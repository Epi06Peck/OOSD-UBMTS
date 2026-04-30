const express = require("express");
const router = express.Router();

const {
  createSession,
  getTutorSessions,
  deleteSession,
  getAllSessions,
  editSession,
  getRegisteredStudents,
} = require("../controllers/tutorController");

router.post("/sessions", createSession); // POST create (tutor)
router.get("/sessions/:tutorID", getTutorSessions); // get tutor's own session
router.get("/sessions", getAllSessions); // GET all (students/admin)
router.delete("/sessions/:sessionID", deleteSession); // DELETE a session
router.put("/sessions/:sessionID", editSession);
router.get("/sessions/:sessionID/students", getRegisteredStudents);

module.exports = router;
