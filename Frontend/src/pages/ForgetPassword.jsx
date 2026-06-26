import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

function ForgetPassword() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [conpassword, setConPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1 - Send OTP
  const sendOtp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/sendotp",
        { email },
        { withCredentials: true }
      );
      setLoading(false);
      setStep(2);
      toast.success(result.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message);
      setLoading(false);
    }
  };

  // Step 2 - Verify OTP
  const verifyOTP = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/verifyotp",
        { email, otp },
        { withCredentials: true }
      );
      setLoading(false);
      setStep(3);
      toast.success(result.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message);
      setLoading(false);
    }
  };

  // Step 3 - Reset Password
  const resetPassword = async () => {
    if (newpassword !== conpassword) {
      return toast.error("Passwords do not match");
    }
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/resetpassword",
        { email, password: newpassword },
        { withCredentials: true }
      );
      setLoading(false);
      toast.success(result.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9fafb] px-4 font-[Poppins] relative overflow-hidden">
      {/* Decorative background elements for a premium feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-3xl opacity-50" />

      <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-10 w-full max-w-md z-10">
        <h2 className="text-3xl font-bold text-center text-slate-900 tracking-tight mb-2">
          Reset Password
        </h2>

        <p className="text-center text-slate-500 text-sm mb-8">
          Follow the simple steps to regain access.
        </p>

        {/* Step Indicator - Refined Progress Bar */}
        <div className="flex justify-center gap-3 mb-10">
          <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= 1 ? "bg-slate-900" : "bg-slate-100"}`} />
          <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= 2 ? "bg-slate-900" : "bg-slate-100"}`} />
          <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= 3 ? "bg-slate-900" : "bg-slate-100"}`} />
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              sendOtp();
            }}
          >
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
              <input
                type="email"
                placeholder="name@company.com"
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all placeholder:text-slate-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-semibold shadow-lg shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Send Reset Code"}
            </button>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              verifyOTP();
            }}
          >
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Verification Code</label>
              <input
                type="text"
                placeholder="······"
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-4 text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            <button
              className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-semibold shadow-lg shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-70"
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Verify Code"}
            </button>
          </form>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              resetPassword();
            }}
          >
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all"
                  value={newpassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all"
                  value={conpassword}
                  onChange={(e) => setConPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-semibold shadow-lg shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-70"
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Update Password"}
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p
            className="text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer transition-colors inline-flex items-center gap-2"
            onClick={() => navigate("/login")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to login
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;