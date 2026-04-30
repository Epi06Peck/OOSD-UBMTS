"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const UserDef_1 = require("./UserDef");
class Admin extends UserDef_1.User {
    constructor(id, name, email, password) {
        // Hardcoding the "Admin" role for the base class constructor
        super(id, name, email, password, "Admin");
    }
}
exports.Admin = Admin;
