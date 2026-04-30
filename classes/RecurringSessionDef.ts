import { TutorSession } from "./TutorSessionDef";

export abstract class RecurringSession extends TutorSession {
  protected recurringDay: string;
  protected recurringFrequency: string;

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
    // Pass base arguments to the TutorSession constructor
    super(sID, tID, day, start, end, cap);
    this.recurringDay = rDay;
    this.recurringFrequency = rFreq;
  }

  // Explicitly marking that we will override this method
  abstract displaySession(): void;
}
