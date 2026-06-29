import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";

// Pages
import Login from "./pages/login";
import Home from "./pages/home";
import SignUp from "./pages/signup";
import Profile from "./pages/Profile";
import UploadMaterial from "./pages/UploadMaterial";
import CourseMaterials from "./pages/CourseMaterials";
import EditCourse from "./pages/Educator/EditCourse";
import ForgetPassword from "./pages/ForgetPassword";
import EditProfile from "./pages/EditProfile";
import ViewCourse from "./pages/ViewCourse";
import ViewLecture from "./pages/ViewLecture";
import Dashboard from "./pages/Educator/Dashboard";
import Courses from "./pages/Educator/Courses";
import Createcourses from "./pages/Educator/CreateCourses";
import AllCourses from "./pages/AllCourses";
import CreateLecture from "./pages/Educator/CreateLecture";
import EditLecture from "./pages/Educator/EditLecture";
import AdminDashboard from "./pages/AdminDashboard";
import EnrolledCourse from "./pages/EnrolledCourse";
import SearchWithAi from "./pages/SearchWithAi";
import StudentDashboard from "./pages/StudentDashboard";
import Support from "./pages/Support";
import InstructorProfile from "./pages/Educator/InstructorProfile";
// Hooks
import useCurrentUser from "./customHooks/useCurrentUser";
import useGetCreatorCourse from "./customHooks/useGetCreatorCourse";
import useGetPublishedCourse from "./customHooks/useGetPublishedCourse";
// import getPublishedCourse from "./customHooks/getPublishedCourse.js";
import getAllReviews from "./customHooks/getAllReviews";

// export const serverUrl =    "http://10.93.200.103:5000";
export const serverUrl = "https://e-learning-mern-1.onrender.com";
// export const serverUrl = import.meta.env.VITE_API_URL;
// export const serverUrl = "http://localhost:5000";
// export const serverUrl = "http://192.168.142.1:5000";

// ✅ global axios config
axios.defaults.withCredentials = true;

function App() {
  // ✅ CALL HOOKS DIRECTLY (IMPORTANT)
  useCurrentUser();
  useGetCreatorCourse();
  useGetPublishedCourse();
  getAllReviews();

  const { userData } = useSelector((state) => state.user);

  // ✅ LOADING STATE
  if (userData === undefined) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <ToastContainer />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/signup"
          element={!userData ? <SignUp /> : <Navigate to="/" />}
        />

        <Route
          path="/login"
          element={!userData ? <Login /> : <Navigate to="/" />}
        />

        <Route path="/profile" element={<Profile />} />
        <Route path="/editprofile" element={<EditProfile/> } />
        <Route path="/instructor/profile" element={<InstructorProfile />} />
        {/* <Route path="/update-profile" element={userData}/> */}

        <Route
          path="/searchwithai"
          element={userData ? <SearchWithAi /> : <Navigate to="/login" />}
        />

        {/* <Route
          path="/editprofile"
          // element={userData ? <EditProfile /> : <Navigate to="/login" />}
        /> */}

        <Route
          path="/AllCourses"
          element={userData ? <AllCourses /> : <Navigate to="/login" />}
        />

        <Route
          path="/dashboard"
          element={
            userData?.role === "admin" ? (
              <AdminDashboard />
            ) : userData?.role === "Instructor" ? (
              <Dashboard />
            ) : userData ? (
              <StudentDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/courses"
          element={userData ? <Courses /> : <Navigate to="/login" />}
        />

        <Route
          path="/createcourse"
          element={userData ? <Createcourses /> : <Navigate to="/login" />}
        />

        <Route
          path="/editcourse/:courseId"
          element={
            userData?.role === "Instructor" ? (
              <EditCourse />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/createlecture/:courseId"
          element={
            userData?.role === "Instructor" ? (
              <CreateLecture />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/editlecture/:courseId/:lectureId"
          element={
            userData?.role === "Instructor" ? (
              <EditLecture />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/viewcourse/:courseId"
          element={userData ? <ViewCourse /> : <Navigate to="/login" />}
        />

        <Route
          path="/viewlecture/:courseId"
          element={userData ? <ViewLecture /> : <Navigate to="/login" />}
        />

        <Route
          path="/enrolledcourses"
          element={userData ? <EnrolledCourse /> : <Navigate to="/login" />}
        />

        <Route
          path="/support"
          element={(<Support />)}
        />
        <Route path="/forget" element={<ForgetPassword />} />

        <Route path="/upload-material/:courseId" element={<UploadMaterial />} />
        <Route path="/course-materials/:courseId" element={<CourseMaterials />} />
      </Routes>
    </>
  );
}

export default App;