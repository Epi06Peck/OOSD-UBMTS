const { StudentImpl } = require("../dist/student");
// TEMP (until DB is used)
let sessions = [
  { id: 1, title: "Math Session" },
  { id: 2, title: "Programming Session" },
];

// ==========================
// GET ALL SESSIONS
// ==========================
const getSessions = async (req, res) => {
  try {
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
};

// ==========================
// REGISTER FOR SESSION
// ==========================
const registerSession = async (req, res) => {
  try {
    const { studentID, sessionID } = req.body;

    if (!studentID || !sessionID) {
      return res.status(400).json({ error: "Missing data" });
    }

    //  CREATE STUDENT OBJECT
    const student = new StudentImpl(studentID, "", "", "");

    //  CALL BUSINESS LOGIC
    student.registerForSession(sessionID);

    res.json({ message: "Registered successfully (via class)" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
};

// ==========================
// CANCEL SESSION
// ==========================
const cancelSession = async (req, res) => {
  try {
    const { studentID, sessionID } = req.body;

    const student = new StudentImpl(studentID, "", "", "");

    student.cancelSession(sessionID);

    res.json({ message: "Cancelled successfully (via class)" });
  } catch (err) {
    res.status(500).json({ error: "Cancellation failed" });
  }
};

module.exports = {
  getSessions,
  registerSession,
  cancelSession,
};
