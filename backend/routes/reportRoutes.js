const express = require("express");
const { getMonthlyReportAI } = require("../controllers/reportController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/monthly-ai", authMiddleware, getMonthlyReportAI);

module.exports = router;