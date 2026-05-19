const { AdminImpl } = require("../dist/Admin");

// ==========================
// GET PENDING TUTORS
// ==========================
const getPendingTutors = async (req, res) => {
  try {
    const admin = new AdminImpl(1, "Admin", "admin@example.com", "x");

    const result = await admin.getPendingTutors();

    res.status(200).json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// APPROVE TUTOR
// ==========================
const approveTutor = async (req, res) => {
  try {
    const admin = new AdminImpl(1, "Admin", "admin@example.com", "x");

    const tutorID = parseInt(req.params.tutorID, 10);
    const message = await admin.approveTutor(tutorID);

    res.json({ success: true, message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// REMOVE TUTOR
// ==========================
const removeTutor = async (req, res) => {
  try {
    const admin = new AdminImpl(1, "Admin", "admin@example.com", "x");

    const tutorID = parseInt(req.params.tutorID, 10);
    const message = await admin.removeTutor(tutorID);

    res.json({ success: true, message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// DELETE SESSION
// ==========================
const deleteTutorSession = async (req, res) => {
  try {
    const admin = new AdminImpl(1, "Admin", "admin@example.com", "x");

    const sessionID = parseInt(req.params.sessionID, 10);
    const message = await admin.deleteTutorSession(sessionID);

    res.json({ success: true, message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// DASHBOARD
// ==========================
const dashboard = async (req, res) => {
  try {
    const admin = new AdminImpl(1, "Admin", "admin@example.com", "x");

    res.json(admin.dashboard());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getPendingTutors,
  approveTutor,
  removeTutor,
  deleteTutorSession,
  dashboard,
};
