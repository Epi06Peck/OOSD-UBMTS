"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserImpl = void 0;
const UserDef_1 = require("./UserDef");
class UserImpl extends UserDef_1.User {
    constructor(id, name, email, password, role) {
        super(id, name, email, password, role);
    }
    login() {
        console.log(`${this.name} logged in.`);
    }
    logout() {
        console.log(`${this.name} logged out.`);
    }
}
exports.UserImpl = UserImpl;
