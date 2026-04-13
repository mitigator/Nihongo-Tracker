const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getTests,
  createTest,
  deleteTest,
} = require("../controllers/mockTestController");

// All routes require authentication
router.use(protect);

router.route("/").get(getTests).post(createTest);

router.delete("/:id", deleteTest);

module.exports = router;