// ═══════════════════════════════════════════════════════════════════════════════
// MIDDLEWARE — Journal d'audit automatique
// Intercepte toute requête POST / PUT / DELETE et insère un enregistrement
// dans la table `audit_logs` pour la traçabilité.
// ═══════════════════════════════════════════════════════════════════════════════

import pool from "../config/database.js";

/**
 * Middleware d'audit global.
 * S'exécute en mode « fire-and-forget » pour ne pas ralentir la réponse.
 *
 * Enregistre :
 *  - user_id     : ID de l'utilisateur connecté (null si anonyme)
 *  - action      : Méthode HTTP (POST, PUT, DELETE)
 *  - table_name  : Chemin de l'endpoint (ex: "/api/hours")
 *  - record_id   : ID de la ressource ciblée (depuis les params URL)
 *  - details     : Corps de la requête (JSONB), sans le mot de passe
 */
const auditLogger = (req, res, next) => {
  // Ne logger que les actions de modification
  const mutatingMethods = ["POST", "PUT", "PATCH", "DELETE"];
  if (!mutatingMethods.includes(req.method)) {
    return next();
  }

  // Capturer la réponse pour logger après succès
  const originalSend = res.send;
  res.send = function (body) {
    // Logger uniquement les succès (2xx)
    if (res.statusCode >= 200 && res.statusCode < 300) {
      // Nettoyer les données sensibles du body
      const sanitizedBody = { ...req.body };
      delete sanitizedBody.password;
      delete sanitizedBody.password_hash;
      delete sanitizedBody.confirm;

      // Extraire l'ID de la ressource depuis les paramètres URL
      const recordId = req.params?.id ? parseInt(req.params.id, 10) : null;

      // Fire-and-forget — on n'attend pas le résultat
      pool
        .query(
          `INSERT INTO audit_logs (user_id, action, table_name, record_id, details)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            req.user?.id || null,
            req.method,
            req.originalUrl,
            isNaN(recordId) ? null : recordId,
            JSON.stringify(sanitizedBody),
          ]
        )
        .catch((err) => {
          console.error("[Audit] Erreur d'écriture :", err.message);
        });
    }

    // Appeler le send original
    return originalSend.call(this, body);
  };

  next();
};

export default auditLogger;
