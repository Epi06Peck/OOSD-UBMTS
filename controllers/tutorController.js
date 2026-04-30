const pool = require("../db/dbconnection");
const { TutorImpl } = require("../dist/Tutor");
const { TutorSessionImpl } = require("../dist/TutorSession");

// ==========================
// CREATE SESSION
// ==========================
const createSession = async (req, res) => {
  try {
    const { tutor_id, subject, day_of_week, start_time, capacity } = req.body;

    if (!tutor_id || !subject || !day_of_week || !start_time || !capacity) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Use TutorImpl to represent the tutor — calls createSession() for business logic
    const tutor = new TutorImpl(tutor_id, "", "", "");
    tutor.createSession(null); // logs + tracks intent via class

    // Use TutorSessionImpl to validate the session before saving
    const session = new TutorSessionImpl(
      null,
      tutor_id,
      day_of_week,
      start_time,
      null,
      capacity,
    );
    if (capacity < 1) {
      return res.status(400).json({ error: "Capacity must be at least 1" });
    }

    // Persist to DB
    const result = await pool.query(
      `INSERT INTO tutor_sessions (tutor_id, subject, day_of_week, start_time, capacity, current_enrolled)
       VALUES ($1, $2, $3, $4, $5, 0) RETURNING *`,
      [
        tutor.user_id,
        subject,
        session.dayOfWeek,
        session.startTime,
        session.capacity,
      ],
    );

    res
      .status(201)
      .json({ message: "Session created!", session: result.rows[0] });
  } catch (err) {
    console.error("Create session error:", err);
    res.status(500).json({ error: "Failed to create session" });
  }
};

// ==========================
// GET SESSIONS BY TUTOR ID
// ==========================
const getTutorSessions = async (req, res) => {
  try {
    const { tutorID } = req.params;

    // Use TutorImpl to represent the tutor
    const tutor = new TutorImpl(tutorID, "", "", "");

    const result = await pool.query(
      `SELECT * FROM tutor_sessions WHERE tutor_id = $1 ORDER BY day_of_week`,
      [tutor.user_id],
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Get tutor sessions error:", err);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
};

// ==========================
// DELETE SESSION
// ==========================
const deleteSession = async (req, res) => {
  try {
    const { sessionID } = req.params;

    await pool.query(`DELETE FROM tutor_sessions WHERE session_id = $1`, [
      sessionID,
    ]);

    res.json({ message: "Session deleted" });
  } catch (err) {
    console.error("Delete session error:", err);
    res.status(500).json({ error: "Failed to delete session" });
  }
};

// ==========================
// GET ALL SESSIONS (students + admin)
// ==========================
const getAllSessions = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM tutor_sessions ORDER BY day_of_week`,
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Get all sessions error:", err);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
};

// ==========================
// ENROLL STUDENT IN SESSION
// capacity check uses TutorSessionImpl
// ==========================
const enrollStudent = async (req, res) => {
  try {
    const { session_id, student_id } = req.body;

    // Fetch current session state from DB
    const sessionResult = await pool.query(
      `SELECT * FROM tutor_sessions WHERE session_id = $1`,
      [session_id],
    );

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({ error: "Session not found" });
    }

    const row = sessionResult.rows[0];

    // Hydrate TutorSessionImpl with real DB values
    const session = new TutorSessionImpl(
      row.session_id,
      row.tutor_id,
      row.day_of_week,
      row.start_time,
      null,
      row.capacity,
    );
    session.currentEnrollment = row.current_enrolled;

    // Class decides if enrolment is allowed
    if (!session.checkCapacity()) {
      return res.status(400).json({ error: "Session is full" });
    }

    // Class says ok — persist to DB
    session.addStudent(); // updates in-memory count (useful for logging)

    await pool.query(
      `UPDATE tutor_sessions SET current_enrolled = current_enrolled + 1 WHERE session_id = $1`,
      [session_id],
    );

    res.json({ message: "Enrolled successfully!" });
  } catch (err) {
    console.error("Enroll error:", err);
    res.status(500).json({ error: "Enrollment failed" });
  }
};

module.exports = {
  createSession,
  getTutorSessions,
  deleteSession,
  getAllSessions,
  enrollStudent,
};
