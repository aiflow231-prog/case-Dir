/**
 * CASE ARCHITECT - Core Type Definitions
 * Exhaustive Route Validator & Forensic Case Analysis
 */

export type EvidenceLabel =
  | 'VERIFIED FACT'
  | 'USER ASSERTION'
  | 'OFFICIAL RECORD'
  | 'PRIMARY EVIDENCE'
  | 'CONTROLLING RULE'
  | 'LEGAL INFERENCE'
  | 'TECHNICAL INFERENCE'
  | 'ASSUMPTION'
  | 'UNVERIFIED'
  | 'CONTRADICTED'
  | 'UNKNOWN'
  | 'INCOMPLETE RECORD';

export type RouteStatus =
  | 'ACTIVE'
  | 'EVIDENCE-DEPENDENT'
  | 'WEAK'
  | 'REJECTED'
  | 'DEAD'
  | 'SUPERSEDED';

export type ConfidenceLevel =
  | 'HIGH CONFIDENCE'
  | 'MODERATE CONFIDENCE'
  | 'LOW CONFIDENCE'
  | 'UNRESOLVED'
  | 'NOT SUPPORTABLE';

export type ContradictionType =
  | 'Date conflict'
  | 'Amount conflict'
  | 'Identity conflict'
  | 'Procedural-status conflict'
  | 'Filing-status conflict'
  | 'Service conflict'
  | 'Authentication conflict'
  | 'Factual inconsistency'
  | 'Legal inconsistency'
  | 'Translation inconsistency';

export type DateType =
  | 'Event date'
  | 'Document date'
  | 'Issue date'
  | 'Service date'
  | 'Knowledge date'
  | 'Creation date'
  | 'Save date'
  | 'Filing date'
  | 'Registration date'
  | 'Payment date'
  | 'Decision date'
  | 'Publication date'
  | 'Effective date';

export type DocumentCategoryType =
  | 'Original document'
  | 'Primary evidence'
  | 'Duplicate'
  | 'Near duplicate'
  | 'Excerpt'
  | 'Partial screenshot'
  | 'Advocacy document'
  | 'Official record'
  | 'Party assertion'
  | 'Secondary source'
  | 'Unverified copy';

export type AuthorityPriorityLevel =
  | 1 // Current controlling legislation
  | 2 // Official amendments
  | 3 // Commencement provisions
  | 4 // Binding or authoritative judicial decisions
  | 5 // Official regulations and procedural decisions
  | 6 // Official court and government service information
  | 7 // Primary documentary evidence
  | 8 // Reliable secondary sources
  | 9; // Commentary

export interface EvidenceItem {
  id: string;
  exhibit_id: string;
  filename: string;
  document_type: string;
  date: string;
  source: string;
  author_or_issuer: string;
  page_count: number;
  authentication_status: 'AUTHENTICATED' | 'UNVERIFIED' | 'CHALLENGED' | 'SUSPECT';
  confidentiality_status: 'CONFIDENTIAL' | 'RESTRICTED' | 'PUBLIC' | 'PRIVILEGED';
  duplicate_status: 'ORIGINAL' | 'DUPLICATE' | 'NEAR_DUPLICATE' | 'EXCERPT';
  ocr_status: 'COMPLETED' | 'PENDING' | 'NOT_REQUIRED' | 'FAILED';
  completeness_status: 'COMPLETE' | 'PARTIAL' | 'PAGES_MISSING' | 'FRAGMENTARY';
  related_events: string[];
  related_routes: string[];
  notes: string;
  source_citation_identifier: string;
  raw_text?: string;
  is_redacted?: boolean;
}

export interface DocumentIndexItem {
  id: string;
  exhibit_id: string;
  page_number: number;
  page_range?: string;
  document_title: string;
  document_category: DocumentCategoryType;
  is_original: boolean;
  is_readable: boolean;
  ocr_required: boolean;
  evidentiary_significance: string;
  related_assertion?: string;
  related_authority?: string;
  related_event?: string;
  related_contradiction?: string;
}

export interface ChronologyEvent {
  event_id: string;
  date_and_time: string;
  date_type: DateType;
  event_description: string;
  evidence_supporting: string[];
  evidence_contradicting: string[];
  procedural_effect: string;
  deadline_effect: string;
  related_route: string;
  confidence: ConfidenceLevel;
  unknowns: string[];
  is_date_proved: boolean;
  date_proof_evidence_id?: string;
}

export interface FinancialEntry {
  id: string;
  category:
    | 'amount_claimed'
    | 'amount_awarded'
    | 'amount_paid_directly'
    | 'amount_paid_into_court'
    | 'amount_held'
    | 'amount_disbursed'
    | 'amount_outstanding'
    | 'fees'
    | 'interest'
    | 'lawyer_fees'
    | 'costs'
    | 'refunds'
    | 'failed_payments'
    | 'reversed_payments';
  amount: number;
  currency: string;
  date: string;
  payment_reference: string;
  recipient_account_evidence: string;
  evidence_id?: string;
  notes: string;
  is_allocation_disputed: boolean;
  status: 'VERIFIED' | 'CLAIMED_ONLY' | 'FAILED' | 'DISPUTED';
}

export interface FinancialReconciliationResult {
  amount_claimed: number;
  amount_awarded: number;
  amount_paid_directly: number;
  amount_paid_into_court: number;
  amount_held: number;
  amount_disbursed: number;
  amount_outstanding: number;
  total_paid_verified: number;
  total_failed_payments: number;
  flags: FinancialFlag[];
}

export interface FinancialFlag {
  id: string;
  type:
    | 'DUPLICATE_PAYMENT'
    | 'CONFLICTING_TOTALS'
    | 'BANK_MISMATCH'
    | 'ARITHMETIC_MISMATCH'
    | 'PLEADING_AMOUNT_DISCREPANCY'
    | 'FAILED_PAYMENT_MISLABELED_AS_SUCCESS';
  severity: 'CRITICAL' | 'WARNING' | 'NOTE';
  description: string;
  affected_entries: string[];
}

export interface ContradictionItem {
  contradiction_id: string;
  proposition_a: string;
  source_a: string;
  proposition_b: string;
  source_b: string;
  type: ContradictionType;
  materiality: 'FATAL' | 'MATERIAL' | 'COLLATERAL' | 'MINOR';
  possible_explanation: string;
  evidence_required_to_resolve: string;
  route_affected: string;
  current_status: 'OPEN' | 'RESOLVED_BY_PRIMARY_RECORD' | 'UNRESOLVED' | 'WAIVED';
}

export interface LegalProposition {
  proposition_id: string;
  proposition: string;
  jurisdiction: string;
  authority_type: string;
  authority_title: string;
  article_or_paragraph: string;
  effective_date: string;
  version_checked: string;
  amendment_history_checked: boolean;
  exact_supporting_passage: string;
  source_url: string;
  source_citation: string;
  directly_supported: boolean;
  contrary_authority: Array<{
    citation: string;
    passage: string;
    divergence_reason: string;
  }>;
  confidence: ConfidenceLevel;
  limitations: string;
  priority_tier: AuthorityPriorityLevel;
}

export interface RouteElement {
  id: string;
  element_name: string;
  legal_basis: string;
  is_verified: boolean;
  evidence_ids: string[];
  status: 'MET' | 'UNMET' | 'CONTRADICTED' | 'DEPENDENT_ON_REQUEST';
  fatal_if_missing: boolean;
}

export interface RouteItem {
  route_id: string; // Permanent ID
  route_name: string;
  status: RouteStatus;
  exact_objective_advanced: string;
  procedural_vehicle: string;
  jurisdiction_or_authority: string;
  controlling_authority: string[];
  required_elements: RouteElement[];
  supporting_evidence: string[];
  missing_evidence: string[];
  admissibility_issues: string[];
  previously_available: boolean | null;
  previously_considered: boolean | null;
  prior_history: string[];
  deadline: {
    duration: string;
    commencement_event: string;
    commencement_evidence: string[];
    commencement_proved: boolean;
    calculation: string;
    expiry_date: string;
    status: 'EXPIRED' | 'PRESERVED' | 'UNRESOLVED' | 'NOT_APPLICABLE' | 'PENDING_SERVICE';
  };
  required_filing_or_action: string;
  available_remedy: string;
  result_it_can_produce: string;
  result_it_cannot_produce: string;
  strongest_supporting_argument: string;
  strongest_contrary_argument: string;
  likely_decision_maker_response: string;
  consequences_if_unsuccessful: string;
  possible_costs: string;
  cheaper_verification_step: string;
  disproof_attempt: string;
  stop_condition: string;
  confidence: ConfidenceLevel;
  confidence_reason: string;
  source_citations: string[];
  survival_score: number; // 0 to 100 based strictly on verified elements
}

export interface AdversarialReviewItem {
  route_id: string;
  route_name: string;
  bars_checked: Record<string, { passed: boolean; note: string; authority?: string }>;
  strongest_supporting_case: string;
  strongest_contrary_case: string;
  evidence_that_would_defeat: string;
  authority_that_would_defeat: string;
  already_rejected: boolean;
  prior_rejection_reason?: string;
  is_route_genuinely_new: boolean;
  produces_requested_outcome: boolean;
  should_route_survive: boolean;
  survival_verdict: 'SURVIVES_AS_ACTIVE' | 'SURVIVES_AS_EVIDENCE_DEPENDENT' | 'BARRED_DISMISSED';
}

export interface ProhibitedReasoningJump {
  id: string;
  phrase: string;
  trigger_rule: string;
  forensic_warning: string;
  remedy_instruction: string;
}

export interface ElectronicAppealForensicsData {
  preparation_number: string;
  draft_save_date: string;
  last_modified_date: string;
  mandatory_attachments: string[];
  existing_attachments: string[];
  payment_demand_reference: string;
  payment_attempt: string;
  payment_result: 'FAILED' | 'PENDING' | 'SUCCESSFUL';
  final_confirmation_reached: boolean;
  registered_case_number: string | null;
  service_date: string | null;
  audit_log_request_status: 'NOT_SUBMITTED' | 'PENDING' | 'OBTAINED' | 'REFUSED';
  current_procedural_conclusion: string;
}

export interface CorrectionEntry {
  id: string;
  timestamp: string;
  type: 'I_WAS_WRONG' | 'I_OVERSTATED_THIS';
  exact_earlier_claim: string;
  corrected_conclusion: string;
  evidence_causing_correction: string;
  effect_on_roadmap: string;
}

export interface ConclusionLedgerState {
  matter_id: string;
  last_updated: string;
  verified_facts: string[];
  official_records: string[];
  user_assertions: string[];
  assumptions: string[];
  inferences: string[];
  unknowns: string[];
  contradictions_count: number;
  open_routes: string[];
  closed_routes: string[];
  rejected_routes: string[];
  decisive_missing_evidence: string[];
  current_committed_conclusion: string;
  previous_conclusions: string[];
  corrections: CorrectionEntry[];
}

export interface RoadmapPlan {
  primary_route: RouteItem | null;
  exact_next_action: string;
  required_documents: string[];
  deadline_note: string;
  decision_point: string;
  stop_condition: string;
  backup_route: RouteItem | null;
  backup_trigger_condition: string;
  no_route_survived: boolean;
  unsupportable_notice?: string;
}

export interface ResearchCycleRecord {
  cycle_number: number;
  timestamp: string;
  reason_for_next_cycle: string;
  specific_missing_element: string;
  new_query_plan: string[];
  expected_decision_value: string;
  duplicate_of_prior_search: boolean;
  new_evidence_found: number;
  new_authorities_found: number;
  material_change_occurred: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action_type:
    | 'SEARCH_RUN'
    | 'AUTHORITY_RETRIEVED'
    | 'ROUTE_STATUS_CHANGE'
    | 'CORRECTION_LOGGED'
    | 'HUMAN_APPROVAL'
    | 'REPORT_EXPORTED'
    | 'CONTRADICTION_FLAGGED'
    | 'EVIDENCE_ADDED';
  actor: string;
  details: string;
  route_id?: string;
  metadata?: Record<string, any>;
}

export interface Matter {
  id: string;
  title: string;
  jurisdiction: string;
  exact_objective: string; // Required before analysis
  requested_outcome: string;
  matter_type: string;
  relevant_court_or_authority: string;
  known_decision_dates: string[];
  known_deadlines: string[];
  current_procedural_stage: string;
  opposing_party: string;
  existing_representative: string;
  confidentiality_classification: 'CONFIDENTIAL' | 'HIGHLY_CONFIDENTIAL' | 'PRIVILEGED';
  analysis_cutoff_date: string;
  user_factual_narrative: string;
  user_known_concerns: string;
  known_prior_filings: string[];
  known_rejected_or_closed_routes: string[];
  research_status: 'IDLE' | 'RESEARCHING' | 'COMPLETED' | 'STOPPED' | 'SATURATED' | 'ANALYSIS IN PROGRESS';
  confidence_indicator: ConfidenceLevel;
  evidence_completeness_pct: number;
  is_sample_pilot?: boolean;
}
