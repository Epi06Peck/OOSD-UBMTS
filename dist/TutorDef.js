"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tutor = void 0;
const UserDef_1 = require("./UserDef");

class Tutor extends UserDef_1.User {
  constructor(id, name, email, password) {
    super(id, name, email, password, "Tutor");
    this.sessionIDs = [];
  }

  // In-memory method signatures only
  createSession(sessionID) {}
  editSession(sessionID) {}
  viewRegisteredStudents(sessionID) {}
  dashboard() {}
}

exports.Tutor = Tutor;
