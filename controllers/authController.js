const authService = require("../dist/authService");

const registerUser = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authService.loginUser(email, password);

    res.json({
      message: "Login successful",
      user,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  registerUser,
  login,
};
