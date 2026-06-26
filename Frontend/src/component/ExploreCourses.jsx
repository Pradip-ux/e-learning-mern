import React from "react";
import { SiViaplay } from "react-icons/si";
import { TbDeviceDesktopAnalytics } from "react-icons/tb";
import { LiaUikit } from "react-icons/lia";
import { MdOutlineAppShortcut } from "react-icons/md";
import { GiCyberEye } from "react-icons/gi";
import { AiFillOpenAI } from "react-icons/ai";
import { SiGoogledataproc } from "react-icons/si";
import { BsClipboardData } from "react-icons/bs";
import { GrCloudComputer } from "react-icons/gr";
import { useNavigate } from "react-router-dom";

function ExploreCourses() {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-[60vh] flex flex-col lg:flex-row items-center justify-center gap-12 px-[30px] py-[60px] bg-gray-50">

      {/* LEFT SECTION */}
      <div className="w-full lg:w-[380px] flex flex-col items-start justify-center gap-4 px-[20px]">

        <span className="text-[40px] font-bold text-gray-900 leading-tight">
          Explore
        </span>

        <span className="text-[40px] font-bold text-gray-900 leading-tight">
          Our Courses
        </span>

        <p className="text-[16px] text-gray-600 leading-relaxed mt-2">
          Learn modern skills from expert instructors. Explore courses designed
          to help you build real-world projects and grow your career in
          development and design.
        </p>

        <button className="px-[24px] py-[12px] bg-black text-white rounded-xl text-[16px] font-medium flex items-center gap-3 mt-[30px] shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
        onClick={()=>navigate("/allcourses")}>
          Explore Courses
          <SiViaplay className="h-[22px] w-[22px]" />
        </button>

      </div>

      {/* RIGHT SECTION */}
      <div className="w-[720px] max-w-[95%] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">

        {/* CARD */}
        <div className="flex flex-col items-center text-center gap-3 cursor-pointer group">
          <div className="w-[90px] h-[90px] bg-purple-100 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition duration-300">
            <TbDeviceDesktopAnalytics className="w-[45px] h-[45px]" />
          </div>
          <span className="text-sm font-semibold text-gray-700">
            Web Development
          </span>
        </div>

        <div className="flex flex-col items-center text-center gap-3 cursor-pointer group">
          <div className="w-[90px] h-[90px] bg-green-100 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition duration-300">
            <LiaUikit className="w-[40px] h-[40px]" />
          </div>
          <span className="text-sm font-semibold text-gray-700">
                  UI/UX Designing
                </span>
        </div>

        <div className="flex flex-col items-center text-center gap-3 cursor-pointer group">
          <div className="w-[90px] h-[90px] bg-pink-100 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition duration-300">
            <MdOutlineAppShortcut className="w-[40px] h-[40px]" />
          </div>
          <span className="text-sm font-semibold text-gray-700">
            App Development
          </span>
        </div>

        <div className="flex flex-col items-center text-center gap-3 cursor-pointer group">
          <div className="w-[90px] h-[90px] bg-blue-100 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition duration-300">
            <GiCyberEye className="w-[40px] h-[40px]" />
          </div>
          <span className="text-sm font-semibold text-gray-700">
            Ethical Hacking
          </span>
        </div>

        <div className="flex flex-col items-center text-center gap-3 cursor-pointer group">
          <div className="w-[90px] h-[90px] bg-yellow-100 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition duration-300">
            <GrCloudComputer className="w-[40px] h-[40px]" />
          </div>
          <span className="text-sm font-semibold text-gray-700">
            AI / ML
          </span>
        </div>

        <div className="flex flex-col items-center text-center gap-3 cursor-pointer group">
          <div className="w-[90px] h-[90px] bg-indigo-100 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition duration-300">
            <SiGoogledataproc className="w-[40px] h-[40px]" />
          </div>
          <span className="text-sm font-semibold text-gray-700">
            Data Science
          </span>
        </div>

        <div className="flex flex-col items-center text-center gap-3 cursor-pointer group">
          <div className="w-[90px] h-[90px] bg-orange-100 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition duration-300">
            <BsClipboardData className="w-[40px] h-[40px]" />
          </div>
          <span className="text-sm font-semibold text-gray-700">
            Data Analytics
          </span>
        </div>

        <div className="flex flex-col items-center text-center gap-3 cursor-pointer group">
          <div className="w-[90px] h-[90px] bg-teal-100 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition duration-300">
            <AiFillOpenAI className="w-[40px] h-[40px]" />
          </div>
          <span className="text-sm font-semibold text-gray-700">
            AI Tools
          </span>
        </div>

      </div>

    </div>
  );
}

export default ExploreCourses;