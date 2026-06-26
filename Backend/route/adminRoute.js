import express from "express";
import isAuth from "../middleware/isAuth.js";
import isAdmin from "../middleware/isAdmin.js";
import {
  getAllUsers,
  deleteUser,
  changeUserRole,
  toggleBlockUser,
  getDashboardStats
} from "../controller/adminController.js";

const adminRouter = express.Router();

// All routes protected
// router.use(isAuth, isAdmin);


adminRouter.use(isAuth);
adminRouter.get("/users", getAllUsers);
adminRouter.delete("/user/:id", deleteUser);
adminRouter.put("/user/:id/role", changeUserRole);
adminRouter.put("/user/:id/block", toggleBlockUser);
adminRouter.get("/stats", getDashboardStats);

export default adminRouter;