import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaEdit, FaPlus } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { serverUrl } from "../../App";
import { ClipLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';
import { setLectureData } from '../../redux/lectureSlice';

function CreateLecture() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [lectureTitle, setLectureTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { lectureData } = useSelector(state => state.lecture);

  const createLectureHandler = async () => {
    if (!lectureTitle.trim()) return toast.error("Please enter a title");
    setLoading(true);
    try {
      const result = await axios.post(`${serverUrl}/api/course/createLecture/${courseId}`, { lectureTitle }, { withCredentials: true });
      dispatch(setLectureData([...(lectureData || []), result.data.lecture]));
      toast.success("Lecture Created");
      setLectureTitle("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create lecture");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getLecture = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/course/getcourselecture/${courseId}`, {
          withCredentials: true
        });
        dispatch(setLectureData(result.data.lectures));
      } catch (error) {
        toast.error("Failed to fetch lectures");
      }
    };
    getLecture();
  }, [courseId, dispatch]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 rounded-2xl w-full max-w-2xl p-8 transition-all">
        
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Build Your Curriculum</h1>
          <p className="text-slate-500 font-medium">Add structured lessons to provide a world-class learning experience.</p>
        </div>

        {/* Input Section */}
        <div className="space-y-4 mb-8">
          <div className="relative group">
            <input
              type="text"
              placeholder="e.g. Master the Art of Networking"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
              onChange={(e) => setLectureTitle(e.target.value)}
              value={lectureTitle}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all text-sm font-semibold shadow-sm" 
              onClick={() => navigate(`/editcourse/${courseId}`)}
            >
              <FaArrowLeft className="text-xs" /> Return
            </button>
            
            <button 
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] transition-all text-sm font-semibold shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed" 
              disabled={loading} 
              onClick={createLectureHandler}
            >
              {loading ? <ClipLoader size={20} color='white' /> : <><FaPlus className="text-xs" /> Create Lecture</>}
            </button>
          </div>
        </div>

        <div className="h-px bg-slate-100 w-full mb-8" />

        {/* Lecture List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Curriculum Overview</h3>
          {(lectureData || []).length > 0 ? (
            (lectureData || []).map((lecture, index) => (
              <div 
                key={index} 
                className="group bg-white border border-slate-100 rounded-xl flex justify-between items-center p-4 hover:border-indigo-100 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-400 text-xs font-bold group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    {index + 1}
                  </span>
                  <span className="text-slate-700 font-semibold truncate max-w-[300px]">
                    {lecture.lectureTitle}
                  </span>
                </div>
                <button 
                  onClick={() => navigate(`/editlecture/${courseId}/${lecture._id}`)}
                  className="p-2 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-indigo-600 transition-all"
                >
                  <FaEdit size={18} />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl">
              <p className="text-slate-400 text-sm">No lectures added yet. Start by typing a title above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateLecture;