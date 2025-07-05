// Final InterviewPortal.jsx with HR transition
import React, { useEffect, useRef, useState } from "react";

const InterviewPortal = () => {
  const [transcript, setTranscript] = useState("");
  const [question, setQuestion] = useState("Loading...");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [followUpQuestions, setFollowUpQuestions] = useState([]);
  const [currentSkillQuestion, setCurrentSkillQuestion] = useState("");
  const [skillQuestionsAsked, setSkillQuestionsAsked] = useState(0);
  const [hrQuestions, setHRQuestions] = useState([]);
  const [hrIndex, setHRIndex] = useState(0);
  const [phase, setPhase] = useState("intro"); 
  const [currentHRQuestion, setCurrentHRQuestion] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const hasAskedSkillQuestion = useRef(false);

  const videoRef = useRef(null);
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);

  const audioRef = useRef(null);

  const sessionId = localStorage.getItem("mockSessionId");
  const sessionDetails = JSON.parse(localStorage.getItem("mockSession") || "{}");
  const role = sessionDetails?.role || "frontend developer";
   const username = JSON.parse(localStorage.getItem("mockmate-user") || "{}");
   const name = username?.name || "Candidate";

    const AllDetails = {...sessionDetails, username};
   
   const speakText = async (text, callback) => {
    if (isSpeakingRef.current) return;
    isSpeakingRef.current = true;
    setIsSpeaking(true);  


    try {
      const res = await fetch("https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": "sk_d1f5dd53f26c1e936cad5396920b399bc7159434aca42446",  
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
        setIsSpeaking(false); // 🟢 stop animation
        callback?.();
      };

      audio.onerror = () => {
        console.error("🛑 Audio playback failed.");
        isSpeakingRef.current = false;
        callback?.();
      };

      audio.play();
    } catch (err) {
      console.error("🛑 ElevenLabs error:", err.message);
      isSpeakingRef.current = false;
      callback?.();
    }
  };


  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    setIsListening(true);
    setTranscript("Listening...");

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript.toLowerCase();
      setTranscript(result);
      setIsListening(false);
      recognition.stop();
    
       if (result.includes("stop the interview")) {
        endInterview();
        return;
      }
    
      if (phase === "intro") {
        evaluateUserIntro(result);
      } else if (phase === "skillQ") {
        handleSkillAnswer(result);
      } else if (phase === "hrQ") {
        handleHRAnswer(result);
      }
    };
    

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const endInterview = async () => {
    console.log("🛑 Interview stopped by user.");
    window.speechSynthesis.cancel();
    if (recognitionRef.current) recognitionRef.current.stop();
  
    setPhase("stopped");
  
     const payload = {
      sessionId,
      email: sessionDetails?.email || "unknown@mce.edu.in",
    };
    
  
    try {
      const res = await fetch("https://ai-mock-interview-back.vercel.app/api/conversations/end-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await res.json();
      const finalScore = data.score || "N/A";
      const feedback = data.summary || "No summary provided.";
  
      const message = `Thank you for attending the interview. You scored ${finalScore}. Here's our feedback: ${feedback} Good luck for your future!`;
      speakText(message);
    } catch (err) {
      console.error("❌ Failed to send interview end data:", err.message);
      speakText("Thank you for attending the interview. Good luck for your future!");
    }
  };
  
  
  const evaluateUserIntro = async (userAnswer) => {
    try {
      setIsProcessing(true);
      const res = await fetch("https://ai-mock-interview-back.vercel.app/api/conversations/user-intro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAnswer, sessionId }),
      });
  
      const data = await res.json();
      const comment = data.feedback?.comment || "Thanks for your intro!";
      const tip = data.feedback?.tips;
      const responseText = tip ? `${comment} Here's a suggestion: ${tip}` : comment;
      setFeedback(responseText);
  
      speakText(responseText, () => {
        speakText("Okay. I know you’ll do even better next time.", () => {
          if (!hasAskedSkillQuestion.current) {
            hasAskedSkillQuestion.current = true; // ✅ only once
            generateSkillQuestions(userAnswer);
          } else {
            fetchHRQuestions(); // ✅ fallback if somehow called again
          }
        });
      });
    } catch {
      speakText("Sorry, I couldn’t analyze your answer.");
    } finally {
      setIsProcessing(false);
    }
  };
  

  const handleSkillAnswer = async (answer) => {
    const res = await fetch("https://ai-mock-interview-back.vercel.app/api/conversations/evaluate-skill-answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: currentSkillQuestion, answer, role }),
    });
  
    const data = await res.json();
  
    // Speak feedback based on answer
    const feedbackText = data.correct
      ? data.comment
      : `${data.comment} Here's a tip: ${data.tip || "Try again with more detail."}`;
  
    speakText(feedbackText, () => {
      console.log("🎯 Skill question answered. Moving to HR questions...");
      fetchHRQuestions(); // ✅ Proceed to HR no matter the skill answer result
    });
  };
  
  
  
  

  const handleHRAnswer = async (answer) => {
    try {
      const res = await fetch("https://ai-mock-interview-back.vercel.app/api/conversations/evaluate-hr-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: currentHRQuestion, answer, role }),
      });
  
      const data = await res.json();
  
      // Optional: Use feedback if available
      const comment = data.comment || "Thank you for your response.";
  
      // Move to next HR question if available
      if (hrIndex + 1 < hrQuestions.length) {
        const nextQ = hrQuestions[hrIndex + 1];
        setHRIndex((prev) => prev + 1);
        setCurrentHRQuestion(nextQ);
  
        speakText(comment, () => {
          speakText(nextQ, () => startListening());
        });
      } else {
        // Interview is done
        speakText(comment, () => {
          speakText("Okay, you did well. That concludes the interview. Best of luck!");
        });
      }
    } catch (err) {
      console.error("❌ HR answer evaluation failed:", err.message);
      speakText("Sorry, I couldn't process that answer.");
    }
  };
  

  const generateSkillQuestions = async (introText) => {
    const res = await fetch("https://ai-mock-interview-back.vercel.app/api/conversations/skill-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userIntro: introText, role }),
    });
  
    const data = await res.json();
    const questions = data.questions || [];
  
    if (questions.length > 0) {
      console.log("🎯 Skill questions:", questions);
       fetchHRQuestions();
      setFollowUpQuestions(questions);
      setCurrentSkillQuestion(questions[0]);
      setPhase("skillQ");
    
      speakText("Let's move to a question based on your skills.", () => {
        speakText(questions[0], () => startListening());
      });
    } else {
      fetchHRQuestions();
    }
    
  };
  



  const fetchHRQuestions = async () => {
    console.log("➡️ Fetching HR questions...");
  
    const res = await fetch("https://ai-mock-interview-back.vercel.app/api/conversations/general-hr-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
  
    const data = await res.json();
    console.log("✅ HR Questions Response:", data);
  
    setHRQuestions(Math.random() < 0.5 ? data.questions : []);
    setHRIndex(0);
    setPhase("hrQ");
  
    if (data.questions?.[0]) {
      setCurrentHRQuestion(data.questions[0]);
      speakText(data.questions[0], () => startListening());
    } else {
      speakText("Sorry, I have no further questions.");
    }
  };
  
  




  const fetchIntroFromGemini = async () => {
    const res = await fetch("https://ai-mock-interview-back.vercel.app/api/conversations/intro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ AllDetails }),
    });
    const data = await res.json();
    const intro = data.intro || "Hi, I’m your AI interviewer. Tell me about yourself.";
    setQuestion(intro);
    setTimeout(() => speakText(intro, () => startListening()), 1500);
  };

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) videoRef.current.srcObject = stream;
    });
    fetchIntroFromGemini();
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="min-h-screen mt-10 text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center tracking-wide">
        Welcome to the interview
      </h1>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full max-w-6xl">
        <img src="/robo.png" alt="AI Interviewer" className="w-72 h-80  rounded-2xl object-cover border abi border-white/10 shadow-xl" />
        <video ref={videoRef} autoPlay muted className="w-72 h-80 rounded-2xl object-cover border border-white/10 shadow-xl" />
      </div>
      <div className="w-full max-w-4xl mt-12 text-center">
        <h4 className="text-blue-400 text-lg font-semibold mb-3 uppercase tracking-widest">Your Answer</h4>
        <div className="bg-white/10 border border-white/20 p-6 rounded-2xl min-h-[140px] text-lg font-medium shadow-lg">
          {transcript || (isListening ? "Listening..." : "Please wait for your turn")}
        </div>
        <div className="mt-6 text-green-400 text-base font-medium whitespace-pre-line">
          {isProcessing ? "Evaluating..." : feedback}
        </div>
        {!isListening && !isProcessing && phase !== "stopped" && (
          <button onClick={startListening} className="mt-8 px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold text-base shadow-lg transition duration-300">
            Start Listening Again
          </button>
        )}
      </div>
    </div>
  );
};

export default InterviewPortal;
