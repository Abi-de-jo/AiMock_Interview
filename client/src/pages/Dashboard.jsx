import { useEffect, useState } from "react";
import InterviewCard from "../components/InterviewCard";

export default function Dashboard() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("mockmate-user"));

  useEffect(() => {
    const fetchInterviews = async () => {
      if (!user?.email) return;

      try {
        const res = await fetch(`https://ai-mock-interview-back.vercel.app/api/interviews/by-user?email=${encodeURIComponent(user.email)}`);
        const data = await res.json();
        console.log(data);
        setInterviews(data);
      } catch (err) {
        console.error("Failed to fetch:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  return (
    <div className="min-h-screen mt-[50px] text-white">
      <section className="text-center p-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || "User"}!</h1>
        <p className="mb-4 text-zinc-400">Your past mock interviews powered by AI Gemini.</p>
        <a href="/new" className="bg-blue-600 px-6 py-2 rounded text-white font-semibold">Start New Interview</a>
      </section>

      <section className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-center col-span-full text-zinc-400">Loading...</p>
        ) : interviews.length === 0 ? (
          <p className="text-center col-span-full text-zinc-500">No interviews found.</p>
        ) : (
          interviews.map((item, i) => (
            <InterviewCard key={i} {...item} />
          ))
        )}
      </section>
    </div>
  );
}
