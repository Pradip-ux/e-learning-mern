import React from "react";
import { FaArrowLeftLong, FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import image from "../../assets/empty.jpg";
import { FaEdit, FaTag, FaCheckCircle, FaHourglassHalf } from "react-icons/fa";
import { useSelector } from "react-redux";
import getCreatorCourse from "../../customHooks/useGetCreatorCourse";

function Courses() {
  const navigate = useNavigate();
  getCreatorCourse();
  const { creatorCourseData } = useSelector((state) => state.course);

  return (
    <div className="p-4 sm:p-6 md:p-10 font-sans bg-[#f8fafc] min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 md:mb-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-indigo-600 hover:border-indigo-100 shadow-sm transition-all active:scale-90"
            >
              <FaArrowLeftLong />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                Course Management
              </h1>
              <p className="text-xs md:text-sm text-slate-500 font-medium">
                Review and update your educational catalog
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/createcourse")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
          >
            <FaPlus className="text-xs" /> Create New Course
          </button>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          
          {/* DESKTOP TABLE VIEW (Hidden on Mobile) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-5 text-xs font-bold uppercase tracking-widest text-slate-400">Course Details</th>
                  <th className="p-5 text-xs font-bold uppercase tracking-widest text-slate-400">Pricing</th>
                  <th className="p-5 text-xs font-bold uppercase tracking-widest text-slate-400">Status</th>
                  <th className="p-5 text-xs font-bold uppercase tracking-widest text-slate-400 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {creatorCourseData?.length > 0 ? (
                  creatorCourseData.map((course, index) => (
                    <tr key={index} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <img
                            src={course?.thumbnail}
                            alt="Thumbnail"
                            className="h-14 w-14 rounded-2xl object-cover border border-slate-100 shadow-sm"
                          />
                          <div>
                            <span className="block text-slate-900 font-bold group-hover:text-indigo-600 transition-colors leading-tight">
                              {course?.title || "Untitled Course"}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                              ID: {course?._id?.slice(-6)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-5 font-bold text-slate-700">
                        {course?.price ? `₹${course.price}` : <span className="text-slate-300">Free</span>}
                      </td>
                      <td className="p-5">
                        <StatusBadge isPublished={course.isPublished} />
                      </td>
                      <td className="p-5">
                        <div className="flex justify-center">
                          <EditButton onClick={() => navigate(`/editcourse/${course._id}`)} />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : <EmptyState image={image} />}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARD VIEW (Hidden on Desktop) */}
          <div className="md:hidden divide-y divide-slate-100">
            {creatorCourseData?.length > 0 ? (
              creatorCourseData.map((course, index) => (
                <div key={index} className="p-5 flex flex-col gap-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={course?.thumbnail}
                      alt="Thumbnail"
                      className="h-16 w-16 rounded-2xl object-cover border border-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        {course?.title || "Untitled Course"}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold mb-2 uppercase">ID: {course?._id?.slice(-6)}</p>
                      <StatusBadge isPublished={course.isPublished} />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl">
                    <div className="flex items-center gap-2 text-slate-600">
                      <FaTag className="text-xs text-slate-400" />
                      <span className="text-sm font-bold">
                         {course?.price ? `₹${course.price}` : "Free"}
                      </span>
                    </div>
                    <EditButton onClick={() => navigate(`/editcourse/${course._id}`)} label="Edit Course" />
                  </div>
                </div>
              ))
            ) : <EmptyState image={image} mobile />}
          </div>
          
          {/* Footer Sync Section */}
          <div className="p-6 bg-slate-50/30 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
              {creatorCourseData?.length || 0} Total Courses
            </p>
            <p className="text-[10px] md:text-xs text-slate-400 font-medium italic text-center">
              Changes sync automatically with your public profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- REUSABLE SUB-COMPONENTS TO CLEAN UP THE CODE --- */

const StatusBadge = ({ isPublished }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
    isPublished ? "bg-green-50 text-green-600 border border-green-100" : "bg-amber-50 text-amber-600 border border-amber-100"
  }`}>
    {isPublished ? <FaCheckCircle size={10}/> : <FaHourglassHalf size={10}/>}
    {isPublished ? "Published" : "Draft"}
  </span>
);

const EditButton = ({ onClick, label }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-2 p-2.5 sm:px-4 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm group active:scale-95"
  >
    <FaEdit size={14} />
    {label && <span className="text-xs font-bold">{label}</span>}
  </button>
);

const EmptyState = ({ image, mobile }) => (
  mobile ? (
    <div className="p-10 text-center flex flex-col items-center">
      <img src={image} className="w-20 opacity-20 mb-4 grayscale" alt="Empty" />
      <p className="text-sm text-slate-400 font-bold">No courses yet.</p>
    </div>
  ) : (
    <tr>
      <td colSpan="4" className="p-20 text-center">
        <div className="flex flex-col items-center">
          <img src={image} alt="Empty" className="w-24 opacity-20 mb-4 grayscale" />
          <p className="text-slate-400 font-semibold tracking-tight">No courses found in your library.</p>
          <p className="text-xs text-slate-300 font-bold uppercase mt-1">Start by creating your first curriculum</p>
        </div>
      </td>
    </tr>
  )
);

export default Courses;