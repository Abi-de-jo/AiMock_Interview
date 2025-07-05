import express from "express";
import { startInterview, getInterviewsByUserName } from "../controllers/interviewController.js";

const router = express.Router();
router.post("/start", startInterview);
router.get("/by-user", getInterviewsByUserName);

export default router;
