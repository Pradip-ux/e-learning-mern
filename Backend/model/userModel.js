import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function () {
            return !this.googleAuth;   // required only if NOT google user
        }
    },
    googleAuth: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ["student", "Instructor", "admin"],
        default: "student"
    },
    photoUrl: {
        type: String,
        default: ""
    },
    enrolledCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }],
    resetOtp: {
        type: String
    },
    otpExpires: {
        type: Date
    },
    isOtpVerified: {
        type: Boolean,
        default: false
    },
    progress: [
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
    },
    completedLectures: [
      {
        type: mongoose.Schema.Types.ObjectId
      }
    ]
  }
]
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
