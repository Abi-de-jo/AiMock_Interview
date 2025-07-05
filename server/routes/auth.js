import express from "express";
import { loginOrRegister } from "../controllers/authController.js";

const router = express.Router();
router.post("/", loginOrRegister);

export default router;
