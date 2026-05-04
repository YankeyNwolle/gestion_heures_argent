// ═══════════════════════════════════════════════════════════════════════════════
// MIDDLEWARE — Contrôle d'accès basé sur les rôles (RBAC)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Factory qui retourne un middleware vérifiant que le rôle de l'utilisateur
 * connecté figure dans la liste autorisée.
 *
 * Usage :
 *   router.get("/users", authenticate, requireRole("admin"), getUsers);
 *   router.get("/hours/pending", authenticate, requireRole("admin", "rh"), getPending);
 *
 * @param  {...string} allowedRoles – rôles autorisés ('admin', 'rh', 'enseignant')
 * @returns {Function} Express middleware
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    // authenticate middleware doit avoir été exécuté avant
    if (!req.user) {
      return res.status(401).json({
        message: "Authentification requise.",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Accès interdit — rôle requis : ${allowedRoles.join(" ou ")}.`,
      });
    }

    next();
  };
};

/**
 * Middleware qui autorise l'accès si l'utilisateur est le propriétaire
 * de la ressource OU possède l'un des rôles spécifiés.
 * Utile pour les routes comme GET /teachers/:id où l'enseignant peut voir
 * son propre profil, mais l'admin/rh peuvent voir tous les profils.
 *
 * @param {string} paramName - Nom du paramètre URL contenant l'ID (ex: "id")
 * @param {...string} privilegedRoles - Rôles qui ont accès à toutes les ressources
 */
export const requireSelfOrRole = (paramName, ...privilegedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentification requise." });
    }

    const resourceId = parseInt(req.params[paramName], 10);

    // Accès autorisé si c'est sa propre ressource
    if (req.user.id === resourceId) {
      return next();
    }

    // Accès autorisé si rôle privilégié
    if (privilegedRoles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({
      message: "Accès interdit — vous ne pouvez consulter que vos propres données.",
    });
  };
};
