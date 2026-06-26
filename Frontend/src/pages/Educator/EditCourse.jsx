import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import img from "../../assets/empty.jpg";
import { FaEdit, FaCloudUploadAlt, FaTrashAlt, FaBookOpen, FaFileUpload } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

function EditCourse() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const thumb = useRef();
  const [selectCourses, setSelectCourses] = useState(null);
  const [isPublished, setisPublished] = useState(false);
  const [title, setTitle] = useState("");
  const [subTitle, setsubTitle] = useState("");
  const [description, setdescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setlevel] = useState("");
  const [price, setprice] = useState("");
  const [frontedImage, sefrontedImage] = useState(img);
  const [backendImage, sebackendImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);

  useEffect(() => {
    if (!courseId) {
      navigate("/courses");
      return;
    }
    getCourseById();
  }, [courseId]);

  const handlerThumbnail = (e) => {
    const file = e.target.files[0];
    if (file) {
      sebackendImage(file);
      sefrontedImage(URL.createObjectURL(file));
    }
  };

  const getCourseById = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/course/getcourse/${courseId}`, { withCredentials: true });
      setSelectCourses(result.data.course);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectCourses) {
      setTitle(selectCourses.title || "");
      setsubTitle(selectCourses.subTitle || "");
      setdescription(selectCourses.description || "");
      setCategory(selectCourses.category || "");
      setlevel(selectCourses.level || "");
      setprice(selectCourses.price || "");
      sefrontedImage(selectCourses.thumbnail || img);
      setisPublished(selectCourses.isPublished);
    }
  }, [selectCourses]);

  const handlerEditCourse = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subTitle", subTitle);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("level", level);
    formData.append("price", price);
    formData.append("isPublished", isPublished);

    if (backendImage) {
      formData.append("thumbnail", backendImage);
    }

    try {
      await axios.post(`${serverUrl}/api/course/editcourse/${courseId}`, formData, { withCredentials: true });
      toast.success("Course Updated Successfully");
      navigate("/courses");
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleRemoveCourse = async () => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    setLoading1(true);
    try {
      await axios.delete(`${serverUrl}/api/course/remove/${courseId}`, { withCredentials: true });
      setLoading1(false);
      toast.success("Course Removed");
      navigate("/courses");
    } catch (error) {
      setLoading1(false);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-10 font-sans">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-3 md:px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/courses")}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors active:scale-90"
            >
              <FaArrowLeftLong className="text-slate-600" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">Edit Course</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ID: {courseId?.slice(-8)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <button 
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all whitespace-nowrap"
              onClick={() => navigate(`/createlecture/${selectCourses?._id}`)}
            >
              <FaBookOpen /> Lectures
            </button>
            <button 
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all whitespace-nowrap"
              onClick={() => navigate(`/upload-material/${courseId}`)}
            >
              <FaFileUpload /> Materials
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-6 px-4 md:px-6">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Section Header */}
          <div className="px-6 py-5 md:px-8 md:py-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
            <div>
              <h2 className="text-base md:text-lg font-bold text-slate-800">Basic Information</h2>
              <p className="text-xs md:text-sm text-slate-500">Update your course details and visibility.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setisPublished(!isPublished)}
                className={`flex-1 sm:flex-none px-4 py-2 text-[10px] font-black rounded-xl transition-all border ${
                  isPublished
                    ? "bg-green-50 text-green-600 border-green-100"
                    : "bg-amber-50 text-amber-600 border-amber-100"
                }`}
              >
                {isPublished ? "● PUBLISHED" : "○ DRAFT"}
              </button>
              <button
                type="button"
                onClick={handleRemoveCourse}
                className="p-2.5 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl transition-all"
              >
                {loading1 ? <ClipLoader size={16} color="currentColor" /> : <FaTrashAlt />}
              </button>
            </div>
          </div>

          {/* Form Body */}
          <form className="p-6 md:p-8 space-y-6 md:space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Course Title</label>
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g. Advanced Machine Learning Masterclass"
                  onChange={(e) => setTitle(e.target.value)} value={title}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Short Subtitle</label>
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                  placeholder="Summarize the course in one sentence"
                  onChange={(e) => setsubTitle(e.target.value)} value={subTitle}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Full Description</label>
                <textarea
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                  placeholder="What will students learn?"
                  onChange={(e) => setdescription(e.target.value)} value={description}
                />
              </div>
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Category</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:bg-white focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                  onChange={(e) => setCategory(e.target.value)} value={category}
                >
                  <option value="">Select Category</option>
                  <option value="App Development">App Development</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="AI Tools">AI Tools</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Data Analytics">Data Analytics</option>
                  <option value="Ethical Hacking">Ethical Hacking</option>
                  <option value="UI UX Designing">UI UX Designing</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Difficulty</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:bg-white focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                  onChange={(e) => setlevel(e.target.value)} value={level}
                >
                  <option value="">Select Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="sm:col-span-2 md:col-span-1 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Price (INR)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-8 pr-4 py-3 text-sm outline-none focus:bg-white focus:border-indigo-500 transition-all"
                    onChange={(e) => setprice(e.target.value)} value={price}
                  />
                </div>
              </div>
            </div>

            {/* Thumbnail Upload */}
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Course Thumbnail</label>
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
                <div
                  onClick={() => thumb.current.click()}
                  className="relative group w-full max-w-sm aspect-video bg-slate-100 rounded-3xl overflow-hidden border-2 border-dashed border-slate-300 hover:border-indigo-400 transition-all cursor-pointer shadow-inner"
                >
                  <img src={frontedImage} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-indigo-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <FaCloudUploadAlt className="text-white text-4xl" />
                  </div>
                </div>
                <div className="flex-1 text-center lg:text-left space-y-3">
                  <h4 className="text-sm font-bold text-slate-800">Cover Image Settings</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    Optimal: 1280x720 (16:9). Max: 2MB.<br />
                    Supported: JPG, PNG, WEBP.
                  </p>
                  <button
                    type="button"
                    onClick={() => thumb.current.click()}
                    className="px-6 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                  >
                    Replace Image
                  </button>
                  <input type="file" hidden ref={thumb} accept="image/*" onChange={handlerThumbnail} />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-8 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/courses")}
                className="w-full sm:w-auto px-8 py-3 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handlerEditCourse}
                disabled={loading}
                className="w-full sm:w-auto px-10 py-3 bg-slate-900 text-white text-sm font-bold rounded-2xl hover:bg-indigo-700 shadow-xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-70"
              >
                {loading ? <ClipLoader size={18} color="white" /> : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditCourse;