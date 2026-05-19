"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminImpl = void 0;
const dbconnection_1 = require("../db/dbconnection");
const { Admin } = require("./AdminDef");

class AdminImpl extends Admin {
  constructor(id, name, email, password) {
    super(id, name, email, password);
  }

  // ==========================
  // GET PENDING TUTORS
  // ==========================
  async getPendingTutors() {
    const result = await dbconnection_1.default.query(
      "SELECT * FROM users WHERE role_name = 'Tutor' AND approved = false",
    );
    return result.rows;
  }

  // ==========================
  // APPROVE TUTOR
  // ==========================
  async approveTutor(tutorID) {
    const result = await dbconnection_1.default.query(
      "UPDATE users SET approved = true WHERE user_id = $1 AND role_name = 'Tutor'",
      [tutorID],
    );

    if (result.rowCount === 0) {
      throw new Error("Tutor not found");
    }

    return `Tutor ${tutorID} approved successfully`;
  }

  // ==========================
  // REMOVE TUTOR
  // ==========================
  async removeTutor(tutorID) {
    const result = await dbconnection_1.default.query(
      "DELETE FROM users WHERE user_id = $1 AND role_name = 'Tutor'",
      [tutorID],
    );

    if (result.rowCount === 0) {
      throw new Error("Tutor not found");
    }

    return `Tutor ${tutorID} removed successfully`;
  }

  // ==========================
  // DELETE SESSION
  // ==========================
  async deleteTutorSession(sessionID) {
    const result = await dbconnection_1.default.query(
      "DELETE FROM tutor_sessions WHERE session_id = $1",
      [sessionID],
    );

    if (result.rowCount === 0) {
      throw new Error("Session not found");
    }

    return `Session ${sessionID} deleted successfully`;
  }

  // ==========================
  // DASHBOARD
  // ==========================
  dashboard() {
    return {
      actions: ["approveTutor", "removeTutor", "deleteTutorSession"],
    };
  }
}

module.exports = { AdminImpl };
