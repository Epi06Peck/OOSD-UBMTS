const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const tutorRoutes = require("./routes/tutorRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "frontEnd")));

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/tutor", tutorRoutes);

// Default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontEnd", "index.html"));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
