import express from "express";
import * as SC from "../controllers/settingsController.js";
import authenticate from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";

const router = express.Router();
router.use(authenticate);

// Equivalence rates
router.get("/equivalences", SC.getEquivalences);
router.put("/equivalences", requireRole("admin"), SC.updateEquivalence);

// Hourly rates
router.get("/rates", SC.getHourlyRates);
router.put("/rates", requireRole("admin"), SC.updateHourlyRate);

// Academic years
router.get("/academic-years", SC.getAcademicYears);
router.get("/academic-years/current", SC.getCurrentYear);
router.post("/academic-years", requireRole("admin"), SC.createAcademicYear);
router.put("/academic-years/:id/activate", requireRole("admin"), SC.activateYear);
router.put("/academic-years/:id/close", requireRole("admin"), SC.closeYear);

export default router;
