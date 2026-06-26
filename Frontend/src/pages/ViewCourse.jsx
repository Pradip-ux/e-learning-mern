import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { serverUrl } from '../App';
// import { FaArrowLeftLong, FaStar, FaLock, FaPlayCircle } from "react-icons/fa6";
import { FaArrowLeftLong, FaStar } from "react-icons/fa6";
import { FaLock, FaPlayCircle } from "react-icons/fa"; // Use /fa for these two
import img from "../assets/empty.jpg";
import Card from '../component/Card';
import { setSelectedCourseData } from '../redux/courseSlice';
import { toast } from 'react-toastify';

function ViewCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux State
  const { courseData, selectedCourseData } = useSelector(state => state.course);
  const { userData } = useSelector(state => state.user);
  const { lectureData } = useSelector(state => state.lecture);

  // Local State
  const [creatorData, setCreatorData] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [selectedCreatorCourse, setSelectedCreatorCourse] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return "0.0";

    const validRatings = reviews
      .map((r) => Number(r.rating))
      .filter((r) => !isNaN(r) && r > 0);

    if (validRatings.length === 0) return "0.0";

    const total = validRatings.reduce((sum, r) => sum + r, 0);

    return (total / validRatings.length).toFixed(1);
  };


  const avgRating = calculateAverageRating(selectedCourseData?.reviews);
  const totalReviews = selectedCourseData?.reviews?.length || 0;

  const fetchCourseData = () => {
    const currentCourse = courseData.find((item) => item._id === courseId);
    if (currentCourse) {
      dispatch(setSelectedCourseData(currentCourse));
    }
  };

  const checkEnrollment = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/course/getenrolled`, { withCredentials: true });
      const enrolledCourses = res.data;
      const isUserEnrolled = enrolledCourses.some(
        (course) => course._id.toString() === courseId.toString()
      );
      setIsEnrolled(isUserEnrolled);
    } catch (error) {
      console.error("Enrollment check error:", error);
    }
  };

  const handleReview = async () => {
    if (!rating) return toast.error("Select rating");
    if (!comment) return toast.error("Write comment");

    try {
      await axios.post(
        serverUrl + "/api/review/addreview",
        { rating, comment, courseId },
        { withCredentials: true }
      );

      toast.success("Review Added");
      setRating(0);
      setComment("");

      // REFRESH DATA FROM SERVER
      const response = await axios.get(`${serverUrl}/api/course/${courseId}`); // Adjust this URL to your GET course route
      dispatch(setSelectedCourseData(response.data.course));

    } catch (error) {
      toast.error(error?.response?.data?.message || "Error");
    }
  };

 const handleEnroll = async (courseId, userId) => {
  try {
    const orderData = await axios.post(
      `${serverUrl}/api/payment/create-order`,
      { courseId }, // userId isn't strictly needed for order creation if using course price
      { withCredentials: true }
    );

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.data.amount,
      currency: "INR",
      name: "SkillNest",
      order_id: orderData.data.id,
      
      // MANDATORY FOR UPI ID OPTION
      config: {
        display: {
          blocks: {
            upi: {
              name: "Pay via UPI",
              instruments: [
                {
                  method: "upi",
                  flows: ["collect", "intent", "qr"] // 'collect' is the "Enter UPI ID" option
                }
              ]
            }
          },
          sequence: ["block.upi"],
          preferences: {
            show_default_blocks: true
          }
        }
      },

      handler: async function (response) {
        try {
          // Send userId here so the backend verifyPayment doesn't crash
          await axios.post(`${serverUrl}/api/payment/verify-payment`, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            courseId,
            userId: userData._id // CRITICAL FIX
          }, { withCredentials: true });

          toast.success("Enrollment Successful!");
          checkEnrollment(); // Refresh the UI button
        } catch (err) {
          toast.error("Payment verification failed.");
        }
      },
      prefill: {
        name: userData?.name,
        email: userData?.email,
      },
      theme: { color: "#0F172A" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    toast.error("Something went wrong while enrolling.");
  }
};
  useEffect(() => {
    fetchCourseData();
    checkEnrollment();
  }, [courseId, courseData, lectureData]);

  useEffect(() => {
    const getCreator = async () => {
      if (selectedCourseData?.creator) {
        try {
          const result = await axios.post(
            serverUrl + `/api/course/getcreator`,
            { userId: selectedCourseData.creator },
            { withCredentials: true }
          );
          setCreatorData(result.data);
        } catch (error) {
          console.error("Error fetching creator:", error);
        }
      }
    };
    getCreator();
  }, [selectedCourseData]);

  useEffect(() => {
    if (creatorData?._id && courseData.length > 0) {
      const creatorCourses = courseData.filter((course) => {
        const creatorId =
          typeof course.creator === "object"
            ? course.creator._id
            : course.creator;

        return (
          creatorId?.toString() === creatorData._id?.toString() &&
          course._id !== courseId
        );
      });

      setSelectedCreatorCourse(creatorCourses);
      console.log(courseData)
    }
  }, [creatorData, courseData, courseId]);


  useEffect(() => {
    if (selectedCourseData?.lectures?.length > 0) {
      const firstPreview = selectedCourseData.lectures.find(l => l.isPreviewFree);
      if (firstPreview) setSelectedLecture(firstPreview);
    }
  }, [selectedCourseData]);


  console.log(selectedCourseData?.reviews);

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-20 font-sans text-slate-900">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-slate-600 hover:text-black transition-colors font-medium text-sm">
            <FaArrowLeftLong /> Back to Browse
          </button>
          <div className="hidden md:block text-xs font-bold tracking-widest uppercase text-slate-400">
            {selectedCourseData?.category || "Course Details"}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 lg:mt-12 space-y-12">
        {/* Top Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-[32px] shadow-2xl shadow-slate-200 bg-white">
              <img src={selectedCourseData?.thumbnail || img} alt="Thumbnail" className="w-full aspect-video object-fill" />
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-xl shadow-slate-200/50 space-y-6">
              <h1 className="text-3xl font-extrabold leading-tight">{selectedCourseData?.title}</h1>
              <p className="text-slate-500 text-lg leading-relaxed">{selectedCourseData?.subTitle}</p>

              {/* --- Review Count & Average Section --- */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                  <FaStar className="text-amber-400 text-sm" />
                  <span className="text-amber-700 font-bold text-sm">{avgRating}</span>
                </div>
                <span className="text-slate-400 text-sm font-medium">
                  ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                </span>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black">₹{selectedCourseData?.price}</span>
                <span className="text-lg text-slate-400 line-through">₹5,999</span>
              </div>

              {userData?.role === "Instructor" || userData?.role === "admin" || isEnrolled ? (
                <button
                  onClick={() => navigate(`/viewlecture/${courseId}`)}
                  className="w-full bg-emerald-500 text-white h-14 rounded-2xl font-bold text-lg hover:bg-emerald-600 transition-all flex items-center justify-center gap-3"
                >
                  <FaPlayCircle /> Start Learning
                </button>



              ) : (
                <button
                  onClick={() => handleEnroll(courseId, userData._id)}
                  className="w-full bg-slate-900 text-white h-14 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg"
                >
                  Enroll Now
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 flex flex-col max-h-[600px]">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">Course Content</h2>
              <p className="text-sm text-slate-500">{selectedCourseData?.lectures?.length} modules available</p>
            </div>
            <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
              {selectedCourseData?.lectures?.map((lecture, index) => (
                <button
                  key={index}
                  disabled={!lecture.isPreviewFree}
                  onClick={() => lecture.isPreviewFree && setSelectedLecture(lecture)}
                  className={`flex items-center gap-4 px-4 py-4 rounded-2xl border transition-all duration-300 text-left ${lecture.isPreviewFree ? "hover:bg-slate-50 cursor-pointer border-slate-100" : "opacity-50 cursor-not-allowed border-transparent"
                    } ${selectedLecture?.lectureTitle === lecture.lectureTitle ? "bg-slate-900 border-slate-900 shadow-md" : "bg-white"}`}
                >
                  <span className={`text-xl ${selectedLecture?.lectureTitle === lecture.lectureTitle ? "text-white" : "text-slate-400"}`}>
                    {lecture.isPreviewFree ? <FaPlayCircle /> : <FaLock />}
                  </span>
                  <div className="flex flex-col">
                    <span className={`text-sm font-bold ${selectedLecture?.lectureTitle === lecture.lectureTitle ? "text-white" : "text-slate-700"}`}>
                      {lecture.lectureTitle}
                    </span>
                    {lecture.isPreviewFree && <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Free Preview</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 bg-slate-900 p-4 rounded-[32px] shadow-2xl overflow-hidden border border-slate-800">
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center group relative">
              {selectedLecture?.videoUrl ? (
                <video src={selectedLecture.videoUrl} controls className="w-full h-full object-contain" />
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto animate-pulse">
                    <FaPlayCircle className="text-slate-600 text-3xl" />
                  </div>
                  <p className="text-slate-500 font-medium">Select a preview module to watch</p>
                </div>
              )}
            </div>
            <div className="mt-6 px-4 pb-2">
              <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest">Currently Playing</span>
              <h3 className="text-xl font-bold text-white mt-1">{selectedLecture?.lectureTitle || "Welcome to the Course"}</h3>
              <p className="text-slate-400 text-sm mt-1">{selectedCourseData?.title}</p>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-slate-200 pt-12">
          <div className="lg:col-span-7 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">Student Feedback <span className="text-sm font-normal text-slate-400">(Avg. {avgRating})</span></h2>
            <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">Rate this course</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar key={star} onClick={() => setRating(star)} className={`text-2xl cursor-pointer transition-transform hover:scale-110 ${star <= rating ? "fill-amber-400" : "fill-slate-200"}`} />
                  ))}
                </div>
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your learning experience..."
                className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                rows="4"
              />
              <button onClick={handleReview} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200">
                Post Review
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center text-center">
              <div className="relative">
                <img src={creatorData?.photoUrl || img} alt="Instructor" className="w-24 h-24 rounded-3xl object-cover ring-4 ring-slate-50 mb-4 shadow-lg" />
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">✓</div>
              </div>
              <h3 className="text-xl font-bold">{creatorData?.name}</h3>
              <p className="text-emerald-600 text-xs font-bold uppercase tracking-wider mb-2">Verified Instructor</p>
              <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">{creatorData?.description}</p>
              <div className="w-full h-[1px] bg-slate-100 my-4" />
              <p className="text-slate-400 text-xs">{creatorData?.email}</p>
            </div>
          </div>
        </div>

        {/* Other Courses */}
        <div className="space-y-8">
          <h2 className="text-2xl font-extrabold flex items-center gap-3">Other Courses by <span className="text-emerald-600">{creatorData?.name}</span></h2>
          <div className="w-full flex items-start justify-center lg:justify-start flex-wrap gap-8">
            {selectedCreatorCourse?.map((item, index) => (
              <Card key={index} thumbnail={item.thumbnail} title={item.title} id={item._id} price={item.price} category={item.category} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewCourse;