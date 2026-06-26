import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { FaFilePdf, FaImage, FaStickyNote, FaExternalLinkAlt } from "react-icons/fa";
import { useParams } from "react-router-dom";

const CourseMaterials = () => {
  const { courseId } = useParams();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to clean up URLs and prevent "/uploads/uploads/" duplication
 const getFileUrl = (fileUrl) => {
  if (!fileUrl) return "";
  // If it already starts with http, it's an external link
  if (fileUrl.startsWith("http")) return fileUrl;
  
  // Construct the clean local path
  return `${serverUrl}/uploads/${fileUrl}`;
};


  useEffect(() => {
    const fetchMaterials = async () => {
      if (!courseId || courseId === "undefined") {
        console.error("Invalid Course ID");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${serverUrl}/api/material/${courseId}`, {
          withCredentials: true
        });
        setMaterials(res.data.materials || []);
      } catch (err) {
        console.error("Error fetching materials:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [courseId]);

  if (loading) {
    return (
      <div className="p-20 text-center text-slate-500 animate-pulse font-medium">
        Loading materials...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Course Materials</h2>
          <p className="text-slate-500 text-sm mt-1">Access all downloadable resources and study notes.</p>
        </div>
        <span className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-100">
          {materials.length} Items
        </span>
      </div>

      {/* Materials List */}
      <div className="grid gap-4">
        {materials.length > 0 ? (
          materials.map((m) => (
            <div 
              key={m._id} 
              className="group bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-300 flex flex-col md:flex-row md:items-center gap-5"
            >
              {/* Type Icon */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 
                ${m.type === 'pdf' ? 'bg-red-50 text-red-500' : 
                  m.type === 'image' ? 'bg-blue-50 text-blue-500' : 
                  'bg-amber-50 text-amber-500'}`}>
                {m.type === "pdf" && <FaFilePdf size={24} />}
                {m.type === "image" && <FaImage size={24} />}
                {m.type === "note" && <FaStickyNote size={24} />}
              </div>

              {/* Title & Info */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {m.title}
                </h3>
                {m.type === "note" ? (
                  <p className="text-slate-500 text-sm mt-1 italic line-clamp-2">{m.content}</p>
                ) : (
                  <p className="text-slate-400 text-xs mt-1 font-medium uppercase tracking-wide">
                    {m.type} Resource
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {m.type === "note" ? (
                  <button className="px-5 py-2 text-sm font-bold text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100">
                    Read Note
                  </button>
                ) : (
                  <a 
                    href={getFileUrl(m.fileUrl)} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95"
                  >
                    {m.type === "pdf" ? "View PDF" : "Open Image"}
                    <FaExternalLinkAlt size={12} />
                  </a>
                )}

                {/* Small Image Preview */}
                {m.type === "image" && (
                  <div className="hidden lg:block h-12 w-12 rounded-lg overflow-hidden border border-slate-100">
                    <img 
                      src={getFileUrl(m.fileUrl)} 
                      alt="preview" 
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">No materials available for this course yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseMaterials;