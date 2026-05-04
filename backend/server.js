import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

// Routes
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import teacherRoutes from "./src/routes/teacherRoutes.js";
import hourRoutes from "./src/routes/hourRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import settingsRoutes from "./src/routes/settingsRoutes.js";
import validationRoutes from "./src/routes/validationRoutes.js";
import exportRoutes from "./src/routes/exportRoutes.js";
import auditRoutes from "./src/routes/auditRoutes.js";
import academicRoutes from "./src/routes/academicRoutes.js";

// Middleware
import auditLogger from "./src/middleware/auditLogger.js";

// charger les variables d'environnement
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// ─── Sécurité ───────────────────────────────────────────
app.use(helmet());

// ─── Logging HTTP ───────────────────────────────────────
app.use(morgan("dev"));

// ─── CORS — Autoriser les requêtes venant de React ─────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));

// ─── Body parsers ───────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// ─── Audit Logger global ────────────────────────────────
app.use(auditLogger);

// ─── Routes API ─────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/hours", hourRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/validation", validationRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/academic", academicRoutes);

// ─── Route santé ────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Error handler global ───────────────────────────────
app.use((err, req, res, next) => {
  console.error("Erreur non gérée :", err);
  res.status(500).json({
    message: "Erreur interne du serveur",
    ...(process.env.NODE_ENV !== "production" && { detail: err.message }),
  });
});

// ─── Démarrage ──────────────────────────────────────────
const host = process.env.HOST || "0.0.0.0";
app.listen(port, host, () => {
  console.log(`\n🚀 Serveur lancé sur http://${host}:${port}`);
  console.log(`📚 API disponible sur http://${host}:${port}/api`);
  console.log(`🏥 Santé : http://${host}:${port}/api/health\n`);
});
