import express from "express";
import { generateIntro, evaluateUserIntro, getSkillQuestions, evaluateSkillResponse, getGeneralHRQuestions, evaluateHRAnswer, endInterview } from "../controllers/conversationController.js";

const router = express.Router();



router.post("/intro", generateIntro);
router.post("/user-intro", evaluateUserIntro);
router.post("/skill-questions", getSkillQuestions);
router.post("/evaluate-skill-answer", evaluateSkillResponse);
router.post("/general-hr-questions", getGeneralHRQuestions);
router.post("/evaluate-hr-answer", evaluateHRAnswer);
router.post("/end-interview", endInterview);




export default router;
