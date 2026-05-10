import express from "express";
import { getStats, getMonthlyChart, getDistributionChart, getTeacherSummary, getDepartmentStats, getProgramStats } from "../controllers/dashboardController.js";
import authenticate from "../middleware/auth.js";

const router = express.Router();
router.use(authenticate);

router.get("/stats", getStats);
router.get("/monthly", getMonthlyChart);
router.get("/distribution", getDistributionChart);
router.get("/teachers", getTeacherSummary);
router.get("/departments", getDepartmentStats);
router.get("/programs", getProgramStats);

export default router;
