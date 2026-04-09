import express from "express";


const router = express.Router();

router.get("/users/", getAllUsers);
router.get("/users/:id", getAllUsers);
router.delete("/users/:id", getAllUsers);
router.post("/users/", createUser);