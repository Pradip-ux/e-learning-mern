import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa6";

const ReviewCard = ({ text, name, image, rating, role }) => {
  return (
    <div className="flex flex-col h-full">
      {/* 💬 Review Text */}
      <p className="text-zinc-300 text-base leading-relaxed mb-6 flex-grow italic">
        "{text}"
      </p>

      {/* 👤 Reviewer Info */}
      <div className="flex items-center gap-4 border-t border-white/5 pt-6">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full blur-[2px] opacity-50" />
          <img
            src={image || "https://via.placeholder.com/150"}
            alt={name}
            className="relative w-12 h-12 rounded-full object-cover border-2 border-[#0f0f0f]"
          />
        </div>
        <div>
          <h4 className="font-bold text-white text-sm tracking-wide">{name}</h4>
          <p className="text-xs text-zinc-500 font-medium">{role || "Learner"}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;