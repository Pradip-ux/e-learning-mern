import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import {
  FaArrowLeftLong,
  FaEnvelope,
  FaBookOpen,
  FaGraduationCap,
  FaCirclePlay,
  FaHeadset
} from "react-icons/fa6";

function StudentDashboard() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const enrolledCourses = userData?.enrolledCourses || [];

  // ✅ New state for progress data
  const [progressData, setProgressData] = useState([]);

  // ✅ Fetch progress data on mount
  useEffect(() => {
   const fetchProgress = async () => {
  try {
    // Ensure courseId is appended to the end of the URL
    const res = await axios.get(
      `${serverUrl}/api/progress/getprogress/${courseId}`, 
      { withCredentials: true }
    );
    setCompletedLectures(res.data.completedLectures || []);
  } catch (err) {
    console.error("Error fetching progress:", err);
  }
};
    fetchProgress();
  }, []);

  const handleSupport = () => {
    navigate("/support");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      {/* HEADER SECTION - NO CHANGES */}
      <div className="relative bg-[#0f172a] pb-32 pt-10">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[150%] bg-blue-500/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-all mb-8 group"
          >
            <FaArrowLeftLong className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold tracking-wide">Back to Home</span>
          </button>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            <div className="relative">
              {userData?.photoUrl ? (
                <img
                  src={userData.photoUrl}
                  alt="Profile"
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-slate-800 shadow-2xl"
                />
              ) : (
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-5xl font-bold border-4 border-slate-800">
                  {userData?.name?.slice(0, 1).toUpperCase()}
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-[#0f172a] rounded-full shadow-lg"></div>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Welcome back, <span className="text-blue-400">{userData?.name?.split(" ")[0]}</span>! 👋
              </h1>
              <p className="text-slate-400 mt-2 max-w-xl italic font-medium">
                "{userData?.description || "Master new skills today."}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 pb-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* SIDEBAR - NO CHANGES */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 h-fit space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl shadow-blue-900/5 border border-white">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">
                Student Profile
              </h3>

              <div className="space-y-6">
                <InfoRow icon={<FaEnvelope />} label="Email Address" value={userData?.email} />
                <InfoRow icon={<FaGraduationCap />} label="Learning Status" value={userData?.role || "Active Student"} isBadge />
                <InfoRow icon={<FaBookOpen />} label="Courses Enrolled" value={enrolledCourses.length} />
              </div>

              <button
                onClick={() => navigate("/editprofile")}
                className="w-full mt-10 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all duration-300 active:scale-[0.98]"
              >
                Edit Profile Details
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                  <FaHeadset className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-black tracking-tight">Help & Support</h3>
              </div>
              <button
                onClick={handleSupport}
                className="w-full py-3.5 bg-white text-blue-700 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-50 transition-colors shadow-lg"
              >
                Submit a Complaint
              </button>
            </div>
          </div>

          {/* COURSE GRID - ADDED PROGRESS LOGIC */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-8 px-2">
              <h2 className="text-2xl text-white tracking-tight text-slate-800">My Courses</h2>
              <div className="h-px flex-1 mx-6 bg-slate-200 hidden sm:block"></div>
            </div>

            {enrolledCourses.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] p-12 text-center border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">No active enrollments found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {enrolledCourses.map((course, index) => {
                  // ✅ Match Progress Data
                  const courseProgress = progressData.find(
                    (p) => p.courseId?.toString() === course._id?.toString()
                  );

                  // If you use my controller fix above, these lines will now work:
                  // ✅ Use the percentage directly from your corrected controller
                  const percent = courseProgress?.progressPercentage || 0;
                  const completed = courseProgress?.completedLectures?.length || 0;
                  const total = courseProgress?.totalLectures || course.lectures?.length || 0;

                  return (
                    <div
                      key={course._id || index}
                      className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-md hover:shadow-2xl transition-all duration-500"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-600 shadow-sm">
                            {course.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <h4 className="text-lg font-bold text-slate-800 leading-tight mb-4 line-clamp-2 h-12">
                          {course.title}
                        </h4>

                        {/* ✅ PROGRESS SECTION ADDED HERE */}
                        <div className="mb-6">
                          <div className="flex justify-between items-end mb-2">
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</p>
                              <p className="text-xs font-bold text-slate-700">{completed} / {total} Lessons</p>
                            </div>
                            <p className="text-xl font-black text-blue-600 leading-none">{percent}%</p>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-1000"
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                        </div>

                        <button
                          onClick={() => navigate(`/viewlecture/${course._id}`)}
                          className="w-full py-3.5 bg-slate-900 group-hover:bg-blue-600 text-white rounded-xl font-black text-xs transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <FaCirclePlay size={18} />
                          {percent > 0 ? "CONTINUE LEARNING" : "START LEARNING"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value, isBadge }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className={`text-[13px] font-bold truncate ${isBadge ? 'text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 inline-block' : 'text-slate-700'}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

export default StudentDashboard;