const express = require("express");
const router = express.Router();

const {
  createSession,
  getTutorSessions,
  deleteSession,
  getAllSessions,
} = require("../controllers/tutorController");

router.post("/sessions", createSession); // POST create (tutor)
router.get("/sessions/:tutorID", getTutorSessions); // get tutor's own session
router.get("/sessions", getAllSessions); // GET all (students/admin)
router.delete("/sessions/:sessionID", deleteSession); // DELETE a session

module.exports = router;
