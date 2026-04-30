console.log("LOGIN JS LOADED");

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    //send login request
    console.log("Sending login request ...");

    const data = await res.json();
    console.log("Response:", data); // check if we do get anything

    if (!res.ok) {
      alert(data.error || "Login failed");
      return;
    }

    // Store user (simple session handling)
    localStorage.setItem("user", JSON.stringify(data.user));

    // Redirect based on role
    const role = data.user.role.toLowerCase();

    window.location.href = `dashboard.html?role=${role}`;
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
});
