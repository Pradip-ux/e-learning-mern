import React, { useState, useEffect, useRef } from 'react';
import ai from "../assets/ai.png";
import ai1 from "../assets/SearchAi.png";
import { RiMicAiFill } from "react-icons/ri";
import axios from 'axios';
import { serverUrl } from '../App';
import { useNavigate } from 'react-router-dom';
import start from "../assets/start.mp3";
import { FaArrowLeftLong } from "react-icons/fa6";

function SearchWithAi() {
  const [input, setInput] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [listening, setListening] = useState(false);

  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  const startSound = new Audio(start);

  // ✅ INIT SPEECH RECOGNITION
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = async (e) => {
      const transcript = e.results[0][0].transcript.trim();
      setInput(transcript);
      await handleRecommendation(transcript);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
  }, []);

  function speak(message) {
    const utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  const handleSearch = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    if (listening) {
      recognition.stop();
      setListening(false);
      return;
    }
    try {
      recognition.start();
      setListening(true);
      startSound.play();
    } catch (err) {
      console.log("Start error:", err);
    }
  };

  const handleRecommendation = async (query) => {
    if (!query.trim()) return;
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/ai/search`,
        { input: query },
        { withCredentials: true }
      );
      setRecommendations(data);
      if (data.length > 0) {
        speak("Here are the best courses for you");
      } else {
        speak("No courses found");
      }
    } catch (error) {
      console.log("API Error:", error);
      speak("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black text-white flex flex-col items-center px-4 py-16">
      
      {/* Search Box */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-[2rem] p-6 sm:p-8 w-full max-w-2xl text-center relative">
        
        <FaArrowLeftLong
          className='text-white/70 hover:text-white w-[22px] h-[22px] cursor-pointer absolute left-6 top-8 transition-colors'
          onClick={() => navigate("/")}
        />

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-8 flex items-center justify-center gap-3 tracking-tight">
          <img src={ai} className='w-9 h-9 animate-pulse' alt="AI" />
          Search with <span className='bg-gradient-to-r from-[#CB99C7] to-[#E493B3] bg-clip-text text-transparent'>AI Intelligence</span>
        </h1>

        <div className="flex items-center bg-black/40 border border-white/10 rounded-full overflow-hidden shadow-inner relative w-full group focus-within:border-[#CB99C7]/50 transition-all duration-300">
          <input
            type="text"
            className="flex-grow px-6 py-4 bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg"
            placeholder="What skill would you like to master?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRecommendation(input)}
          />

          {input && (
            <button
              onClick={() => handleRecommendation(input)}
              className="absolute right-16 hover:scale-110 transition-transform"
            >
              <div className="bg-gradient-to-r from-[#CB99C7] to-[#E493B3] p-2 rounded-full shadow-lg">
                <img src={ai} className='w-6 h-6 invert' alt="Search" />
              </div>
            </button>
          )}

          <button
            className={`absolute right-2 rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 ${
              listening ? "bg-red-500 animate-pulse scale-110 shadow-[0_0_15px_rgba(239,68,68,0.5)]" : "bg-white hover:bg-gray-100"
            }`}
            onClick={handleSearch}
          >
            <RiMicAiFill className={`w-6 h-6 ${listening ? "text-white" : "text-[#cb87c5]"}`} />
          </button>
        </div>
      </div>

      {/* RESULTS SECTION */}
      <div className="w-full max-w-6xl mt-16 px-4">
        {recommendations.length > 0 ? (
          <>
            <div className="flex flex-col items-center mb-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                    <img src={ai1} className="w-8 h-8" alt="AI" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                    AI Recommendations
                </h2>
              </div>
              <p className="text-gray-500 text-sm">Tailored learning paths based on your request</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendations.map((course, index) => (
                <div
                  key={index}
                  className="group relative bg-[#0f0f0f] border border-white/5 rounded-3xl p-1 overflow-hidden transition-all duration-500 hover:border-[#CB99C7]/30 hover:shadow-[0_0_30px_rgba(203,153,199,0.1)] hover:-translate-y-2 cursor-pointer"
                  onClick={() => navigate(`/viewcourse/${course._id}`)}
                >
                  {/* Subtle Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#CB99C7]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative bg-[#141414] rounded-[1.4rem] p-6 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-[#CB99C7] font-bold">
                          {course.category || "Course"}
                        </span>
                        <div className="w-2 h-2 rounded-full bg-[#CB99C7] shadow-[0_0_8px_#CB99C7]" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-white group-hover:text-[#CB99C7] transition-colors line-clamp-2 leading-snug">
                        {course.title}
                      </h3>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-gray-500 text-xs font-medium">Explore Modules</span>
                      <div className="p-2 bg-white/5 rounded-full group-hover:bg-[#CB99C7] group-hover:text-black transition-all">
                        <FaArrowLeftLong className="rotate-180 w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center mt-20 space-y-4">
             <div className={`p-6 rounded-full border-2 border-dashed ${listening ? 'border-red-500/50' : 'border-white/10'}`}>
                {listening ? (
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                ) : (
                    <RiMicAiFill className="w-12 h-12 text-gray-700" />
                )}
             </div>
             <h1 className="text-2xl font-light text-gray-500 tracking-wide">
                {listening ? "Processing Audio..." : "Start your journey with a voice command"}
             </h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchWithAi;