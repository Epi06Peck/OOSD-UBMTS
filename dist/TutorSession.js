"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorSessionImpl = void 0;
const TutorSessionDef_1 = require("./TutorSessionDef");
const dbconnection_1 = require("../db/dbconnection");
class TutorSessionImpl extends TutorSessionDef_1.TutorSession {
  constructor(sID, tID, subject, day, start, end, cap, meetingLink = null) {
    super(sID, tID, subject, day, start, end, cap, meetingLink);
  }
  addStudent() {
    if (this.checkCapacity()) {
      this.currentEnrollment++;
      console.log(`Student added. Current: ${this.currentEnrollment}`);
    } else {
      console.log("Session is full.");
    }
  }
  removeStudent() {
    if (this.currentEnrollment > 0) {
      this.currentEnrollment--;
      console.log(`Student removed. Current: ${this.currentEnrollment}`);
    }
  }
  checkCapacity() {
    return this.currentEnrollment < this.capacity;
  }
  displaySession() {
    console.log(`Session ${this.sessionID} on ${this.dayOfWeek}`);
  }

  // ==========================
  // CREATE SESSION
  // ==========================
  async createSession() {
    this.validateSession();
    const result = await dbconnection_1.default.query(
      `INSERT INTO tutor_sessions
     (tutor_id, subject, day_of_week, start_time, end_time, capacity, current_enrolled, meeting_link)
     VALUES ($1, $2, $3, $4, $5, $6, 0, $7)
     RETURNING *`,
      [
        this.tutorID,
        this.subject,
        this.dayOfWeek,
        this.startTime,
        this.endTime,
        this.capacity,
        this.meetingLink,
      ],
    );

    const row = result.rows[0]; // ← grab safely
    if (!row) throw new Error("Insert succeeded but no row returned");

    this.sessionID = row.session_id;
    return row;
  }

  // GET sessions by tutor
  static async getByTutorId(tutorID) {
    const result = await dbconnection_1.default.query(
      `SELECT * FROM tutor_sessions WHERE tutor_id = $1 ORDER BY day_of_week`,
      [tutorID],
    );

    return result.rows;
  }

  // Get all sessions
  static async getAll() {
    const result = await dbconnection_1.default.query(
      `SELECT * FROM tutor_sessions ORDER BY day_of_week`,
    );

    return result.rows;
  }

  // DELETE A session
  static async deleteById(sessionID) {
    await dbconnection_1.default.query(
      `DELETE FROM tutor_sessions WHERE session_id = $1`,
      [sessionID],
    );

    return true;
  }

  // Enroll a student in a session
  async enrollStudent() {
    const result = await dbconnection_1.default.query(
      `SELECT * FROM tutor_sessions WHERE session_id = $1`,
      [this.sessionID],
    );

    if (result.rows.length === 0) {
      throw new Error("Session not found");
    }

    const row = result.rows[0];

    this.currentEnrollment = row.current_enrolled;
    this.capacity = row.capacity;

    if (!this.checkCapacity()) {
      throw new Error("Session is full");
    }

    await dbconnection_1.default.query(
      `UPDATE tutor_sessions 
     SET current_enrolled = current_enrolled + 1 
     WHERE session_id = $1`,
      [this.sessionID],
    );

    this.currentEnrollment++;
    return true;
  }

  // validation check before creating session
  validateSession() {
    if (!this.subject || this.subject.trim() === "") {
      throw new Error("Subject is required.");
    }

    if (!this.dayOfWeek) {
      throw new Error("Day of week is required.");
    }

    if (!this.startTime || !this.endTime) {
      throw new Error("Start and end time are required.");
    }

    if (this.capacity <= 0) {
      throw new Error("Capacity must be greater than zero.");
    }

    if (!this.meetingLink || this.meetingLink.trim() === "") {
      throw new Error("Meeting link is required.");
    }
  }
}
exports.TutorSessionImpl = TutorSessionImpl;
