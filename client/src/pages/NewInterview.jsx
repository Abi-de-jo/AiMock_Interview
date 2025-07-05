import React, { useState } from "react";
import { companies, roles, difficultyLevels } from "../utils/interviewData";
import { useNavigate } from "react-router-dom";
const NewInterview = () => {
  
  const [mockName, setMockName] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [difficulty, setDifficulty] = useState("");
  
  const navigate = useNavigate();



const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("mockmate-user"));

    if (!user || !user.id) {
      alert("User not found. Please login again.");
      navigate("/login");
      return;
    }

    const payload = {
      userId: user.id,
      name: mockName,
      company: selectedCompany,
      role: selectedRole,
      difficulty,
    };

    try {
      const res = await fetch("https://ai-mock-interview-back.vercel.app/api/interviews/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
         localStorage.setItem("mockSessionId", data.interview.id);
      
         localStorage.setItem("mockSession", JSON.stringify({
          id: data.interview.id,
          name: mockName,
          company: selectedCompany,
          role: selectedRole,
          difficulty,
        }));
      
         window.dispatchEvent(new Event("storage"));
        navigate("/interview");
      }
      else {
        alert("❌ Failed to start interview. Please try again.");
      }
    } catch (err) {
      console.error("Interview start error:", err);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <section className="min-h-screen px-6 py-20 text-white max-w-3xl mx-auto">
      <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-xl">
        <h1 className="text-3xl font-bold text-blue-500 mb-8 text-center">
          Start a New Mock Interview
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Interview Name */}
          <div>
            <label className="block text-sm mb-2">Interview Name</label>
            <input
              type="text"
              value={mockName}
              onChange={(e) => setMockName(e.target.value)}
              placeholder="Eg: Google Backend Round"
              className="w-full px-4 py-2 bg-white/10 rounded-lg border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm mb-2">Select Company</label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full  px-4 py-2 bg-white/10 rounded-lg border border-white/20 text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option className="option text-gray-400" value="">Choose Company</option>
              {companies.map((company, idx) => (
                <option className="option" key={idx} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </div>

          {/* Role */}
          <div>
            <label className="block  text-sm mb-2">Select Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full  px-4 py-2 bg-white/10 rounded-lg border border-white/20 text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option className="option text-gray-400" value="">Choose Role</option>
              {roles.map((role, idx) => (
                <option className="option" key={idx} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm mb-2">Select Difficulty</label>
            <div className="flex gap-4">
              {difficultyLevels.map((level, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setDifficulty(level)}
                  className={`px-4 py-2 rounded-lg border text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    difficulty === level
                      ? "bg-blue-600 border-blue-700"
                      : "bg-white/10 border-white/20"
                  } text-gray-100 transition`}
                >
                  {level}
                </button>
              ))} 
            </div>
          </div>

          {/* Submit */}
          <div className="text-center pt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold shadow-md"
            >
              Start Interview
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default NewInterview;
