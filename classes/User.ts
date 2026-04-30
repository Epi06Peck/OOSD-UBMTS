import { User } from "./UserDef";

export abstract class UserImpl extends User {
  constructor(
    id: number,
    name: string,
    email: string,
    password: string,
    role: string,
  ) {
    super(id, name, email, password, role);
  }

  login(): void {
    console.log(`${this.name} logged in.`);
  }

  logout(): void {
    console.log(`${this.name} logged out.`);
  }

  // Note: dashboard() remains unimplemented here
  // because UserImpl is still abstract.
}
