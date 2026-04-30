import {
  getSessions,
  registerSession,
  cancelSession,
  createSession,
  getTutorSessions,
  deleteSession,
} from "./ubmtApi.js";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const role = params.get("role");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!role || !user) {
    window.location.href = "index.html";
    return;
  }

  // Show welcome message
  document.getElementById("welcome").innerText = `Welcome, ${user.name}`;

  if (role === "student") {
    loadStudentUI(user);
  } else if (role === "tutor") {
    loadTutorUI(user);
  } else if (role === "admin") {
    loadAdminUI(user);
  }
});

// ==========================
//  STUDENT DASHBOARD
// ==========================
async function loadStudentUI(user) {
  const view = document.getElementById("studentView");
  view.style.display = "block";

  const content = document.getElementById("sessions");
  content.innerHTML = "<p>Loading sessions...</p>";

  try {
    const sessions = await getSessions();

    if (sessions.length === 0) {
      content.innerHTML = "<p>No sessions available right now.</p>";
      return;
    }

    content.innerHTML = "";

    sessions.forEach((session) => {
      const card = document.createElement("div");
      card.className = "session-card";
      card.innerHTML = `
        <h3>${session.title || session.subject || "Session"}</h3>
        <p><strong>Day:</strong> ${session.day_of_week || "TBD"}</p>
        <p><strong>Time:</strong> ${session.start_time || "TBD"}</p>
        <p><strong>Spots:</strong> ${session.current_enrolled ?? 0} / ${session.capacity ?? "?"}</p>
        <button class="btn-register">Enroll</button>
        <button class="btn-cancel">Cancel</button>
      `;

      card
        .querySelector(".btn-register")
        .addEventListener("click", async () => {
          const result = await registerSession(user.user_id, session.id);
          alert(result.message || "Enrolled!");
        });

      card.querySelector(".btn-cancel").addEventListener("click", async () => {
        const result = await cancelSession(user.user_id, session.id);
        alert(result.message || "Cancelled!");
      });

      content.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    content.innerHTML = "<p>Error loading sessions. Please try again.</p>";
  }
}

// ==========================
//  TUTOR DASHBOARD
// ==========================
async function loadTutorUI(user) {
  const view = document.getElementById("tutorView");
  view.style.display = "block";

  const content = document.getElementById("tutorActions");

  content.innerHTML = `
  <section>
    <h3>Create a New Session</h3>
    <form id="createSessionForm">
      <input type="text" id="subject" placeholder="Subject" required />

      <select id="dayOfWeek">
        <option value="Monday">Monday</option>
        <option value="Tuesday">Tuesday</option>
        <option value="Wednesday">Wednesday</option>
        <option value="Thursday">Thursday</option>
        <option value="Friday">Friday</option>
      </select>

      <label>Start Time</label>
      <input type="time" id="startTime" required />

      <label>End Time</label>
      <input type="time" id="endTime" required />

      <input
        type="number"
        id="capacity"
        placeholder="Max students"
        min="1"
        required
      />

      <input
        type="url"
        id="meetingLink"
        placeholder="Meeting Link"
        required
      />

      <button type="submit">Publish Session</button>
    </form>

    <p id="sessionMsg"></p>
  </section>

  <section>
    <h3>Your Sessions</h3>
    <div id="tutorSessionList"><p>Loading...</p></div>
  </section>
`;

  // Load existing sessions
  await loadTutorSessionList(user.user_id);

  // Handle create form
  document
    .getElementById("createSessionForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const sessionData = {
        tutor_id: user.user_id,
        subject: document.getElementById("subject").value,
        day_of_week: document.getElementById("dayOfWeek").value,
        start_time: document.getElementById("startTime").value,
        end_time: document.getElementById("endTime").value,
        capacity: parseInt(document.getElementById("capacity").value),
        meeting_link: document.getElementById("meetingLink").value,
      };

      try {
        const result = await createSession(sessionData);
        document.getElementById("sessionMsg").innerText =
          result.message || "Session created!";
        e.target.reset();
        await loadTutorSessionList(user.user_id);
      } catch (err) {
        document.getElementById("sessionMsg").innerText =
          "Failed to create session.";
      }
    });
}

async function loadTutorSessionList(tutorID) {
  const list = document.getElementById("tutorSessionList");
  try {
    const sessions = await getTutorSessions(tutorID);

    if (!sessions.length) {
      list.innerHTML = "<p>You haven't created any sessions yet.</p>";
      return;
    }

    list.innerHTML = "";
    sessions.forEach((s) => {
      const card = document.createElement("div");
      card.className = "session-card";
      card.innerHTML = `
        <h3>${s.subject}</h3>
        <p><strong>Day:</strong> ${s.day_of_week}</p>
        <p><strong>Time:</strong> ${s.start_time}</p>
        <p><strong>Enrolled:</strong> ${s.current_enrolled ?? 0} / ${s.capacity}</p>
        <button class="btn-delete" data-id="${s.session_id}">Delete Session</button>
      `;
      card.querySelector(".btn-delete").addEventListener("click", async (e) => {
        if (!confirm("Delete this session?")) return;
        const sid = e.target.dataset.id;
        await deleteSession(sid);
        await loadTutorSessionList(tutorID);
      });
      list.appendChild(card);
    });
  } catch (err) {
    list.innerHTML = "<p>Error loading your sessions.</p>";
  }
}

// ==========================
//  ADMIN DASHBOARD
// ==========================
async function loadAdminUI(user) {
  const view = document.getElementById("adminView");
  view.style.display = "block";

  const content = document.getElementById("adminActions");

  content.innerHTML = `
    <section>
      <h3>Pending Tutor Approvals</h3>
      <div id="pendingTutors"><p>Loading...</p></div>
    </section>
    <section>
      <h3>All Sessions</h3>
      <div id="allSessions"><p>Loading...</p></div>
    </section>
  `;

  // Load pending tutors
  try {
    const res = await fetch("http://localhost:3000/api/admin/pending-tutors");
    const tutors = await res.json();
    const pendingDiv = document.getElementById("pendingTutors");

    if (!tutors.length) {
      pendingDiv.innerHTML = "<p>No pending tutor requests.</p>";
    } else {
      pendingDiv.innerHTML = "";
      tutors.forEach((t) => {
        const card = document.createElement("div");
        card.className = "session-card";
        card.innerHTML = `
          <p><strong>${t.name}</strong> — ${t.email}</p>
          <button class="btn-approve" data-id="${t.user_id}">Approve</button>
          <button class="btn-remove"  data-id="${t.user_id}">Remove</button>
        `;
        card
          .querySelector(".btn-approve")
          .addEventListener("click", async (e) => {
            await fetch(
              `http://localhost:3000/api/admin/approve-tutor/${e.target.dataset.id}`,
              { method: "PUT" },
            );
            alert("Tutor approved!");
            loadAdminUI(user);
          });
        card
          .querySelector(".btn-remove")
          .addEventListener("click", async (e) => {
            if (!confirm("Remove this tutor?")) return;
            await fetch(
              `http://localhost:3000/api/admin/remove-tutor/${e.target.dataset.id}`,
              { method: "DELETE" },
            );
            alert("Tutor removed.");
            loadAdminUI(user);
          });
        pendingDiv.appendChild(card);
      });
    }
  } catch (err) {
    document.getElementById("pendingTutors").innerHTML =
      "<p>Could not load tutors.</p>";
  }

  // Load all sessions
  try {
    const sessions = await getSessions();
    const sessDiv = document.getElementById("allSessions");

    if (!sessions.length) {
      sessDiv.innerHTML = "<p>No sessions in the system.</p>";
    } else {
      sessDiv.innerHTML = "";
      sessions.forEach((s) => {
        const card = document.createElement("div");
        card.className = "session-card";
        card.innerHTML = `
          <h3>${s.subject || s.title}</h3>
          <p><strong>Day:</strong> ${s.day_of_week || "TBD"}</p>
          <p><strong>Enrolled:</strong> ${s.current_enrolled ?? 0} / ${s.capacity ?? "?"}</p>
          <button class="btn-delete-admin" data-id="${s.session_id || s.id}">Delete Session</button>
        `;
        card
          .querySelector(".btn-delete-admin")
          .addEventListener("click", async (e) => {
            if (!confirm("Delete this session?")) return;
            await fetch(
              `http://localhost:3000/api/admin/sessions/${e.target.dataset.id}`,
              { method: "DELETE" },
            );
            loadAdminUI(user);
          });
        sessDiv.appendChild(card);
      });
    }
  } catch (err) {
    document.getElementById("allSessions").innerHTML =
      "<p>Could not load sessions.</p>";
  }
}
