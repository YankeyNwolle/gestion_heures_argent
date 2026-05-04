import express from "express";
import * as AC from "../controllers/academicController.js";
import authenticate from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";

const router = express.Router();
router.use(authenticate);

// Departments
router.get("/departments", AC.getDepartments);
router.get("/departments/:id", AC.getDepartment);
router.post("/departments", requireRole("admin"), AC.createDepartment);
router.put("/departments/:id", requireRole("admin"), AC.updateDepartment);
router.delete("/departments/:id", requireRole("admin"), AC.deleteDepartment);

// Programs
router.get("/programs", AC.getPrograms);
router.post("/programs", requireRole("admin"), AC.createProgram);
router.put("/programs/:id", requireRole("admin"), AC.updateProgram);
router.delete("/programs/:id", requireRole("admin"), AC.deleteProgram);

// Subjects
router.get("/subjects", AC.getSubjects);
router.get("/subjects/:id", AC.getSubject);
router.post("/subjects", requireRole("admin","rh"), AC.createSubject);
router.put("/subjects/:id", requireRole("admin","rh"), AC.updateSubject);
router.delete("/subjects/:id", requireRole("admin"), AC.deleteSubject);

export default router;
