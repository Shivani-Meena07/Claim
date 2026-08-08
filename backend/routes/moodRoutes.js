const express = require("express");

const {
  createMood,
  getMoods,
} = require("../controllers/moodController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createMood);

router.get("/", authMiddleware, getMoods);

module.exports = router;