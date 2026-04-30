import { Student } from "./StudentDef";

export class StudentImpl extends Student {
  constructor(id: number, name: string, email: string, password: string) {
    super(id, name, email, password);
  }

  registerForSession(sessionID: number): void {
    this.registeredSessions.push(sessionID);
    console.log(`Registered for session ${sessionID}`);
  }

  cancelSession(sessionID: number): void {
    const initialLength = this.registeredSessions.length;
    // Replaces the C++ iterator/erase logic
    this.registeredSessions = this.registeredSessions.filter(
      (id) => id !== sessionID,
    );

    if (this.registeredSessions.length < initialLength) {
      console.log(`Cancelled session ${sessionID}`);
    }
  }

  viewSessions(): void {
    console.log("Enrolled Sessions: " + this.registeredSessions.join(" "));
  }

  dashboard(): void {
    console.log("Student Dashboard:");
    console.log("- View enrolled sessions");
    console.log("- Register for sessions");
  }

  // Inherited login/logout logic would come from UserImpl
  // if we were chaining implementations, but for now we'll
  // focus on the Student-specific logic.
}
