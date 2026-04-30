import { User } from "./UserDef";

export abstract class Admin extends User {
  constructor(id: number, name: string, email: string, password: string) {
    // Hardcoding the "Admin" role for the base class constructor
    super(id, name, email, password, "Admin");
  }

  abstract deleteTutorSession(sessionID: number): void;
  abstract removeTutor(tutorID: number): void;
  abstract approveTutor(tutorID: number): void;

  // Implementation of the pure virtual method from User
  abstract dashboard(): void;
}
