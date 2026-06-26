import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeftLong, FaCamera } from "react-icons/fa6";
import { setUserData } from "../../redux/userSlice";
import { serverUrl } from "../../App";
function InstructorProfile() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState(userData?.name || "");
  const [description, setDescription] = useState(userData?.description || "");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(userData?.photoUrl || "");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      if (photo) formData.append("photo", photo);

      const res = await axios.post(
        `${serverUrl}/api/user/update-profile`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Using the imported action creator is cleaner than hardcoding type strings
      dispatch(setUserData(res.data));

      alert("Profile updated successfully");
    } catch (error) {
      console.error(error);
      alert("Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] px-4 py-12 md:px-6">
      <div className="max-w-3xl mx-auto">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-8 font-medium"
        >
          <FaArrowLeftLong className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        {/* MAIN CARD */}
        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="p-8 md:p-12">

            <header className="mb-10">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Instructor Profile
              </h1>
              <p className="text-slate-500 mt-2">Manage your public presence and bio.</p>
            </header>

            {/* PROFILE IMAGE SECTION */}
            <div className="flex flex-col sm:flex-row items-center gap-8 mb-10 pb-10 border-b border-slate-50">
              <div className="relative group">
                <img
                  src={preview || "https://via.placeholder.com/150"}
                  alt="profile"
                  className="w-32 h-32 rounded-3xl object-cover ring-4 ring-slate-50 shadow-inner"
                />
                <label className="absolute bottom-[-10px] right-[-10px] bg-indigo-600 p-3 rounded-2xl text-white cursor-pointer hover:bg-indigo-700 transition-all shadow-lg hover:scale-110">
                  <FaCamera size={18} />
                  <input type="file" className="hidden" onChange={handleImageChange} />
                </label>
              </div>

              <div className="text-center sm:text-left">
                <h3 className="font-bold text-slate-800 text-lg">Profile Photo</h3>
                <p className="text-sm text-slate-400 mt-1">PNG, JPG or GIF. Max 5MB.</p>
              </div>
            </div>

            {/* FORM */}
            <div className="space-y-8">

              <div className="space-y-2">
                <label className="text-[13px] uppercase tracking-wider font-bold text-slate-400 ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-700 font-medium"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] uppercase tracking-wider font-bold text-slate-400 ml-1">
                  Bio / Description
                </label>
                <textarea
                  placeholder="Tell your students about yourself..."
                  className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-700 font-medium h-40 resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={handleUpdate}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 shadow-xl shadow-indigo-200/20 transition-all active:scale-[0.98]"
                >
                  Save Changes
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorProfile;