import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";
// import { PlayCircleIcon } from '@heroicons/react/24/solid'; // Optional: for a pro icon look
// Remove the heroicons line and use this instead:
import { FaPlayCircle } from "react-icons/fa";

function EnrolledCourse() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  // Safeguard against undefined data
  const enrolledCourses = userData?.enrolledCourses || [];

  return (
    <div className="min-h-screen w-full px-6 py-12 bg-[#f8fafc]">
      {/* Navigation & Header */}
      <div className="max-w-7xl mx-auto relative mb-12">
        <button 
          onClick={() => navigate("/")}
          className="group flex items-center gap-2 text-gray-500 hover:text-black transition-all duration-300 mb-6"
        >
          <FaArrowLeftLong className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
        
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          My Enrolled <span className="text-blue-600">Courses</span>
        </h1>
        <div className="h-1 w-20 bg-blue-600 mt-2 rounded-full"></div>
      </div>

      {enrolledCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
          <p className="text-xl text-gray-400 font-medium">You haven’t started learning yet.</p>
          <button 
             onClick={() => navigate("/courses")}
             className="mt-4 text-blue-600 font-semibold hover:underline"
          >
            Explore Courses
          </button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {enrolledCourses.map((course) => (
            <div
              key={course._id}
              className="group bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-blue-600 shadow-sm">
                    {course.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{course.level}</p>
                </div>
                
                <h2 className="text-lg font-bold text-gray-800 leading-tight mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {course.title}
                </h2>

                <button
                  onClick={() => navigate(`/viewlecture/${course._id}`)}
                  className="w-full py-3 bg-gray-900 hover:bg-blue-600 text-white rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-blue-200"
                >
                  <FaPlayCircle className="w-5 h-5" />
                  Continue Learning
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EnrolledCourse;