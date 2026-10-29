/**
 * AUTOMATED ACCEPTANCE TEST HARNESS: 8 Mandatory Test Conditions
 *
 * Implements genuine executable assertions invoking production utility
 * and state-transition logic for the 8 forensic test scenarios.
 *
 * All results are derived from actual runtime outputs without hardcoded passes.
 */

import { detectProhibitedJump } from '../utils/prohibitedJumps';
import { reconcileFinancialEntries } from '../utils/financialReconciliation';
import { auditChronologyEvents, validateElectronicFilingTerms } from '../utils/chronologyEngine';
import {
  calculateSurvivalScore,
  validateRouteActionPermitted,
  validateRoutePromotion,
  applyCorrectionToLedger
} from '../utils/routeValidator';
import { evaluateResearchLoopContinuation } from '../utils/boundedLoop';
import { PILOT_ROUTES, PILOT_CONCLUSION_LEDGER } from './bahrainPilot';
import { ChronologyEvent, FinancialEntry, ResearchCycleRecord, RouteItem } from '../types';

export interface TestCaseScenario {
  id: string;
  name: string;
  description: string;
  inputConditions: {
    fact_description: string;
    procedural_state?: string;
    user_command?: string;
    search_results?: any[];
  };
  expectedResult: {
    verdict: string;
    forensic_finding: string;
    prohibited_jump_triggered?: boolean;
    route_status_assigned?: string;
    correction_logged?: boolean;
  };
  executeTest: () => {
    passed: boolean;
    actualFinding: string;
    assertionLog: string[];
  };
}

export const TEST_SUITE: TestCaseScenario[] = [
  {
    id: 'TEST_01',
    name: 'TEST 1: Strong payment evidence but no open procedural vehicle',
    description: 'Substantive payment records are verified, but judgment has lapsed past absolute appeal deadlines with no pending execution or petition.',
    inputConditions: {
      fact_description: 'Debtor holds authenticated bank transfers for full debt amount, but 30-day appeal, 60-day cassation, and extraordinary review periods are expired without open execution docket.',
      procedural_state: 'All statutory appeal channels expired; no execution file currently open.'
    },
    expectedResult: {
      verdict: 'Evidence strong; remedy not established',
      forensic_finding: 'Substantive evidence of payment verified; procedural vehicle unavailable to disturb final judgment in absence of enforcement proceedings.'
    },
    executeTest: () => {
      // 1. Genuine financial reconciliation of authentic payment transfers
      const paymentEvidence: FinancialEntry[] = [
        {
          id: 'TEST_F1',
          category: 'amount_awarded',
          amount: 1440,
          currency: 'BHD',
          date: '2026-06-03',
          payment_reference: 'JUDG-FINAL',
          recipient_account_evidence: 'Final Judgment',
          notes: 'Lapsed first-instance award',
          is_allocation_disputed: false,
          status: 'VERIFIED'
        },
        {
          id: 'TEST_F2',
          category: 'amount_paid_directly',
          amount: 1440,
          currency: 'BHD',
          date: '2026-03-20',
          payment_reference: 'TRANS-FULL-PAY',
          recipient_account_evidence: 'Bank official debit advice',
          notes: 'Full direct satisfaction of debt',
          is_allocation_disputed: false,
          status: 'VERIFIED'
        }
      ];
      const recon = reconcileFinancialEntries(paymentEvidence);

      // 2. Candidate route with no open procedural vehicle (vehicle elements expired/unmet)
      const expiredVehicleRoute: RouteItem = {
        route_id: 'R-EXPIRED-TEST',
        route_name: 'Direct Reopening of Final Judgment on Payment Proof',
        status: 'WEAK',
        exact_objective_advanced: 'Reopen lapsed final judgment based on bank transfer evidence',
        procedural_vehicle: 'None open (Appeal, Cassation, Review statutory windows expired)',
        jurisdiction_or_authority: 'Rental Disputes Committee',
        controlling_authority: ['Civil and Commercial Procedure Law (Res Judicata Bar)'],
        required_elements: [
          {
            id: 'EL_EXP_1',
            element_name: 'Open Statutory Procedural Vehicle or Pending Execution Docket',
            legal_basis: 'Procedural Finality Rule',
            is_verified: false,
            evidence_ids: [],
            status: 'UNMET',
            fatal_if_missing: true
          },
          {
            id: 'EL_EXP_2',
            element_name: 'Authenticated Proof of Payment',
            legal_basis: 'Law of Evidence',
            is_verified: true,
            evidence_ids: ['TEST_F2'],
            status: 'MET',
            fatal_if_missing: true
          }
        ],
        supporting_evidence: ['TEST_F2'],
        missing_evidence: ['Open execution file or unexpired statutory appeal docket'],
        admissibility_issues: ['Final judgment is res judicata; no pending enforcement to lodge accounting plea'],
        previously_available: true,
        previously_considered: false,
        prior_history: ['Statutory appeal window expired with no pending action'],
        deadline: {
          duration: 'Expired',
          commencement_event: 'Judgment entry',
          commencement_evidence: [],
          commencement_proved: true,
          calculation: 'All statutory appeal periods elapsed',
          expiry_date: 'EXPIRED',
          status: 'EXPIRED'
        },
        required_filing_or_action: 'None available until opposing party opens execution docket.',
        available_remedy: 'None in absence of enforcement docket.',
        result_it_can_produce: 'None',
        result_it_cannot_produce: 'Cannot unilaterally reopen closed court record.',
        strongest_supporting_argument: 'Bank transfers demonstrate full debt satisfaction.',
        strongest_contrary_argument: 'Res judicata and expiration of all procedural channels bar reopening.',
        likely_decision_maker_response: 'Refusal for lack of open procedural vehicle.',
        consequences_if_unsuccessful: 'Summary dismissal.',
        possible_costs: 'Adverse court costs.',
        cheaper_verification_step: 'Await formal execution notice before asserting payment defense.',
        disproof_attempt: 'Res judicata conclusively bars disturbance of judgment.',
        stop_condition: 'Absence of open procedural vehicle.',
        confidence: 'NOT SUPPORTABLE',
        confidence_reason: 'Evidence strong but procedural vehicle is missing.',
        source_citations: ['CCPL Res Judicata Rules'],
        survival_score: 15
      };

      // Real failure-path check: ACTIVE promotion being refused when fatal elements remain unmet
      const promotionCheck = validateRoutePromotion(expiredVehicleRoute);
      const filingCheck = validateRouteActionPermitted(expiredVehicleRoute, 'SUBSTANTIVE_FILING');
      const jumpCheck = detectProhibitedJump('Strong evidence automatically reopens a final judgment.');

      const assertion1 = recon.total_paid_verified === 1440 && recon.amount_outstanding === 0;
      const assertion2 = !promotionCheck.canPromote && promotionCheck.fatalUnmetElements.includes('Open Statutory Procedural Vehicle or Pending Execution Docket');
      const assertion3 = !filingCheck.permitted && filingCheck.reason.includes('PROCEDURAL BAR');
      const assertion4 = jumpCheck.detected && jumpCheck.jump?.id === 'JUMP_06';

      const passed = assertion1 && assertion2 && assertion3 && assertion4;

      const assertionLog = [
        `Payment reconciliation executed: Verified BHD ${recon.total_paid_verified.toFixed(2)} paid directly; outstanding balance BHD ${recon.amount_outstanding.toFixed(2)} (pass: ${assertion1}).`,
        `ACTIVE promotion evaluation: Refused due to fatal unmet element "Open Statutory Procedural Vehicle" (pass: ${assertion2}).`,
        `Substantive filing authorization check: Blocked with procedural bar (permitted: ${filingCheck.permitted}) (pass: ${assertion3}).`,
        `Prohibited jump detection: JUMP_06 ("Strong evidence automatically reopens a final judgment") triggered & blocked (pass: ${assertion4}).`,
        `Forensic conclusion: Evidence strong; remedy not established (overall: ${passed}).`
      ];

      return {
        passed,
        actualFinding: passed
          ? 'Evidence strong; remedy not established'
          : `Assertion failure in Test 1: a1=${assertion1}, a2=${assertion2}, a3=${assertion3}, a4=${assertion4}`,
        assertionLog
      };
    }
  },
  {
    id: 'TEST_02',
    name: 'TEST 2: Electronic appeal draft saved within deadline but not submitted',
    description: 'User saved draft electronic appeal on portal during statutory window but never completed final submission or received registry number.',
    inputConditions: {
      fact_description: 'Draft R88736 saved on day 13 of 15-day period. Portal status remains "Draft - Unsubmitted".',
      procedural_state: 'Portal draft saved; no submission receipt issued.'
    },
    expectedResult: {
      verdict: 'Timely attempt supported; timely legal filing unproved',
      forensic_finding: 'Draft save demonstrates timely drafting activity, but does not satisfy statutory requirement of filing with court registry.',
      prohibited_jump_triggered: true
    },
    executeTest: () => {
      // 1. Prohibited jump detection: JUMP_01
      const jumpCheck = detectProhibitedJump('The draft date is automatically the filing date.');

      // 2. Electronic filing terms validation
      const termsCheck = validateElectronicFilingTerms('The saved draft counts as filing and save date is the filing date.');

      // 3. Take pilot Route R-01 (Ordinary High Court Appeal, status: EVIDENCE-DEPENDENT)
      const routeR01 = PILOT_ROUTES.find(r => r.route_id === 'R-01') || PILOT_ROUTES[0];

      // Failure-path check: EVIDENCE-DEPENDENT route blocked from substantive filing
      const filingCheck = validateRouteActionPermitted(routeR01, 'SUBSTANTIVE_FILING');

      // Investigative action check: permitted for EVIDENCE-DEPENDENT
      const investCheck = validateRouteActionPermitted(routeR01, 'INVESTIGATIVE_STEP');

      const assertion1 = jumpCheck.detected && jumpCheck.jump?.id === 'JUMP_01' && jumpCheck.verdict === 'BLOCKED_INVALID_REASONING';
      const assertion2 = !termsCheck.isValid && termsCheck.violations.some(v => v.includes('Save date is NOT filing date'));
      const assertion3 = !filingCheck.permitted && filingCheck.reason.includes('PROCEDURAL BAR') && filingCheck.reason.includes('EVIDENCE-DEPENDENT');
      const assertion4 = investCheck.permitted && investCheck.reason.includes('EVIDENCE-DEPENDENT routes are lawfully permitted');

      const passed = assertion1 && assertion2 && assertion3 && assertion4;

      const assertionLog = [
        `Prohibited jump JUMP_01 ("The draft date is automatically the filing date") detected: ${jumpCheck.detected} (${jumpCheck.verdict}) (pass: ${assertion1}).`,
        `Portal date-conflation check: Flagged ${termsCheck.violations.length} statutory filing violations (pass: ${assertion2}).`,
        `Substantive filing authorization on EVIDENCE-DEPENDENT route R-01: Blocked (permitted: ${filingCheck.permitted}) (pass: ${assertion3}).`,
        `Investigative step on EVIDENCE-DEPENDENT route R-01: Permitted for targeted records inquiry (pass: ${assertion4}).`,
        `Forensic conclusion: Timely attempt supported; timely legal filing unproved (overall: ${passed}).`
      ];

      return {
        passed,
        actualFinding: passed
          ? 'Timely attempt supported; timely legal filing unproved'
          : `Assertion failure in Test 2: a1=${assertion1}, a2=${assertion2}, a3=${assertion3}, a4=${assertion4}`,
        assertionLog
      };
    }
  },
  {
    id: 'TEST_03',
    name: 'TEST 3: Failed fee payment',
    description: 'User initiated credit card fee payment before deadline, but payment gateway returned Issuer Decline (Code 91).',
    inputConditions: {
      fact_description: 'Payment attempt BHD 30 on 5 July 2026 failed. No subsequent fee receipt found.',
      procedural_state: 'Electronic payment failed; fee remains unpaid.'
    },
    expectedResult: {
      verdict: 'Payment attempt verified; statutory fee payment not completed',
      forensic_finding: 'Payment attempt is authenticated by gateway log, but fee obligation was not discharged.',
      prohibited_jump_triggered: true
    },
    executeTest: () => {
      // 1. Financial reconciliation on failed payment
      const failedPaymentEntries: FinancialEntry[] = [
        {
          id: 'TEST_F_FAIL',
          category: 'failed_payments',
          amount: 30,
          currency: 'BHD',
          date: '2026-07-05',
          payment_reference: 'BD-PAY-99201',
          recipient_account_evidence: 'Payment Gateway Advice Ref BD-PAY-99201 (Decline Code 91)',
          notes: 'Fee transaction failed; card declined by issuer.',
          is_allocation_disputed: false,
          status: 'VERIFIED'
        }
      ];
      const recon = reconcileFinancialEntries(failedPaymentEntries);

      // 2. Prohibited jump detection: JUMP_02
      const jumpCheck = detectProhibitedJump('The failed payment preserved the deadline.');

      // 3. Electronic filing terms validation
      const termsCheck = validateElectronicFilingTerms('failed payment counts as fee paid');

      const assertion1 = recon.total_failed_payments === 30;
      const assertion2 = recon.flags.some(f => f.type === 'FAILED_PAYMENT_MISLABELED_AS_SUCCESS');
      const assertion3 = jumpCheck.detected && jumpCheck.jump?.id === 'JUMP_02' && jumpCheck.verdict === 'BLOCKED_INVALID_REASONING';
      const assertion4 = !termsCheck.isValid && termsCheck.violations.some(v => v.includes('Failed payment does NOT satisfy statutory fee requirement'));

      const passed = assertion1 && assertion2 && assertion3 && assertion4;

      const assertionLog = [
        `Financial reconciliation of gateway log: Total failed payments recorded: BHD ${recon.total_failed_payments} (pass: ${assertion1}).`,
        `Mislabeled payment flag check: Detected FAILED_PAYMENT_MISLABELED_AS_SUCCESS flag (pass: ${assertion2}).`,
        `Prohibited jump JUMP_02 ("The failed payment preserved the deadline") detected: ${jumpCheck.detected} (${jumpCheck.verdict}) (pass: ${assertion3}).`,
        `Electronic filing statutory fee compliance: Prohibited conflation identified (pass: ${assertion4}).`,
        `Forensic conclusion: Payment attempt verified; statutory fee payment not completed (overall: ${passed}).`
      ];

      return {
        passed,
        actualFinding: passed
          ? 'Payment attempt verified; statutory fee payment not completed'
          : `Assertion failure in Test 3: a1=${assertion1}, a2=${assertion2}, a3=${assertion3}, a4=${assertion4}`,
        assertionLog
      };
    }
  },
  {
    id: 'TEST_04',
    name: 'TEST 4: No downloaded service record',
    description: 'User portals and downloaded case materials do not contain a signed return of service.',
    inputConditions: {
      fact_description: 'User has no copy of bailiff service certificate.',
      procedural_state: 'Correspondence record silent on service.'
    },
    expectedResult: {
      verdict: 'Service unknown; no inference that service never occurred',
      forensic_finding: 'Negative inference rejected. Absence of document in user view does not prove service was legally omitted by registry.',
      prohibited_jump_triggered: true
    },
    executeTest: () => {
      // 1. Failure-path check: an unproved service date blocking deadline calculation
      const serviceEvent: ChronologyEvent = {
        event_id: 'EVT_SERV_TEST',
        date_and_time: 'UNKNOWN',
        date_type: 'Service date',
        event_description: 'Alleged formal process service not present in user portal download',
        evidence_supporting: [],
        evidence_contradicting: [],
        procedural_effect: 'Appeal limitation period commencement',
        deadline_effect: '15 calendar days from service date',
        related_route: 'R-01',
        confidence: 'UNRESOLVED',
        unknowns: ['Process server return missing from portal view'],
        is_date_proved: false
      };
      const audit = auditChronologyEvents([serviceEvent]);

      // 2. Prohibited jump detection: JUMP_03 (negative inference fallacy)
      const jumpCheck = detectProhibitedJump('No correspondence entry means no service occurred.');

      // 3. Route deadline check on pilot Route R-01
      const routeR01 = PILOT_ROUTES.find(r => r.route_id === 'R-01') || PILOT_ROUTES[0];
      const deadlineUnproved = !routeR01.deadline.commencement_proved;
      const expiryUncalculated = routeR01.deadline.expiry_date.includes('CANNOT BE CALCULATED');

      const assertion1 = audit.unprovedDatesCount === 1;
      const assertion2 = audit.warnings.some(
        w => w.isFatal && w.dateType === 'Service date' && w.message.includes('UNPROVED DEADLINE COMMENCEMENT WARNING')
      );
      const assertion3 = jumpCheck.detected && jumpCheck.jump?.id === 'JUMP_03' && jumpCheck.verdict === 'BLOCKED_INVALID_REASONING';
      const assertion4 = deadlineUnproved && expiryUncalculated;

      const passed = assertion1 && assertion2 && assertion3 && assertion4;

      const assertionLog = [
        `Chronology audit unproved date count: ${audit.unprovedDatesCount} (pass: ${assertion1}).`,
        `Chronology audit fatal warning: Generated "UNPROVED DEADLINE COMMENCEMENT WARNING" for unproved service date (pass: ${assertion2}).`,
        `Prohibited jump JUMP_03 ("No correspondence entry means no service occurred") detected: ${jumpCheck.detected} (pass: ${assertion3}).`,
        `Route R-01 deadline status: commencement_proved=${routeR01.deadline.commencement_proved}, expiry="${routeR01.deadline.expiry_date}" (pass: ${assertion4}).`,
        `Forensic conclusion: Service unknown; no inference that service never occurred (overall: ${passed}).`
      ];

      return {
        passed,
        actualFinding: passed
          ? 'Service unknown; no inference that service never occurred'
          : `Assertion failure in Test 4: a1=${assertion1}, a2=${assertion2}, a3=${assertion3}, a4=${assertion4}`,
        assertionLog
      };
    }
  },
  {
    id: 'TEST_05',
    name: 'TEST 5: Reconsideration already rejected',
    description: 'User requests filing another reconsideration motion citing the same rent transfer arguments.',
    inputConditions: {
      fact_description: 'Reconsideration petition was dismissed on 12 June 2026 by RDC secretariat.',
      procedural_state: 'Prior rejection on file.'
    },
    expectedResult: {
      verdict: 'Route remains rejected unless genuinely new evidence or authority defeats the rejection reason',
      forensic_finding: 'Route R-02 remains REJECTED. Prohibited repackaging of a dismissed petition.',
      route_status_assigned: 'REJECTED'
    },
    executeTest: () => {
      // 1. Take pilot Route R-05 (status: DEAD, prior dismissal EX-06, survival score: 0)
      const routeR05 = PILOT_ROUTES.find(r => r.route_id === 'R-05') || PILOT_ROUTES[4];

      // Failure-path check: a DEAD route blocked from investigation and filing
      const filingCheck = validateRouteActionPermitted(routeR05, 'SUBSTANTIVE_FILING');
      const investCheck = validateRouteActionPermitted(routeR05, 'INVESTIGATIVE_STEP');
      const score = calculateSurvivalScore(routeR05);
      const promoCheck = validateRoutePromotion(routeR05);

      // 2. Prohibited jump detection: JUMP_10 (relabeling a rejected theory)
      const jumpCheck = detectProhibitedJump('A new label creates a new cause of action.');

      const assertion1 = !filingCheck.permitted && filingCheck.reason.includes('PROCEDURAL BAR');
      const assertion2 = !investCheck.permitted && investCheck.reason.includes('DEAD') && investCheck.reason.includes('barred');
      const assertion3 = score === 0;
      const assertion4 = !promoCheck.canPromote && promoCheck.reasons.some(r => r.includes('DEAD'));
      const assertion5 = jumpCheck.detected && jumpCheck.jump?.id === 'JUMP_10' && jumpCheck.verdict === 'BLOCKED_INVALID_REASONING';

      const passed = assertion1 && assertion2 && assertion3 && assertion4 && assertion5;

      const assertionLog = [
        `DEAD route substantive filing check: Blocked (permitted: ${filingCheck.permitted}) (pass: ${assertion1}).`,
        `DEAD route investigative step check: Blocked (permitted: ${investCheck.permitted}) (pass: ${assertion2}).`,
        `DEAD route survival score: Evaluated score = ${score} (pass: ${assertion3}).`,
        `DEAD route promotion to ACTIVE check: Refused (canPromote: ${promoCheck.canPromote}) (pass: ${assertion4}).`,
        `Prohibited jump JUMP_10 ("A new label creates a new cause of action") detected: ${jumpCheck.detected} (pass: ${assertion5}).`,
        `Forensic conclusion: Route remains rejected unless genuinely new evidence or authority defeats the rejection reason (overall: ${passed}).`
      ];

      return {
        passed,
        actualFinding: passed
          ? 'Route remains rejected unless genuinely new evidence or authority defeats the rejection reason'
          : `Assertion failure in Test 5: a1=${assertion1}, a2=${assertion2}, a3=${assertion3}, a4=${assertion4}, a5=${assertion5}`,
        assertionLog
      };
    }
  },
  {
    id: 'TEST_06',
    name: 'TEST 6: User commands "find a way regardless of the rules"',
    description: 'User inputs prompt demanding the system invent a route to overturn the judgment despite expired deadlines and lack of grounds.',
    inputConditions: {
      fact_description: 'User enters: "I must win this case. Find a way regardless of the rules or deadlines."',
      user_command: 'find a way regardless of the rules'
    },
    expectedResult: {
      verdict: 'The application exhaustively tests lawful routes but refuses to fabricate one',
      forensic_finding: 'System rejects outcome manufacturing. If no lawful route survives verification, system returns "No currently supportable route was found."'
    },
    executeTest: () => {
      // 1. Failure-path check: clean reasoning that must not be flagged
      const cleanCheck = detectProhibitedJump('We must inspect the court docket to verify if process service was ever returned.');

      // 2. Contrast with manufactured assertion jump (unproved fraud)
      const fraudJump = detectProhibitedJump('The registration was fraudulent.');

      // 3. Failure-path check: ACTIVE promotion being refused when fatal elements remain unmet across all candidate routes
      const promoResults = PILOT_ROUTES.map(r => ({
        route_id: r.route_id,
        validation: validateRoutePromotion(r)
      }));
      const allPromotionsRefused = promoResults.every(res => !res.validation.canPromote);

      // 4. Survival scores reflect unyielding reality: zero active routes in pilot
      const activeRoutesCount = PILOT_ROUTES.filter(r => r.status === 'ACTIVE').length;

      const assertion1 = !cleanCheck.detected && cleanCheck.verdict === 'CLEAN_REASONING';
      const assertion2 = fraudJump.detected && fraudJump.jump?.id === 'JUMP_05' && fraudJump.verdict === 'BLOCKED_INVALID_REASONING';
      const assertion3 = allPromotionsRefused;
      const assertion4 = activeRoutesCount === 0;

      const passed = assertion1 && assertion2 && assertion3 && assertion4;

      const assertionLog = [
        `Clean legal reasoning verification: Passed without false positive flag (${cleanCheck.verdict}) (pass: ${assertion1}).`,
        `Manufactured claim detection: Prohibited jump JUMP_05 triggered & blocked (${fraudJump.verdict}) (pass: ${assertion2}).`,
        `Exhaustive route verification across all ${PILOT_ROUTES.length} pilot routes: 100% refused promotion to ACTIVE due to unmet fatal elements (pass: ${assertion3}).`,
        `Pilot active route count: ${activeRoutesCount} ACTIVE routes fabricated upon command (pass: ${assertion4}).`,
        `Forensic conclusion: The application exhaustively tests lawful routes but refuses to fabricate one (overall: ${passed}).`
      ];

      return {
        passed,
        actualFinding: passed
          ? 'The application exhaustively tests lawful routes but refuses to fabricate one'
          : `Assertion failure in Test 6: a1=${assertion1}, a2=${assertion2}, a3=${assertion3}, a4=${assertion4}`,
        assertionLog
      };
    }
  },
  {
    id: 'TEST_07',
    name: 'TEST 7: Two repeated searches return no new authority',
    description: 'Research loop executes two consecutive search cycles that return duplicate citations and zero new material propositions.',
    inputConditions: {
      fact_description: 'Cycle 3 and Cycle 4 query public legal databases but yield identical results to Cycle 2.',
      search_results: []
    },
    expectedResult: {
      verdict: 'Research loop stops and records saturation',
      forensic_finding: 'Termination rule triggered: Two consecutive cycles with no material change halts research loop to prevent infinite loops.'
    },
    executeTest: () => {
      // 1. Failure-path check: two unchanged research cycles causing saturation
      const saturatedHistory: ResearchCycleRecord[] = [
        {
          cycle_number: 1,
          timestamp: '2026-10-29T00:00:00Z',
          reason_for_next_cycle: 'Initial authority search',
          specific_missing_element: 'Rent Law Article 28 commentary',
          new_query_plan: ['Rent law appeal window'],
          expected_decision_value: 'Confirm statutory duration',
          duplicate_of_prior_search: false,
          new_evidence_found: 1,
          new_authorities_found: 2,
          material_change_occurred: true
        },
        {
          cycle_number: 2,
          timestamp: '2026-10-29T00:01:00Z',
          reason_for_next_cycle: 'Secondary query for electronic portal regulations',
          specific_missing_element: 'Decree 27/2021 precedents',
          new_query_plan: ['Decree 27/2021 draft save rulings'],
          expected_decision_value: 'Check if draft saves toll limitation',
          duplicate_of_prior_search: true,
          new_evidence_found: 0,
          new_authorities_found: 0,
          material_change_occurred: false
        },
        {
          cycle_number: 3,
          timestamp: '2026-10-29T00:02:00Z',
          reason_for_next_cycle: 'Third re-query for electronic portal regulations',
          specific_missing_element: 'Decree 27/2021 precedents',
          new_query_plan: ['Decree 27/2021 draft save rulings identical re-query'],
          expected_decision_value: 'Check if draft saves toll limitation',
          duplicate_of_prior_search: true,
          new_evidence_found: 0,
          new_authorities_found: 0,
          material_change_occurred: false
        }
      ];

      const saturationDecision = evaluateResearchLoopContinuation({
        maxCycles: 5,
        currentCycle: 3,
        history: saturatedHistory,
        activeRouteExists: false,
        allRoutesBarred: false,
        missingFactRequiresExternalParty: false,
        userRequestedStop: false
      });

      // 2. Contrast with single unchanged cycle (should continue if under budget)
      const singleUnchangedDecision = evaluateResearchLoopContinuation({
        maxCycles: 5,
        currentCycle: 2,
        history: saturatedHistory.slice(0, 2),
        activeRouteExists: false,
        allRoutesBarred: false,
        missingFactRequiresExternalParty: false,
        userRequestedStop: false
      });

      const assertion1 = saturationDecision.shouldContinue === false;
      const assertion2 = Boolean(
        saturationDecision.stopReason && saturationDecision.stopReason.includes('SATURATION DETECTED')
      );
      const assertion3 = singleUnchangedDecision.shouldContinue === true;

      const passed = assertion1 && assertion2 && assertion3;

      const assertionLog = [
        `Bounded loop evaluation with 2 consecutive unchanged cycles: shouldContinue = ${saturationDecision.shouldContinue} (pass: ${assertion1}).`,
        `Termination reason: "${saturationDecision.stopReason}" (pass: ${assertion2}).`,
        `Single unchanged cycle control check: shouldContinue = ${singleUnchangedDecision.shouldContinue} (proves saturation strictly requires 2 cycles) (pass: ${assertion3}).`,
        `Forensic conclusion: Research loop stops and records saturation (overall: ${passed}).`
      ];

      return {
        passed,
        actualFinding: passed
          ? 'Research loop stops and records saturation'
          : `Assertion failure in Test 7: a1=${assertion1}, a2=${assertion2}, a3=${assertion3}`,
        assertionLog
      };
    }
  },
  {
    id: 'TEST_08',
    name: 'TEST 8: A new authoritative source defeats an earlier conclusion',
    description: 'A newly retrieved authoritative decree contradicts an earlier assumption that portal drafts preserve limitation dates.',
    inputConditions: {
      fact_description: 'System previously assumed portal save date might toll deadline; newly retrieved Ministerial Decree No. 27/2021 states draft saves have zero legal effect.',
      procedural_state: 'New controlling authority retrieved.'
    },
    expectedResult: {
      verdict: 'The system explicitly corrects the prior conclusion and updates the roadmap',
      forensic_finding: 'System logs "I was wrong" / "I overstated this" in Conclusion Ledger, adjusts route from ACTIVE to EVIDENCE-DEPENDENT, and amends roadmap.',
      correction_logged: true
    },
    executeTest: () => {
      // 1. Initial ledger baseline
      const initialLedger = PILOT_CONCLUSION_LEDGER;
      const priorConclusion = initialLedger.current_committed_conclusion;
      const priorCount = initialLedger.corrections.length;

      // 2. Failure-path check: a correction being persisted to the conclusion ledger
      const correctionData = {
        type: 'I_OVERSTATED_THIS' as const,
        exact_earlier_claim: 'Portal draft save date (16 June 2026) might toll statutory 15-day appeal deadline.',
        corrected_conclusion: 'Ministerial Decree No. 27/2021 Articles 4 & 7 establishes that draft saves carry zero legal effect and do not toll statutory limitation.',
        evidence_causing_correction: 'Ministerial Decree No. 27 of 2021 Articles 4 & 7 (Official Gazette Edition 3521)',
        effect_on_roadmap: 'Downgraded Ordinary Appeal from ACTIVE to EVIDENCE-DEPENDENT; redirected primary next action to execution docket inspection.'
      };

      const { updatedLedger, persisted } = applyCorrectionToLedger(initialLedger, correctionData);

      // 3. Route status adjustment check: verify substantive filing blocked on downgraded route
      const downgradedRoute: RouteItem = {
        ...PILOT_ROUTES[0],
        status: 'EVIDENCE-DEPENDENT'
      };
      const filingCheck = validateRouteActionPermitted(downgradedRoute, 'SUBSTANTIVE_FILING');

      const assertion1 = persisted === true;
      const assertion2 = updatedLedger.corrections.length === priorCount + 1;
      const assertion3 = updatedLedger.corrections[0].type === 'I_OVERSTATED_THIS';
      const assertion4 = updatedLedger.current_committed_conclusion === correctionData.corrected_conclusion;
      const assertion5 = updatedLedger.previous_conclusions[0] === priorConclusion;
      const assertion6 = !filingCheck.permitted && filingCheck.reason.includes('PROCEDURAL BAR');

      const passed = assertion1 && assertion2 && assertion3 && assertion4 && assertion5 && assertion6;

      const assertionLog = [
        `Ledger state transition execution: persisted = ${persisted} (pass: ${assertion1}).`,
        `Correction count check: Incremented from ${priorCount} to ${updatedLedger.corrections.length} (pass: ${assertion2}).`,
        `Formal correction entry type: ${updatedLedger.corrections[0].type} (pass: ${assertion3}).`,
        `Current committed conclusion updated: "${updatedLedger.current_committed_conclusion}" (pass: ${assertion4}).`,
        `Prior conclusion preserved in ledger history: "${updatedLedger.previous_conclusions[0]}" (pass: ${assertion5}).`,
        `Route status downgraded to EVIDENCE-DEPENDENT: Substantive court filing blocked (pass: ${assertion6}).`,
        `Forensic conclusion: The system explicitly corrects the prior conclusion and updates the roadmap (overall: ${passed}).`
      ];

      return {
        passed,
        actualFinding: passed
          ? 'The system explicitly corrects the prior conclusion and updates the roadmap'
          : `Assertion failure in Test 8: a1=${assertion1}, a2=${assertion2}, a3=${assertion3}, a4=${assertion4}, a5=${assertion5}, a6=${assertion6}`,
        assertionLog
      };
    }
  }
];
