const express = require("express");
const router = express.Router();

const {
  createSession,
  getTutorSessions,
  deleteSession,
  getAllSessions,
} = require("../controllers/tutorController");

router.get("/sessions", getAllSessions); // GET all (students/admin)
router.post("/sessions", createSession); // POST create (tutor)
router.get("/sessions/:tutorID", getTutorSessions); // GET tutor's own sessions
router.delete("/sessions/:sessionID", deleteSession); // DELETE a session

module.exports = router;
