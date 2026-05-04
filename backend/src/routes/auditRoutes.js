import express from "express";
import { getAuditLogs, getRecentLogs } from "../controllers/auditController.js";
import authenticate from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";

const router = express.Router();
router.use(authenticate);
router.use(requireRole("admin"));

router.get("/", getAuditLogs);
router.get("/recent", getRecentLogs);

export default router;
