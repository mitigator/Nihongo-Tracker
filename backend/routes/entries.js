const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getEntries,
  createEntry,
  updateEntry,
  deleteEntry,
} = require("../controllers/entryController");

// All routes require authentication
router.use(protect);

router.route("/").get(getEntries).post(createEntry);

router.route("/:id").put(updateEntry).delete(deleteEntry);

module.exports = router;