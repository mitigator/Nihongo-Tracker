const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getSummary,
  getWeeklyChart,
  getMonthlyChart,
} = require("../controllers/progressController");

// All routes require authentication
router.use(protect);

router.get("/summary", getSummary);
router.get("/weekly", getWeeklyChart);
router.get("/monthly", getMonthlyChart);

module.exports = router;