const BASE = "http://localhost:3000/api";

// ==========================
// GET ALL SESSIONS
// ==========================
export async function getSessions() {
  const res = await fetch(`${BASE}/student/sessions`);
  return res.json();
}

// ==========================
// REGISTER FOR SESSION
// ==========================
export async function registerSession(studentID, sessionID) {
  const res = await fetch(`${BASE}/student/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentID, sessionID }),
  });
  return res.json();
}

// ==========================
// get enrollments
// ==========================
export async function getMyEnrollments(studentID) {
  const res = await fetch(`${BASE}/student/enrollments/${studentID}`);
  return res.json();
}

// ==========================
// CANCEL SESSION
// ==========================
export async function cancelSession(studentID, sessionID) {
  const res = await fetch(`${BASE}/student/cancel`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentID, sessionID }),
  });
  return res.json();
}

// ==========================
// TUTOR: CREATE SESSION
// ==========================
export async function createSession(sessionData) {
  const res = await fetch(`${BASE}/tutor/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sessionData),
  });
  return res.json();
}

// ==========================
// TUTOR: GET MY SESSIONS
// ==========================
export async function getTutorSessions(tutorID) {
  const res = await fetch(`${BASE}/tutor/sessions/${tutorID}`);
  const data = await res.json();
  console.log("API response:", data);
  return data;
}

// ==========================
// TUTOR: DELETE SESSION
// ==========================
export async function deleteSession(sessionID) {
  const res = await fetch(`${BASE}/tutor/sessions/${sessionID}`, {
    method: "DELETE",
  });
  return res.json();
}
