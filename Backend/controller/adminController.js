import User from '../model/userModel.js';
import Course from '../model/courseModel.js';
// 📌 Get All Users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json({ 
            success: true, 
            users 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📌 Delete User
export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Prevent self-deletion (Check if req.user exists from isAuth middleware)
        if (req.user && req.user._id.toString() === userId) {
            return res.status(400).json({ message: "You cannot delete yourself" });
        }

        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ 
            success: true, 
            message: "User deleted successfully" 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📌 Change User Role
export const changeUserRole = async (req, res) => {
    try {
        const userId = req.params.id;
        const { role } = req.body;

        const validRoles = ["student", "instructor", "admin"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ 
            success: true, 
            user 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📌 Block / Unblock User
export const toggleBlockUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        // ✅ Critical Fix: Check if user exists before accessing properties
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isBlocked = !user.isBlocked;
        await user.save();

        res.status(200).json({ 
            success: true, 
            message: user.isBlocked ? "User blocked" : "User unblocked",
            isBlocked: user.isBlocked
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const getDashboardStats = async (req, res) => {
  try {
    // ✅ Total Users
    const totalUsers = await User.countDocuments();

    // ✅ Total Courses
    const totalCourses = await Course.countDocuments();

    // ✅ Published Courses
    const publishedCourses = await Course.countDocuments({
      isPublished: true,
    });

    // ✅ Instructors Count
    const totalInstructors = await User.countDocuments({
      role: "Instructor", // ⚠️ must match your DB exactly
    });

    // ✅ Students Count
    const totalStudents = await User.countDocuments({
      role: "student",
    });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalCourses,
        publishedCourses,
        totalInstructors,
        totalStudents,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
      error: error.message,
    });
  }
};