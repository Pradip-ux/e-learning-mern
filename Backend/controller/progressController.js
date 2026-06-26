import User from "../model/userModel.js";

// ✅ UPDATE PROGRESS
export const updateProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.body;
    const userId = req.user.id; // from auth middleware

    const user = await User.findById(userId);

    let progress = user.progress.find(
      (p) => p.courseId.toString() === courseId
    );

    if (!progress) {
      // first time
      user.progress.push({
        courseId,
        completedLectures: [lectureId],
      });
    } else {
      // avoid duplicate
      const alreadyCompleted = progress.completedLectures.some(
        (id) => id.toString() === lectureId
      );

      if (!alreadyCompleted) {
        progress.completedLectures.push(lectureId);
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Progress updated",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET OVERALL PROGRESS (for Student Dashboard)
// export const getAllUserProgress = async (req, res) => {
//   try {
//     // 1. Find user and populate the lectures of enrolled courses
//     const user = await User.findById(req.user.id).populate({
//       path: "enrolledCourses",
//       select: "title thumbnail lectures", // Only get what we need
//     });

//     if (!user) return res.status(404).json({ message: "User not found" });

//     // 2. Map through enrolled courses to calculate progress
//     const dashboardData = user.enrolledCourses.map((course) => {
//       // Find the specific progress entry for this course
//       const courseProgress = user.progress.find(
//         (p) => p.courseId.toString() === course._id.toString()
//       );

//       // const completedCount = courseProgress ? courseProgress.completedLectures.length : 0;
//       // const totalLectures = course.lectures.length;

//       // // Calculate percentage
//       // const percentage = totalLectures > 0 
//       //   ? Math.round((completedCount / totalLectures) * 100) 
//       //   : 0;
//       const completed = courseProgress?.completedCount || 0;
//       const total = courseProgress?.totalLectures || 0;
//       const percent = courseProgress?.progressPercentage || 0;
//       return {
//         courseId: course._id,
//         title: course.title,
//         thumbnail: course.thumbnail,
//         totalLectures,
//         completedCount,
//         progressPercentage: percentage,
//       };
//     });

//     res.status(200).json({
//       success: true,
//       progressData: dashboardData,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const getAllUserProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "enrolledCourses",
      select: "title thumbnail lectures",
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const dashboardData = user.enrolledCourses.map((course) => {
      // Find progress or default to an empty object
      const courseProgress = user.progress?.find(
        (p) => p.courseId.toString() === course._id.toString()
      ) || { completedLectures: [] };

      const totalLecturesCount = course.lectures?.length || 0;
      const completedCount = courseProgress.completedLectures.length;
      
      const percentage = totalLecturesCount > 0 
        ? Math.round((completedCount / totalLecturesCount) * 100) 
        : 0;

      return {
        courseId: course._id,
        title: course.title,
        thumbnail: course.thumbnail,
        completedLectures: courseProgress.completedLectures,
        totalLectures: totalLecturesCount,
        progressPercentage: percentage,
      };
    });

    res.status(200).json({ success: true, progressData: dashboardData });
  } catch (error) {
    // This will catch the error that was causing your 500 status
    res.status(500).json({ message: error.message });
  }
};
// ✅ GET PROGRESS (for dashboard)
export const getUserProgress = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "courseId is required",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const progress = user.progress.find(
      (p) => p.courseId.toString() === courseId
    );

    res.status(200).json({
      success: true,
      completedLectures: progress ? progress.completedLectures : [],
    });

  } catch (error) {
    console.error("GET PROGRESS ERROR:", error); // 🔥 important
    res.status(500).json({ message: error.message });
  }
};