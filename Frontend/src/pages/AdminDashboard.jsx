import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { serverUrl } from "../App";
import {
  Users, Briefcase, BookOpen, MessageSquare, Star,
  Search, ShieldAlert, Calendar, Trash2, Layout, MessageCircle,
  FileText, Image as ImageIcon, StickyNote, ExternalLink // Added missing icons
} from "lucide-react";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({});
  const [complaints, setComplaints] = useState([]);
  const [materials, setMaterials] = useState([]); // Added missing state
  const [searchTerm, setSearchTerm] = useState("");

  const [latestReview, setLatestReview] = useState([]);
  const { reviewData } = useSelector(state => state.review);

  // Helper to handle file URLs
  const getFileUrl = (fileUrl) => {
    if (!fileUrl) return "";
    return fileUrl.startsWith("http") ? fileUrl : `${serverUrl}/uploads/${fileUrl}`;
  };

  useEffect(() => {
    if (Array.isArray(reviewData)) {
      setLatestReview(reviewData);
    } else if (reviewData?.reviews) {
      setLatestReview(reviewData.reviews);
    } else {
      setLatestReview([]);
    }
  }, [reviewData]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getInstructorCourseCount = (userId) => courses.filter(c => c.creator === userId || c.instructor?._id === userId).length;
  const getStudentEnrollmentCount = (user) => user.enrolledCourses?.length || 0;

  const fetchData = async () => {
    try {
      const uRes = await axios.get(`${serverUrl}/api/admin/users`);
      setUsers(uRes.data?.users || (Array.isArray(uRes.data) ? uRes.data : []));

      const sRes = await axios.get(`${serverUrl}/api/admin/stats`);
      setStats(sRes.data?.stats || sRes.data || {});

      const cRes = await axios.get(`${serverUrl}/api/course/getpublished`);
      const courseArray = cRes.data.courses || cRes.data; 
      setCourses(Array.isArray(courseArray) ? courseArray : []);

      const compRes = await axios.get(`${serverUrl}/api/admin/complaints`);
      setComplaints(compRes.data?.complaints || (Array.isArray(compRes.data) ? compRes.data : []));

      // Fetch materials data
      const matRes = await axios.get(`${serverUrl}/api/material/all`, { withCredentials: true });
      setMaterials(matRes.data.materials || []);

    } catch (error) {
      console.error("Fetch Error:", error.response?.data || error.message);
    }
  };

  const deleteMaterial = async (id) => {
    if (window.confirm("Delete this material?")) {
      try {
        await axios.delete(`${serverUrl}/api/material/${id}`, { withCredentials: true });
        setMaterials(materials.filter(m => m._id !== id));
      } catch (error) {
        alert("Failed to delete material");
      }
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to permanently delete this user?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${serverUrl}/api/admin/user/${userId}`, { headers: { token: token } });
        setUsers(users.filter((user) => user._id !== userId));
        alert("User deleted successfully");
      } catch (error) {
        alert(error.response?.data?.message || "Failed to delete user.");
      }
    }
  };

  const deleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${serverUrl}/api/course/${courseId}`, { headers: { token: token } });
        setCourses(courses.filter((course) => course._id !== courseId));
        alert("Course deleted successfully");
      } catch (error) {
        alert(error.response?.data?.message || "Failed to delete course.");
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 bg-[#f8fafc] min-h-screen font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">

      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            System Overview & Management
          </p>
        </div>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search users or emails..."
            className="pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none w-full md:w-80 shadow-sm transition-all duration-300 placeholder:text-slate-400 font-medium"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 2. Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="Total Users" value={stats?.totalUsers || users.length} icon={<Users />} color="bg-indigo-600" />
        <StatCard title="Instructors" value={users.filter(u => u.role === 'Instructor').length} icon={<Briefcase />} color="bg-violet-600" />
        <StatCard title="Total Courses" value={courses?.length} icon={<BookOpen />} color="bg-amber-500" />
        <StatCard title="Total Reviews" value={latestReview.length} icon={<Star />} color="bg-emerald-500" />
      </div>

      {/* 3. User Management & Support Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white">
            <h2 className="font-bold text-slate-800 text-xl tracking-tight">Active Accounts</h2>
            <span className="text-[11px] font-black px-3 py-1.5 bg-indigo-50 rounded-lg text-indigo-600 uppercase tracking-wider">
              {filteredUsers.length} total
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/70 text-slate-400 text-[11px] uppercase tracking-[0.15em] font-bold">
                  <th className="px-8 py-5">User Details</th>
                  <th className="px-8 py-5">Role</th>
                  <th className="px-8 py-5">Activity</th>
                  <th className="px-8 py-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.slice(0, 10).map(user => (
                  <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center font-bold text-indigo-600 border border-slate-100 shadow-sm">
                          {user.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm leading-none mb-1.5">{user.name}</p>
                          <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${user.role === 'Instructor' ? 'bg-violet-50 text-violet-600 border-violet-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-slate-700">
                        {user.role === 'Instructor' ? `${getInstructorCourseCount(user._id)} Courses` : `${getStudentEnrollmentCount(user)} Enrolled`}
                      </p>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <button onClick={() => deleteUser(user._id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-bold text-slate-800 text-xl tracking-tight">Urgent Support</h2>
            <div className="p-2 bg-rose-50 rounded-lg"><ShieldAlert className="text-rose-500" size={20} /></div>
          </div>
          <div className="space-y-4">
            {complaints.length > 0 ? complaints.map((comp, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-800 mb-1">{comp.user?.name}</p>
                <p className="text-[11px] text-slate-500 line-clamp-2">{comp.message}</p>
              </div>
            )) : <p className="text-xs text-slate-400 text-center py-10">No pending complaints.</p>}
          </div>
        </div>
      </div>

      {/* 4. COURSE MANAGEMENT TABLE */}
      <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-12">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600">
              <Layout size={20} />
            </div>
            <h2 className="font-bold text-slate-800 text-xl tracking-tight">Course Management</h2>
          </div>
          <span className="text-[11px] font-black px-3 py-1.5 bg-amber-50 rounded-lg text-amber-600 uppercase tracking-wider">
            {courses?.length} active courses
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/70 text-slate-400 text-[11px] uppercase tracking-[0.15em] font-bold">
                <th className="px-8 py-5">Course</th>
                <th className="px-8 py-5">Description</th>
                <th className="px-8 py-5">Created Date</th>
                <th className="px-8 py-5">Students</th>
                <th className="px-8 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {courses?.map((course) => (
                <tr key={course._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-16 h-10 rounded-lg object-cover shadow-sm border border-slate-100 bg-slate-100"
                        onError={(e) => { e.target.src = "https://placehold.co/400x225?text=Error"; }}
                      />
                      <div>
                        <p className="font-bold text-slate-800 text-sm leading-none mb-1">{course.title}</p>
                        <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-tight">
                          {course.category || "General"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 max-w-xs">
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{course.description}</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar size={14} className="text-slate-300" />
                      <span className="text-xs font-semibold">{formatDate(course.createdAt)}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-700">{course.enrolledStudents?.length || 0}</span>
                      <span className="text-[10px] text-slate-400 font-medium">Students</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <button onClick={() => deleteCourse(course._id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. MATERIAL MANAGEMENT TABLE */}
      {/* <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-12">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-50 rounded-xl text-rose-600">
              <StickyNote size={20} />
            </div>
            <h2 className="font-bold text-slate-800 text-xl tracking-tight">Material Management</h2>
          </div>
          <span className="text-[11px] font-black px-3 py-1.5 bg-rose-50 rounded-lg text-rose-600 uppercase tracking-wider">
            {materials.length} Items Total
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/70 text-slate-400 text-[11px] uppercase tracking-[0.15em] font-bold">
                <th className="px-8 py-5">Title & Type</th>
                <th className="px-8 py-5">Course Link</th>
                <th className="px-8 py-5">Content Preview</th>
                <th className="px-8 py-5">Date Added</th>
                <th className="px-8 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {materials.map((m) => (
                <tr key={m._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center 
                        ${m.type === 'pdf' ? 'bg-red-50 text-red-500' : 
                          m.type === 'image' ? 'bg-blue-50 text-blue-500' : 
                          'bg-amber-50 text-amber-500'}`}>
                        {m.type === "pdf" && <FileText size={18} />}
                        {m.type === "image" && <ImageIcon size={18} />}
                        {m.type === "note" && <StickyNote size={18} />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm leading-none mb-1">{m.title}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{m.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                      {m.course?.title || "General"}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    {m.type === "note" ? (
                      <p className="text-xs text-slate-500 italic line-clamp-1 truncate max-w-[200px]">{m.content}</p>
                    ) : (
                      <a href={getFileUrl(m.fileUrl)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors">
                        View Attachment <ExternalLink size={12} />
                      </a>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar size={14} className="text-slate-300" />
                      <span className="text-xs font-semibold">{formatDate(m.createdAt)}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <button onClick={() => deleteMaterial(m._id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {materials.length === 0 && (
            <div className="py-20 text-center text-slate-400 text-xs font-medium uppercase tracking-widest">No materials found.</div>
          )}
        </div>
      </div> */}
      
      {/* 6. REVIEW MANAGEMENT TABLE */}
      <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-12">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
              <MessageCircle size={20} />
            </div>
            <h2 className="font-bold text-slate-800 text-xl tracking-tight">Review Management</h2>
          </div>
          <span className="text-[11px] font-black px-3 py-1.5 bg-emerald-50 rounded-lg text-emerald-600 uppercase tracking-wider">
            {latestReview.length} total reviews
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/70 text-slate-400 text-[11px] uppercase tracking-[0.15em] font-bold">
                <th className="px-8 py-5">Student</th>
                <th className="px-8 py-5">Course</th>
                <th className="px-8 py-5">Feedback</th>
                <th className="px-8 py-5 text-center">Rating</th>
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {latestReview?.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs border border-indigo-100">
                        {item.user?.name?.charAt(0) || "S"}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-xs leading-none mb-1">{item.user?.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{item.user?.role || "Student"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 uppercase">
                      {item.courseName || "Course"}
                    </span>
                  </td>
                  <td className="px-8 py-5 max-w-xs">
                    <p className="text-xs text-slate-500 italic line-clamp-1">"{item.comment}"</p>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex items-center justify-center gap-1 text-amber-500">
                      <Star size={12} fill="currentColor" />
                      <span className="text-sm font-black">{item.rating}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar size={14} className="text-slate-300" />
                      <span className="text-xs font-semibold">{formatDate(item.createdAt || item.date)}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {latestReview.length === 0 && (
            <div className="py-20 text-center text-slate-400 text-xs font-medium uppercase tracking-widest">No review data found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-6 hover:shadow-2xl hover:shadow-indigo-50 transition-all duration-300 group cursor-default">
    <div className={`p-5 rounded-2xl text-white ${color} shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
      {React.cloneElement(icon, { size: 28, strokeWidth: 2.5 })}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</p>
      <p className="text-4xl font-black text-slate-900 leading-none tabular-nums tracking-tighter">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;