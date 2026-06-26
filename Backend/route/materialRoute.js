import express from "express";
import { uploadMaterial, getCourseMaterials } from "../controller/materialController.js";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js"; // ✅ keep this

const router = express.Router();

// Upload
router.post("/upload", isAuth, upload.single("file"), uploadMaterial);

// Get materials
router.get("/:courseId", isAuth, getCourseMaterials);

export default router;