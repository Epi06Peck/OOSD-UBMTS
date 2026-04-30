const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "ubmts",
  password: "chriscilla06$",
  port: 5432,
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("DB connection failed", err);
  } else {
    console.log("DB connected:", res.rows);
  }
});

module.exports = pool;
module.exports.default = pool;
