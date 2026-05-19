const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

// dashboard
router.get("/dashboard", adminController.dashboard);

// tutors
router.get("/pending-tutors", adminController.getPendingTutors);
router.put("/approve-tutor/:tutorID", adminController.approveTutor);
router.delete("/remove-tutor/:tutorID", adminController.removeTutor);

// sessions (FIXED PATH)
router.delete("/delete-session/:sessionID", adminController.deleteTutorSession);

module.exports = router;
