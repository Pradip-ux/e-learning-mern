import axios from "axios";
import React, { useState } from "react";
import { FaArrowLeftLong, FaCamera } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

function EditProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const [name, setName] = useState(userData?.name || "");
  const [description, setdesc] = useState(userData?.description || "");
  const [photoUrl, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleeditProfile = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (photoUrl) {
      formData.append("photoUrl", photoUrl);
    }

    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/profile`,
        formData,
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      toast.success("Profile Updated Successfully");
      navigate("/profile");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.05)] p-8 md:p-12 relative">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate("/dashboard")}
          className="absolute top-8 left-8 p-2 rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all"
        >
          <FaArrowLeftLong size={20} />
        </button>

        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Account Settings
          </h2>
          <p className="text-slate-400 text-sm font-medium mt-1">
            Update your professional presence on Skill Nest
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleeditProfile();
          }}
          className="space-y-6"
        >
          {/* Enhanced Avatar Upload */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-28 h-28 rounded-3xl overflow-hidden border-4 border-white shadow-xl ring-1 ring-slate-100">
                {photoUrl ? (
                  <img
                    src={URL.createObjectURL(photoUrl)}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : userData?.photoUrl ? (
                  <img
                    src={userData.photoUrl}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-indigo-600 text-white flex items-center justify-center text-4xl font-black">
                    {userData?.name?.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 p-2.5 bg-slate-900 text-white rounded-xl cursor-pointer shadow-lg hover:bg-indigo-600 transition-colors">
                <FaCamera size={16} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setPhoto(e.target.files[0])}
                />
              </label>
            </div>
            <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Upload New Photo
            </p>
          </div>

          <div className="space-y-4 pt-4">
            {/* Input Group: Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-slate-800 font-semibold focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
                placeholder="Enter your name"
              />
            </div>

            {/* Input Group: Email (Read Only) */}
            <div className="space-y-1.5 opacity-60">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <input
                readOnly
                type="text"
                value={userData?.email}
                className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-400 font-medium cursor-not-allowed"
              />
            </div>

            {/* Input Group: Bio */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                About You
              </label>
              <textarea
                rows={4}
                value={description}
                placeholder="Share your expertise or background..."
                onChange={(e) => setdesc(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-slate-800 font-medium focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4">
            <button
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-slate-200 
              hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <ClipLoader size={20} color="white" />
              ) : (
                "Save Preferences"
              )}
            </button>
            <button 
              type="button"
              onClick={() => navigate("/profile")}
              className="w-full mt-3 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
              Discard Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;