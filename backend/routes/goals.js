const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getGoals,
  getCurrentGoal,
  upsertGoal,
  deleteGoal,
} = require("../controllers/goalController");

// All routes require authentication
router.use(protect);

router.route("/").get(getGoals).post(upsertGoal);

router.get("/current", getCurrentGoal);

router.delete("/:id", deleteGoal);

module.exports = router;