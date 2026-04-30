import { User } from "./UserDef";

export abstract class Tutor extends User {
  protected sessionIDs: number[];

  constructor(id: number, name: string, email: string, password: string) {
    // Explicitly passing "Tutor" as the role to the User constructor
    super(id, name, email, password, "Tutor");
    this.sessionIDs = [];
  }

  abstract createSession(sessionID: number): void;
  abstract editSession(sessionID: number): void;
  abstract viewRegisteredStudents(sessionID: number): void;

  // Implementation of the pure virtual method from User
  abstract dashboard(): void;
}
