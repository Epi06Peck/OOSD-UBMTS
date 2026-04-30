import {
  getSessions,
  registerSession,
  cancelSession,
  getMyEnrollments,
  createSession,
  getTutorSessions,
  deleteSession,
  editSession,
  getRegisteredStudents,
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
    // Fetch all sessions AND student's current enrollments in parallel
    const [sessions, enrolled] = await Promise.all([
      getSessions(),
      getMyEnrollments(user.user_id),
    ]);

    if (sessions.length === 0) {
      content.innerHTML = "<p>No sessions available right now.</p>";
      return;
    }

    // Build a Set of enrolled session IDs for quick lookup
    const enrolledIDs = new Set(enrolled.map((e) => e.session_id));

    content.innerHTML = "";

    sessions.forEach((session) => {
      const isEnrolled = enrolledIDs.has(session.session_id);

      const card = document.createElement("div");
      card.className = "session-card";
      card.id = `card-${session.session_id}`;
      card.innerHTML = `
        <h3>${session.subject || "Session"}</h3>
        <p><strong>Tutor:</strong> ${session.tutor_name || "TBD"}</p>
        <p><strong>Day:</strong> ${session.day_of_week || "TBD"}</p>
        <p><strong>Start:</strong> ${session.start_time || "TBD"}</p>
        <p><strong>End:</strong> ${session.end_time || "TBD"}</p>
        <p><strong>Spots:</strong> <span id="spots-${session.session_id}">${session.current_enrolled ?? 0} / ${session.capacity ?? "?"}</span></p>
        <p><strong>Link:</strong> <a href="${session.meeting_link}" target="_blank">Join Session</a></p>
        <button 
          class="btn-register" 
          id="enroll-${session.session_id}"
          ${isEnrolled ? "disabled" : ""}
          style="${isEnrolled ? "opacity:0.5; cursor:not-allowed; background:#999;" : ""}"
        >
          ${isEnrolled ? "✓ Enrolled" : "Enroll"}
        </button>
        <button 
          class="btn-cancel" 
          id="cancel-${session.session_id}"
          ${!isEnrolled ? "disabled" : ""}
          style="${!isEnrolled ? "opacity:0.5; cursor:not-allowed;" : ""}"
        >
          Cancel
        </button>
      `;

      // ENROLL
      card
        .querySelector(".btn-register")
        .addEventListener("click", async () => {
          const enrollBtn = document.getElementById(
            `enroll-${session.session_id}`,
          );
          const cancelBtn = document.getElementById(
            `cancel-${session.session_id}`,
          );

          enrollBtn.disabled = true;
          enrollBtn.textContent = "Enrolling...";

          const result = await registerSession(
            user.user_id,
            session.session_id,
          );

          if (result.error) {
            alert(result.error);
            enrollBtn.disabled = false;
            enrollBtn.textContent = "Enroll";
            return;
          }

          // Success — gray out enroll, activate cancel, update spots
          enrollBtn.textContent = "✓ Enrolled";
          enrollBtn.style.opacity = "0.5";
          enrollBtn.style.cursor = "not-allowed";

          cancelBtn.disabled = false;
          cancelBtn.style.opacity = "1";
          cancelBtn.style.cursor = "pointer";

          // Update spot count
          const spotsEl = document.getElementById(
            `spots-${session.session_id}`,
          );
          const [cur, cap] = spotsEl.textContent.split(" / ");
          spotsEl.textContent = `${parseInt(cur) + 1} / ${cap}`;
        });

      // CANCEL
      card.querySelector(".btn-cancel").addEventListener("click", async () => {
        const enrollBtn = document.getElementById(
          `enroll-${session.session_id}`,
        );
        const cancelBtn = document.getElementById(
          `cancel-${session.session_id}`,
        );

        if (!confirm("Cancel your enrollment in this session?")) return;

        cancelBtn.disabled = true;
        cancelBtn.textContent = "Cancelling...";

        const result = await cancelSession(user.user_id, session.session_id);

        if (result.error) {
          alert(result.error);
          cancelBtn.disabled = false;
          cancelBtn.textContent = "Cancel";
          return;
        }

        // Success — reactivate enroll, gray out cancel
        enrollBtn.disabled = false;
        enrollBtn.textContent = "Enroll";
        enrollBtn.style.opacity = "1";
        enrollBtn.style.cursor = "pointer";

        cancelBtn.disabled = true;
        cancelBtn.textContent = "Cancel";
        cancelBtn.style.opacity = "0.5";
        cancelBtn.style.cursor = "not-allowed";

        // Update spot count
        const spotsEl = document.getElementById(`spots-${session.session_id}`);
        const [cur, cap] = spotsEl.textContent.split(" / ");
        spotsEl.textContent = `${Math.max(0, parseInt(cur) - 1)} / ${cap}`;
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

    if (!sessions || sessions.length === 0) {
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
    <p><strong>Time:</strong> ${s.start_time} - ${s.end_time}</p>
    <p><strong>Enrolled:</strong> ${s.current_enrolled ?? 0} / ${s.capacity}</p>
    <p><strong>Link:</strong> <a href="${s.meeting_link}" target="_blank">Join Session</a></p>
    <div style="margin-top:8px;">
      <button class="btn-edit"     data-id="${s.session_id}">Edit</button>
      <button class="btn-students" data-id="${s.session_id}">View Students</button>
      <button class="btn-delete"   data-id="${s.session_id}">Delete</button>
    </div>

    <!-- Edit form (hidden by default) -->
    <div class="edit-form" id="edit-${s.session_id}" style="display:none; margin-top:12px;">
      <input type="text"   class="edit-subject"  placeholder="Subject"      value="${s.subject}" />
      <select class="edit-day">
        ${["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
          .map(
            (d) =>
              `<option value="${d}" ${s.day_of_week === d ? "selected" : ""}>${d}</option>`,
          )
          .join("")}
      </select>
      <input type="time" class="edit-start"    value="${s.start_time}" />
      <input type="time" class="edit-end"      value="${s.end_time}" />
      <input type="number" class="edit-capacity" value="${s.capacity}" min="1" />
      <input type="url"  class="edit-link"     value="${s.meeting_link}" />
      <button class="btn-save-edit" data-id="${s.session_id}">Save Changes</button>
      <button class="btn-cancel-edit" data-id="${s.session_id}">Cancel</button>
      <p class="edit-msg" id="edit-msg-${s.session_id}"></p>
    </div>

    <!-- Students list (hidden by default) -->
    <div class="students-list" id="students-${s.session_id}" style="display:none; margin-top:12px;">
      <p>Loading students...</p>
    </div>
  `;

      // EDIT — toggle form
      card.querySelector(".btn-edit").addEventListener("click", () => {
        const form = document.getElementById(`edit-${s.session_id}`);
        form.style.display = form.style.display === "none" ? "block" : "none";
      });

      // CANCEL EDIT — hide form
      card.querySelector(".btn-cancel-edit").addEventListener("click", () => {
        document.getElementById(`edit-${s.session_id}`).style.display = "none";
      });

      // SAVE EDIT
      card
        .querySelector(".btn-save-edit")
        .addEventListener("click", async () => {
          const form = document.getElementById(`edit-${s.session_id}`);
          const updatedData = {
            subject: form.querySelector(".edit-subject").value,
            day_of_week: form.querySelector(".edit-day").value,
            start_time: form.querySelector(".edit-start").value,
            end_time: form.querySelector(".edit-end").value,
            capacity: parseInt(form.querySelector(".edit-capacity").value),
            meeting_link: form.querySelector(".edit-link").value,
          };

          const result = await editSession(s.session_id, updatedData);
          const msg = document.getElementById(`edit-msg-${s.session_id}`);

          if (result.error) {
            msg.style.color = "red";
            msg.textContent = result.error;
          } else {
            msg.style.color = "green";
            msg.textContent = "Session updated!";
            setTimeout(() => {
              form.style.display = "none";
              loadTutorSessionList(tutorID); // refresh list
            }, 1000);
          }
        });

      // VIEW STUDENTS
      card
        .querySelector(".btn-students")
        .addEventListener("click", async () => {
          const div = document.getElementById(`students-${s.session_id}`);

          // Toggle off if already open
          if (div.style.display === "block") {
            div.style.display = "none";
            return;
          }

          div.style.display = "block";
          div.innerHTML = "<p>Loading students...</p>";

          const students = await getRegisteredStudents(s.session_id);

          if (!students.length) {
            div.innerHTML = "<p>No students enrolled yet.</p>";
            return;
          }

          div.innerHTML = `
      <strong>Enrolled Students (${students.length}):</strong>
      <ul style="margin-top:6px;">
        ${students
          .map(
            (st) => `
          <li style="padding:4px 0;">${st.name} — <span style="color:#666;">${st.email}</span></li>
        `,
          )
          .join("")}
      </ul>
    `;
        });

      // DELETE
      card.querySelector(".btn-delete").addEventListener("click", async (e) => {
        if (!confirm("Delete this session?")) return;
        await deleteSession(e.target.dataset.id);
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
