const isAdmin = (req, res, next) => {
  try {
    // 1. Check if user exists (attached by isAuth middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Please login first",
      });
    }

    // 2. Check if the role is 'admin'
    // Note: Ensure this matches the string in your User model ("admin" vs "Admin")
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have admin permissions",
      });
    }

    // 3. User is admin, proceed to the next function
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error in Admin Middleware",
    });
  }
};

export default isAdmin;