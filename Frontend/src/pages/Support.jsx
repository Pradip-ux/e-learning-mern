import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaArrowLeftLong, FaHeadset, FaPaperPlane, FaCircleCheck } from "react-icons/fa6";
import axios from "axios";
import { serverUrl } from "../App";

function Support() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    category: "Technical Issue",
    message: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ Replace with your actual backend endpoint
      await axios.post(`${serverUrl}/api/support/contact`, {
        name: userData.name,
        email: userData.email,
        ...formData
      }, { withCredentials: true });

      setSubmitted(true);
      setTimeout(() => navigate("/dashboard"), 3000);
    } catch (error) {
      console.error("Failed to send complaint", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl text-center max-w-md w-full border border-slate-100">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCircleCheck size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Message Sent!</h2>
          <p className="text-slate-500 font-medium mb-8">We have received your complaint. Our team will get back to you at <b>{userData.email}</b> shortly.</p>
          <p className="text-xs text-blue-600 font-bold animate-pulse">Redirecting to Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all mb-10 group"
        >
          <FaArrowLeftLong className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Back</span>
        </button>

        <div className="bg-white rounded-[3rem] shadow-2xl shadow-blue-900/5 overflow-hidden border border-slate-100">
          <div className="bg-slate-900 p-10 text-white relative">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <FaHeadset size={100} />
             </div>
             <h1 className="text-3xl font-black tracking-tight mb-2">Help Center</h1>
             <p className="text-slate-400 font-medium">Have a complaint or need help? Send us a message.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 mb-2 block">
                  Subject
                </label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. Course access issue"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 transition-all font-semibold"
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 mb-2 block">
                  Category
                </label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 transition-all font-semibold appearance-none"
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option>Technical Issue</option>
                  <option>Payment/Refund</option>
                  <option>Course Content</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 mb-2 block">
                Detailed Complaint
              </label>
              <textarea 
                required
                rows="5"
                placeholder="Describe your issue in detail..."
                className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-6 py-4 focus:outline-none focus:border-blue-500 transition-all font-semibold"
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>

            <button 
              disabled={loading}
              className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                loading ? "bg-slate-200 text-slate-400" : "bg-blue-600 text-white hover:bg-slate-900 hover:shadow-xl hover:shadow-blue-100"
              }`}
            >
              {loading ? "Sending..." : (
                <>
                  <FaPaperPlane /> Send Complaint
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Support;