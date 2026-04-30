"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentImpl = void 0;
const StudentDef_1 = require("./StudentDef");
const dbconnection_1 = require("../db/dbconnection");

class StudentImpl extends StudentDef_1.Student {
  constructor(id, name, email, password) {
    super(id, name, email, password);
  }

  // ========================
  // BUSINESS LOGIC (in-memory, from spec)
  // ========================
  registerForSession(sessionID) {
    this.registeredSessions.push(sessionID);
    console.log(`Registered for session ${sessionID}`);
  }

  cancelSession(sessionID) {
    const initialLength = this.registeredSessions.length;
    this.registeredSessions = this.registeredSessions.filter(
      (id) => id !== sessionID,
    );
    if (this.registeredSessions.length < initialLength) {
      console.log(`Cancelled session ${sessionID}`);
    }
  }

  viewSessions() {
    console.log("Enrolled Sessions: " + this.registeredSessions.join(" "));
  }

  // ========================
  // DB PERSISTENCE METHODS
  // ========================

  // Get all available sessions (all tutors)
  static async getAllSessions() {
    const result = await dbconnection_1.default.query(
      `SELECT 
      ts.session_id,
      ts.subject,
      ts.day_of_week,
      ts.start_time,
      ts.end_time,
      ts.capacity,
      ts.current_enrolled,
      ts.meeting_link,
      u.name AS tutor_name
    FROM tutor_sessions ts
    JOIN users u ON ts.tutor_id = u.user_id
    ORDER BY ts.day_of_week`,
    );
    return result.rows;
  }

  static async getEnrollments(studentID) {
    const result = await dbconnection_1.default.query(
      `SELECT session_id FROM session_registrations WHERE student_id = $1`,
      [studentID],
    );
    return result.rows;
  }

  // Enroll student — uses TutorSessionImpl capacity check
  async enroll(sessionID) {
    const check = await dbconnection_1.default.query(
      `SELECT capacity, current_enrolled FROM tutor_sessions WHERE session_id = $1`,
      [sessionID],
    );
    if (check.rows.length === 0) throw new Error("Session not found");

    const { capacity, current_enrolled } = check.rows[0];

    if (current_enrolled >= capacity) throw new Error("Session is full");

    const exists = await dbconnection_1.default.query(
      `SELECT * FROM session_registrations WHERE student_id = $1 AND session_id = $2`,
      [this.userID, sessionID], // ← this.userID not this.user_id
    );
    if (exists.rows.length > 0)
      throw new Error("Already enrolled in this session");

    await dbconnection_1.default.query(
      `INSERT INTO session_registrations (student_id, session_id) VALUES ($1, $2)`,
      [this.userID, sessionID], // ← this.userID
    );
    await dbconnection_1.default.query(
      `UPDATE tutor_sessions SET current_enrolled = current_enrolled + 1 WHERE session_id = $1`,
      [sessionID],
    );

    this.registerForSession(sessionID);
    return { message: "Enrolled successfully!" };
  }

  // Cancel enrollment
  async unenroll(sessionID) {
    const exists = await dbconnection_1.default.query(
      `SELECT * FROM session_registrations WHERE student_id = $1 AND session_id = $2`,
      [this.userID, sessionID], // ← this.userID
    );
    if (exists.rows.length === 0)
      throw new Error("Not enrolled in this session");

    await dbconnection_1.default.query(
      `DELETE FROM session_registrations WHERE student_id = $1 AND session_id = $2`,
      [this.userID, sessionID], // ← this.userID
    );
    await dbconnection_1.default.query(
      `UPDATE tutor_sessions SET current_enrolled = current_enrolled - 1 WHERE session_id = $1`,
      [sessionID],
    );

    this.cancelSession(sessionID);
    return { message: "Cancelled successfully!" };
  }
}

exports.StudentImpl = StudentImpl;
