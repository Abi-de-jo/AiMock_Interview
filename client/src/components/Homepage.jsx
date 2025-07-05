import React, { useRef } from "react";
import VariableProximity from "./VariableProximity";
import { useTestimonialContext } from "../context/TestimonialContext";
import { useNavigate } from "react-router-dom";

export default function Homepage() {
  const containerRef = useRef(null);
  const testimonialContext = useTestimonialContext();
  const testimonials = testimonialContext?.testimonials || [];
  const navigate = useNavigate();
  
  return (
    <section className="relative px-6 py-24 md:py-32 text-white text-center space-y-20">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
          Practice Real <br /> <span className="text-blue-500">AI Mock Interviews</span>
        </h1>

        <div ref={containerRef} style={{ position: "relative" }}>
          <VariableProximity
            label="AI-powered interviews that simulate real tech hiring. Speak naturally, get real-time evaluation, and grow faster."
            className="text-lg md:text-xl text-gray-300 cursor-pointer"
            fromFontVariationSettings="'wght' 400, 'opsz' 9"
            toFontVariationSettings="'wght' 1000, 'opsz' 40"
            containerRef={containerRef}
            radius={100}
            falloff="linear"
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => navigate("/new")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-md transition"
          >
            Start New Interview
          </button>
        </div>
      </div>

      <div className="text-xl font-medium text-white mt-8 cursor-pointer">
        Simulated Interview. Real Feedback.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full mx-auto">
        {[
          {
            name: "Google",
            domain: "Backend Developer",
            profile: "https://cdn-icons-png.flaticon.com/512/281/281764.png",
            comment: "Gemini's feedback helped me ace real interviews!",
          },
          {
            name: "Infosys",
            domain: "QA Engineer",
            profile: "https://cdn-icons-png.flaticon.com/512/5968/5968350.png",
            comment: "The voice analysis was shockingly accurate!",
          },
          {
            name: "Amazon",
            domain: "Frontend Dev",
            profile: "https://cdn-icons-png.flaticon.com/512/5968/5968350.png",
            comment: "Practice mode boosted my confidence a lot.",
          },
        ].map((user, index) => (
          <div
            key={index}
            className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 text-white "
          >
            <img
              src={user.profile}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover "
            />
            <div>
              <h4 className="text-lg font-semibold">{user.name}</h4>
              <p className="text-sm text-blue-400 mb-1">{user.domain}</p>
              <p className="text-xs text-gray-300">{user.comment}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full max-w-6xl mx-auto mt-24">
        <h2 className="text-center text-3xl md:text-4xl font-bold text-blue-400 mb-12">
          How It Works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 xl:gap-20 justify-items-center w-full">
          {[
            {
              title: "1. Enter Interview Details",
              desc: "Pick your company, role, and difficulty level to start.",
            },
            {
              title: "2. Speak Your Answers",
              desc: "Face AI-powered robot interviewer with voice input.",
            },
            {
              title: "3. Get Real Feedback",
              desc: "Gemini evaluates your answers, tone, and fluency.",
            },
            {
              title: "4. Review and Improve",
              desc: "See your score, strengths, and improvement areas.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="min-w-[300px] max-w-[340px] bg-white/10 p-6 rounded-xl border border-white/10 text-white space-y-3"
            >
              <strong className="block text-blue-300 text-lg font-semibold">
                {item.title}
              </strong>
              <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto mt-24">
        <h2 className="text-center text-3xl md:text-4xl font-bold text-blue-400 mb-12">
          Reviews
        </h2>

        <div className="overflow-x-auto scrollbar-hide px-2 cursor-pointer">
          <div className="flex gap-6 min-w-full animate-slide-left py-4">
            {testimonials?.length === 0 ? (
              <p className="text-gray-400">No feedback yet.</p>
            ) : (
              testimonials.map((t) => (
                <div
                  key={t.id}
                  className="min-w-[85%] md:min-w-[50%] lg:min-w-[38%] xl:min-w-[32%]
                            bg-gradient-to-br from-white/10 to-white/5 border border-white/10
                            backdrop-blur-lg px-6 py-4 rounded-2xl shadow-lg text-left
                            hover:scale-[1.01] transition duration-300"
                >
                  <p className="text-lg text-white font-semibold">{t.name}</p>
                  <p className="text-sm text-gray-300 mt-1">{t.message}</p>
                  <p className="text-xs text-gray-500 mt-3">
                    {new Date(t.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-12 text-gray-500 text-sm text-center">
          © 2025 <span className="text-white font-semibold">MockMate AI</span> • All rights reserved.
        </div>
      </div>
    </section>
  );
}
