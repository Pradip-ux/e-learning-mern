import User from "../model/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import genToken from "../config/token.js";
import sendMail from "../config/sendMail.js";

export const signUp = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }



    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Enter valid email" });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }


    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashPassword,
      role,
    });

    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // remove password before sending response
    user.password = undefined;

    return res.status(200).json({
      user,
      token
    });
  } catch (error) {
    return res.status(500).json({ message: `SignUp error: ${error.message}` });
  }
};

export const login=async(req,res)=>{
    try {
        let {email,password}= req.body
        let user= await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"user does not exist"})
        }
        let isMatch =await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({message:"incorrect Password"})
        }
        let token =await genToken(user._id)
        res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json(user)

    } catch (error) {
        console.log("login error")
        return res.status(500).json({message:`login Error ${error}`})
    }
}

export const getMe = async (req, res) => {
  try {
    console.log("User ID:", req.userId); // 👈 DEBUG

    const user = await User.findById(req.userId)
      .populate("enrolledCourses")
      .select("-password");

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,   // true in production
      sameSite: "lax",
      path: "/",       // VERY IMPORTANT
    });

    return res.status(200).json({ message: "Logout Successfully" });

  } catch (error) {
    return res.status(500).json({
      message: `Logout error: ${error.message}`
    });
  }
};

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString()

    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;

    user.isOtpVerified = false;

    await user.save()
    await sendMail(email, otp);
    return res.status(200).json({ message: "otp Sends Successfully" })
  } catch (error) {
    return res.status(500).json({ message: `send otp error: ${error.message}` });
  }
}

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email })
    if (!user || user.resetOtp != otp || user.otpExpires < Date.now()) {
      return res.status(404).json({ message: "Invalid OTP" });
    }
    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;

    await user.save();
    return res.status(200).json({ message: "OTP Verified Successfully" });

  } catch (error) {
    return res.status(500).json({
      message: `verify OTP error ${error.message}`
    });
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !user.isOtpVerified) {
      return res.status(404).json({ message: "OTP verfication is required" });
    }
    const hashPassword = await bcrypt.hash(password, 10)
    user.password = hashPassword,
      user.isOtpVerified = false

    await user.save()
    return res.status(200).json({ message: "Reset Password Successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Reset Password error: ${error.message}` });

  }
}

export const googleAuth = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        role,
        googleAuth: true,
      });
    }

    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/", // ✅ ADD THIS (IMPORTANT)
    });

    user.password = undefined;

    return res.status(200).json(user);

  } catch (error) {
    return res.status(500).json({ message: `Google Auth error: ${error.message}` });
  }
};