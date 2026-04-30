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
  addStudent() {}
  removeStudent() {}
  checkCapacity() {
    return false;
  }
  displaySession() {}
}
exports.TutorSession = TutorSession;
