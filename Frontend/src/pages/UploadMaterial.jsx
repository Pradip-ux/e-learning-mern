import React, { useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { FaCloudUploadAlt, FaFileAlt, FaStickyNote, FaImage } from 'react-icons/fa';
import { useNavigate, useParams } from "react-router-dom";


const UploadMaterial = () => {
    const { courseId } = useParams();
   
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("pdf");
  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

 const handleUpload = async (e) => {
  e.preventDefault();

  if (!courseId) {
    return toast.error("Course ID missing");
  }

  if (!file && type !== "note") {
    return toast.error("Please select a file");
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("course", courseId);
  formData.append("type", type);

  if (type === "note") {
    formData.append("content", content);
  } else {
    formData.append("file", file);
  }

  try {
    setLoading(true);

    const res = await axios.post(
      `${serverUrl}/api/material/upload`,
      formData,
      { withCredentials: true }
    );

    console.log("Uploaded:", res.data); // 👈 useful debug

    toast.success("Material uploaded successfully");

    // optional reset
    setTitle("");
    setFile(null);
    setContent("");

  } catch (error) {
    console.error(error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Upload failed");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="max-w-2xl mx-auto mt-20 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-slate-50 p-6 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <FaCloudUploadAlt className="text-indigo-600" />
          Upload Course Material
        </h2>
        <p className="text-sm text-slate-500 mt-1">Add PDFs, Images, or Notes for your students.</p>
      </div>

      <form onSubmit={handleUpload} className="p-8 space-y-6">
        {/* Title Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 ml-1">Material Title</label>
          <input 
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all placeholder:text-slate-400 text-slate-700"
            placeholder="e.g. Advanced React Architecture PDF" 
            value={title}
            onChange={(e) => setTitle(e.target.value)} 
          />
        </div>

        {/* Type Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Content Type</label>
            <div className="relative">
              <select 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white appearance-none focus:border-indigo-500 outline-none cursor-pointer text-slate-700"
                onChange={(e) => setType(e.target.value)}
                value={type}
              >
                <option value="pdf">PDF Document</option>
                <option value="image">Image / Diagram</option>
                <option value="note">Text Note</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                {type === 'pdf' && <FaFileAlt />}
                {type === 'image' && <FaImage />}
                {type === 'note' && <FaStickyNote />}
              </div>
            </div>
          </div>

          {/* File Upload / Note Area */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">
              {type === "note" ? "Your Content" : "Select File"}
            </label>
            
            {type === "note" ? (
              <textarea 
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all h-32 resize-none text-slate-700"
                placeholder="Write your notes here..." 
                value={content}
                onChange={(e) => setContent(e.target.value)} 
              />
            ) : (
              <div className="relative group">
                <input 
                  type="file" 
                  accept={type === "pdf" ? ".pdf" : "image/*"}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={(e) => setFile(e.target.files[0])} 
                />
                <div className="w-full px-4 py-3 rounded-xl border-2 border-dashed border-slate-200 group-hover:border-indigo-400 group-hover:bg-indigo-50/30 transition-all text-center">
                  <span className="text-sm text-slate-500">
                    {file ? file.name : "Click to browse files"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button 
          
          type="submit" 
          // onClick={() => navigate(`/upload-material/${selectCourses._id}`)}
          className="w-full py-4 bg-indigo-600
           hover:bg-indigo-700 disabled:bg-slate-400 
           text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 
           transition-all transform hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {loading ? "Uploading..." : "Upload Material"}
        </button>
      </form>
    </div>
  );
};

export default UploadMaterial;