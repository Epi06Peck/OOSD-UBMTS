import { User } from "./UserDef";

export abstract class Student extends User {
  protected registeredSessions: number[];

  constructor(id: number, name: string, email: string, password: string) {
    // C++ passes "Student" as the role to the base constructor
    super(id, name, email, password, "Student");
    this.registeredSessions = [];
  }

  abstract registerForSession(sessionID: number): void;
  abstract cancelSession(sessionID: number): void;
  abstract viewSessions(): void;

  // Implementation of the pure virtual method from User
  abstract dashboard(): void;
}
