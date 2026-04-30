import { Tutor } from "./TutorDef";

export class TutorImpl extends Tutor {
  constructor(id: number, name: string, email: string, password: string) {
    super(id, name, email, password);
  }

  createSession(sessionID: number): void {
    this.sessionIDs.push(sessionID);
    console.log(`Created session ${sessionID}`);
  }

  editSession(sessionID: number): void {
    console.log(`Editing session ${sessionID}`);
  }

  viewRegisteredStudents(sessionID: number): void {
    console.log(`Viewing students for session ${sessionID}`);
  }

  dashboard(): void {
    console.log("Tutor Dashboard:");
    console.log("- Create sessions");
    console.log("- Edit sessions");
    console.log("- View registered students");
  }
}
