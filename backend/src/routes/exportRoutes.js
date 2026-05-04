import express from "express";
import { exportTeacherPDF, exportAccountingExcel, getPaymentStatus } from "../controllers/exportController.js";
import authenticate from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";

const router = express.Router();
router.use(authenticate);
router.use(requireRole("admin","rh"));

router.get("/pdf/:teacherId", exportTeacherPDF);
router.get("/excel", exportAccountingExcel);
router.get("/payments", getPaymentStatus);

export default router;
