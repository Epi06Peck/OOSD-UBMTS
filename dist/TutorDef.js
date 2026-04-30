"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tutor = void 0;
const UserDef_1 = require("./UserDef");
class Tutor extends UserDef_1.User {
    constructor(id, name, email, password) {
        // Explicitly passing "Tutor" as the role to the User constructor
        super(id, name, email, password, "Tutor");
        this.sessionIDs = [];
    }
}
exports.Tutor = Tutor;
