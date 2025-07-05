import React, { useEffect, useRef, useState } from "react";

const InterviewPortal = () => {
  const [transcript, setTranscript] = useState("");
  const [question, setQuestion] = useState("Loading...");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const isSpeakingRef = useRef(false); // 🛡️ Guard against overlap

  const sessionDetails = JSON.parse(localStorage.getItem("mockSession") || "{}");

  // 🔊 Universal speech function (uses browser for now)
  const speakText = async (text, callback) => {
    if (isSpeakingRef.current) {
      console.warn("🛑 Already speaking. Skipping:", text);
      return;
    }

    isSpeakingRef.current = true;

    // ✅ Using browser speech synthesis
    const synth = window.speechSynthesis;
    synth.cancel(); // stop any ongoing

    const utter = new SpeechSynthesisUtterance(text);
    utter.onend = () => {
      isSpeakingRef.current = false;
      callback?.();
    };
    utter.onerror = () => {
      console.error("🎙️ SpeechSynthesis failed");
      isSpeakingRef.current = false;
      callback?.();
    };

    synth.speak(utter);

    // 🔒 Commented out ElevenLabs logic (keep for future use)
    /*
    try {
      const res = await fetch("https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": "your_api_key_here",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: { stability: 0.4, similarity_boost: 0.8 },
        }),
      });

      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => {
        isSpeakingRef.current = false;
        callback?.();
      };
      audio.play();
    } catch (err) {
      console.error("🛑 ElevenLabs error:", err.message);
      isSpeakingRef.current = false;
      callback?.();
    }
    */
  };

  const fetchIntroFromGemini = async () => {
    try {
      const res = await fetch("https://ai-mock-interview-back.vercel.app/api/conversations/intro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionDetails }),
      });

      const data = await res.json();
      const intro = data.intro || "Hi, I’m your AI interviewer. Tell me about yourself.";
      setQuestion(intro);

      setTimeout(() => speakText(intro), 2000);
    } catch (err) {
      console.error("❌ Gemini intro fetch failed:", err.message);
    }
  };

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) videoRef.current.srcObject = stream;
    });

    fetchIntroFromGemini();
  }, []);

  return (
    <div className="min-h-screen mt-10 text-white p-6 flex flex-col items-center">
      <div className="text-3xl md:text-4xl font-bold mb-10 text-center tracking-wide">
        <h1>Welcome to the interview</h1>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full max-w-6xl">
        <img
          src="/robo.png"
          alt="AI Interviewer"
          className="w-72 h-80 rounded-2xl object-cover border border-white/10 shadow-xl"
        />
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-72 h-80 rounded-2xl object-cover border border-white/10 shadow-xl"
        />
      </div>

      <div className="w-full max-w-4xl mt-12 text-center">
        <h4 className="text-blue-400 text-lg font-semibold mb-3 uppercase tracking-widest">
          Your Answer  
        </h4>
        <div className="bg-white/10 border border-white/20 p-6 rounded-2xl min-h-[140px] text-lg font-medium shadow-lg">
          {transcript || (
            <span className="text-gray-400">
              {isProcessing ? "Processing..." : "Listening..."}
            </span>
          )}
        </div>
        {!isListening && !isProcessing && (
          <button
            className="mt-8 px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold text-base shadow-lg transition duration-300"
          >
            Start Listening
          </button>
        )}
      </div>
    </div>
  );
};

export default InterviewPortal;



// it contains elevan labs