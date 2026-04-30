"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = void 0;
const UserDef_1 = require("./UserDef");
class Student extends UserDef_1.User {
    constructor(id, name, email, password) {
        // C++ passes "Student" as the role to the base constructor
        super(id, name, email, password, "Student");
        this.registeredSessions = [];
    }
}
exports.Student = Student;
