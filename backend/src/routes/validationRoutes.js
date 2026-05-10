import express from "express";
import { getPendingHours, validateHour, validateAll, contestHour } from "../controllers/validationController.js";
import authenticate from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";

const router = express.Router();
router.use(authenticate);

router.get("/pending", getPendingHours);
router.put("/:id/validate", validateHour); // Permission check in controller
router.put("/validate-all", requireRole("admin","rh"), validateAll);
router.put("/:id/contest", contestHour);

export default router;
