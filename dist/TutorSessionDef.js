"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorSession = void 0;
class TutorSession {
  constructor(sID, tID, subject, day, start, end, cap, meetingLink = null) {
    this.sessionID = sID;
    this.tutorID = tID;
    this.subject = subject;
    this.dayOfWeek = day;
    this.startTime = start;
    this.endTime = end;
    this.capacity = cap;
    this.currentEnrollment = 0;
    this.meetingLink = meetingLink;
  }
  // Since these have logic in the .cpp, we'll declare them here
  // In TS definition files, we just describe the signatures
  // BUSINESS LOGIC
  // ==========================
  addStudent() {}
  removeStudent() {}
  checkCapacity() {
    return false;
  }
  displaySession() {}

  validateSession() {}

  // ==========================
  // DATA / PERSISTENCE METHODS
  // ==========================
  async createSession() {}

  async enrollStudent() {}
  // Add these inside the class, after deleteById
  async editSession(fields) {}
  static async getRegisteredStudents(sessionID) {}

  // Static methods for fetching
  static async getByTutorId(tutorID) {}

  static async getAll() {}

  static async deleteById(sessionID) {}
}

exports.TutorSession = TutorSession;
