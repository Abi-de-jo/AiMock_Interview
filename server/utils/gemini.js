import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const GEMINI_API = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

const headers = {
  "Content-Type": "application/json",
};

export const generateIntroMessage = async (AllDetails = {}) => {
  const { role = "general", company = "our company", name = "Candidate", difficulty = "medium", username } = AllDetails;
  

  const context = `
  You are a friendly HR interviewer from ${company}.
  You're interviewing for the role of ${role}.
  The candidate's name is ${username.name}.
  The difficulty level is ${difficulty}.
  Your name is Rachel. 

  Generate a very short HR-style intro (2-3 sentences max):
  - Greet ${username.name}, mention the role (${role}), say you are AI Interviewer from ${company}
  - End with a short motivational quote (1 line max)
  - Close with: "Tell me about yourself."
  
  Only return the message. No explanation. Be friendly and brief.
  `;
  

  try {
    const response = await axios.post(
      GEMINI_API,
      { contents: [{ parts: [{ text: context }] }] },
      { headers }
    );

    return response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Hi, welcome!";
  } catch (err) {
    console.error("❌ Gemini API error:", err.message);
    return "Hi, welcome to the interview!";
  }
};

export const evaluateUserIntroAnswer = async (userAnswer) => {
  const prompt = `
  You are an AI HR interviewer. Evaluate this self-intro:
  
  "${userAnswer}"
  
  Reply in this JSON format:
  {
    "comment": "Very short HR-style feedback (1 sentence max).",
    "tips": "One improvement suggestion (or null). Keep it short."
  }
  `;
  

  try {
    const res = await axios.post(GEMINI_API, {
      contents: [{ parts: [{ text: prompt }] }],
    }, { headers });

    const raw = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const match = raw.match(/\{[\s\S]*?\}/);
    return match ? JSON.parse(match[0]) : {
      comment: "I think your intro was solid!",
      tips: null,
    };
  } catch (err) {
    console.error("Gemini user intro eval failed:", err.message);
    return { comment: "I'm sorry, I couldn't evaluate that properly.", tips: null };
  }
};



export const generateSkillBasedQuestions = async (introText, role = "frontend developer") => {
  const prompt = `
Analyze the following self-introduction:

"${introText}"

1. Identify **only one most relevant** technical skill.
2. Based on the role (${role}), generate **exactly one** short technical interview question related to that skill. Limit the question to **1 line only**.

Respond in strict JSON format:

{
  "skills": ["<only one skill>"],
  "questions": ["<only one question>"]
}

Return **only one skill** and **only one question**. Do not include explanations or multiple items.
`.trim();

  try {
    const res = await axios.post(GEMINI_API, {
      contents: [{ parts: [{ text: prompt }] }],
    }, { headers });

    const raw = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const match = raw.match(/\{[\s\S]*?\}/);
    return match ? JSON.parse(match[0]) : null;
  } catch (err) {
    console.error("❌ Gemini skill-question generation failed:", err.message);
    return null;
  }
};



export const evaluateSkillAnswer = async (question, answer, role = "frontend developer") => {
  const prompt = `
  You’re a technical interviewer for a ${role} role.
  
  Question: "${question}"
  Candidate's Answer: "${answer}"
  
  Evaluate concisely. Respond in JSON:
  
  If correct:
  {
    "correct": true,
    "comment": "Short praise (1 line max)."
  }
  If incorrect:
  {
    "correct": false,
    "comment": "Brief issue summary (1 line).",
    "tip": "1-line improvement tip."
  }
  `;
  
  try {
    const res = await axios.post(GEMINI_API, {
      contents: [{ parts: [{ text: prompt }] }],
    }, { headers });

    const raw = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const match = raw.match(/\{[\s\S]*?\}/);
    return match ? JSON.parse(match[0]) : null;
  } catch (err) {
    console.error("❌ Gemini skill answer evaluation failed:", err.message);
    return null;
  }
};

export const generateGeneralHRQuestions = async (role = "frontend developer") => {
  const prompt = `
You are a professional HR interviewer for the role of ${role}.

Randomly pick 2 different and commonly asked HR questions from this list:
- What are your hobbies?
- What are your strengths?
- What is your weakness?
- Why should we hire you?
- What motivates you?
- Where do you see yourself in 5 years?

Only return a strict JSON like this:
{
  "questions": ["question 1", "question 2"]
}

Do not include any explanation, notes, or repeated questions.
Only the JSON.
`.trim();

  try {
    const response = await axios.post(
      GEMINI_API,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      { headers }
    );

    const raw = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const match = raw.match(/\{[\s\S]*?\}/);
    return match ? JSON.parse(match[0]) : { questions: [] };
  } catch (error) {
    console.error("❌ Gemini HR Q generation failed:", error.message);
    return { error: "Failed to generate HR questions" };
  }
};




