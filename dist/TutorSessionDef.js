"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorSession = void 0;
class TutorSession {
    constructor(sID, tID, day, start, end, cap) {
        this.sessionID = sID;
        this.tutorID = tID;
        this.dayOfWeek = day;
        this.startTime = start;
        this.endTime = end;
        this.capacity = cap;
        this.currentEnrollment = 0;
    }
    // Since these have logic in the .cpp, we'll declare them here
    // In TS definition files, we just describe the signatures
    addStudent() { }
    removeStudent() { }
    checkCapacity() {
        return false;
    }
    displaySession() { }
}
exports.TutorSession = TutorSession;
