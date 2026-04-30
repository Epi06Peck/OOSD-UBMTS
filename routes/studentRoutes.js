const express = require("express");
const router = express.Router();

const {
  getSessions,
  registerSession,
  cancelSession,
} = require("../controllers/studentController");

router.get("/sessions", getSessions);
router.post("/register", registerSession);
router.post("/cancel", cancelSession);

module.exports = router;
