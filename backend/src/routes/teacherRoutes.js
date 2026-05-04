import express from "express";
import { getTeachers, getTeacher, getMyProfile, createTeacher, updateTeacher, getTeacherBalance, getTeacherAccounting, getTeacherCount } from "../controllers/teacherController.js";
import authenticate from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";

const router = express.Router();
router.use(authenticate);

router.get("/me", getMyProfile);
router.get("/count", requireRole("admin","rh"), getTeacherCount);
router.get("/", requireRole("admin","rh"), getTeachers);
router.get("/:id", getTeacher);
router.post("/", requireRole("admin","rh"), createTeacher);
router.put("/:id", requireRole("admin","rh"), updateTeacher);
router.get("/:id/balance", getTeacherBalance);
router.get("/:id/accounting", requireRole("admin","rh"), getTeacherAccounting);

export default router;
