"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(id, name, email, password, role) {
        this.userID = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }
    // Provide default behavior
    login() {
        console.log(`${this.name} logged in`);
    }
    logout() {
        console.log(`${this.name} logged out`);
    }
}
exports.User = User;
