import axios from 'axios';
import React, { useState } from 'react';
import { FaArrowLeft, FaTrashAlt, FaCloudUploadAlt } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { serverUrl } from '../../App';
import { setLectureData } from '../../redux/lectureSlice';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

function EditLecture() {
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const { courseId, lectureId } = useParams();
    const { lectureData } = useSelector(state => state.lecture);
    const dispatch = useDispatch();
    const selectedLecture = lectureData.find(lecture => lecture._id === lectureId);
    
    const [videoUrl, setVideoUrl] = useState(null);
    const [lectureTitle, setLectureTitle] = useState(selectedLecture?.lectureTitle || "");
    const [isPreviewFree, setIsPreviewFree] = useState(false);
    const navigate = useNavigate();

   

    const editLecture = async () => {
        setLoading(true);
         const formData = new FormData();
    formData.append("lectureTitle", lectureTitle);
    formData.append("videoUrl", videoUrl);
    formData.append("isPreviewFree", isPreviewFree);
        try {
            const result = await axios.post(serverUrl+`/api/course/editlecture/${lectureId}`, formData, { withCredentials: true });
            dispatch(setLectureData([...lectureData, result.data]));
            toast.success("Lecture Updated Successfully");
            navigate(`/createlecture/${courseId}`);
            setLoading(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
            setLoading(false);
        }
    };

    const removeLecture = async () => {
        if (!window.confirm("Are you sure you want to delete this lecture?")) return;
        setLoading1(true);
        try {
            await axios.delete(serverUrl+`/api/course/removelecture/${lectureId}`, { withCredentials: true });
            toast.success("Lecture Removed");
            navigate(`/createlecture/${courseId}`);
            setLoading1(false);
        } catch (error) {
            toast.error("Lecture remove error");
            setLoading1(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                
                {/* Header Section */}
                <div className="bg-slate-50/50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate(`/createlecture/${courseId}`)}
                            className="p-2 rounded-full hover:bg-white hover:shadow-sm transition-all text-slate-600"
                        >
                            <FaArrowLeft size={16} />
                        </button>
                        <h2 className="text-xl font-bold text-slate-800">Edit Lecture</h2>
                    </div>
                    <button 
                        className="flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-all text-xs font-bold uppercase tracking-wider"
                        disabled={loading1} 
                        onClick={removeLecture}
                    >
                        {loading1 ? <ClipLoader size={14} color='#ef4444' /> : <><FaTrashAlt /> Delete</>}
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    {/* Title Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Lecture Title</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all"
                            placeholder="Enter lecture title"
                            onChange={(e) => setLectureTitle(e.target.value)}
                            value={lectureTitle}
                        />
                    </div>

                    {/* Video Upload Section */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Video Lesson</label>
                        <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-4 bg-slate-50/30 hover:bg-slate-50 hover:border-indigo-300 transition-all group">
                            <input
                                type="file"
                                required
                                accept='video/*'
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                onChange={(e) => setVideoUrl(e.target.files[0])}
                            />
                            <div className="flex flex-col items-center justify-center py-2 space-y-2">
                                <FaCloudUploadAlt className="text-slate-400 group-hover:text-indigo-500 transition-colors" size={32} />
                                <p className="text-sm text-slate-500">
                                    {videoUrl ? <span className="text-indigo-600 font-medium">{videoUrl.name}</span> : "Click to upload or drag and drop"}
                                </p>
                                <p className="text-xs text-slate-400 font-medium">MP4, WEBM, or OGG (Max. 500MB)</p>
                            </div>
                        </div>
                    </div>

                    {/* Premium Toggle */}
                    <label className="flex items-center cursor-pointer group w-fit">
                        <div className="relative">
                            <input 
                                type="checkbox" 
                                className="sr-only" 
                                checked={isPreviewFree}
                                onChange={() => setIsPreviewFree(prev => !prev)} 
                            />
                            <div className={`w-11 h-6 rounded-full shadow-inner transition-colors ${isPreviewFree ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isPreviewFree ? 'translate-x-5' : ''}`}></div>
                        </div>
                        <span className="ml-3 text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
                            Make this a free preview video
                        </span>
                    </label>

                    {/* Status Indicator */}
                    {loading && (
                        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 flex items-center gap-3">
                            <ClipLoader size={18} color='#4f46e5' />
                            <p className="text-xs font-bold text-indigo-700 uppercase tracking-wide">Optimization in progress... Keep this tab open.</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button 
                            className="w-full bg-slate-900 text-white py-4 rounded-xl text-sm font-bold hover:bg-indigo-700 active:scale-[0.99] transition-all shadow-lg shadow-slate-200 disabled:opacity-50 disabled:pointer-events-none" 
                            disabled={loading} 
                            onClick={editLecture}
                        >
                            {loading ? "Uploading..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditLecture;