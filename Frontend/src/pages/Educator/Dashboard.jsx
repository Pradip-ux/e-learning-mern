import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlus, FaChartLine, FaWallet, FaUsers, FaGraduationCap } from "react-icons/fa6";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

function Dashboard() {
    const { userData } = useSelector(state => state.user);
    // const totalStudents = userData?.filter(user => user.role === "student").length || 0;
    const navigate = useNavigate();
    const { courseData } = useSelector(state => state.course);
    const { creatorCourseData } = useSelector(state => state.course);
    const totalStudents = creatorCourseData
  ? [...new Set(
      creatorCourseData.flatMap(course => course.enrolledStudents || [])
    )].length
  : 0;

    // Data Preparation
    const CourseProgressData = creatorCourseData?.map((course) => ({
        name: course.title.length > 10 ? course.title.slice(0, 10) + "..." : course.title,
        lectures: course.lectures?.length || 0
    })) || [];

    const EnrollData = creatorCourseData?.map((course) => ({
        name: course.title.length > 10 ? course.title.slice(0, 10) + "..." : course.title,
        enrolled: course.enrolledStudents?.length || 0
    })) || [];

    const totalEarnings = creatorCourseData?.reduce((sum, course) => {
        const studentCount = course.enrolledStudents?.length || 0;
        const courseRevenue = course.price ? course.price * studentCount : 0;
        return sum + courseRevenue;
    }, 0) || 0;

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10 font-sans text-slate-900">
            <div className="max-w-6xl mx-auto relative">

                {/* Navigation */}
                <button
                    onClick={() => navigate("/")}
                    className="mb-8 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-all font-bold text-sm group"
                >
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </button>

                {/* Hero Profile Section */}
                <div className="bg-white border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] rounded-3xl p-8 mb-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        
                        <div className="relative">
                            <div className="w-28 h-28 rounded-2xl bg-indigo-50 border-2 border-white shadow-sm flex items-center justify-center text-indigo-600 text-4xl font-black overflow-hidden">
                                {userData?.photoUrl ? (
                                    <img src={userData.photoUrl} alt="profile" className="w-full h-full object-cover" />
                                ) : (
                                    userData?.name?.slice(0, 1).toUpperCase() || "I"
                                )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-4 border-white shadow-sm"></div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                                    {userData?.name || "Instructor"}
                                </h1>
                                <span className="bg-indigo-50 text-indigo-600 text-[10px] uppercase tracking-widest font-black px-2.5 py-1 rounded-lg w-fit mx-auto md:mx-0 border border-indigo-100">
                                    Certified Instructor
                                </span>
                            </div>
                            <p className="text-slate-500 max-w-xl text-sm font-medium leading-relaxed">
                                {userData?.description || "Manage your curriculum, track student progress, and scale your educational brand from your SkillNest command center."}
                            </p>
                        </div>

                        <button
                            onClick={() => navigate("/courses")}
                            className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-200 hover:bg-indigo-600 hover:shadow-indigo-100 active:scale-95 transition-all duration-300"
                        >
                            <FaPlus /> Create New Course
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    <StatCard icon={<FaWallet />} label="Total Revenue" value={`₹${totalEarnings.toLocaleString()}`} color="text-emerald-600" bg="bg-emerald-50" />
                    <StatCard icon={<FaUsers />} label="Total Students" value={totalStudents} color="text-indigo-600" bg="bg-indigo-50" />
                    <StatCard icon={<FaGraduationCap />} label="Active Courses" value={creatorCourseData?.length || 0} color="text-purple-600" bg="bg-purple-50" />
                </div>
                                        {/* value={EnrollData.reduce((a, b) => a + b.enrolled, 0)} */}
                {/* Analytics Section */}
                <div className="bg-white border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] rounded-3xl p-6 md:p-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                <FaChartLine className="text-indigo-600" /> Performance Analytics
                            </h2>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Growth & Engagement Insights</p>
                        </div>
                        <select className="bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer transition-all">
                            <option>Monthly View</option>
                            <option>Weekly View</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Course Content Graph */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-sm font-bold text-slate-700">Content Depth (Lectures)</h3>
                                <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md font-bold uppercase">Structure</span>
                            </div>
                            <div className="h-72 w-full bg-slate-50/50 rounded-2xl p-4 border border-slate-100 shadow-inner">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={CourseProgressData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                                        <Tooltip 
                                            cursor={{fill: '#f1f5f9'}}
                                            contentStyle={{borderRadius: '14px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', fontSize: '12px', fontWeight: 'bold'}}
                                        />
                                        <Bar dataKey="lectures" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={35} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Enrollment Graph */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-sm font-bold text-slate-700">Market Reach (Enrolled)</h3>
                                <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md font-bold uppercase">Popularity</span>
                            </div>
                            <div className="h-72 w-full bg-slate-50/50 rounded-2xl p-4 border border-slate-100 shadow-inner">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={EnrollData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                                        <Tooltip 
                                            cursor={{fill: '#f1f5f9'}}
                                            contentStyle={{borderRadius: '14px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', fontSize: '12px', fontWeight: 'bold'}}
                                        />
                                        <Bar dataKey="enrolled" fill="#0f172a" radius={[6, 6, 0, 0]} barSize={35} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Stats Card Component
function StatCard({ icon, label, value, color, bg }) {
    return (
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl ${bg} ${color} flex items-center justify-center text-2xl transition-transform group-hover:scale-110`}>
                    {icon}
                </div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                    <p className={`text-2xl font-black ${color} tracking-tight`}>{value}</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;