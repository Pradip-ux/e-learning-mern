import React, { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../../App";
import axios from "axios";
import Courses from "./Courses";

import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

function Createcourses() {
    const navigate = useNavigate();
    const [title,setTitle] = useState("");
    const [category,setCategory] = useState("");
    const [loading,setLoading] = useState(false);

    const handleCreateCourse = async()=>{
        setLoading(true)
        try {
            const result = await axios.post(serverUrl + "/api/course/create",{title,category},
                {withCredentials: true})
            console.log(result.data)
            navigate("/courses")
            setLoading(false)
            toast.success("Course Created")

        } catch (error) {
            console.log(error)
           setLoading(false)
              
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">

            <div className="w-full max-w-lg bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl p-8">

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <FaArrowLeftLong 
                        onClick={() => navigate("/courses")} 
                        className="text-slate-500 text-lg cursor-pointer hover:text-indigo-600 transition transform hover:-translate-x-1"
                    />
                    <h2 className="text-2xl font-semibold text-slate-800">
                        Create Course
                    </h2>
                </div>

                {/* Form */}
                <form onSubmit={(e)=>e.preventDefault()} className="space-y-6">

                    {/* Title */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-600">
                            Course Title
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Course Title"
                            onChange={(e)=>setTitle(e.target.value)}
                            value={title}
                            className="px-4 py-3 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
                        />
                    </div>

                    {/* Category */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-600">
                            Course Category
                        </label>
                        <select
                            onChange={(e)=>setCategory(e.target.value)}
                            className="px-4 py-3 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
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

                    {/* Button */}
                    <button
                        disabled={loading}
                        onClick={handleCreateCourse}
                        className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl text-sm font-semibold tracking-wide hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg active:scale-[0.98]"
                    >
                        {loading 
                            ? <ClipLoader size={20} color="white"/> 
                            : "Create Course"}
                    </button>

                </form>

            </div>
        </div>
    )
}

export default Createcourses;