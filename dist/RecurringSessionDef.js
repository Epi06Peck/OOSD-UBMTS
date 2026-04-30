"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecurringSession = void 0;
const TutorSessionDef_1 = require("./TutorSessionDef");
class RecurringSession extends TutorSessionDef_1.TutorSession {
    constructor(sID, tID, day, start, end, cap, rDay, rFreq) {
        // Pass base arguments to the TutorSession constructor
        super(sID, tID, day, start, end, cap);
        this.recurringDay = rDay;
        this.recurringFrequency = rFreq;
    }
}
exports.RecurringSession = RecurringSession;
