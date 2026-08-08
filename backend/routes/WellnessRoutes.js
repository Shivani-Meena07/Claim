const express = require("express");

const {
  getWellnessRecommendations,
} = require("../controllers/wellnessController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/recommendations",
  authMiddleware,
  getWellnessRecommendations
);

module.exports = router;