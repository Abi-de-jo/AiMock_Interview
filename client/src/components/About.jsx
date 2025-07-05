import React from "react";

const About = () => {
  return (
    <section className="min-h-screen px-6 py-24 text-white max-w-6xl mx-auto">
      {/* Glassmorphic Wrapper */}
      <div className="bg-white/1 backdrop-blur-[1px] rounded-3xl shadow-2xl border border-white/1 p-10 md:p-16 space-y-14 transition duration-300 ease-in-out">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center gap-10 text-left">
          <img
            src="./abi.png"
            alt="Abishek"
            className="w-36 h-36 rounded-full object-cover border border-white/20 shadow-lg hover:scale-105 transition duration-300"
          />
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-blue-500">Abishek</h1>
            <p className="text-lg text-gray-300 mt-2">
              Creator of <span className="font-semibold text-white">MockMate AI</span> & Founder of <span className="font-semibold text-white">NextDevPath</span>
            </p>
            <p className="text-sm text-gray-400 mt-1">Full-Stack Developer • AI Builder • Educator</p>
          </div>
        </div>

        {/* Bio Section */}
        <div className="text-gray-300 text-lg leading-loose space-y-6 tracking-wide">
          <p>
            <span className="text-blue-300 font-semibold">MockMate AI</span> is built with a mission to bring interview preparation into the modern era.
            It's an AI-powered mock interview simulator that listens to your voice, evaluates your fluency, tone, and technical depth — just like a real interviewer.
          </p>
          <p>
            As a passionate <span className="text-blue-300 font-semibold">developer and mentor</span>, I wanted to create a platform that empowers students and job seekers to practice confidently before the real deal. 
            The idea came from watching talented peers struggle with anxiety or lack of structure during interviews.
          </p>
          <p>
            This platform bridges that gap — combining <span className="text-blue-300 font-semibold">real-time voice recognition, Gemini API feedback, and custom-built UI</span> into a smooth experience that helps users grow with every attempt.
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-gray-300 text-base">
          <div>
            <h3 className="text-blue-400 font-semibold text-lg mb-2">🛠 Tech Stack</h3>
            <p className="leading-relaxed">React, Tailwind CSS, Vite, Node.js, Express, MongoDB, Prisma, Gemini API, Web Speech API</p>
          </div>

          <div>
            <h3 className="text-blue-400 font-semibold text-lg mb-2">🌐 What It Does</h3>
            <p className="leading-relaxed">
              Simulates interviews using your voice, evaluates your answers in real time, and shows personalized feedback cards with scores and tips to improve.
            </p>
          </div>

          <div>
            <h3 className="text-blue-400 font-semibold text-lg mb-2">📸 Instagram</h3>
            <a
              href="https://instagram.com/codebyabi"
              className="text-blue-300 underline hover:text-blue-400 transition"
              target="_blank"
              rel="noreferrer"
            >
              @codebyabi
            </a>
          </div>

          <div>
            <h3 className="text-blue-400 font-semibold text-lg mb-2">📍 Location</h3>
            <p className="leading-relaxed">Tamil Nadu, India</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
