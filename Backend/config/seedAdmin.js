import bcrypt from "bcryptjs"; // Import bcrypt
import User from "../model/userModel.js";

// const seedAdmin = async () => {
//     try {
//         await User.deleteOne({ email: "admin@gmail.com" }); // Reset to ensure hash is applied

//         const hashedPassword = await bcrypt.hash("Pradip@LMS#1999", 10); // Hash it manually

//         const newAdmin = new User({
//             name: "Main Admin",
//             email: "admin.lms@gmail.com",
//             password: hashedPassword, // Save the HASH, not the text
//             role: "admin",
//             isOtpVerified: true
//         });
//         await newAdmin.save();
//         console.log("✅ Admin seeded with hashed password!");
//     } catch (error) {
//         console.error("❌ Error:", error);
//     }
// };

// export default seedAdmin

const seedAdmin = async () => {
    try {
        // ✅ Delete old admin (correct email)
        await User.deleteOne({ email: "admin@gmail.com" });

        // ✅ Check if new admin already exists (avoid duplicate error)
        const existingAdmin = await User.findOne({ email: "admin.lms@gmail.com" });

        if (existingAdmin) {
            console.log("⚠️ New admin already exists, skipping creation...");
            return;
        }

        // ✅ Hash password
        const hashedPassword = await bcrypt.hash("Pradip@LMS#1999", 10);

        // ✅ Create new admin
        const newAdmin = new User({
            name: "Main Admin",
            email: "admin.lms@gmail.com",
            password: hashedPassword,
            role: "admin",
            isOtpVerified: true
        });

        await newAdmin.save();

        console.log("✅ Old admin removed & new admin created!");
    } catch (error) {
        console.error("❌ Error:", error);
    }
};

 export default seedAdmin