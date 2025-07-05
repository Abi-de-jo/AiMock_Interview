import { generateIntroMessage, evaluateUserIntroAnswer, generateSkillBasedQuestions, evaluateSkillAnswer, generateGeneralHRQuestions } from "../utils/gemini.js";
import axios from "axios";
const GEMINI_API = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
import  prisma  from "../utils/prisma.js";



const headers = {
  "Content-Type": "application/json",
};

export const generateIntro = async (req, res) => {
  const { AllDetails } = req.body;
  console.log("AllDetails",AllDetails);

  if (!AllDetails) {
    return res.status(400).json({ error: "Missing session details" });
  }

  try {
    const intro = await generateIntroMessage(AllDetails);
    res.status(200).json({ intro });
  } catch (err) {
    console.error("❌ Controller error:", err.message);
    res.status(500).json({ error: "Failed to generate intro" });
  }
};


export const evaluateUserIntro = async (req, res) => {
  const { userAnswer, sessionId } = req.body;

  if (!userAnswer || !sessionId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const feedback = await evaluateUserIntroAnswer(userAnswer);  
    await prisma.conversation.create({
      data: {
        interviewSessionId: sessionId,
        question: "Tell me about yourself.",
        userAnswer,
        feedback: feedback.comment,
        isCorrect: true, // or null/undefined if not evaluated
      },
    });
    
    res.status(200).json({ success: true, feedback });
  } catch (err) {
    console.error("❌ User intro evaluation failed:", err.message);
    res.status(500).json({ error: "Failed to evaluate user intro" });
  }
};


export const getSkillQuestions = async (req, res) => {
  const { userIntro, role } = req.body;

  if (!userIntro) return res.status(400).json({ error: "Missing introduction text" });

  try {
    const result = await generateSkillBasedQuestions(userIntro, role || "frontend developer");
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Skill Q error:", err.message);
    res.status(500).json({ error: "Failed to generate questions" });
  }
};



export const evaluateSkillResponse = async (req, res) => {
  const { question, answer, role } = req.body;
  if (!question || !answer) return res.status(400).json({ error: "Missing question or answer" });

  try {
    const result = await evaluateSkillAnswer(question, answer, role || "frontend developer");
    await prisma.conversation.create({
      data: {
        interviewSessionId: sessionId,
        question,
        userAnswer: answer,
        isCorrect: result.correct,
        feedback: result.comment,
      },
    });
    
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Skill answer eval error:", err.message);
    res.status(500).json({ error: "Failed to evaluate answer" });
  }
};


export const getGeneralHRQuestions = async (req, res) => {
  const { role } = req.body;
  try {
    const result = await generateGeneralHRQuestions(role || "frontend developer");
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ HR Question fetch failed:", err.message);
    res.status(500).json({ error: "Failed to generate HR questions" });
  }
};




export const evaluateHRAnswer = async (req, res) => {
  const { question, answer, role = "frontend developer", sessionId } = req.body;

  const prompt = `
You are an experienced HR interviewer for the role of ${role}.
The candidate was asked: "${question}"
The candidate answered: "${answer}"

Now, give a short and constructive comment about this answer (1-2 lines max). Be supportive but honest.

Respond in this exact JSON format only:
{
  "comment": "your feedback here"
}
  `.trim();

  try {
    const geminiRes = await axios.post(
      GEMINI_API,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const raw = geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const match = raw.match(/\{[\s\S]*?\}/);
    const parsed = match ? JSON.parse(match[0]) : { comment: "Thanks for your answer." };

    await prisma.conversation.create({
      data: {
        interviewSessionId: sessionId,
        question,
        userAnswer: answer,
        isCorrect: null,
        feedback: parsed.comment,
      },
    });
    
    res.json(parsed);
  } catch (error) {
    console.error("❌ Gemini HR evaluation failed:", error.message);
    res.status(500).json({ comment: "Sorry, I couldn't evaluate your answer." });
  }
};



export const endInterview = async (req, res) => {
  const { sessionId, email } = req.body;

  try {
    const conversation = await getConversationHistory(sessionId);

    const prompt = `
Analyze this interview conversation with candidate (${email}):

${conversation.map((msg, i) => `${i + 1}. ${msg.role}: ${msg.text}`).join("\n")}

Based on clarity, confidence, and technical correctness, assign a score out of 10.
Return a short JSON like:
{
  "score": 8.5,
  "summary": "Candidate was clear and confident. Could improve depth on technical topics."
}
`.trim();

    const geminiResponse = await axios.post(GEMINI_API, {
      contents: [{ parts: [{ text: prompt }] }],
    }, { headers });

    const raw = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const match = raw.match(/\{[\s\S]*?\}/);
    const result = match ? JSON.parse(match[0]) : { score: 5, summary: "Default evaluation." };

    // ✅ Save result to InterviewSession
    await prisma.interviewSession.update({
      where: { id: sessionId },
      data: {
        score: result.score,
        summary: result.summary,
        endedAt: new Date(),
      },
    });

    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Error ending interview:", err.message);
    res.status(500).json({ error: "Failed to process final evaluation." });
  }
};




 export const getConversationHistory = async (sessionId) => {
  const conversations = await prisma.conversation.findMany({
    where: { interviewSessionId: sessionId },
    orderBy: { createdAt: "asc" },
    select: {
      question: true,
      userAnswer: true,
      feedback: true,
      isCorrect: true,
    },
  });

  // Convert to format for prompt
  const formatted = [];
  for (const item of conversations) {
    formatted.push({ role: "AI", text: item.question });
    formatted.push({ role: "User", text: item.userAnswer });
    if (item.feedback) {
      formatted.push({ role: "AI", text: item.feedback });
    }
  }

  return formatted;
};