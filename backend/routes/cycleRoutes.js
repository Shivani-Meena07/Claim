const express = require("express");

const {
  createCycle,
  getCycles,
  updateCycle,
  deleteCycle,
  getCycleAIInsight,
} = require("../controllers/cycleController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createCycle);
router.get("/", authMiddleware, getCycles);

router.get("/ai-insight", authMiddleware, getCycleAIInsight);

router.put("/:id", authMiddleware, updateCycle);
router.delete("/:id", authMiddleware, deleteCycle);

module.exports = router;