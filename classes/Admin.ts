import { Admin } from "./AdminDef";

export class AdminImpl extends Admin {
  constructor(id: number, name: string, email: string, password: string) {
    super(id, name, email, password);
  }

  deleteTutorSession(sessionID: number): void {
    console.log(`Deleted session ${sessionID}`);
  }

  removeTutor(tutorID: number): void {
    console.log(`Removed tutor ${tutorID}`);
  }

  approveTutor(tutorID: number): void {
    console.log(`Approved tutor ${tutorID}`);
  }

  dashboard(): void {
    console.log("Admin Dashboard:");
    console.log("- Approve tutors");
    console.log("- Delete sessions");
    console.log("- Remove tutors");
  }
}
