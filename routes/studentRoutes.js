const express = require("express");
const router = express.Router();

const {
  getSessions,
  registerSession,
  cancelSession,
  getEnrollments,
} = require("../controllers/studentController");

router.get("/sessions", getSessions);
router.post("/register", registerSession);
router.get("/enrollments/:studentID", getEnrollments);
router.post("/cancel", cancelSession);

module.exports = router;
