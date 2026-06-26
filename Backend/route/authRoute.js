import express from "express";
import { googleAuth, login, logout, resetPassword, sendOTP, signUp, verifyOtp } from "../controller/authController.js";
// import isAuth from "../middleware/isAuth.js";
import isAuth from "../middleware/isAuth.js"
import { getMe } from "../controller/authController.js";
const authRouter = express.Router();

authRouter.post("/signUp", signUp);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/sendotp",sendOTP)
authRouter.post("/verifyotp",verifyOtp)
authRouter.post("/resetpassword",resetPassword)
authRouter.post("/googleauth",googleAuth)
authRouter.get("/me", isAuth, getMe);

export default authRouter;
