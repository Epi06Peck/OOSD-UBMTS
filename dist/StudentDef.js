"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = void 0;
const UserDef_1 = require("./UserDef");

class Student extends UserDef_1.User {
  constructor(id, name, email, password) {
    super(id, name, email, password, "Student");
    this.registeredSessions = [];
  }

  // Business logic signatures
  registerForSession(sessionID) {}
  cancelSession(sessionID) {}
  viewSessions() {}

  // DB method signatures
  async enroll(sessionID) {}
  async unenroll(sessionID) {}
  static async getAllSessions() {}
  static async getEnrollments(studentID) {} // ← add this
}

exports.Student = Student;
