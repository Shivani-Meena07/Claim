const express = require("express");
const { signup, login } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "You are authenticated",
    userId: req.user.id,
  });
});

module.exports = router;