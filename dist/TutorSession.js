"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorSessionImpl = void 0;
const TutorSessionDef_1 = require("./TutorSessionDef");
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
