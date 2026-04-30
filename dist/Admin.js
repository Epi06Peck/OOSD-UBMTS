"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminImpl = void 0;
const AdminDef_1 = require("./AdminDef");
class AdminImpl extends AdminDef_1.Admin {
    constructor(id, name, email, password) {
        super(id, name, email, password);
    }
    deleteTutorSession(sessionID) {
        console.log(`Deleted session ${sessionID}`);
    }
    removeTutor(tutorID) {
        console.log(`Removed tutor ${tutorID}`);
    }
    approveTutor(tutorID) {
        console.log(`Approved tutor ${tutorID}`);
    }
    dashboard() {
        console.log("Admin Dashboard:");
        console.log("- Approve tutors");
        console.log("- Delete sessions");
        console.log("- Remove tutors");
    }
}
exports.AdminImpl = AdminImpl;
