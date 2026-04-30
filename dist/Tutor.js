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
    console.log(`Tutor ${this.userID} created session ${sessionID}`);
  }

  editSession(sessionID) {
    // In-memory tracking only — DB logic lives in TutorSessionImpl
    console.log(`Tutor ${this.userID} editing session ${sessionID}`);
  }

  viewRegisteredStudents(sessionID) {
    // In-memory tracking only — DB logic lives in TutorSessionImpl
    console.log(
      `Tutor ${this.userID} viewing students for session ${sessionID}`,
    );
  }

  dashboard() {
    console.log("Tutor Dashboard:");
    console.log("- Create sessions");
    console.log("- Edit sessions");
    console.log("- View registered students");
  }
}

exports.TutorImpl = TutorImpl;
