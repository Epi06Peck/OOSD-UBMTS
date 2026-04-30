const { TutorImpl } = require("../dist/Tutor");
const { TutorSessionImpl } = require("../dist/TutorSession");

// ==========================
// CREATE SESSION
// ==========================

const createSession = async (req, res) => {
  try {
    const {
      tutor_id,
      subject,
      day_of_week,
      start_time,
      end_time,
      capacity,
      meeting_link,
    } = req.body;

    const session = new TutorSessionImpl(
      null,
      tutor_id,
      subject,
      day_of_week,
      start_time,
      end_time,
      capacity,
      meeting_link,
    );
    const savedSession = await session.createSession();
    res
      .status(201)
      .json({ message: "Session created!", session: savedSession });
  } catch (err) {
    console.error("Create session error:", err.message); // ← will now tell you exactly what threw
    res.status(400).json({ error: err.message });
  }
};

// ==========================
// GET SESSIONS BY TUTOR ID
// ==========================
const getTutorSessions = async (req, res) => {
  try {
    const sessions = await TutorSessionImpl.getByTutorId(req.params.tutorID);
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// DELETE SESSION
// ==========================
const deleteSession = async (req, res) => {
  try {
    await TutorSessionImpl.deleteById(req.params.sessionID);
    res.json({ message: "Session deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// GET ALL SESSIONS (students + admin)
// ==========================
const getAllSessions = async (req, res) => {
  try {
    const sessions = await TutorSessionImpl.getAll();
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// ENROLL STUDENT IN SESSION
// capacity check uses TutorSessionImpl
// ==========================
const enrollStudent = async (req, res) => {
  try {
    const { session_id } = req.body;

    const session = new TutorSessionImpl(session_id);
    await session.enrollStudent();

    res.json({ message: "Enrolled successfully!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createSession,
  getTutorSessions,
  deleteSession,
  getAllSessions,
  enrollStudent,
};
