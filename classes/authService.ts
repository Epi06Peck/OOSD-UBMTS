type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
};

// Temporary in-memory users (for testing)
let users: User[] = [];
let currentID = 1;

// ==========================
// REGISTER
// ==========================
export const register = async (data: any) => {
  const { name, email, password, role } = data;

  if (!name || !email || !password || !role) {
    throw new Error("Missing fields");
  }

  // Check if user exists
  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const newUser: User = {
    id: currentID++,
    name,
    email,
    password,
    role,
  };

  users.push(newUser);

  return {
    message: "User registered successfully",
    user: newUser,
  };
};

// ==========================
// LOGIN
// ==========================
export const login = async (data: any) => {
  const { email, password } = data;

  const user = users.find((u) => u.email === email);

  if (!user || user.password !== password) {
    throw new Error("Invalid credentials");
  }

  return {
    message: "Login successful",
    user,
  };
};
