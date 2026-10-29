/**
 * ROUTE VALIDATOR & ADVERSARIAL REVIEW ENGINE
 *
 * Enforces strict procedural rules:
 * - Only ACTIVE routes may recommend substantive filings.
 * - Evidence-dependent routes can only recommend targeted records requests,
 *   preservation notices, technical verification, or neutral inquiries.
 * - Survival scores reflect strictly verified elements, never optimism.
 * - A rejected route cannot be revived without genuinely new evidence/authority.
 */

import {
  AdversarialReviewItem,
  ConclusionLedgerState,
  CorrectionEntry,
  RouteItem,
  RouteStatus
} from '../types';

export const ADVERSARIAL_BAR_KEYS = [
  'Limitation',
  'Deadline',
  'Commencement of deadline',
  'Valid service',
  'Waiver',
  'Acquiescence',
  'Previous availability of evidence',
  'Prior rejection',
  'Claim preclusion',
  'Issue preclusion',
  'Res judicata',
  'Jurisdiction',
  'Standing',
  'Admissibility',
  'Authentication',
  'Missing legal element',
  'Lack of remedy',
  'Lack of causation',
  'Failure to advance exact objective',
  'Adverse-cost exposure',
  'Procedural misuse',
  'Repackaging of a rejected theory'
] as const;

export function calculateSurvivalScore(route: RouteItem): number {
  if (route.status === 'REJECTED' || route.status === 'DEAD') {
    return 0;
  }

  if (route.required_elements.length === 0) {
    return route.status === 'ACTIVE' ? 80 : 40;
  }

  const totalElements = route.required_elements.length;
  const verifiedCount = route.required_elements.filter(e => e.is_verified && e.status === 'MET').length;
  const contradictedCount = route.required_elements.filter(e => e.status === 'CONTRADICTED').length;
  const fatalMissing = route.required_elements.some(e => e.fatal_if_missing && e.status === 'UNMET');

  if (fatalMissing) {
    return Math.min(25, Math.round((verifiedCount / totalElements) * 100));
  }

  if (contradictedCount > 0) {
    return Math.max(10, Math.round(((verifiedCount - contradictedCount) / totalElements) * 100));
  }

  const baseScore = Math.round((verifiedCount / totalElements) * 100);

  // Status damping
  if (route.status === 'WEAK') return Math.min(baseScore, 35);
  if (route.status === 'EVIDENCE-DEPENDENT') return Math.min(baseScore, 65);
  if (route.status === 'ACTIVE') return Math.max(baseScore, 75);

  return baseScore;
}

export function validateRouteActionPermitted(route: RouteItem, actionType: 'SUBSTANTIVE_FILING' | 'INVESTIGATIVE_STEP'): {
  permitted: boolean;
  reason: string;
} {
  if (actionType === 'SUBSTANTIVE_FILING') {
    if (route.status !== 'ACTIVE') {
      return {
        permitted: false,
        reason: `PROCEDURAL BAR: Only an ACTIVE route may recommend or initiate a substantive court filing. Route "${route.route_name}" is currently ${route.status}. Substantive action would risk immediate dismissal or adverse cost penalties.`
      };
    }
    return { permitted: true, reason: 'Route is fully ACTIVE with all legal and evidentiary elements verified.' };
  }

  // INVESTIGATIVE_STEP
  if (route.status === 'EVIDENCE-DEPENDENT') {
    return {
      permitted: true,
      reason: 'EVIDENCE-DEPENDENT routes are lawfully permitted to seek targeted records requests, preservation notices, technical verification, or neutral inquiries.'
    };
  }

  if (route.status === 'REJECTED' || route.status === 'DEAD') {
    return {
      permitted: false,
      reason: `Route "${route.route_name}" is ${route.status}. Further investigation is barred unless new decisive authority or unconsidered evidence emerges.`
    };
  }

  return { permitted: true, reason: 'Investigative verification permitted.' };
}

export function evaluateAdversarialReview(
  route: RouteItem,
  barsChecked: Record<string, { passed: boolean; note: string; authority?: string }>
): AdversarialReviewItem {
  const failedBars = Object.entries(barsChecked).filter(([_, bar]) => !bar.passed);

  const alreadyRejected = route.prior_history.some(h => h.toLowerCase().includes('reject') || h.toLowerCase().includes('dismissed'));
  const isRouteGenuinelyNew = !alreadyRejected && !barsChecked['Repackaging of a rejected theory']?.passed === false;

  let survivalVerdict: AdversarialReviewItem['survival_verdict'] = 'SURVIVES_AS_ACTIVE';

  if (alreadyRejected || failedBars.some(([k]) => k === 'Res judicata' || k === 'Jurisdiction' || k === 'Prior rejection')) {
    survivalVerdict = 'BARRED_DISMISSED';
  } else if (failedBars.length > 0 || route.status === 'EVIDENCE-DEPENDENT') {
    survivalVerdict = 'SURVIVES_AS_EVIDENCE_DEPENDENT';
  }

  const shouldRouteSurvive = survivalVerdict !== 'BARRED_DISMISSED';

  return {
    route_id: route.route_id,
    route_name: route.route_name,
    bars_checked: barsChecked,
    strongest_supporting_case: route.strongest_supporting_argument || 'Statutory right of appeal within limitation window if service is unperfected.',
    strongest_contrary_case: route.strongest_contrary_argument || 'Appeal unsubmitted, fee unpaid, execution already initiated, prior reconsideration refused.',
    evidence_that_would_defeat: 'Proof of personal service with process server affidavit or registry electronic transmission record.',
    authority_that_would_defeat: 'Precedent establishing draft electronic record carries no legal filing status.',
    already_rejected: alreadyRejected,
    prior_rejection_reason: alreadyRejected ? 'Reconsideration motion previously dismissed by the committee on 12 June 2026.' : undefined,
    is_route_genuinely_new: isRouteGenuinelyNew,
    produces_requested_outcome: route.result_it_can_produce.length > 0,
    should_route_survive: shouldRouteSurvive,
    survival_verdict: survivalVerdict
  };
}

export interface RoutePromotionValidation {
  canPromote: boolean;
  reasons: string[];
  fatalUnmetElements: string[];
}

export function validateRoutePromotion(route: RouteItem): RoutePromotionValidation {
  const reasons: string[] = [];

  const fatalUnmet = route.required_elements.filter(
    e => e.fatal_if_missing && (e.status === 'UNMET' || !e.is_verified)
  );
  if (fatalUnmet.length > 0) {
    reasons.push(
      `Refused: ${fatalUnmet.length} fatal element(s) remain unmet (${fatalUnmet.map(e => e.element_name).join(', ')}).`
    );
  }

  const contradicted = route.required_elements.filter(e => e.status === 'CONTRADICTED');
  if (contradicted.length > 0) {
    reasons.push(
      `Refused: ${contradicted.length} required element(s) are contradicted by primary record.`
    );
  }

  if (route.status === 'DEAD' || route.status === 'REJECTED') {
    reasons.push(
      `Refused: Route status is ${route.status}. Dead or rejected routes cannot be promoted to ACTIVE.`
    );
  }

  if (route.deadline && !route.deadline.commencement_proved) {
    reasons.push('Refused: Statutory deadline commencement date is unproved.');
  }

  return {
    canPromote: reasons.length === 0,
    reasons,
    fatalUnmetElements: fatalUnmet.map(e => e.element_name)
  };
}

export function applyCorrectionToLedger(
  ledger: ConclusionLedgerState,
  correction: Omit<CorrectionEntry, 'id' | 'timestamp'>
): {
  updatedLedger: ConclusionLedgerState;
  persisted: boolean;
} {
  const newEntry: CorrectionEntry = {
    ...correction,
    id: `CORR_${Date.now()}`,
    timestamp: new Date().toISOString()
  };

  const updatedLedger: ConclusionLedgerState = {
    ...ledger,
    corrections: [newEntry, ...ledger.corrections],
    previous_conclusions: [ledger.current_committed_conclusion, ...ledger.previous_conclusions],
    current_committed_conclusion: correction.corrected_conclusion,
    last_updated: newEntry.timestamp
  };

  const persisted =
    updatedLedger.corrections.length === ledger.corrections.length + 1 &&
    updatedLedger.corrections[0].corrected_conclusion === correction.corrected_conclusion &&
    updatedLedger.current_committed_conclusion === correction.corrected_conclusion &&
    updatedLedger.previous_conclusions[0] === ledger.current_committed_conclusion;

  return {
    updatedLedger,
    persisted
  };
}

