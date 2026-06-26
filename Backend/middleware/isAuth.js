import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ message: "User not authenticated: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Ensure your JWT payload actually contains 'userId'
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ message: "Invalid token structure" });
        }

        req.userId = decoded.userId;
        console.log("Authenticated User ID:", req.userId);
        next();
    } catch (error) {
        // If token is expired or altered, jwt.verify throws an error
        return res.status(401).json({ message: "Token is invalid or expired" });
    }
};

export default isAuth;