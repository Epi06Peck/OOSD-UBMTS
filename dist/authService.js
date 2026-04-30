"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const pool = require("../db/dbconnection");
const bcrypt = require("bcrypt");

const register = async (data) => {
  const { name, email, password, role } = data;
  if (!name || !email || !password || !role) throw new Error("Missing fields");

  //hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, role_name) VALUES ($1, $2, $3, $4) RETURNING *`,
    [name, email, hashedPassword, role],
  );
  return { message: "User registered successfully", user: result.rows[0] };
};
// ==========================
// LOGIN
// ==========================
async function loginUser(email, password) {
  // 1. Find user
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = result.rows[0];

  console.log("REQ BODY:", { email, password });
  console.log("DB USER:", user);
  console.log("Stored password:", user.password);

  // 2. Compare password
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Invalid password");
  }

  // 3. Return user (no password)
  return {
    user_id: user.user_id,
    name: user.name,
    email: user.email,
    role: user.role_name,
  };
}

module.exports = {
  register,
  loginUser,
};
