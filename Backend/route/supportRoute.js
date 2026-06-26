import express from "express";
import { contactSupport } from "../controller/supportController.js";
// import { isAuth } from "../middleware/isAuth.js"; // Optional: to ensure only logged in users complain
import isAuth from "../middleware/isAuth.js";
const SupportRouter = express.Router();

SupportRouter.post("/contact", isAuth, contactSupport);

export default SupportRouter;