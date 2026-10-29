/**
 * CHRONOLOGY & DATE ENGINE
 *
 * Strictly enforces date separation. Never merges save dates with filing dates,
 * service dates with knowledge dates, or preparation numbers with case numbers.
 * Warns whenever a deadline is computed using an unproved date.
 */

import { ChronologyEvent, DateType } from '../types';

export interface DeadlineCalculationWarning {
  eventId: string;
  dateType: DateType;
  message: string;
  isFatal: boolean;
}

export function auditChronologyEvents(events: ChronologyEvent[]): {
  warnings: DeadlineCalculationWarning[];
  unprovedDatesCount: number;
  sortedEvents: ChronologyEvent[];
} {
  const warnings: DeadlineCalculationWarning[] = [];
  let unprovedDatesCount = 0;

  for (const event of events) {
    if (!event.is_date_proved) {
      unprovedDatesCount++;
      if (event.deadline_effect && event.deadline_effect.trim() !== '' && event.deadline_effect !== 'None') {
        const dateDisplay = event.date_and_time === 'UNKNOWN' ? 'UNKNOWN' : event.date_and_time;
        warnings.push({
          eventId: event.event_id,
          dateType: event.date_type,
          message: `UNPROVED DEADLINE COMMENCEMENT WARNING: Deadline effect "${event.deadline_effect}" is linked to an unproved date (${event.date_type}: ${dateDisplay}). A procedural deadline calculated from an unestablished date cannot be relied upon in court.`,
          isFatal: true
        });
      }
    }

    // Specific electronic filing date-conflation checks
    if (event.date_type === 'Save date') {
      const desc = event.event_description.toLowerCase();
      if (desc.includes('appeal filed') || desc.includes('registered') || desc.includes('submitted')) {
        warnings.push({
          eventId: event.event_id,
          dateType: event.date_type,
          message: `DATE CONFLATION HAZARD: Event describes save date as "filing" or "submission". A draft save does not constitute legal filing.`,
          isFatal: true
        });
      }
    }

    if (event.date_type === 'Knowledge date') {
      const desc = event.event_description.toLowerCase();
      if (desc.includes('served') || desc.includes('service perfected')) {
        warnings.push({
          eventId: event.event_id,
          dateType: event.date_type,
          message: `SERVICE CONFLATION HAZARD: Informal knowledge date must not be classified as statutory service without official proof of process service.`,
          isFatal: true
        });
      }
    }
  }

  // Sort events chronologically by timestamp (placing UNKNOWN at its chronological context or end)
  const sorted = [...events].sort((a, b) => {
    const da = new Date(a.date_and_time).getTime();
    const db = new Date(b.date_and_time).getTime();
    const timeA = isNaN(da) ? Infinity : da;
    const timeB = isNaN(db) ? Infinity : db;
    return timeA - timeB;
  });

  return {
    warnings,
    unprovedDatesCount,
    sortedEvents: sorted
  };
}

export function validateElectronicFilingTerms(text: string): {
  isValid: boolean;
  violations: string[];
} {
  const violations: string[] = [];
  const lower = text.toLowerCase();

  if (lower.includes('save date is the filing date') || lower.includes('saved draft counts as filing')) {
    violations.push('Prohibited conflation: Save date is NOT filing date.');
  }
  if (lower.includes('preparation number is the case number') || lower.includes('r-number is registered case')) {
    violations.push('Prohibited conflation: Preparation number (R-number) is NOT a registered court case number.');
  }
  if (lower.includes('failed payment counts as fee paid') || lower.includes('attempted payment discharged fee')) {
    violations.push('Prohibited conflation: Failed payment does NOT satisfy statutory fee requirement.');
  }
  if (lower.includes('knowledge equals formal service') || lower.includes('aware means served')) {
    violations.push('Prohibited conflation: Actual awareness is NOT formal statutory service.');
  }

  return {
    isValid: violations.length === 0,
    violations
  };
}
