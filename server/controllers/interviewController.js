import prisma from "../utils/prisma.js";

 

export const startInterview = async (req, res) => {
  const { userId, name, company, role, difficulty } = req.body;

   if (!userId || !name || !company || !role || !difficulty) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields: userId, name, company, role, or difficulty.",
    });
  }

  try {
    const interview = await prisma.interviewSession.create({
      data: {
        userId,
        name,
        company,
        role,
        difficulty,
      },
      select: {
        id: true,
        name: true,
        company: true,
        role: true,
        difficulty: true,
        startedAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Interview session created successfully.",
      interview,
    });
  } catch (err) {
    console.error("❌ Error creating interview session:", err);
    return res.status(500).json({
      success: false,
      error: "Server error: Failed to create interview session.",
    });
  }
};

export const getInterviewsByUserName = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Missing user name" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const interviews = await prisma.interviewSession.findMany({
      where: { userId: user.id },
      include: {
        conversations: true,  
      },
      orderBy: {
        startedAt: "desc",
      },
    });

    res.status(200).json(interviews);
  } catch (err) {
    console.error("Error fetching interviews:", err);
    res.status(500).json({ error: "Server error" });
  }
};





