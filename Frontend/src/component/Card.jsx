import React from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
function Card({  thumbnail, title, category, price ,id , reviews}) {

  //  const { courseData, selectedCourseData } = useSelector(state => state.course);
  const navigate = useNavigate();
//   const calculateAverageRating = (reviews) => {
//   if (!reviews || reviews.length === 0) return "0.0";

//   const validRatings = reviews
//     .map((r) => Number(r.rating))
//     .filter((r) => !isNaN(r) && r > 0);

//   if (validRatings.length === 0) return "0.0";

//   const total = validRatings.reduce((sum, r) => sum + r, 0);

//   return (total / validRatings.length).toFixed(1);
// };

// // console.log(selectedCourseData?.reviews);
//   const avgRating = calculateAverageRating(selectedCourseData?.reviews);
//   const totalReviews = selectedCourseData?.reviews?.length || 0;;
const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return (total / reviews.length).toFixed(1); // rounded to 1 decimal
};

// Usage:
const avgRating = calculateAverageRating(reviews);
console.log("Average Rating:", avgRating);


  // const navigate = useNavigate();

  
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
      onClick={() => navigate(`/viewcourse/${id}`)}>

      {/* Image */}
      <div className="relative overflow-hidden">
        {/* Change the img src line to this */}
        <img
          src={(thumbnail && thumbnail !== "undefined") ? thumbnail : "https://via.placeholder.com/300"}
          alt={title}
          className="w-full h-44 object-fill group-hover:scale-105 transition duration-300"
        />
        {/* Category badge */}
        <span className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur text-white text-xs px-3 py-1 rounded-full font-medium tracking-wide shadow">
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 text-left">

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800 leading-snug tracking-tight mb-2 line-clamp-2 group-hover:text-blue-600 transition">
          {title}
        </h2>

        {/* Subtitle (optional extra detail) */}
        <p className="text-sm text-gray-400 mb-3">
          Beginner to Advanced • Lifetime Access
        </p>

        {/* Price + Rating */}
        <div className="flex justify-between items-center">

          <span className="text-xl font-bold text-green-600 tracking-tight">
            ₹{price}
          </span>

          <span className="flex items-center gap-1 text-yellow-500 text-sm font-medium">
            <FaStar className="text-yellow-400" /> {avgRating}
          </span>
        </div>

        {/* Button */}
        <button className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold tracking-wide hover:bg-blue-700 transition">
          View Course
        </button>
      </div>
    </div>
  );
}

export default Card;