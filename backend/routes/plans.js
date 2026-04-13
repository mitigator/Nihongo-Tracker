const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
} = require("../controllers/planController");

// All routes require authentication
router.use(protect);

router.route("/").get(getPlans).post(createPlan);

router.route("/:id").get(getPlanById).put(updatePlan).delete(deletePlan);

module.exports = router;