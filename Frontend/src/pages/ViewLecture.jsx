import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPlayCircle, FaChevronRight, FaFileAlt, FaChalkboardTeacher, FaTrophy } from 'react-icons/fa';
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from 'axios';
import { serverUrl } from '../App';

function ViewLecture() {
  const { courseId } = useParams();
  const { courseData } = useSelector((state) => state.course);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedLectures, setCompletedLectures] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const navigate = useNavigate();

  const selectedCourse = courseData?.find(
    (course) => course._id?.toString() === courseId
  );

  // --- CALCULATE PROGRESS PERCENTAGE ---
  const totalLectures = selectedCourse?.lectures?.length || 0;
  const completedCount = completedLectures.length;
  const progressPercentage = totalLectures > 0
    ? Math.round((completedCount / totalLectures) * 100)
    : 0;

  // const fetchProgress = async () => {
  //   try {
  //     const res = await axios.get(
  //       `${serverUrl}/api/progress/${courseId}`,
  //       { withCredentials: true }
  //     );
  //     setCompletedLectures(res.data.completedLectures || []);
  //   } catch (err) {
  //     console.error("Error fetching progress:", err);
  //   }
  // };
  // ✅ Fix: Add /getprogress/ to the URL
  const fetchProgress = async () => {
  if (!courseId || courseId === "undefined") return; // Guard clause
  try {
    const res = await axios.get(`${serverUrl}/api/progress/getprogress/${courseId}`);
    setCompletedLectures(res.data.completedLectures || []);
  } catch (err) {
    console.error("Error fetching progress:", err);
  }
};
  const markAsCompleted = async (lectureId) => {
    try {
      await axios.post(
        `${serverUrl}/api/progress/update`,
        { courseId, lectureId },
        { withCredentials: true }
      );
      fetchProgress();
    } catch (err) {
      console.log("Progress update error:", err);
    }
  };

  // useEffect(() => {
  //   if (!courseId || courseId === "undefined") return;

  //   const fetchData = async () => {
  //     try {
  //       const [courseRes, materialRes] = await Promise.all([
  //         axios.get(`${serverUrl}/api/course/${courseId}`),
  //         axios.get(`${serverUrl}/api/material/${courseId}`, { withCredentials: true })
  //       ]);
  //       setCourse(courseRes.data.course);
  //       setMaterials(materialRes.data.materials);
  //       fetchProgress();
  //     } catch (err) {
  //       console.error("Error fetching data:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, [courseId]);

  useEffect(() => {
  // Prevent calling if courseId is invalid
  if (!courseId || courseId === "undefined") return;

  const fetchData = async () => {
    try {
      // It's better to call fetchProgress inside here to ensure sequence
      const [courseRes, materialRes] = await Promise.all([
        axios.get(`${serverUrl}/api/course/${courseId.trim()}`),
        axios.get(`${serverUrl}/api/material/${courseId}`, { withCredentials: true })
      ]);
      
      setCourse(courseRes.data.course);
      setMaterials(materialRes.data.materials);
      
      // Call the corrected progress fetcher
      await fetchProgress(); 
      
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [courseId]); // Only triggers when courseId changes

  useEffect(() => {
    if (selectedCourse && selectedCourse.lectures?.length > 0 && !selectedLecture) {
      setSelectedLecture(selectedCourse.lectures[0]);
    }
  }, [selectedCourse, selectedLecture]);

  if (loading && (!selectedCourse || !course)) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-4 bg-gray-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium animate-pulse">Loading Your Campus...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors group"
          >
            <FaArrowLeftLong className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-4">
            {/* Simple Progress Chip in Nav */}
            <div className="hidden sm:flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100">
              <FaTrophy className="text-indigo-500" />
              {progressPercentage}% Completed
            </div>
            <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              {selectedCourse.category}
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-[1440px] mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-[68%] space-y-6">
          <div className="bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video bg-slate-900 ring-1 ring-white/10">
            {selectedLecture?.videoUrl ? (
              <video
                // ✅ Use _id as key to force a hard reset of the video player
                key={selectedLecture._id}
                src={selectedLecture.videoUrl}
                controls
                autoPlay // Optional: starts video immediately on click
                className="w-full h-full object-contain"
                controlsList="nodownload"
                onEnded={() => markAsCompleted(selectedLecture._id)}
              >
                {/* Fallback for older browsers */}
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                <FaPlayCircle size={64} className="opacity-20" />
                <p className="text-lg">Select a lecture to start learning</p>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
              {selectedLecture?.lectureTitle || "Welcome to the Course"}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1.5 text-green-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Lecture active
              </div>
              <span>•</span>
              <p className="font-medium text-slate-600">{selectedCourse.title}</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[32%] space-y-6">

          {/* --- PROGRESS CARD ADDED HERE --- */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your Course Progress</p>
                <p className="text-sm font-bold text-slate-700">{completedCount} of {totalLectures} Lessons Finished</p>
              </div>
              <p className="text-2xl font-black text-indigo-600">{progressPercentage}%</p>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-700 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Playlist Section */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-50 bg-gray-50/50">
              <h2 className="font-bold text-lg">Course Content</h2>
            </div>

            <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
              {selectedCourse?.lectures?.map((lecture, index) => {
                const isActive = selectedLecture?._id === lecture._id;
                const isCompleted = completedLectures.includes(lecture._id);

                return (
                  <button
                    key={lecture._id || index}
                    onClick={() => setSelectedLecture(lecture)}
                    className={`w-full flex items-center gap-4 p-4 text-left transition-all border-b border-gray-50 last:border-0 
                      ${isActive ? 'bg-indigo-50/70 border-l-4 border-l-indigo-600' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm 
                      ${isActive ? 'bg-indigo-600 text-white shadow-lg' : isCompleted ? 'bg-green-100 text-green-600 font-bold' : 'bg-gray-100 text-gray-500'}`}>
                      {isCompleted ? "✓" : index + 1}
                    </div>
                    <div className="flex-grow">
                      <p className={`text-sm font-semibold truncate ${isActive ? 'text-indigo-700' : 'text-slate-700'}`}>
                        {lecture.lectureTitle}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1 font-medium">
                        {isCompleted ? <span className="text-green-600">Completed</span> : "Video Lecture"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Instructor & Materials Card */}
          <div className="bg-indigo-900 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <FaChalkboardTeacher /> Your Instructor
              </h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-indigo-500/30 border border-indigo-400/50 flex items-center justify-center text-xl font-bold">
                  {selectedCourse?.creator?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="font-bold text-lg leading-tight">{selectedCourse?.creator?.name || "Unknown Instructor"}</p>
                  <p className="text-indigo-300 text-xs font-medium">Course Expert</p>
                </div>
              </div>

              <button
                onClick={() => navigate(`/course-materials/${courseId}`)}
                className="w-full bg-white text-indigo-900 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <FaFileAlt /> View Study Materials
              </button>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/40 transition-colors"></div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ViewLecture;