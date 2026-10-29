/**
 * Fast-Feedback Unit Tests for Case Architect Forensic Rules
 * Run via: npx --yes tsx --test tests/forensicLogic.test.ts
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { detectProhibitedJump } from '../src/utils/prohibitedJumps';
import { reconcileFinancialEntries } from '../src/utils/financialReconciliation';
import { auditChronologyEvents } from '../src/utils/chronologyEngine';
import { calculateSurvivalScore, validateRouteActionPermitted } from '../src/utils/routeValidator';
import { evaluateResearchLoopContinuation } from '../src/utils/boundedLoop';
import { ChronologyEvent, FinancialEntry, RouteItem } from '../src/types';

test('Prohibited Jump Detector identifies forbidden assumptions', () => {
  // Test 1: Draft date = filing date
  const res1 = detectProhibitedJump('The draft date is automatically the filing date.');
  assert.equal(res1.detected, true);
  assert.equal(res1.verdict, 'BLOCKED_INVALID_REASONING');
  assert.equal(res1.jump?.id, 'JUMP_01');

  // Test 2: Failed payment preserved deadline
  const res2 = detectProhibitedJump('The failed payment preserved the deadline.');
  assert.equal(res2.detected, true);
  assert.equal(res2.jump?.id, 'JUMP_02');

  // Test 3: Clean reasoning
  const res3 = detectProhibitedJump('We must inspect the court docket to verify if process service was ever returned.');
  assert.equal(res3.detected, false);
  assert.equal(res3.verdict, 'CLEAN_REASONING');
});

test('Financial Reconciliation flags arithmetic gaps and failed payments', () => {
  const entries: FinancialEntry[] = [
    {
      id: 'F1',
      category: 'amount_awarded',
      amount: 1440,
      currency: 'BHD',
      date: '2026-06-03',
      payment_reference: 'JUDG-01',
      recipient_account_evidence: 'Judgment',
      notes: 'Total award',
      is_allocation_disputed: true,
      status: 'VERIFIED'
    },
    {
      id: 'F2',
      category: 'amount_paid_directly',
      amount: 792,
      currency: 'BHD',
      date: '2026-03-20',
      payment_reference: 'TRANS-01',
      recipient_account_evidence: 'Bank statement',
      notes: 'Direct transfers',
      is_allocation_disputed: false,
      status: 'VERIFIED'
    },
    {
      id: 'F3',
      category: 'failed_payments',
      amount: 30,
      currency: 'BHD',
      date: '2026-07-05',
      payment_reference: 'PAY-FAIL',
      recipient_account_evidence: 'Decline slip',
      notes: 'Card declined',
      is_allocation_disputed: false,
      status: 'VERIFIED'
    }
  ];

  const result = reconcileFinancialEntries(entries);
  assert.equal(result.amount_awarded, 1440);
  assert.equal(result.total_paid_verified, 792);
  assert.equal(result.amount_outstanding, 648);
  assert.equal(result.total_failed_payments, 30);

  // Flags must include arithmetic deficit and failed payment mislabeled warning
  assert.ok(result.flags.some(f => f.type === 'ARITHMETIC_MISMATCH'));
  assert.ok(result.flags.some(f => f.type === 'FAILED_PAYMENT_MISLABELED_AS_SUCCESS'));
});

test('Chronology audit warns when deadline effect relies on unproved date', () => {
  const events: ChronologyEvent[] = [
    {
      event_id: 'E1',
      date_and_time: '2026-06-18',
      date_type: 'Service date',
      event_description: 'Alleged unconfirmed service',
      evidence_supporting: [],
      evidence_contradicting: [],
      procedural_effect: 'Appeal window started',
      deadline_effect: '15 days from service date',
      related_route: 'R-01',
      confidence: 'UNRESOLVED',
      unknowns: ['Process return missing'],
      is_date_proved: false
    }
  ];

  const audit = auditChronologyEvents(events);
  assert.equal(audit.unprovedDatesCount, 1);
  assert.ok(audit.warnings.length > 0);
  assert.ok(audit.warnings[0].message.includes('UNPROVED DEADLINE COMMENCEMENT WARNING'));
});

test('Route Validator allows substantive filing only for ACTIVE routes', () => {
  const dummyRoute: RouteItem = {
    route_id: 'R-TEST',
    route_name: 'Test Appeal',
    status: 'EVIDENCE-DEPENDENT',
    exact_objective_advanced: 'Appeal judgment',
    procedural_vehicle: 'Notice of Appeal',
    jurisdiction_or_authority: 'High Court',
    controlling_authority: [],
    required_elements: [],
    supporting_evidence: [],
    missing_evidence: [],
    admissibility_issues: [],
    previously_available: null,
    previously_considered: null,
    prior_history: [],
    deadline: {
      duration: '15 days',
      commencement_event: 'Service',
      commencement_evidence: [],
      commencement_proved: false,
      calculation: '',
      expiry_date: '',
      status: 'UNRESOLVED'
    },
    required_filing_or_action: '',
    available_remedy: '',
    result_it_can_produce: '',
    result_it_cannot_produce: '',
    strongest_supporting_argument: '',
    strongest_contrary_argument: '',
    likely_decision_maker_response: '',
    consequences_if_unsuccessful: '',
    possible_costs: '',
    cheaper_verification_step: '',
    disproof_attempt: '',
    stop_condition: '',
    confidence: 'MODERATE CONFIDENCE',
    confidence_reason: '',
    source_citations: [],
    survival_score: 50
  };

  // Substantive filing must be blocked when status is EVIDENCE-DEPENDENT
  const filingCheck = validateRouteActionPermitted(dummyRoute, 'SUBSTANTIVE_FILING');
  assert.equal(filingCheck.permitted, false);
  assert.ok(filingCheck.reason.includes('PROCEDURAL BAR'));

  // Investigative step must be permitted
  const investCheck = validateRouteActionPermitted(dummyRoute, 'INVESTIGATIVE_STEP');
  assert.equal(investCheck.permitted, true);

  // If status is ACTIVE, substantive filing is permitted
  dummyRoute.status = 'ACTIVE';
  const activeCheck = validateRouteActionPermitted(dummyRoute, 'SUBSTANTIVE_FILING');
  assert.equal(activeCheck.permitted, true);

  // If status is REJECTED, survival score must be 0
  dummyRoute.status = 'REJECTED';
  assert.equal(calculateSurvivalScore(dummyRoute), 0);
});

test('Bounded Research Loop stops upon saturation (2 cycles with no material change)', () => {
  const decision = evaluateResearchLoopContinuation({
    maxCycles: 5,
    currentCycle: 3,
    history: [
      {
        cycle_number: 1,
        timestamp: '2026-10-29T00:00:00Z',
        reason_for_next_cycle: 'First search',
        specific_missing_element: 'Authority',
        new_query_plan: ['q1'],
        expected_decision_value: 'val',
        duplicate_of_prior_search: false,
        new_evidence_found: 2,
        new_authorities_found: 1,
        material_change_occurred: true
      },
      {
        cycle_number: 2,
        timestamp: '2026-10-29T00:01:00Z',
        reason_for_next_cycle: 'Second search',
        specific_missing_element: 'Portal rules',
        new_query_plan: ['q2'],
        expected_decision_value: 'val',
        duplicate_of_prior_search: true,
        new_evidence_found: 0,
        new_authorities_found: 0,
        material_change_occurred: false
      },
      {
        cycle_number: 3,
        timestamp: '2026-10-29T00:02:00Z',
        reason_for_next_cycle: 'Third search',
        specific_missing_element: 'Portal rules recheck',
        new_query_plan: ['q3'],
        expected_decision_value: 'val',
        duplicate_of_prior_search: true,
        new_evidence_found: 0,
        new_authorities_found: 0,
        material_change_occurred: false
      }
    ],
    activeRouteExists: false,
    allRoutesBarred: false,
    missingFactRequiresExternalParty: false,
    userRequestedStop: false
  });

  assert.equal(decision.shouldContinue, false);
  assert.ok(decision.stopReason?.includes('SATURATION DETECTED'));
});
