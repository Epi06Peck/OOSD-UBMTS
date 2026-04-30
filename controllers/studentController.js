const { StudentImpl } = require("../dist/Student");

// GET ALL SESSIONS
const getSessions = async (req, res) => {
  try {
    const sessions = await StudentImpl.getAllSessions(); // ← static DB call
    res.json(sessions);
  } catch (err) {
    console.error("Get sessions error:", err.message);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
};

// REGISTER FOR SESSION
const registerSession = async (req, res) => {
  try {
    const { studentID, sessionID } = req.body;
    if (!studentID || !sessionID) {
      return res.status(400).json({ error: "Missing studentID or sessionID" });
    }

    const student = new StudentImpl(studentID, "", "", "");
    const result = await student.enroll(sessionID); // ← class handles capacity + DB
    res.json(result);
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(400).json({ error: err.message }); // sends "Session is full" etc to frontend
  }
};

// CANCEL SESSION
const cancelSession = async (req, res) => {
  try {
    const { studentID, sessionID } = req.body;
    if (!studentID || !sessionID) {
      return res.status(400).json({ error: "Missing studentID or sessionID" });
    }

    const student = new StudentImpl(studentID, "", "", "");
    const result = await student.unenroll(sessionID); // ← class handles DB
    res.json(result);
  } catch (err) {
    console.error("Cancel error:", err.message);
    res.status(400).json({ error: err.message });
  }
};

const getEnrollments = async (req, res) => {
  try {
    const enrollments = await StudentImpl.getEnrollments(req.params.studentID);
    res.json(enrollments);
  } catch (err) {
    console.error("Get enrollments error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getSessions,
  registerSession,
  cancelSession,
  getEnrollments,
};
