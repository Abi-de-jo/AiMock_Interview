import prisma from "../utils/prisma.js";

export const loginOrRegister = async (req, res) => {
  const { email, name } = req.body;

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name,
      },
    });

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("Auth Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
