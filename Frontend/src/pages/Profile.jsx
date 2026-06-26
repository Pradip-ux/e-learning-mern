import React from "react";
import { useSelector } from "react-redux";
import { FaArrowLeftLong, FaEnvelope, FaUserTag, FaBookOpen } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function Profile() {
    const { userData } = useSelector((state) => state.user);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden relative">

                {/* Back Button */}
                <button
                    onClick={() => navigate("/")}
                    className="absolute top-6 left-6 z-20 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-slate-900 transition-all shadow-sm"
                >
                    <FaArrowLeftLong size={18} />
                </button>

                {/* Header Banner */}
                <div className="h-40 bg-slate-900 relative flex justify-center">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                    {/* Profile Image with Status Ring */}
                    <div className="absolute -bottom-14">
                        <div className="relative group">
                            {userData?.photoUrl ? (
                                <img
                                    src={userData.photoUrl + "?t=" + new Date().getTime()}
                                    alt="Profile"
                                    className="w-28 h-28 rounded-3xl object-cover border-4 border-white shadow-xl transition-transform group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-28 h-28 rounded-3xl bg-indigo-600 text-white flex items-center justify-center text-4xl font-black border-4 border-white shadow-xl">
                                    {userData?.name?.slice(0, 1).toUpperCase()}
                                </div>
                            )}
                            <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* Body Content */}
                <div className="pt-20 pb-8 px-8">
                    {/* User Identity */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                            {userData?.name}
                        </h2>
                        <span className="inline-block mt-1 px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100">
                            {userData?.role || "Student"}
                        </span>
                    </div>

                    {/* Information Grid */}
                    <div className="space-y-3">
                        <ProfileInfoRow
                            icon={<FaEnvelope className="text-indigo-500" />}
                            label="Email Address"
                            value={userData?.email}
                        />
                        <ProfileInfoRow
                            icon={<FaUserTag className="text-indigo-500" />}
                            label="Professional Bio"
                            value={userData?.description || "No bio added yet."}
                        />
                        <ProfileInfoRow
                            icon={<FaBookOpen className="text-indigo-500" />}
                            label="Enrolled Courses"
                            value={userData?.enrolledCourses?.length || 0}
                            isBadge
                        />
                    </div>

                    {/* Action Button */}
                    <div className="mt-10 flex justify-center">
                        <button
                            className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-slate-200"
                            onClick={() =>
                                navigate("/editprofile")
                            }
                        >
                            Edit Profile Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Reusable row component for cleaner code
function ProfileInfoRow({ icon, label, value, isBadge }) {
    return (
        <div className="flex items-start gap-4 bg-slate-50/50 border border-slate-100 p-4 rounded-2xl hover:bg-white hover:border-indigo-100 hover:shadow-sm transition-all group">
            <div className="mt-1">{icon}</div>
            <div className="flex-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
                <p className={`text-sm ${isBadge ? 'font-black text-indigo-600' : 'font-semibold text-slate-700'} leading-relaxed`}>
                    {value}
                </p>
            </div>
        </div>
    );
}

export default Profile;