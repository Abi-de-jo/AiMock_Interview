import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://ai-mock-interview-back.vercel.app/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("mockmate-user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("storage")); 

        navigate("/dashboard");
      } else {
        alert("Login failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex justify-center items-center px-6">
      <form
        onSubmit={handleLogin}
        className="bg-white/10 p-8 rounded-xl border border-white/10 shadow-md w-full max-w-md space-y-6 text-white"
      >
        <h1 className="text-3xl font-bold text-center text-blue-400">Login / Register</h1>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Name (optional)</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your name"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition shadow"
        >
          {loading ? "Logging in..." : "Start"}
        </button>
      </form>
    </section>
  );
};

export default Login;
