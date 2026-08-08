const express = require("express");

const {
  chatWithBot,
  getChatHistory,
} = require("../controllers/chatbotController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, chatWithBot);
router.get("/history", authMiddleware, getChatHistory);

module.exports = router;