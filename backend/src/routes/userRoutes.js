import express from "express";
import { getUsers, getUser, createUser, updateUser, deleteUser, changePassword } from "../controllers/userController.js";
import authenticate from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";

const router = express.Router();

router.use(authenticate);
router.use(requireRole("admin"));

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.put("/:id/password", changePassword);

export default router;