console.log("Register JS loaded");
document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    // UB email check
    if (!email.endsWith("@ub.edu.bz")) {
      return alert("Must use UB email");
    }

    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registered successfully");
      window.location.href = "index.html";
    } else {
      alert(data.error);
    }
  });
