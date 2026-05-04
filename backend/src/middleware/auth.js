// ═══════════════════════════════════════════════════════════════════════════════
// MIDDLEWARE — Vérification JWT
// Protège les routes en vérifiant le token Bearer dans l'en-tête Authorization.
// ═══════════════════════════════════════════════════════════════════════════════

import jwt from "jsonwebtoken";

/**
 * Middleware d'authentification JWT.
 * Extrait et vérifie le token, puis attache `req.user` avec { id, email, role }.
 */
const authenticate = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Accès refusé — aucun token fourni.",
    });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Session expirée — veuillez vous reconnecter.",
      });
    }
    return res.status(403).json({
      message: "Token invalide.",
    });
  }
};

export default authenticate;
