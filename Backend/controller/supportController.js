import { sendSupportMail } from "../config/sendMail.js"

export const contactSupport = async (req, res) => {
  try {
    const { name, email, subject, category, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Trigger the email sending
    await sendSupportMail({ name, email, subject, category, message });

    res.status(200).json({ 
      success: true, 
      message: "Complaint received successfully" 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};