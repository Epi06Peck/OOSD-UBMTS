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
}
exports.TutorSessionImpl = TutorSessionImpl;
