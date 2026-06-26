import Course from "../model/courseModel.js"
import uploadOnCloudinary from "../config/cloudinary.js";
import Lecture from "../model/LectureModel.js";
import User from "../model/userModel.js";

export const createCourse = async (req, res) => {
    try {
        const { title, category } = req.body
        if (!title || !category) {
            return res.status(400).json({ message: "title or Category is required " })
        }
        // const course = await Course.create({
        //     title,
        //     category,
        //     creator: req.userId
        // })
        const course = await Course.create({
            title,
            category,
            creator: req.userId,
            isPublished: true
        })
        // return res.status(201).json(course)
        return res.status(201).json(course)
    }
    catch (error) {
        return res.status(400).json({ message: `Create Course error $ {error} ` })
    }
}

export const getPublishedCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true })
            .populate("creator", "name role photoUrl") // 🔥 ADD
            .populate("lectures")
            .populate("reviews");
        if (!courses) {
            return res.status(404).json({ message: "Course not found" })
        }

        return res.status(200).json({
            success: true,
            courses
        });

    } catch (error) {
        return res.status(500).json({ message: `Failed to get All  courses ${error}` })
    }
}

// export const getCreatorCourses = async (req, res) => {
//     try {
//         const userId = req.userId
//         const courses = await Course.find({ creator: userId })
//   .populate("creator", "name role photoUrl"); // 🔥 ADD
//         if (!courses) {
//             return res.status(400).json({ message: `Courses are not found ` })
//         }
//         return res.status(200).json(courses)
//     }
//     catch (error) {
//         return res.status(500).json({ message: `Failed to get Creator Courses ${error}` })
//     }
// }
export const getCreatorCourses = async (req, res) => {
    try {
        const userId = req.userId
        const courses = await Course.find({ creator: userId })
        if (!courses) {
            return res.status(404).json({ message: "Course not found" })
        }
        return res.status(200).json(courses)

    } catch (error) {
        return res.status(500).json({ message: `Failed to get creator courses ${error}` })
    }
}
export const editCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, subTitle, description, category, level, price, isPublished } = req.body;
        let thumbnail;
        let updateData = { title, subTitle, description, category, level, price, isPublished };
        if (req.file) {
            const thumbnail = await uploadOnCloudinary(req.file.path);
            console.log("FILE:", req.file);
            if (thumbnail) {
                updateData.thumbnail = thumbnail;
            }
        }
        let course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ message: "Course not found" })
        }
        // let updateData = { title, subTitle, description, category, level, price, isPublished };


        course = await Course.findByIdAndUpdate(courseId, updateData, { new: true })
        return res.status(201).json(course)
    } catch (error) {
        return res.status(500).json({ message: `Failed to update course ${error}` })
    }
}

export const getSingleCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId)
            .populate("lectures")
            .populate({
                path: "reviews",
                populate: {
                    path: "user",
                    select: "name photoUrl",
                },
            });

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // REMOVE OR FIX THIS LINE: 
        // console.log("FINAL DATA:", selectedCourseData); 

        console.log("FINAL DATA:", course); // Fix it to use 'course'

        return res.status(200).json({ course });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};
// export const getCourseById = async (req, res) => {
//     try {
//         const { courseId } = req.params;
//         let course = await Course.findById(courseId)
//         if (!course) {
//             return res.status(400).json({ message: `Course is  not found ` })
//         }
//         return res.status(200).json(course)
//     } catch (error) {
//         return res.status(500).json({ message: `Failed to get Courses by Id ${error}` })
//     }
// }
export const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;

        let course = await Course.findById(courseId)
            .populate("lectures") // 🔥 FIX
            .populate({
                path: "reviews",
                populate: {
                    path: "user",
                    select: "name photoUrl"
                }
            });

        if (!course) {
            return res.status(400).json({ message: "Course not found" });
        }

        return res.status(200).json({ course });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching course" });
    }
};
export const removeCourse = async (req, res) => {
    try {
        const { courseId } = req.params
        let course = await Course.findById(courseId)
        if (!course) {
            return res.status(400).json({ message: `Course is  not found ` })
        }
        course = await Course.findByIdAndDelete(courseId, { new: true })
        return res.status(200).json({ message: "Course removed" })
    } catch (error) {
        return res.status(500).json({ message: `Failed to delete Course by Id ${error}` })
    }

}

export const createLecture = async (req, res) => {
    try {
        const { lectureTitle } = req.body;
        const { courseId } = req.params
        if (!lectureTitle || !courseId) {
            return res.status(400).json({ message: "Lecture Title is required" })
        }

        const lecture = await Lecture.create({ lectureTitle })
        const course = await Course.findById(courseId)
        if (course) {
            course.lectures.push(lecture._id)
        }
        await course.populate("lectures")
        await course.save();
        return res.status(201).json({ lecture, course })
    }

    catch (error) {
        return res.status(400).json({ message: `Failed to Create Lecture ${error}` })
    }
}

export const getCourseLecture = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId)
            .populate("lectures")
            .populate("creator");

        if (!course) {
            return res.status(404).json({ message: "Course Is Not Found" });
        }

        return res.status(200).json({
            lectures: course.lectures,
        });

    } catch (error) {
        console.log("ERROR:", error); // 👈 add this for debugging
        return res.status(500).json({
            message: `Failed to get course Lecture`,
        });
    }
};

export const editLecture = async (req, res) => {
    try {
        const { lectureId } = req.params
        const { isPreviewFree, lectureTitle } = req.body
        const lecture = await Lecture.findById(lectureId)
        if (!lecture) {
            return res.status(404).json({ message: "Lecture not found" })
        }
        let videoUrl
        if (req.file) {
            videoUrl = await uploadOnCloudinary(req.file.path)
            lecture.videoUrl = videoUrl
        }
        if (lectureTitle) {
            lecture.lectureTitle = lectureTitle
        }
        lecture.isPreviewFree = isPreviewFree

        await lecture.save()
        return res.status(200).json(lecture)
    } catch (error) {
        return res.status(500).json({ message: `Failed to edit Lectures ${error}` })
    }

}

export const removeLecture = async (req, res) => {
    try {
        const { lectureId } = req.params
        const lecture = await Lecture.findByIdAndDelete(lectureId)
        if (!lecture) {
            return res.status(404).json({ message: "Lecture not found" })
        }
        //remove the lecture from associated course

        await Course.updateOne(
            { lectures: lectureId },
            { $pull: { lectures: lectureId } }
        )
        return res.status(200).json({ message: "Lecture Remove Successfully" })
    }

    catch (error) {
        return res.status(500).json({ message: `Failed to remove Lectures ${error}` })
    }
}

export const getCreatorById = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({ message: "get Creator error" });
    }
};



export const getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.userId;
        // Find the user and populate the courses they are enrolled in
        const user = await User.findById(userId).populate("enrolledCourses");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return just the array of courses
        res.status(200).json(user.enrolledCourses || []);
    } catch (error) {
        res.status(500).json({ message: "Failed to get enrolled courses" });
    }
};
export const enrollCourse = async (req, res) => {
    try {
        const userId = req.userId;
        const { courseId } = req.params; // or req.body, check your route

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // 1. Update Course: Add student to the course's enrolled list
        if (!course.enrolledStudents.includes(userId)) {
            course.enrolledStudents.push(userId);
            await course.save();
        }

        // 2. Update User: Add course to the user's enrolled list
        const user = await User.findById(userId);
        if (!user.enrolledCourses.includes(courseId)) {
            user.enrolledCourses.push(courseId);
            await user.save();
        }

        res.status(200).json({ message: "Enrolled successfully", course });
    } catch (error) {
        res.status(500).json({ message: "Enrollment failed", error: error.message });
    }
};