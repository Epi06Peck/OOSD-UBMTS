export class TutorSession {
  protected sessionID: number;
  protected tutorID: number;
  protected dayOfWeek: string;
  protected startTime: string;
  protected endTime: string;
  protected capacity: number;
  protected currentEnrollment: number;

  constructor(
    sID: number,
    tID: number,
    day: string,
    start: string,
    end: string,
    cap: number,
  ) {
    this.sessionID = sID;
    this.tutorID = tID;
    this.dayOfWeek = day;
    this.startTime = start;
    this.endTime = end;
    this.capacity = cap;
    this.currentEnrollment = 0;
  }

  // Since these have logic in the .cpp, we'll declare them here
  // In TS definition files, we just describe the signatures
  addStudent(): void {}
  removeStudent(): void {}
  checkCapacity(): boolean {
    return false;
  }
  displaySession(): void {}
}
