import express from "express"
import { getCurrentUser, UpdateProfile } from "../controller/userController.js"
import isAuth from "../middleware/isAuth.js"
import upload from "../middleware/multer.js"
import { getMe } from "../controller/authController.js"

const userRouter = express.Router()

userRouter.get("/getcurrentuser",isAuth,getCurrentUser)
userRouter.get("/me", isAuth, getMe);
userRouter.post("/profile",isAuth,upload.single("photoUrl"),UpdateProfile)
userRouter.post("/update-profile",isAuth, upload.single("photo"),
  UpdateProfile
);

export default userRouter;