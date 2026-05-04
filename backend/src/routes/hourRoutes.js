import express from "express";
import { createHour, getHours, getHour, updateHour, deleteHour, getRecentHours } from "../controllers/hourController.js";
import authenticate from "../middleware/auth.js";

const router = express.Router();
router.use(authenticate);

router.post("/", createHour);
router.get("/", getHours);
router.get("/recent", getRecentHours);
router.get("/:id", getHour);
router.put("/:id", updateHour);
router.delete("/:id", deleteHour);

export default router;
