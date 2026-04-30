"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentImpl = void 0;
const StudentDef_1 = require("./StudentDef");
class StudentImpl extends StudentDef_1.Student {
    constructor(id, name, email, password) {
        super(id, name, email, password);
    }
    registerForSession(sessionID) {
        this.registeredSessions.push(sessionID);
        console.log(`Registered for session ${sessionID}`);
    }
    cancelSession(sessionID) {
        const initialLength = this.registeredSessions.length;
        // Replaces the C++ iterator/erase logic
        this.registeredSessions = this.registeredSessions.filter((id) => id !== sessionID);
        if (this.registeredSessions.length < initialLength) {
            console.log(`Cancelled session ${sessionID}`);
        }
    }
    viewSessions() {
        console.log("Enrolled Sessions: " + this.registeredSessions.join(" "));
    }
    dashboard() {
        console.log("Student Dashboard:");
        console.log("- View enrolled sessions");
        console.log("- Register for sessions");
    }
}
exports.StudentImpl = StudentImpl;
