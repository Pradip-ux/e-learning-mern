// import Course from "../models/courseModel.js";
import Course from '../model/courseModel.js';
import razorpay from 'razorpay'
// import crypto from "crypto";

// import User from "../models/userModel.js";
import User from '../model/userModel.js';
import dotenv from "dotenv"
dotenv.config()
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
    
})

export const createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;

    // ✅ FETCH COURSE FROM DB
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const options = {
      amount: course.price * 100, // ✅ now works
      // amount:  * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(200).json(order);

  } catch (error) {
    console.error("🔥 PAYMENT ERROR:", error);
    res.status(500).json({ message: "Order creation failed" });
  }
};



import crypto from "crypto";

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
      userId,
    } = req.body;

    // 1. Signature Verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // 2. Enrollment Logic with safety checks
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Ensure enrolledCourses array exists
    if (!user.enrolledCourses) user.enrolledCourses = [];

    if (!user.enrolledCourses.includes(courseId)) {
      user.enrolledCourses.push(courseId);
      await user.save();
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Ensure enrolledStudents array exists
    if (!course.enrolledStudents) course.enrolledStudents = [];

    if (!course.enrolledStudents.includes(userId)) {
      course.enrolledStudents.push(userId);
      await course.save();
    }

    return res.status(200).json({ message: "Payment successful & enrollment done" });

  } catch (error) {
    console.error("VERIFICATION ERROR:", error); // This will show you exactly why it's 500
    return res.status(500).json({ message: "Internal Server Error during verification" });
  }
};
