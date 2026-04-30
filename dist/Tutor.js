"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorImpl = void 0;
const TutorDef_1 = require("./TutorDef");
class TutorImpl extends TutorDef_1.Tutor {
    constructor(id, name, email, password) {
        super(id, name, email, password);
    }
    createSession(sessionID) {
        this.sessionIDs.push(sessionID);
        console.log(`Created session ${sessionID}`);
    }
    editSession(sessionID) {
        console.log(`Editing session ${sessionID}`);
    }
    viewRegisteredStudents(sessionID) {
        console.log(`Viewing students for session ${sessionID}`);
    }
    dashboard() {
        console.log("Tutor Dashboard:");
        console.log("- Create sessions");
        console.log("- Edit sessions");
        console.log("- View registered students");
    }
}
exports.TutorImpl = TutorImpl;
