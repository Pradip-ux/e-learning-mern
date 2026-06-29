import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/connectDB.js";
import cookieParser from "cookie-parser";
import authRouter from "./route/authRoute.js";
import userRouter from "./route/userRoute.js";
import cors from "cors";
import courseRouter from "./route/courseRoute.js";
import paymentRouter from "./route/paymentRoute.js";
import adminRouter from "./route/adminRoute.js";
import reviewRouter from "./route/reviewRoute.js";
import SupportRouter from "./route/supportRoute.js";
import aiRouter from "./route/aiRoute.js";
import seedAdmin from "./config/seedAdmin.js";
import materialRouter from "./route/materialRoute.js";
import upload from "./middleware/multer.js";
import path from "path";
import { fileURLToPath } from "url";
import progressRouter from "./route/progressRoute.js";


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

// app.use(
//   cors({
//     // origin: [
//     //         // "http://localhost:5173",
//     //         // "http://192.168.142.1:5173/",
//     //         "http://192.168.75.1:5173"
//     // ],
    
//     credentials: true,
//   })
// );
// app.use(
//   cors({
//     origin: "http://localhost:5173", // Be explicit about your frontend port
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"]
//   })
// );
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://e-learning-mern-git-main-pradip-uxs-projects.vercel.app"
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// --- CRITICAL FIX: MOVE THIS ABOVE THE ROUTES ---
// This ensures that requests to /uploads are handled before any other routing logic
// Make sure this is above your routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/review", reviewRouter);
app.use("/api/ai", aiRouter);
app.use("/api/admin", adminRouter);
app.use("/api/support", SupportRouter);
app.use("/api/material", materialRouter);
app.use("/api/progress", progressRouter);
// Support Router fallback (keep generic routes at the bottom)
app.use("/", SupportRouter);

app.get("/", (req, res) => {
  res.send("Hello from server");
});
console.log("Mongo URL:", process.env.MONGODB_URL);
console.log("JWT:", process.env.JWT_SECRET);
const startServer = async () => {
  try {
    await connectDb();
    seedAdmin();

    app.listen(port, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${port}`);
    });

  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();