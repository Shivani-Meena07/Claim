const express = require("express");

const {
  createSleep,
  getSleep,
} = require("../controllers/sleepController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createSleep);

router.get("/", authMiddleware, getSleep);

module.exports = router;