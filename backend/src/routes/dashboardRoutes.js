import express from "express";
import { getStats, getMonthlyChart, getDistributionChart, getTeacherSummary } from "../controllers/dashboardController.js";
import authenticate from "../middleware/auth.js";

const router = express.Router();
router.use(authenticate);

router.get("/stats", getStats);
router.get("/monthly", getMonthlyChart);
router.get("/distribution", getDistributionChart);
router.get("/teachers", getTeacherSummary);

export default router;
