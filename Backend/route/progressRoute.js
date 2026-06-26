import express from "express";
import { updateProgress, getUserProgress } from "../controller/progressController.js";
// import isAuthenticated from "../middleware/authMiddleware.js";
import isAuth from "../middleware/isAuth.js";
import { getAllUserProgress } from "../controller/progressController.js";
const Progressrouter = express.Router();

// ✅ update progress
// ✅ Corrected Order
Progressrouter.post("/update", isAuth, updateProgress);
Progressrouter.get("/all/overview", isAuth, getAllUserProgress);
Progressrouter.get("/getprogress/:courseId", isAuth, getUserProgress);

export default Progressrouter;