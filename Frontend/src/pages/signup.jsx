import React, { useState } from "react";
import logg from "../assets/logg.png";
import googl from "../assets/googl.jpg";
import { IoEyeOutline, IoEye } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/firebase";

function SignUp() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignup = async () => {
    setLoading(true);
    if (!email || !password || !name) {
      toast.error("All fields are required");
      setLoading(false);
      return;
    }
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/signUp",
        { name, email, password, role },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      toast.success("Signup successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error signing up");
    }
    setLoading(false);
  };

  const googleSignUp = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const user = response.user;
      const result = await axios.post(
        serverUrl + "/api/auth/googleauth",
        { name: user.displayName, email: user.email, role },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      toast.success("Google Signup Successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Google Error");
    }
  };

  return (
    // h-screen and overflow-hidden ensures no scrolling on the main page
    <div className="h-screen w-full bg-[#f8fafc] flex items-center justify-center p-4 md:p-8 overflow-hidden font-sans">
      <div className="w-full max-w-5xl h-full max-h-[700px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex overflow-hidden border border-gray-100">
        
        {/* LEFT SIDE: COMPACT FORM */}
        <div className="flex flex-col justify-center w-full md:w-1/2 px-8 lg:px-16 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Get Started</h1>
            <p className="text-gray-400 text-sm font-medium">Create your premium account today</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-[0.15em] font-bold text-gray-400 ml-1">Full Name</label>
              <input
                type="text"
                className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-sm"
                placeholder="Enter name"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-[0.15em] font-bold text-gray-400 ml-1">Email</label>
              <input
                type="email"
                className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-sm"
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>

            <div className="space-y-1 relative">
              <label className="text-[10px] uppercase tracking-[0.15em] font-bold text-gray-400 ml-1">Password</label>
              <input
                type={show ? "text" : "password"}
                className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-sm"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <button onClick={() => setShow(!show)} className="absolute right-4 bottom-3 text-gray-400 hover:text-indigo-500">
                {show ? <IoEye size={18} /> : <IoEyeOutline size={18} />}
              </button>
            </div>

            <div className="flex gap-2 pt-1">
              {["student", "Instructor"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2.5 rounded-xl border text-[12px] font-bold transition-all ${
                    role === r ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100" : "bg-white text-gray-400 border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full bg-gray-900 text-white p-3.5 rounded-xl font-bold hover:bg-indigo-600 transition-all transform active:scale-95 flex justify-center mt-2 shadow-lg shadow-gray-200"
            >
              {loading ? <ClipLoader size={18} color="white" /> : "Sign Up"}
            </button>
          </div>

          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 h-[1px] bg-gray-100"></div>
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">or</span>
            <div className="flex-1 h-[1px] bg-gray-100"></div>
          </div>

          <button
            onClick={googleSignUp}
            className="flex items-center justify-center gap-3 border border-gray-200 p-3 rounded-xl hover:bg-gray-50 transition-all font-semibold text-sm text-gray-600"
          >
            <img src={googl} className="w-4" alt="Google" />
            <span>Continue with Google</span>
          </button>

          <p className="text-center text-gray-400 text-xs mt-6">
            Member already? <span onClick={() => navigate("/Login")} className="text-indigo-600 font-bold cursor-pointer hover:underline">Login</span>
          </p>
        </div>

        {/* RIGHT SIDE: PREMIUM ROUND LOGO */}
        <div className="hidden md:flex w-1/2 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-600 via-indigo-700 to-purple-900 items-center justify-center flex-col p-12 relative">
          {/* Decorative ambient light */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 blur-[60px] rounded-full"></div>
          
          {/* THE ROUND LOGO CONTAINER */}
        {/* THE ROUND LOGO CONTAINER */}
<div className="w-48 h-48 rounded-full bg-white/5 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl relative z-10 group transition-all duration-500 hover:scale-105">
   {/* Removed internal padding from this div to allow full image spread */}
   <div className="w-40 h-40 rounded-full bg-white flex items-center justify-center shadow-inner overflow-hidden transition-transform duration-700 group-hover:rotate-6">
      {/* Changed to take FULL width/height and cover the circle */}
      <img src={logg} alt="Logo" className="w-full h-full object-cover" />
   </div>
</div>

          <div className="text-center mt-10 z-10">
            <h2 className="text-3xl font-black text-indigo-500 tracking-[0.3em] uppercase">SkillNest</h2>
            <div className="h-1 w-8 bg-indigo-400 mx-auto my-4 rounded-full"></div>
            <p className="text-indigo-500 text-sm font-medium italic max-w-xs mx-auto">
              "Excellence in every lesson. Success in every step."
            </p>
          </div>
          
          <div className="absolute bottom-8 text-white/30 text-[10px] font-bold tracking-[0.2em] uppercase">
            Premium Learning Experience
          </div>
        </div>

      </div>
    </div>
  );
}

export default SignUp;