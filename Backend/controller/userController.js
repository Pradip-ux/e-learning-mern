import uploadOnCloudinary from "../config/cloudinary.js"
import User from "../model/userModel.js"

export const getCurrentUser = async (req,res) => {
    try {
        const user = await User.findById(req.userId).select("-password").populate("enrolledcourses")
         if(!user){
            return res.status(400).json({message:"user does not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
        console.log(error);
        return res.status(400).json({message:"get current user error"})
    }
}

// export const getCurrentUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.userId)
//       .select("-password")
//       .populate("enrolledCourses");

//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const UpdateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, description } = req.body;

    let updateData = {};

    // ✅ Only update if values exist
    if (name) updateData.name = name;
    if (description) updateData.description = description;

    // ✅ Handle image upload
    if (req.file) {
      const photoUrl = await uploadOnCloudinary(req.file.path);
      if (photoUrl) {
        updateData.photoUrl = photoUrl;
      }
    }

    // ✅ Update user
    const user = await User.findByIdAndUpdate(
  userId,
  updateData,
  { new: true }
)
.select("-password")
.populate("enrolledCourses");

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    return res.status(200).json(user);

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `Update Profile error: ${error.message}`,
    });
  }
};