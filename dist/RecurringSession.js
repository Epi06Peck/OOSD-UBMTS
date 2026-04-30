"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecurringSessionImpl = void 0;
const RecurringSessionDef_1 = require("./RecurringSessionDef");
class RecurringSessionImpl extends RecurringSessionDef_1.RecurringSession {
    constructor(sID, tID, day, start, end, cap, rDay, rFreq) {
        super(sID, tID, day, start, end, cap, rDay, rFreq);
    }
    displaySession() {
        console.log(`Recurring Session every ${this.recurringDay} (${this.recurringFrequency})`);
    }
}
exports.RecurringSessionImpl = RecurringSessionImpl;
