/**
 * BOUNDED RESEARCH LOOP ENGINE
 *
 * Implements a strictly controlled, cycle-limited research orchestration.
 * Halts upon saturation (e.g. 2 cycles with no material change), budget limit,
 * decisive bar on all routes, or one active surviving route.
 * Prevents infinite loops and empty re-queries.
 */

import { ResearchCycleRecord } from '../types';

export interface LoopExecutionParams {
  maxCycles: 2 | 5 | 10;
  currentCycle: number;
  history: ResearchCycleRecord[];
  activeRouteExists: boolean;
  allRoutesBarred: boolean;
  missingFactRequiresExternalParty: boolean;
  userRequestedStop: boolean;
}

export interface LoopDecision {
  shouldContinue: boolean;
  stopReason?: string;
  nextCycleProposal?: {
    reason_for_next_cycle: string;
    specific_missing_element: string;
    new_query_plan: string[];
    expected_decision_value: string;
    duplicate_of_prior_search: boolean;
  };
}

export function evaluateResearchLoopContinuation(params: LoopExecutionParams): LoopDecision {
  if (params.userRequestedStop) {
    return {
      shouldContinue: false,
      stopReason: 'STOP CONDITION MET: Research loop terminated by explicit user command.'
    };
  }

  if (params.activeRouteExists) {
    return {
      shouldContinue: false,
      stopReason: 'TERMINATION TARGET MET: One complete ACTIVE route has survived hostile adversarial review. Further open-ended research is stopped to prevent speculative drift.'
    };
  }

  if (params.allRoutesBarred) {
    return {
      shouldContinue: false,
      stopReason: 'DECISIVE BAR ENCOUNTERED: Every evaluated procedural route faces a fatal jurisdictional, statutory, or limitation bar. No currently supportable route was found.'
    };
  }

  if (params.missingFactRequiresExternalParty) {
    return {
      shouldContinue: false,
      stopReason: 'BOUNDED PAUSE: The decisive missing fact (formal service docket confirmation) can only be provided by the court registry or executing bailiff. Public research cannot fabricate official registry records.'
    };
  }

  if (params.currentCycle >= params.maxCycles) {
    return {
      shouldContinue: false,
      stopReason: `BUDGET REACHED: Maximum configured cycle limit (${params.maxCycles} cycles) reached without discovering decisive new authority.`
    };
  }

  // Saturation check: 2 consecutive cycles with no material change
  if (params.history.length >= 2) {
    const lastTwo = params.history.slice(-2);
    if (!lastTwo[0].material_change_occurred && !lastTwo[1].material_change_occurred) {
      return {
        shouldContinue: false,
        stopReason: 'SATURATION DETECTED: Two consecutive research cycles produced no materially new authority or evidence. Repeated searches producing no new information cannot increase confidence.'
      };
    }
  }

  // Propose next cycle parameters
  const nextCycleNum = params.currentCycle + 1;
  return {
    shouldContinue: true,
    nextCycleProposal: {
      reason_for_next_cycle: `Examine specialized judicial precedents regarding electronic filing portal timeouts and fee gateway reconciliation (Cycle ${nextCycleNum}).`,
      specific_missing_element: 'Statutory rule or precedent regarding whether draft timestamp preserves limitation when fee gateway fails.',
      new_query_plan: [
        'Bahrain Court of Cassation electronic filing failure force majeure precedents',
        'Ministry of Justice electronic portal decree No. 27/2021 technical failure provisions',
        'Rental disputes committee appeal window commencement under Article 28'
      ],
      expected_decision_value: 'Determines whether Electronic Appeal (Route R-01) can be elevated from EVIDENCE-DEPENDENT to ACTIVE.',
      duplicate_of_prior_search: false
    }
  };
}
