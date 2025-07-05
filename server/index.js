import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import interviewRoutes from "./routes/interview.js";
import conversationRoutes from "./routes/conversation.js";
 
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/conversations", conversationRoutes);
 
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));

export default app;