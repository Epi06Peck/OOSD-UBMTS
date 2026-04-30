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

  // EDIT SESSION
  async editSession(fields) {
    const {
      subject,
      day_of_week,
      start_time,
      end_time,
      capacity,
      meeting_link,
    } = fields;

    // Business logic validation
    if (capacity !== undefined && capacity < 1) {
      throw new Error("Capacity must be at least 1");
    }

    // Can't reduce capacity below current enrollment
    if (capacity !== undefined && capacity < this.currentEnrollment) {
      throw new Error("Capacity cannot be less than current enrollment");
    }

    const result = await dbconnection_1.default.query(
      `UPDATE tutor_sessions
     SET
       subject      = COALESCE($1, subject),
       day_of_week  = COALESCE($2, day_of_week),
       start_time   = COALESCE($3, start_time),
       end_time     = COALESCE($4, end_time),
       capacity     = COALESCE($5, capacity),
       meeting_link = COALESCE($6, meeting_link)
     WHERE session_id = $7
     RETURNING *`,
      [
        subject,
        day_of_week,
        start_time,
        end_time,
        capacity,
        meeting_link,
        this.sessionID,
      ],
    );

    if (result.rows.length === 0) throw new Error("Session not found");

    // Sync in-memory state with DB
    const updated = result.rows[0];
    this.subject = updated.subject;
    this.dayOfWeek = updated.day_of_week;
    this.startTime = updated.start_time;
    this.endTime = updated.end_time;
    this.capacity = updated.capacity;
    this.meetingLink = updated.meeting_link;

    return updated;
  }

  // VIEW REGISTERED STUDENTS
  static async getRegisteredStudents(sessionID) {
    const result = await dbconnection_1.default.query(
      `SELECT u.user_id, u.name, u.email
     FROM session_registrations sr
     JOIN users u ON sr.student_id = u.user_id
     WHERE sr.session_id = $1
     ORDER BY u.name`,
      [sessionID],
    );
    return result.rows;
  }
}
exports.TutorSessionImpl = TutorSessionImpl;
