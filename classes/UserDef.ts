export abstract class User {
  protected userID: number;
  protected name: string;
  protected email: string;
  protected password: string;
  protected role: string;

  constructor(
    id: number,
    name: string,
    email: string,
    password: string,
    role: string,
  ) {
    this.userID = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  // Pure virtual equivalent: Abstract method (must be implemented by subclasses)
  abstract dashboard(): void;

  // Provide default behavior
  login(): void {
    console.log(`${this.name} logged in`);
  }

  logout(): void {
    console.log(`${this.name} logged out`);
  }
}
