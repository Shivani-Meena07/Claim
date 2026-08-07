const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  console.log("========== AUTH MIDDLEWARE ==========");

  try {
    const authHeader = req.headers.authorization;

    console.log("Authorization header exists:", !!authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ No Bearer token");
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    console.log("Token received:", !!token);
    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("✅ JWT VERIFIED");
    console.log("User ID:", decoded.userId);

    req.user = {
      id: decoded.userId,
    };

    next();

  } catch (error) {
    console.error("❌ JWT ERROR:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
      debug: error.message,
    });
  }
};

module.exports = authMiddleware;