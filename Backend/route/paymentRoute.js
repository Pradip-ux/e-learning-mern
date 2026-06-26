import express from "express"
// import { createOrder, verifyPayment } from "../controllers/orderController.js";
import { createOrder,verifyPayment } from "../controller/orderController.js";

let paymentRouter = express.Router()

// paymentRouter.post("/razorpay-order", RazorpayOrder);
paymentRouter.post("/create-order", createOrder);
paymentRouter.post("/verify-payment", verifyPayment);


export default paymentRouter