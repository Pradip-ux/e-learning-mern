import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, 
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

// Your existing OTP function
 const sendMail = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.USER_EMAIL,
    to: to,
    subject: "Reset Your Password",
    html: `<p>Your otp for Password Reset is <b>${otp}</b>. It expires in 5 minutes.</p>`, 
  });
};

// ✅ NEW: Function for Support Complaints
export const sendSupportMail = async (userData) => {
  const { name, email, subject, category, message } = userData;

  await transporter.sendMail({
    from: process.env.USER_EMAIL,
    to: process.env.USER_EMAIL, // Complaint goes TO YOU
    replyTo: email, // If you click "Reply", it goes to the student
    subject: `[SUPPORT] ${category}: ${subject}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
        <h2 style="color: #2563eb;">New Support Complaint</h2>
        <p><b>From:</b> ${name} (${email})</p>
        <p><b>Category:</b> ${category}</p>
        <p><b>Subject:</b> ${subject}</p>
        <hr />
        <p><b>Message:</b></p>
        <p style="background: #f9fafb; padding: 15px; border-radius: 8px;">${message}</p>
      </div>
    `,
  });
};

export default sendMail;