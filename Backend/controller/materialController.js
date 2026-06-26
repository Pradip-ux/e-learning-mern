import Material from "../model/materialModel.js";

// 📌 Upload Material
export const uploadMaterial = async (req, res) => {
  console.log(req.file); 
  try {
    const { title, type, course, content } = req.body;

    // ✅ Debug
    console.log("course from frontend:", course);
    // console.log("Uploaded file:", req.file);

    if (!course) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const newMaterial = new Material({
  title,
  type,
  course,
  content: type === "note" ? content : "",
  // CHANGE THIS: Remove "/uploads/". Just save the filename.
  fileUrl: req.file ? req.file.filename : "", 
  uploadedBy: req.user?._id,
});

    await newMaterial.save();

    res.status(201).json({
      success: true,
      material: newMaterial,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
// 📌 Get Materials by Course
export const getCourseMaterials = async (req, res) => {
  try {
    const { courseId } = req.params;

    const materials = await Material.find({ course: courseId });

    res.status(200).json({
      success: true,
      materials
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};