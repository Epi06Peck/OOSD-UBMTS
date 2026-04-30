import { TutorSession } from "./TutorSessionDef";

export class TutorSessionImpl extends TutorSession {
  constructor(
    sID: number,
    tID: number,
    day: string,
    start: string,
    end: string,
    cap: number,
  ) {
    super(sID, tID, day, start, end, cap);
  }

  addStudent(): void {
    if (this.checkCapacity()) {
      this.currentEnrollment++;
      console.log(`Student added. Current: ${this.currentEnrollment}`);
    } else {
      console.log("Session is full.");
    }
  }

  removeStudent(): void {
    if (this.currentEnrollment > 0) {
      this.currentEnrollment--;
      console.log(`Student removed. Current: ${this.currentEnrollment}`);
    }
  }

  checkCapacity(): boolean {
    return this.currentEnrollment < this.capacity;
  }

  displaySession(): void {
    console.log(`Session ${this.sessionID} on ${this.dayOfWeek}`);
  }
}
