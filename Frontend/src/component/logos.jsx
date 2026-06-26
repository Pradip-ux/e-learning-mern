import React from "react";
import { MdOutlineCastForEducation } from "react-icons/md";
import { SiOpenaccess } from "react-icons/si";
import { FaSackDollar } from "react-icons/fa6";
import { BiSupport } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";

function Logos() {
    const features = [
        { icon: <MdOutlineCastForEducation />, text: " Online Courses" },
        { icon: <SiOpenaccess />, text: "Lifetime Access" },
        { icon: <FaSackDollar />, text: "Value for Money" },
        { icon: <BiSupport />, text: "Lifetime Support" },
        { icon: <FaUsers />, text: "Community Support" },
    ];

    return (
        <div className="w-full py-16 px-4 flex items-center justify-center flex-wrap gap-8">
            {features.map((item, index) => (
                <div 
                    key={index}
                    className="group relative flex items-center gap-4 px-8 py-5 
                               rounded-full bg-white/80 backdrop-blur-md
                               border border-gray-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]
                               hover:shadow-[0_20px_40px_rgba(3,57,75,0.1)] 
                               hover:border-[#03394b]/20 hover:-translate-y-1.5
                               transition-all duration-500 ease-out cursor-pointer"
                >
                    {/* Subtle Gradient Background on Hover */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-[#03394b]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative text-[#03394b] text-2xl group-hover:rotate-[10deg] transition-transform duration-300">
                        {item.icon}
                    </div>
                    
                    <div className="relative flex flex-col">
                        <span className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#03394b]/60 leading-none mb-1">
                            Premium
                        </span>
                        <span className="text-[15px] font-semibold text-slate-800 tracking-tight">
                            {item.text}
                        </span>
                    </div>

                    {/* Bottom accent line */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#03394b] rounded-full group-hover:w-1/3 transition-all duration-500 opacity-50" />
                </div>
            ))}
        </div>
    );
}

export default Logos;