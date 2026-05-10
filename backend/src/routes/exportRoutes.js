import express from "express";
import { exportTeacherPDF, exportAccountingExcel, getPaymentStatus, exportGlobalPDF } from "../controllers/exportController.js";
import authenticate from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";

const router = express.Router();
router.use(authenticate);
// Suppression du requireRole global pour permettre l'export PDF individuel aux enseignants
router.get("/pdf/:teacherId", exportTeacherPDF);

router.get("/pdf-global", requireRole("admin", "rh"), exportGlobalPDF);
router.get("/excel", requireRole("admin","rh"), exportAccountingExcel);
router.get("/payments", requireRole("admin","rh"), getPaymentStatus);

export default router;
