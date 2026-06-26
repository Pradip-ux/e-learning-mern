import express from "express"
import isAuth from "../middleware/isAuth.js"
import upload from "../middleware/multer.js"
import { 
  createCourse, 
  createLecture, 
  editCourse, 
  getCourseById, 
  getCreatorCourses, 
  getCreatorById,
  getPublishedCourses, 
  // ViewLecture,
  removeCourse,
  getCourseLecture,
  editLecture,
  removeLecture,
  getEnrolledCourses // Make sure this is exported from your controller
} from "../controller/courseController.js"
// import ViewLecture from "../../Frontend/src/pages/ViewLecture"

const courseRouter = express.Router() // 1. INITIALIZE FIRST

// 2. THEN DEFINE ROUTES
courseRouter.get("/getenrolled", isAuth, getEnrolledCourses);
courseRouter.post("/create", isAuth, createCourse)
courseRouter.get("/getpublished", getPublishedCourses)
// courseRouter.js
courseRouter.get("/getcreator", isAuth, getCreatorCourses) // GET request
courseRouter.post("/getcreator", isAuth, getCreatorById)   // POST request
courseRouter.post("/editcourse/:courseId", isAuth, upload.single("thumbnail"), editCourse)
courseRouter.get("/getcourse/:courseId", isAuth, getCourseById)
courseRouter.delete("/remove/:courseId", isAuth, removeCourse)
// courseRouter("/viewlecture",isAuth,ViewLecture)
// for lectures
courseRouter.post("/createLecture/:courseId", isAuth, createLecture)
courseRouter.get("/getcourselecture/:courseId", isAuth, getCourseLecture)
courseRouter.post("/editlecture/:lectureId", isAuth, upload.single("videoUrl"), editLecture)
courseRouter.delete("/removelecture/:lectureId", isAuth, removeLecture)
// courseRouter.post("/editcourse/:courseId",isAuth,upload.single("thumbnail"),editCourse)

// courseRouter.get("/getenrolled", isAuth, getEnrolledCourses);

export default courseRouter;