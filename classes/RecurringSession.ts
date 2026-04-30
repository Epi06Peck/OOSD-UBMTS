import { RecurringSession } from "./RecurringSessionDef";

export class RecurringSessionImpl extends RecurringSession {
  constructor(
    sID: number,
    tID: number,
    day: string,
    start: string,
    end: string,
    cap: number,
    rDay: string,
    rFreq: string,
  ) {
    super(sID, tID, day, start, end, cap, rDay, rFreq);
  }

  displaySession(): void {
    console.log(
      `Recurring Session every ${this.recurringDay} (${this.recurringFrequency})`,
    );
  }
}
