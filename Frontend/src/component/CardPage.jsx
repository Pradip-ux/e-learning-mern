import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useGetCreatorCourse from "../customHooks/useGetCreatorCourse";
// import { getPublishedCourse } from "../customHooks/useGetPublishedCourse";
import useGetPublishedCourse from "../customHooks/useGetPublishedCourse";
// import  getPublishedCourse  from "../customHooks/getPublishedCourse";
import Card from "./Card";
import { useNavigate } from "react-router-dom";

function CardPage() {
  // Execute custom hooks to fetch data
  useGetCreatorCourse();
  useGetPublishedCourse();

  const [popularCourses, setPopularCourses] = useState([]);
  const { courseData } = useSelector((state) => state.course);
  const navigate = useNavigate();

  // Debugging log
  console.log("COURSES:", courseData);

  useEffect(() => {
    // Check if courseData exists before slicing to prevent crashes
    if (courseData && Array.isArray(courseData)) {
      setPopularCourses(courseData.slice(0, 6));
    }
  }, [courseData]);

  return (
    <div
      className="w-full bg-[#FDFDFD] py-20 px-4 sm:px-8 lg:px-16 relative"
      id="card-section"
      style={{ scrollMarginTop: "72px" }}
    >
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
        <span className="inline-block px-4 py-1.5 mb-2 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold tracking-widest uppercase">
          Top Rated Learning
        </span>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          Our Popular{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
            Courses
          </span>
        </h1>

        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
          Unlock your potential with expert-led curriculum designed to bridge
          the gap between learning and industry-standard expertise.
        </p>

        <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full mt-6 shadow-lg shadow-emerald-200"></div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {popularCourses.length > 0 ? (
            popularCourses.map((item, index) => (
              <div
                key={item._id || index}
                className="transform transition-all duration-500 hover:-translate-y-2"
              >
                {/* FIXED: Using 'item' instead of 'course' */}
                <Card
                  thumbnail={item.thumbnail}
                  title={item.title}
                  category={item.category}
                  price={item.price}
                  id={item._id}
                  reviews={item.reviews}
                />
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-slate-400">Loading courses...</p>
          )}
        </div>
      </div>

      {/* Background Accent Elements */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-emerald-50 rounded-full blur-[100px] opacity-50"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-blue-50 rounded-full blur-[100px] opacity-50"></div>
    </div>
  );
}

export default CardPage;