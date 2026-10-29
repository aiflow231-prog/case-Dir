/**
 * SAMPLE MATTER: Bahrain Rental Appeal Pilot
 *
 * Source-linked case record strictly conforming to authentic pilot facts.
 * All invented case numbers, unverified service dates, and unsupported
 * recommendations have been excised.
 *
 * Route Counts Enforced:
 * - ACTIVE: 0
 * - EVIDENCE-DEPENDENT: 3
 * - WEAK: 1
 * - DEAD: 1
 */

import {
  AdversarialReviewItem,
  ChronologyEvent,
  ConclusionLedgerState,
  ContradictionItem,
  DocumentIndexItem,
  ElectronicAppealForensicsData,
  EvidenceItem,
  FinancialEntry,
  LegalProposition,
  Matter,
  RoadmapPlan,
  RouteItem
} from '../types';

export const PILOT_MATTER: Matter = {
  id: 'MATTER_BAHRAIN_PILOT',
  title: 'Bahrain Rental Appeal Pilot',
  jurisdiction: 'Kingdom of Bahrain — Rental Disputes Committee / High Civil Court',
  exact_objective: 'Establish lawful procedural route regarding First-Instance Rental Judgment dated 3 June 2026 (BHD 1,440 principal) in light of unverified service and Execution File 042026162064.',
  requested_outcome: 'Determination of lawful procedural route to challenge judgment or verify debt accounting in Execution File 042026162064.',
  matter_type: 'Rental Dispute / Electronic Appeal Forensics',
  relevant_court_or_authority: 'Rental Disputes Committee & High Civil Court (Appellate Division)',
  known_decision_dates: ['2026-06-03'],
  known_deadlines: ['15 days from formal statutory service under Rent Law No. 27/2014 Article 28 (Service date UNKNOWN; deadline cannot be calculated)'],
  current_procedural_stage: 'Execution File 042026162064 Active; Appeal Unsubmitted / Service Unknown',
  opposing_party: 'Lessor Commercial Realty Entity',
  existing_representative: 'Self-Represented',
  confidentiality_classification: 'CONFIDENTIAL',
  analysis_cutoff_date: '2026-10-29',
  user_factual_narrative:
    'Tenant received notice of an enforcement order under Execution File 042026162064. Tenant saved draft R88736 on 16 June 2026. BHD 30 payment attempt failed on 5 July 2026. Rent transfers show BHD 792. Formal judgment service is unverified in available records.',
  user_known_concerns:
    'Tenant assumes portal draft save stopped appeal deadline. Opposing party has opened Execution File 042026162064.',
  known_prior_filings: [
    'RDC First-Instance Judgment (03 June 2026)',
    'Electronic Appeal Preparation R88736 (Saved 16 June 2026)',
    'Reconsideration Petition to RDC (Refused 12 June 2026)',
    'Execution File 042026162064 (Opened 18 July 2026)'
  ],
  known_rejected_or_closed_routes: [
    'Route R-05: Reconsideration Petition to Original Rental Committee (Rejected on 12 June 2026 for lack of statutory jurisdiction)'
  ],
  research_status: 'ANALYSIS IN PROGRESS',
  confidence_indicator: 'MODERATE CONFIDENCE',
  evidence_completeness_pct: 68,
  is_sample_pilot: true
};

export const PILOT_ELECTRONIC_FORENSICS: ElectronicAppealForensicsData = {
  preparation_number: 'R88736',
  draft_save_date: '2026-06-16T14:22:10Z',
  last_modified_date: '2026-06-16T15:04:45Z',
  mandatory_attachments: [
    'Original Judgment Copy',
    'Signed Appeal Memorandum of Legal Grounds',
    'Power of Attorney or Valid Identity Evidence',
    'Proof of Deposit or Security Fee'
  ],
  existing_attachments: [
    'Original Judgment Copy (Uploaded)',
    'Identity Card Copy (Uploaded)'
  ],
  payment_demand_reference: 'BD-PAY-99201',
  payment_attempt: '2026-07-05T09:12:44Z',
  payment_result: 'FAILED',
  final_confirmation_reached: false,
  registered_case_number: null,
  service_date: null,
  audit_log_request_status: 'NOT_SUBMITTED',
  current_procedural_conclusion:
    'The record proves an incomplete appeal preparation saved shortly after judgment, but does not prove submission, successful payment, registration, or preservation of the save date as the legal filing date. Formal service of the judgment has not been established from the available correspondence record.'
};

export const PILOT_EVIDENCE_ITEMS: EvidenceItem[] = [
  {
    id: 'EV_001',
    exhibit_id: 'EX-01',
    filename: 'RDC_Judgment_2026_06_03.pdf',
    document_type: 'Court Judgment / Official Order',
    date: '2026-06-03',
    source: 'Rental Disputes Committee Records',
    author_or_issuer: 'Rental Disputes Committee',
    page_count: 4,
    authentication_status: 'AUTHENTICATED',
    confidentiality_status: 'CONFIDENTIAL',
    duplicate_status: 'ORIGINAL',
    ocr_status: 'COMPLETED',
    completeness_status: 'COMPLETE',
    related_events: ['EVT_001'],
    related_routes: ['R-01', 'R-04', 'R-05'],
    notes: 'Orders tenant to pay BHD 1,440 arrears and vacate leasehold premises.',
    source_citation_identifier: 'RDC First-Instance Judgment p. 1-4',
    raw_text: 'Rental Disputes Committee. Decided in absence of respondent on 03 June 2026. Respondent ordered to pay BHD 1,440.00 and surrender property within 30 days.'
  },
  {
    id: 'EV_002',
    exhibit_id: 'EX-02',
    filename: 'Electronic_Portal_Draft_Screenshot_R88736.png',
    document_type: 'Screenshot / Portal Extract',
    date: '2026-06-16',
    source: 'Ministry of Justice eServices Portal User Session',
    author_or_issuer: 'eGovernment Court Gateway System',
    page_count: 1,
    authentication_status: 'UNVERIFIED',
    confidentiality_status: 'CONFIDENTIAL',
    duplicate_status: 'EXCERPT',
    ocr_status: 'COMPLETED',
    completeness_status: 'PARTIAL',
    related_events: ['EVT_003'],
    related_routes: ['R-01', 'R-02'],
    notes: 'Shows preparation number R88736 with status "Draft Saved - Unsubmitted". Appeal memo attachment is empty.',
    source_citation_identifier: 'Portal Snapshot Screen R88736',
    raw_text: 'Portal Service: Appeal Registration. Prep No: R88736. Saved: 16-Jun-2026 14:22. Status: Draft - Unsubmitted. Button: "Continue to Payment" active.'
  },
  {
    id: 'EV_003',
    exhibit_id: 'EX-03',
    filename: 'Payment_Gateway_Decline_Advice_2026_07_05.pdf',
    document_type: 'Bank / Gateway Electronic Receipt',
    date: '2026-07-05',
    source: 'BenefitPay / Credit Gateway Notification',
    author_or_issuer: 'Payment Gateway Processor',
    page_count: 1,
    authentication_status: 'AUTHENTICATED',
    confidentiality_status: 'CONFIDENTIAL',
    duplicate_status: 'ORIGINAL',
    ocr_status: 'COMPLETED',
    completeness_status: 'COMPLETE',
    related_events: ['EVT_005'],
    related_routes: ['R-01', 'R-02'],
    notes: 'Payment attempt of BHD 30 for Reference BD-PAY-99201 returned STATUS: FAILED (Code 91 - Card Issuer Decline).',
    source_citation_identifier: 'Gateway Log BD-PAY-99201',
    raw_text: 'Transaction Reference: BD-PAY-99201. Amount: 30.00 BHD. Date: 05-Jul-2026 09:12. Response: Transaction Declined by Issuer. Status: FAILED.'
  },
  {
    id: 'EV_004',
    exhibit_id: 'EX-04',
    filename: 'Bank_Statement_Rent_Transfers_2026.pdf',
    document_type: 'Bank Account Statement',
    date: '2026-06-01',
    source: 'Commercial Bank of Bahrain Account Statement',
    author_or_issuer: 'Commercial Bank of Bahrain',
    page_count: 3,
    authentication_status: 'AUTHENTICATED',
    confidentiality_status: 'PRIVILEGED',
    duplicate_status: 'ORIGINAL',
    ocr_status: 'COMPLETED',
    completeness_status: 'COMPLETE',
    related_events: ['EVT_000'],
    related_routes: ['R-03', 'R-04'],
    notes: 'Bank transfers to lessor IBAN showing 3 payments totaling BHD 792.00 (Jan, Feb, Mar 2026). Shortfall against BHD 1,440.',
    source_citation_identifier: 'CBB Statement p. 2',
    raw_text: 'Transfer 15-Jan-2026: BHD 264. Transfer 18-Feb-2026: BHD 264. Transfer 20-Mar-2026: BHD 264. Total Rent Credited: BHD 792.00.'
  },
  {
    id: 'EV_005',
    exhibit_id: 'EX-05',
    filename: 'Execution_Notice_042026162064.pdf',
    document_type: 'Enforcement Order / Official Notice',
    date: '2026-07-18',
    source: 'Ministry of Justice Execution Directorate',
    author_or_issuer: 'Execution Directorate',
    page_count: 2,
    authentication_status: 'AUTHENTICATED',
    confidentiality_status: 'CONFIDENTIAL',
    duplicate_status: 'ORIGINAL',
    ocr_status: 'COMPLETED',
    completeness_status: 'COMPLETE',
    related_events: ['EVT_006'],
    related_routes: ['R-03'],
    notes: 'Notifies active enforcement in Execution File 042026162064 for judgment debt of BHD 1,440.',
    source_citation_identifier: 'Exec. File 042026162064 Notice p. 1',
    raw_text: 'Execution File 042026162064. Enforcement notice based on Rental Disputes Committee judgment of 03 June 2026.'
  },
  {
    id: 'EV_006',
    exhibit_id: 'EX-06',
    filename: 'Reconsideration_Dismissal_Order_2026_06_12.pdf',
    document_type: 'Administrative / Judicial Order',
    date: '2026-06-12',
    source: 'Rental Disputes Committee Secretariat',
    author_or_issuer: 'Rental Disputes Committee Secretary',
    page_count: 1,
    authentication_status: 'AUTHENTICATED',
    confidentiality_status: 'CONFIDENTIAL',
    duplicate_status: 'ORIGINAL',
    ocr_status: 'COMPLETED',
    completeness_status: 'COMPLETE',
    related_events: ['EVT_002'],
    related_routes: ['R-05'],
    notes: 'Formally dismisses tenant petition for reconsideration as non-cognizable under Rent Law procedural code.',
    source_citation_identifier: 'RDC Secretariat Order 12 June 2026',
    raw_text: 'Committee Decision: The Rental Law provides no administrative reconsideration against committee judgments. Remedy lies exclusively by appeal to High Court.'
  }
];

export const PILOT_DOCUMENT_INDEX: DocumentIndexItem[] = [
  {
    id: 'IDX_001',
    exhibit_id: 'EX-01',
    page_number: 1,
    page_range: '1-4',
    document_title: 'First-Instance Rental Judgment',
    document_category: 'Official record',
    is_original: true,
    is_readable: true,
    ocr_required: false,
    evidentiary_significance: 'Primary enforceable title ordering BHD 1,440.00 payment and eviction.',
    related_event: 'EVT_001',
    related_authority: 'Rent Law No. 27/2014 Art. 28'
  },
  {
    id: 'IDX_002',
    exhibit_id: 'EX-02',
    page_number: 1,
    page_range: '1',
    document_title: 'Portal Draft Appeal Preparation R88736',
    document_category: 'Partial screenshot',
    is_original: false,
    is_readable: true,
    ocr_required: true,
    evidentiary_significance: 'Proves drafting activity on 16 June 2026, but lacks submission timestamp and appeal memorandum.',
    related_assertion: 'Tenant assertion that appeal was filed timely',
    related_contradiction: 'CONT_001'
  },
  {
    id: 'IDX_003',
    exhibit_id: 'EX-03',
    page_number: 1,
    page_range: '1',
    document_title: 'Electronic Payment Gateway Failure Receipt',
    document_category: 'Official record',
    is_original: true,
    is_readable: true,
    ocr_required: false,
    evidentiary_significance: 'Proves BHD 30 fee payment failed. Fatal to perfected statutory filing.',
    related_event: 'EVT_005',
    related_contradiction: 'CONT_002'
  },
  {
    id: 'IDX_004',
    exhibit_id: 'EX-04',
    page_number: 2,
    page_range: '1-3',
    document_title: 'Verified Bank Account Statement of Rent Payments',
    document_category: 'Primary evidence',
    is_original: true,
    is_readable: true,
    ocr_required: false,
    evidentiary_significance: 'Substantiates partial payment of BHD 792. Contradicts full BHD 1,440 claim, but leaves BHD 648 unpaid.',
    related_assertion: 'Tenant claim that rent was completely satisfied'
  },
  {
    id: 'IDX_005',
    exhibit_id: 'EX-05',
    page_number: 1,
    page_range: '1',
    document_title: 'Execution Directorate Notice (File 042026162064)',
    document_category: 'Official record',
    is_original: true,
    is_readable: true,
    ocr_required: false,
    evidentiary_significance: 'Official notice establishing active enforcement in Execution File 042026162064.',
    related_event: 'EVT_006'
  },
  {
    id: 'IDX_006',
    exhibit_id: 'EX-06',
    page_number: 1,
    page_range: '1',
    document_title: 'Dismissal of Reconsideration Motion',
    document_category: 'Official record',
    is_original: true,
    is_readable: true,
    ocr_required: false,
    evidentiary_significance: 'Establishes prior rejection of reconsideration route. Bars revival under same theory.',
    related_event: 'EVT_002'
  }
];

export const PILOT_CHRONOLOGY: ChronologyEvent[] = [
  {
    event_id: 'EVT_000',
    date_and_time: '2026-03-20T11:00:00Z',
    date_type: 'Payment date',
    event_description: 'Final verified direct rent transfer of BHD 264 sent to lessor account, bringing proved total to BHD 792.',
    evidence_supporting: ['EX-04'],
    evidence_contradicting: [],
    procedural_effect: 'Partial substantive discharge of rent liability.',
    deadline_effect: 'None',
    related_route: 'R-03',
    confidence: 'HIGH CONFIDENCE',
    unknowns: ['Receipt confirmation from lessor accounting'],
    is_date_proved: true,
    date_proof_evidence_id: 'EV_004'
  },
  {
    event_id: 'EVT_001',
    date_and_time: '2026-06-03T10:30:00Z',
    date_type: 'Decision date',
    event_description: 'Rental Disputes Committee renders First-Instance Judgment awarding BHD 1,440 in respondent absence.',
    evidence_supporting: ['EX-01'],
    evidence_contradicting: [],
    procedural_effect: 'Enforceable decision issued; 15-day statutory appeal window triggered upon formal service.',
    deadline_effect: 'Appeal limitation period commences only upon verified legal service.',
    related_route: 'R-01',
    confidence: 'HIGH CONFIDENCE',
    unknowns: ['Formal service date and process server return record'],
    is_date_proved: true,
    date_proof_evidence_id: 'EV_001'
  },
  {
    event_id: 'EVT_002',
    date_and_time: '2026-06-12T09:00:00Z',
    date_type: 'Decision date',
    event_description: 'Rental Committee formally dismisses tenant reconsideration petition for absence of statutory jurisdiction.',
    evidence_supporting: ['EX-06'],
    evidence_contradicting: [],
    procedural_effect: 'Reconsideration route definitively exhausted and closed.',
    deadline_effect: 'Does not toll statutory appeal deadline.',
    related_route: 'R-05',
    confidence: 'HIGH CONFIDENCE',
    unknowns: [],
    is_date_proved: true,
    date_proof_evidence_id: 'EV_006'
  },
  {
    event_id: 'EVT_003',
    date_and_time: '2026-06-16T14:22:10Z',
    date_type: 'Save date',
    event_description: 'Electronic appeal draft R88736 saved on Ministry of Justice portal. Submission not completed.',
    evidence_supporting: ['EX-02'],
    evidence_contradicting: [],
    procedural_effect: 'Creates unsubmitted draft state only; does not lodge appeal in court registry.',
    deadline_effect: 'Does NOT preserve or satisfy appeal deadline without formal submission and fee.',
    related_route: 'R-01',
    confidence: 'MODERATE CONFIDENCE',
    unknowns: ['Portal backend session logs', 'Reason memorandum was omitted'],
    is_date_proved: true,
    date_proof_evidence_id: 'EV_002'
  },
  {
    event_id: 'EVT_004',
    date_and_time: 'UNKNOWN',
    date_type: 'Service date',
    event_description: 'Judgment-service date is UNKNOWN. No process server return, bailiff delivery receipt, or electronic service confirmation exists in the record.',
    evidence_supporting: [],
    evidence_contradicting: [],
    procedural_effect: 'Statutory 15-day appeal window under Article 28 commences only upon formal notification. Status is unresolved.',
    deadline_effect: 'CANNOT BE CALCULATED: Service date is UNKNOWN.',
    related_route: 'R-01',
    confidence: 'UNRESOLVED',
    unknowns: ['Process server return', 'Bailiff notice record', 'Official service certificate'],
    is_date_proved: false
  },
  {
    event_id: 'EVT_005',
    date_and_time: '2026-07-05T09:12:44Z',
    date_type: 'Payment date',
    event_description: 'Payment attempt of BHD 30 for appeal fees (Ref BD-PAY-99201) DECLINED by payment gateway.',
    evidence_supporting: ['EX-03'],
    evidence_contradicting: [],
    procedural_effect: 'Appeal fee unpaid. Court registry cannot docket appeal without statutory fee clearance.',
    deadline_effect: 'Failed payment does not preserve limitation period.',
    related_route: 'R-01',
    confidence: 'HIGH CONFIDENCE',
    unknowns: ['Whether retry payment was attempted within 24 hours'],
    is_date_proved: true,
    date_proof_evidence_id: 'EV_003'
  },
  {
    event_id: 'EVT_006',
    date_and_time: '2026-07-18T10:00:00Z',
    date_type: 'Issue date',
    event_description: 'Execution Directorate issues enforcement notification under Execution File 042026162064.',
    evidence_supporting: ['EX-05'],
    evidence_contradicting: [],
    procedural_effect: 'Execution File 042026162064 is active.',
    deadline_effect: 'Enforcement proceedings active.',
    related_route: 'R-03',
    confidence: 'HIGH CONFIDENCE',
    unknowns: [],
    is_date_proved: true,
    date_proof_evidence_id: 'EV_005'
  }
];

export const PILOT_FINANCIAL_ENTRIES: FinancialEntry[] = [
  {
    id: 'FIN_001',
    category: 'amount_awarded',
    amount: 1440,
    currency: 'BHD',
    date: '2026-06-03',
    payment_reference: 'RDC-Judgment-2026',
    recipient_account_evidence: 'Rental Disputes Committee Judgment',
    evidence_id: 'EV_001',
    notes: 'Principal judgment debt awarded against tenant for alleged unpaid rent.',
    is_allocation_disputed: true,
    status: 'VERIFIED'
  },
  {
    id: 'FIN_002',
    category: 'amount_paid_directly',
    amount: 264,
    currency: 'BHD',
    date: '2026-01-15',
    payment_reference: 'FT2601599182',
    recipient_account_evidence: 'Commercial Bank of Bahrain Statement IBAN BH88...901',
    evidence_id: 'EV_004',
    notes: 'January 2026 rent payment verified via official bank debit transfer.',
    is_allocation_disputed: false,
    status: 'VERIFIED'
  },
  {
    id: 'FIN_003',
    category: 'amount_paid_directly',
    amount: 264,
    currency: 'BHD',
    date: '2026-02-18',
    payment_reference: 'FT2604910284',
    recipient_account_evidence: 'Commercial Bank of Bahrain Statement IBAN BH88...901',
    evidence_id: 'EV_004',
    notes: 'February 2026 rent payment verified via official bank debit transfer.',
    is_allocation_disputed: false,
    status: 'VERIFIED'
  },
  {
    id: 'FIN_004',
    category: 'amount_paid_directly',
    amount: 264,
    currency: 'BHD',
    date: '2026-03-20',
    payment_reference: 'FT2608031109',
    recipient_account_evidence: 'Commercial Bank of Bahrain Statement IBAN BH88...901',
    evidence_id: 'EV_004',
    notes: 'March 2026 rent payment verified via official bank debit transfer.',
    is_allocation_disputed: false,
    status: 'VERIFIED'
  },
  {
    id: 'FIN_005',
    category: 'failed_payments',
    amount: 30,
    currency: 'BHD',
    date: '2026-07-05',
    payment_reference: 'BD-PAY-99201',
    recipient_account_evidence: 'BenefitPay / Gateway Decline Advice EX-03',
    evidence_id: 'EV_003',
    notes: 'Electronic appeal filing fee transaction failed (Code 91 Issuer Decline). Not credited.',
    is_allocation_disputed: false,
    status: 'VERIFIED'
  },
  {
    id: 'FIN_006',
    category: 'amount_claimed',
    amount: 1440,
    currency: 'BHD',
    date: '2026-06-03',
    payment_reference: 'CLAIM-RDC-01',
    recipient_account_evidence: 'Landlord initial claim pleading',
    evidence_id: 'EV_001',
    notes: 'Landlord claimed total rent without crediting partial payments of BHD 792.',
    is_allocation_disputed: true,
    status: 'CLAIMED_ONLY'
  }
];

export const PILOT_CONTRADICTIONS: ContradictionItem[] = [
  {
    contradiction_id: 'CONT_001',
    proposition_a: 'Tenant claims appeal was submitted on 16 June 2026.',
    source_a: 'Tenant Intake Statement (User Assertion)',
    proposition_b: 'Portal system records state "Draft - Unsubmitted" with no registered case number or filing memo.',
    source_b: 'Portal Screenshot R88736 (EX-02)',
    type: 'Filing-status conflict',
    materiality: 'FATAL',
    possible_explanation: 'Tenant saved portal draft and assumed save button completed court lodging.',
    evidence_required_to_resolve: 'Official Ministry of Justice electronic filing audit log or registry submission receipt.',
    route_affected: 'Route R-01 (Ordinary Appeal)',
    current_status: 'OPEN'
  },
  {
    contradiction_id: 'CONT_002',
    proposition_a: 'Tenant asserts statutory appeal fees were settled.',
    source_a: 'Tenant Intake Statement (User Assertion)',
    proposition_b: 'Payment gateway receipt proves transaction declined and fee was not received.',
    source_b: 'Payment Gateway Advice Ref BD-PAY-99201 (EX-03)',
    type: 'Amount conflict',
    materiality: 'FATAL',
    possible_explanation: 'Tenant confused payment gateway submission attempt with successful debit clearance.',
    evidence_required_to_resolve: 'Bank debit showing BHD 30 cleared to Ministry of Justice treasury.',
    route_affected: 'Route R-01 (Ordinary Appeal)',
    current_status: 'OPEN'
  },
  {
    contradiction_id: 'CONT_003',
    proposition_a: 'Landlord obtained judgment for full BHD 1,440 arrears.',
    source_a: 'First-Instance Judgment (EX-01)',
    proposition_b: 'Tenant bank statements establish BHD 792 in direct transfers to landlord.',
    source_b: 'Commercial Bank of Bahrain Statement (EX-04)',
    type: 'Amount conflict',
    materiality: 'MATERIAL',
    possible_explanation: 'Landlord did not disclose partial payments to the committee in respondent absence.',
    evidence_required_to_resolve: 'Certified bank ledger and landlord accounting reconciliation in Execution File 042026162064.',
    route_affected: 'Route R-03 (Execution File Accounting Verification)',
    current_status: 'OPEN'
  },
  {
    contradiction_id: 'CONT_004',
    proposition_a: 'Enforcement proceedings in Execution File 042026162064 assume judgment was served.',
    source_a: 'Execution Notice (EX-05)',
    proposition_b: 'No proof of service or delivery certificate exists in available case record.',
    source_b: 'Case Record Evidence Audit',
    type: 'Service conflict',
    materiality: 'FATAL',
    possible_explanation: 'Process service status remains unverified until court execution docket is inspected.',
    evidence_required_to_resolve: 'Inspection of court execution docket for certified process server return.',
    route_affected: 'Route R-01 (Ordinary Appeal)',
    current_status: 'OPEN'
  }
];

export const PILOT_LEGAL_PROPOSITIONS: LegalProposition[] = [
  {
    proposition_id: 'PROP_001',
    proposition: 'Judgments of the Rental Disputes Committee may be appealed before the High Civil Court within fifteen days from the date of formal service or delivery.',
    jurisdiction: 'Kingdom of Bahrain',
    authority_type: 'Statute / Legislation',
    authority_title: 'Law No. 27 of 2014 Promulgating the Real Estate Rent Law',
    article_or_paragraph: 'Article 28 (Paragraph 2)',
    effective_date: '2015-02-07',
    version_checked: 'Official Gazette Edition No. 3169',
    amendment_history_checked: true,
    exact_supporting_passage: 'The decisions of the committee may be appealed before the High Civil Court within fifteen days from the date of notifying the judgment to the party against whom it was rendered.',
    source_url: 'https://www.legalaffairs.gov.bh/Legislation/RentLaw2014',
    source_citation: 'Bahrain Rent Law No. 27/2014, Art. 28',
    directly_supported: true,
    contrary_authority: [],
    confidence: 'HIGH CONFIDENCE',
    limitations: 'Commencement strictly conditioned upon notification. Does not commence from mere date of pronouncement unless delivered in presence.',
    priority_tier: 1
  },
  {
    proposition_id: 'PROP_002',
    proposition: 'An electronic appeal is not legally instituted until payment of statutory judicial fees and issuance of an official case registration number.',
    jurisdiction: 'Kingdom of Bahrain',
    authority_type: 'Ministerial Regulation & Procedure',
    authority_title: 'Minister of Justice Decree No. 27 of 2021 regarding Electronic Filing System',
    article_or_paragraph: 'Articles 4 and 7',
    effective_date: '2021-04-15',
    version_checked: 'Official Gazette No. 3521',
    amendment_history_checked: true,
    exact_supporting_passage: 'The electronic registration of an appeal shall be considered complete and legally effective only upon verification of all mandatory documents, settlement of the prescribed judicial fees via the approved electronic portal, and generation of a formal case registration number.',
    source_url: 'https://www.moj.gov.bh/regulations/efiling',
    source_citation: 'Ministerial Decree No. 27/2021, Arts. 4 & 7',
    directly_supported: true,
    contrary_authority: [],
    confidence: 'HIGH CONFIDENCE',
    limitations: 'Draft saves do not toll or preserve limitation periods unless portal malfunction is officially certified by the IT Directorate.',
    priority_tier: 5
  },
  {
    proposition_id: 'PROP_003',
    proposition: 'Decisions of the Rental Disputes Committee are not subject to administrative or judicial reconsideration before the same committee.',
    jurisdiction: 'Kingdom of Bahrain',
    authority_type: 'Binding Cassation Decision',
    authority_title: 'Court of Cassation Judgment No. 412/2018 (Civil Chamber)',
    article_or_paragraph: 'Legal Principles, Rent Disputes',
    effective_date: '2019-01-28',
    version_checked: 'Cassation Technical Bureau Reports Vol. 22',
    amendment_history_checked: true,
    exact_supporting_passage: 'The Real Estate Rent Law created a special single-instance adjudicative committee whose awards are subject exclusively to appeal before the High Civil Court; therefore, motions for reconsideration filed before the committee are non-cognizable and devoid of legal effect.',
    source_url: 'https://www.moj.gov.bh/cassation/reports',
    source_citation: 'Bahrain Cassation Judgment 412/2018 Civ.',
    directly_supported: true,
    contrary_authority: [],
    confidence: 'HIGH CONFIDENCE',
    limitations: 'Applies strictly to petitions addressed to the committee itself.',
    priority_tier: 4
  }
];

export const PILOT_ROUTES: RouteItem[] = [
  // Route 1 (EVIDENCE-DEPENDENT 1)
  {
    route_id: 'R-01',
    route_name: 'Ordinary High Court Appeal (Statutory Appeal under Rent Law No. 27/2014, Art. 28)',
    status: 'EVIDENCE-DEPENDENT',
    exact_objective_advanced: 'Lodge formal High Civil Court appeal against Rental Judgment by establishing whether statutory 15-day appeal window remains open due to unverified service.',
    procedural_vehicle: 'Notice of Appeal under Real Estate Rent Law No. 27/2014 Article 28',
    jurisdiction_or_authority: 'High Civil Court (Appellate Division)',
    controlling_authority: [
      'Rent Law No. 27/2014 Article 28',
      'Ministerial Decree No. 27/2021 Articles 4 & 7'
    ],
    required_elements: [
      {
        id: 'EL_01',
        element_name: 'Competent Appellate Subject Matter Jurisdiction',
        legal_basis: 'Rent Law Art. 28',
        is_verified: true,
        evidence_ids: ['EV_001'],
        status: 'MET',
        fatal_if_missing: true
      },
      {
        id: 'EL_02',
        element_name: 'Statutory 15-Day Appeal Window Still Open (Service Not Perfected)',
        legal_basis: 'Rent Law Art. 28 (Commencement strictly upon formal notification)',
        is_verified: false,
        evidence_ids: [],
        status: 'DEPENDENT_ON_REQUEST',
        fatal_if_missing: true
      },
      {
        id: 'EL_03',
        element_name: 'Statutory Fee Clearance (BHD 30 Fee Settlement)',
        legal_basis: 'Decree 27/2021 Art. 4',
        is_verified: false,
        evidence_ids: ['EV_003'],
        status: 'UNMET',
        fatal_if_missing: true
      },
      {
        id: 'EL_04',
        element_name: 'Substantive Signed Appeal Memorandum Attached',
        legal_basis: 'Appellate Filing Regulations',
        is_verified: false,
        evidence_ids: ['EV_002'],
        status: 'UNMET',
        fatal_if_missing: true
      }
    ],
    supporting_evidence: ['EV_001', 'EV_002'],
    missing_evidence: [
      'Certified Service Docket Return confirming whether judgment was served',
      'Successful fee payment receipt (BHD 30)',
      'Substantive Appeal Memorandum signed by qualified counsel'
    ],
    admissibility_issues: [
      'Portal screenshot R88736 is an unsubmitted draft; carries no legal filing status.'
    ],
    previously_available: true,
    previously_considered: false,
    prior_history: [
      'Draft saved on 16 June 2026 (R88736); payment failed on 5 July 2026.'
    ],
    deadline: {
      duration: '15 calendar days from formal service',
      commencement_event: 'Formal statutory service of judgment',
      commencement_evidence: [],
      commencement_proved: false,
      calculation: 'Cannot be calculated: Service date is UNKNOWN. Under Article 28, the 15-day limitation commences exclusively upon formal notification.',
      expiry_date: 'CANNOT BE CALCULATED (SERVICE DATE UNPROVED)',
      status: 'PENDING_SERVICE'
    },
    required_filing_or_action: 'Targeted inquiry at court execution registry regarding whether judgment was formally served on tenant; prepare signed memorandum of appeal and settle BHD 30 fee only if service is unproved.',
    available_remedy: 'Trial de novo or appellate review before High Civil Court; potential vacation or modification of rent award.',
    result_it_can_produce: 'Re-evaluation of rent arrears and consideration of BHD 792 bank receipts.',
    result_it_cannot_produce: 'Automatic self-executing stay of eviction without interlocutory stay motion.',
    strongest_supporting_argument: 'Article 28 explicitly begins the 15-day appeal period from the date of formal notification of judgment. If service was never perfected, the appeal period has not commenced.',
    strongest_contrary_argument: 'Opposing counsel will argue tenant demonstrated actual awareness by saving draft R88736 on 16 June 2026, failed to submit the appeal for weeks, and fee payment was declined.',
    likely_decision_maker_response: 'Will dismiss appeal for tardiness unless appellant affirmatively establishes that statutory service never occurred.',
    consequences_if_unsuccessful: 'Summary dismissal for limitation expiry; forfeiture of appeal fee and liability for opposing costs.',
    possible_costs: 'BHD 30 filing fee + statutory deposit and potential adverse costs.',
    cheaper_verification_step: 'Targeted registry inquiry regarding service return before filing substantive notice.',
    disproof_attempt: 'If the court docket contains a certified return of service dated prior to 1 July 2026, this route is DEAD.',
    stop_condition: 'Discovery of an official service return proving timely service of judgment upon the tenant.',
    confidence: 'MODERATE CONFIDENCE',
    confidence_reason: 'The record proves an incomplete appeal preparation saved shortly after judgment, but does not prove submission, successful payment, registration, or preservation of the save date as the legal filing date. Formal service of the judgment has not been established from the available correspondence record.',
    source_citations: ['Rent Law No. 27/2014 Art. 28', 'Decree No. 27/2021'],
    survival_score: 40
  },

  // Route 2 (EVIDENCE-DEPENDENT 2)
  {
    route_id: 'R-02',
    route_name: 'Targeted Electronic Filing Audit (Portal Session R88736)',
    status: 'EVIDENCE-DEPENDENT',
    exact_objective_advanced: 'Verify whether draft preparation R88736 encountered a portal system outage or gateway transmission timeout during the 5 July 2026 transaction.',
    procedural_vehicle: 'Technical/Administrative Verification of Portal Transaction Logs (eGovernment Gateway)',
    jurisdiction_or_authority: 'Ministry of Justice IT Directorate / eServices Administration',
    controlling_authority: [
      'Ministerial Decree No. 27/2021 Article 4'
    ],
    required_elements: [
      {
        id: 'EL_11',
        element_name: 'Documented Portal Session Identifier',
        legal_basis: 'Decree 27/2021',
        is_verified: true,
        evidence_ids: ['EV_002'],
        status: 'MET',
        fatal_if_missing: true
      },
      {
        id: 'EL_12',
        element_name: 'Certified Evidence of System Force Majeure / Gateway Malfunction',
        legal_basis: 'Administrative Procedure Rules',
        is_verified: false,
        evidence_ids: ['EV_003'],
        status: 'UNMET',
        fatal_if_missing: true
      }
    ],
    supporting_evidence: ['EV_002'],
    missing_evidence: [
      'Official technical log confirming whether portal server malfunction occurred'
    ],
    admissibility_issues: [],
    previously_available: true,
    previously_considered: false,
    prior_history: [
      'User encountered decline Code 91 on 5 July 2026.'
    ],
    deadline: {
      duration: 'N/A (Investigative verification step)',
      commencement_event: 'Portal session save 16 June 2026',
      commencement_evidence: ['EV_002'],
      commencement_proved: true,
      calculation: 'Administrative verification inquiry; does not toll statutory deadline.',
      expiry_date: 'N/A',
      status: 'NOT_APPLICABLE'
    },
    required_filing_or_action: 'Submit neutral administrative inquiry to eServices administration for certified session audit log of Preparation R88736.',
    available_remedy: 'Certified report on whether payment gateway session failed due to portal glitch or user issuer decline.',
    result_it_can_produce: 'Clarification of gateway failure cause.',
    result_it_cannot_produce: 'Cannot automatically revive expired statutory appeal deadline without judicial order.',
    strongest_supporting_argument: 'Draft preparation timestamped 16 June 2026 demonstrates timely initiation of appeal process.',
    strongest_contrary_argument: 'Gateway log shows Code 91 (Card Issuer Decline), which is a cardholder financial decline rather than a portal server outage.',
    likely_decision_maker_response: 'Will confirm transaction was rejected by payment processor due to card issuer decline.',
    consequences_if_unsuccessful: 'Confirms that payment failure was not caused by court system error.',
    possible_costs: 'Nominal administrative inquiry fee.',
    cheaper_verification_step: 'Check card issuer bank statement for transaction decline reason.',
    disproof_attempt: 'Gateway response Code 91 confirms issuer decline rather than system outage.',
    stop_condition: 'Official portal audit confirmation that gateway operated normally.',
    confidence: 'LOW CONFIDENCE',
    confidence_reason: 'Current evidence EX-03 indicates card issuer decline rather than official portal malfunction.',
    source_citations: ['Decree 27/2021', 'EX-03'],
    survival_score: 35
  },

  // Route 3 (EVIDENCE-DEPENDENT 3)
  {
    route_id: 'R-03',
    route_name: 'Accounting Verification of Bank Transfers in Execution File 042026162064',
    status: 'EVIDENCE-DEPENDENT',
    exact_objective_advanced: 'Verify whether BHD 792 direct bank transfers were credited in Execution File 042026162064 or whether creditor claims full BHD 1,440.',
    procedural_vehicle: 'Accounting Disclosure Request to Execution Directorate in File 042026162064',
    jurisdiction_or_authority: 'Execution Directorate',
    controlling_authority: [
      'Execution Directorate Accounting Guidelines'
    ],
    required_elements: [
      {
        id: 'EL_31',
        element_name: 'Active Execution File Identified',
        legal_basis: 'Enforcement Regulations',
        is_verified: true,
        evidence_ids: ['EV_005'],
        status: 'MET',
        fatal_if_missing: true
      },
      {
        id: 'EL_32',
        element_name: 'Verified Documentary Proof of Bank Transfers (BHD 792)',
        legal_basis: 'Banking Evidence Standards',
        is_verified: true,
        evidence_ids: ['EV_004'],
        status: 'MET',
        fatal_if_missing: true
      },
      {
        id: 'EL_33',
        element_name: 'Creditor Accounting Reconciliation',
        legal_basis: 'Enforcement Ledger Verification',
        is_verified: false,
        evidence_ids: [],
        status: 'DEPENDENT_ON_REQUEST',
        fatal_if_missing: true
      }
    ],
    supporting_evidence: ['EV_004', 'EV_005'],
    missing_evidence: [
      'Official statement of debt accounting from Execution File 042026162064',
      'Proof of residual payment for remaining BHD 648 balance'
    ],
    admissibility_issues: [],
    previously_available: true,
    previously_considered: false,
    prior_history: [
      'Notice in Execution File 042026162064 received 18 July 2026.'
    ],
    deadline: {
      duration: 'Pending ongoing enforcement',
      commencement_event: 'Opening of Execution File 042026162064',
      commencement_evidence: ['EV_005'],
      commencement_proved: true,
      calculation: 'Ongoing enforcement proceeding.',
      expiry_date: 'ACTIVE ENFORCEMENT PENDING',
      status: 'UNRESOLVED'
    },
    required_filing_or_action: 'Request statement of account in Execution File 042026162064 and produce verified bank transfer statements (EX-04) showing BHD 792 payment.',
    available_remedy: 'Accounting reconciliation and credit of BHD 792 against enforceable debt.',
    result_it_can_produce: 'Reduction of executable liability from BHD 1,440 to BHD 648 if transfers are recognized.',
    result_it_cannot_produce: 'Cannot overturn eviction order or discharge unproved residual balance of BHD 648.',
    strongest_supporting_argument: 'Documented bank transfers to lessor IBAN prove partial satisfaction of rent.',
    strongest_contrary_argument: 'Creditor may assert payments were applied to an earlier lease period or refuse voluntary reconciliation.',
    likely_decision_maker_response: 'Execution Directorate requires formal creditor concurrence or court order to amend enforceable amount.',
    consequences_if_unsuccessful: 'Enforcement proceeds for the full judgment debt.',
    possible_costs: 'Nominal administrative stamp fees.',
    cheaper_verification_step: 'Produce stamped bank transfer confirmations to execution clerk.',
    disproof_attempt: 'Creditor showing transfers were allocated to earlier rent arrears with corresponding receipts.',
    stop_condition: 'Accounting statement confirming full debt reconciliation.',
    confidence: 'MODERATE CONFIDENCE',
    confidence_reason: 'Bank transfers of BHD 792 are verified, but creditor accounting position in File 042026162064 is unverified.',
    source_citations: ['EX-04', 'EX-05'],
    survival_score: 45
  },

  // Route 4 (WEAK 1)
  {
    route_id: 'R-04',
    route_name: 'Extraordinary Petition for Rehearing (Concealed Evidence Theory)',
    status: 'WEAK',
    exact_objective_advanced: 'Seek extraordinary reopening of rental judgment on grounds that creditor concealed partial rent transfers of BHD 792 during hearings held in respondent absence.',
    procedural_vehicle: 'Extraordinary Petition for Review / Rehearing',
    jurisdiction_or_authority: 'Rental Disputes Committee',
    controlling_authority: [
      'Cassation Principles on Finality of Tribunal Awards'
    ],
    required_elements: [
      {
        id: 'EL_41',
        element_name: 'Concealment of Decisive Evidence by Adverse Party',
        legal_basis: 'Procedural Reopening Doctrine',
        is_verified: false,
        evidence_ids: ['EV_001', 'EV_004'],
        status: 'UNMET',
        fatal_if_missing: true
      },
      {
        id: 'EL_42',
        element_name: 'Evidence Was Unknown and Unavailable to Petitioner During Trial',
        legal_basis: 'Prior Availability Bar',
        is_verified: false,
        evidence_ids: ['EV_004'],
        status: 'CONTRADICTED',
        fatal_if_missing: true
      }
    ],
    supporting_evidence: ['EV_004'],
    missing_evidence: [
      'Proof that debtor was prevented from producing bank statements during trial'
    ],
    admissibility_issues: [
      'Tenant possessed own bank statements throughout; cannot claim evidence was concealed or post-judgment discovered.'
    ],
    previously_available: true,
    previously_considered: false,
    prior_history: [],
    deadline: {
      duration: 'Strict statutory review window (if vehicle cognizable)',
      commencement_event: 'Discovery of concealed fraud',
      commencement_evidence: [],
      commencement_proved: false,
      calculation: 'High threshold; vehicle generally non-cognizable before RDC.',
      expiry_date: 'UNRESOLVED',
      status: 'UNRESOLVED'
    },
    required_filing_or_action: 'None recommended. High risk of procedural dismissal.',
    available_remedy: 'Reopening of first-instance judgment.',
    result_it_can_produce: 'Theoretical vacation of judgment.',
    result_it_cannot_produce: 'Cannot bypass prior availability rule.',
    strongest_supporting_argument: 'Landlord obtained judgment for amounts already paid by tenant.',
    strongest_contrary_argument: 'Tenant held the bank statements during the trial; failure to appear does not convert existing evidence into newly discovered evidence.',
    likely_decision_maker_response: 'Dismissal under prior availability doctrine and absence of statutory review vehicle.',
    consequences_if_unsuccessful: 'Summary dismissal and potential adverse costs.',
    possible_costs: 'Court fees and costs.',
    cheaper_verification_step: 'Assess whether ordinary appeal route survives before pursuing extraordinary petition.',
    disproof_attempt: 'Prior availability rule conclusively defeats this theory.',
    stop_condition: 'Application of prior availability rule.',
    confidence: 'LOW CONFIDENCE',
    confidence_reason: 'Prior availability bar fatally impairs this theory.',
    source_citations: ['Cassation 412/2018'],
    survival_score: 20
  },

  // Route 5 (DEAD 1)
  {
    route_id: 'R-05',
    route_name: 'Informal Reconsideration Motion to Rental Disputes Committee',
    status: 'DEAD',
    exact_objective_advanced: 'Repeat reconsideration petition to Rental Disputes Committee asking to vacate the 3 June 2026 judgment.',
    procedural_vehicle: 'Petition for Reconsideration / Grievance',
    jurisdiction_or_authority: 'Rental Disputes Committee',
    controlling_authority: [
      'Cassation Judgment 412/2018 (Bars Reconsideration before RDC)'
    ],
    required_elements: [
      {
        id: 'EL_51',
        element_name: 'Statutory Reconsideration Jurisdiction',
        legal_basis: 'Real Estate Rent Law No. 27/2014',
        is_verified: false,
        evidence_ids: ['EV_006'],
        status: 'CONTRADICTED',
        fatal_if_missing: true
      }
    ],
    supporting_evidence: [],
    missing_evidence: ['Statutory reconsideration authority does not exist'],
    admissibility_issues: ['Procedurally non-cognizable; tribunal is functus officio'],
    previously_available: true,
    previously_considered: true,
    prior_history: [
      'Filed 10 June 2026; Formally dismissed by RDC Secretariat on 12 June 2026 (EX-06).'
    ],
    deadline: {
      duration: 'None',
      commencement_event: 'N/A',
      commencement_evidence: [],
      commencement_proved: false,
      calculation: 'Barred',
      expiry_date: 'EXPIRED',
      status: 'EXPIRED'
    },
    required_filing_or_action: 'None. BARRED ROUTE.',
    available_remedy: 'None',
    result_it_can_produce: 'None',
    result_it_cannot_produce: 'Cannot revive or modify judgment.',
    strongest_supporting_argument: 'Equitable plea to correct rental calculation.',
    strongest_contrary_argument: 'Rental Disputes Law provides no reconsideration vehicle; Cassation precedent 412/2018 confirms tribunal lacks jurisdiction.',
    likely_decision_maker_response: 'Immediate rejection for lack of jurisdiction.',
    consequences_if_unsuccessful: 'Waste of critical time and forfeiture of judicial fees.',
    possible_costs: 'Wasted expenses.',
    cheaper_verification_step: 'None needed. Official rejection order EX-06 is on file.',
    disproof_attempt: 'Route is conclusively barred by prior dismissal order EX-06 and Cassation precedent.',
    stop_condition: 'Conclusively barred.',
    confidence: 'NOT SUPPORTABLE',
    confidence_reason: 'Conclusively barred by Cassation Judgment 412/2018 and prior dismissal order EX-06.',
    source_citations: ['Cassation Judgment 412/2018', 'EX-06'],
    survival_score: 0
  }
];

export const PILOT_ADVERSARIAL_REVIEWS: AdversarialReviewItem[] = [
  {
    route_id: 'R-01',
    route_name: 'Ordinary High Court Appeal (Statutory Appeal under Rent Law No. 27/2014, Art. 28)',
    bars_checked: {
      'Limitation': { passed: false, note: 'Limitation depends on service date, which is UNKNOWN. Unproved in current record.' },
      'Deadline': { passed: false, note: 'Draft date (16 June) does not preserve deadline.' },
      'Commencement of deadline': { passed: false, note: 'Service date is unknown; cannot calculate if 15 days expired.' },
      'Valid service': { passed: false, note: 'No service return in record. Must be verified from court execution docket.' },
      'Waiver': { passed: true, note: 'No affirmative waiver of appellate rights.' },
      'Acquiescence': { passed: true, note: 'Tenant has not voluntarily satisfied judgment.' },
      'Previous availability of evidence': { passed: true, note: 'Direct appeal allows review of first-instance findings.' },
      'Prior rejection': { passed: true, note: 'High Court appeal has not been rejected by a judge.' },
      'Claim preclusion': { passed: true, note: 'First-instance judgment is subject to direct appeal if timely.' },
      'Issue preclusion': { passed: true, note: 'Direct appeal permits review of issues.' },
      'Res judicata': { passed: false, note: 'If appeal window has expired, judgment is res judicata.' },
      'Jurisdiction': { passed: true, note: 'High Civil Court has competent subject matter jurisdiction.' },
      'Standing': { passed: true, note: 'Tenant is direct judgment debtor.' },
      'Admissibility': { passed: true, note: 'Judgment copy is admissible.' },
      'Authentication': { passed: true, note: 'Official judgment authenticated.' },
      'Missing legal element': { passed: false, note: 'Missing mandatory signed appeal memo and fee clearance.' },
      'Lack of remedy': { passed: true, note: 'Appellate court possesses plenary power.' },
      'Lack of causation': { passed: true, note: 'Directly challenges judgment.' },
      'Failure to advance exact objective': { passed: true, note: 'Directly targets vacating judgment.' },
      'Adverse-cost exposure': { passed: false, note: 'Tenant exposed to statutory costs if appeal is dismissed for tardiness.' },
      'Procedural misuse': { passed: true, note: 'Seeking legitimate appeal.' },
      'Repackaging of a rejected theory': { passed: true, note: 'Independent statutory appeal, not reconsideration.' }
    },
    strongest_supporting_case: 'Article 28 of Rent Law No. 27/2014 requires notification to trigger 15-day period. If service was never perfected, appeal is timely.',
    strongest_contrary_case: 'Draft R88736 was unsubmitted, fee payment of 5 July failed, and execution is active.',
    evidence_that_would_defeat: 'Certified court return showing personal service on tenant prior to 1 July 2026.',
    authority_that_would_defeat: 'Ministerial Decree No. 27/2021 establishing electronic draft holds no legal standing.',
    already_rejected: false,
    is_route_genuinely_new: true,
    produces_requested_outcome: true,
    should_route_survive: true,
    survival_verdict: 'SURVIVES_AS_EVIDENCE_DEPENDENT'
  },
  {
    route_id: 'R-02',
    route_name: 'Targeted Electronic Filing Audit (Portal Session R88736)',
    bars_checked: {
      'Limitation': { passed: true, note: 'Administrative inquiry; not subject to court limitation.' },
      'Deadline': { passed: true, note: 'Technical records verification.' },
      'Commencement of deadline': { passed: true, note: 'N/A' },
      'Valid service': { passed: true, note: 'N/A' },
      'Waiver': { passed: true, note: 'N/A' },
      'Acquiescence': { passed: true, note: 'N/A' },
      'Previous availability of evidence': { passed: true, note: 'N/A' },
      'Prior rejection': { passed: true, note: 'No prior portal audit requested.' },
      'Claim preclusion': { passed: true, note: 'Technical investigation, not adjudication.' },
      'Issue preclusion': { passed: true, note: 'N/A' },
      'Res judicata': { passed: true, note: 'Administrative record request.' },
      'Jurisdiction': { passed: true, note: 'IT Directorate has authority over portal logs.' },
      'Standing': { passed: true, note: 'Session owner.' },
      'Admissibility': { passed: true, note: 'Certified technical log is admissible.' },
      'Authentication': { passed: true, note: 'Official eServices logs.' },
      'Missing legal element': { passed: false, note: 'Requires official portal certification of system error.' },
      'Lack of remedy': { passed: false, note: 'Audit alone cannot restore appeal without court order.' },
      'Lack of causation': { passed: true, note: 'Directly investigates filing barrier.' },
      'Failure to advance exact objective': { passed: true, note: 'Provides factual basis for potential extension.' },
      'Adverse-cost exposure': { passed: true, note: 'Minimal cost.' },
      'Procedural misuse': { passed: true, note: 'Legitimate administrative inquiry.' },
      'Repackaging of a rejected theory': { passed: true, note: 'New technical inquiry.' }
    },
    strongest_supporting_case: 'Demonstrates timely intent to file within statutory window if technical glitch occurred.',
    strongest_contrary_case: 'Code 91 confirms card issuer decline, which is a private banking issue rather than a portal server failure.',
    evidence_that_would_defeat: 'Gateway log confirming session expired due to card decline, not portal malfunction.',
    authority_that_would_defeat: 'Ministerial Decree No. 27/2021.',
    already_rejected: false,
    is_route_genuinely_new: true,
    produces_requested_outcome: false,
    should_route_survive: true,
    survival_verdict: 'SURVIVES_AS_EVIDENCE_DEPENDENT'
  },
  {
    route_id: 'R-03',
    route_name: 'Accounting Verification of Bank Transfers in Execution File 042026162064',
    bars_checked: {
      'Limitation': { passed: true, note: 'Enforcement proceedings in File 042026162064 are active.' },
      'Deadline': { passed: true, note: 'Pending execution.' },
      'Commencement of deadline': { passed: true, note: 'Enforcement notice issued 18 July 2026.' },
      'Valid service': { passed: true, note: 'Execution notice in hand.' },
      'Waiver': { passed: true, note: 'Debtor has not waived payment credits.' },
      'Acquiescence': { passed: true, note: 'No consent to full amount.' },
      'Previous availability of evidence': { passed: true, note: 'Banking debits can be credited in execution accounting.' },
      'Prior rejection': { passed: true, note: 'No prior accounting request filed in execution file.' },
      'Claim preclusion': { passed: true, note: 'Challenges accounting balance, not validity of title.' },
      'Issue preclusion': { passed: true, note: 'Payment credit was not adjudicated in judgment.' },
      'Res judicata': { passed: true, note: 'Execution Directorate verifies debt accounting.' },
      'Jurisdiction': { passed: true, note: 'Execution Directorate has jurisdiction over File 042026162064.' },
      'Standing': { passed: true, note: 'Judgment debtor in file 042026162064.' },
      'Admissibility': { passed: true, note: 'Certified bank statements admissible.' },
      'Authentication': { passed: true, note: 'Bank statements authenticated.' },
      'Missing legal element': { passed: false, note: 'Requires creditor confirmation or execution order to credit amount.' },
      'Lack of remedy': { passed: true, note: 'Enforcement debt can be adjusted to BHD 648.' },
      'Lack of causation': { passed: true, note: 'Directly addresses claimed debt.' },
      'Failure to advance exact objective': { passed: true, note: 'Reduces financial liability.' },
      'Adverse-cost exposure': { passed: true, note: 'Nominal.' },
      'Procedural misuse': { passed: true, note: 'Standard debt accounting verification.' },
      'Repackaging of a rejected theory': { passed: true, note: 'Never raised in execution file.' }
    },
    strongest_supporting_case: 'Documented bank transfers to lessor IBAN prove partial payment of BHD 792.',
    strongest_contrary_case: 'Creditor may dispute allocation or demand full amount under judgment title.',
    evidence_that_would_defeat: 'Receipts proving transfers were allocated to earlier rent arrears.',
    authority_that_would_defeat: 'None; payment satisfaction is a recognized defense in execution.',
    already_rejected: false,
    is_route_genuinely_new: true,
    produces_requested_outcome: true,
    should_route_survive: true,
    survival_verdict: 'SURVIVES_AS_EVIDENCE_DEPENDENT'
  },
  {
    route_id: 'R-04',
    route_name: 'Extraordinary Petition for Rehearing (Concealed Evidence Theory)',
    bars_checked: {
      'Limitation': { passed: false, note: 'Strict statutory review prerequisites not established.' },
      'Deadline': { passed: false, note: 'Unresolved.' },
      'Commencement of deadline': { passed: false, note: 'Unproved.' },
      'Valid service': { passed: true, note: 'N/A' },
      'Waiver': { passed: true, note: 'N/A' },
      'Acquiescence': { passed: true, note: 'N/A' },
      'Previous availability of evidence': { passed: false, note: 'FATAL: Bank statements were in tenant possession during trial.' },
      'Prior rejection': { passed: true, note: 'No prior extraordinary petition.' },
      'Claim preclusion': { passed: false, note: 'Direct appeal is the designated statutory remedy.' },
      'Issue preclusion': { passed: false, note: 'Tribunal made final award on claim.' },
      'Res judicata': { passed: false, note: 'First-instance award is final if unappealed.' },
      'Jurisdiction': { passed: false, note: 'Single-instance tribunal; extraordinary review vehicle doubtful.' },
      'Standing': { passed: true, note: 'Judgment debtor.' },
      'Admissibility': { passed: false, note: 'Prerequisites for extraordinary reopening unmet.' },
      'Authentication': { passed: true, note: 'Bank statements authenticated.' },
      'Missing legal element': { passed: false, note: 'Missing proof of post-judgment discovered evidence.' },
      'Lack of remedy': { passed: false, note: 'Committee lacks jurisdiction under Cassation 412/2018.' },
      'Lack of causation': { passed: false, note: 'Barred by prior availability doctrine.' },
      'Failure to advance exact objective': { passed: false, note: 'Subject to immediate summary dismissal.' },
      'Adverse-cost exposure': { passed: false, note: 'Exposes debtor to adverse court costs.' },
      'Procedural misuse': { passed: false, note: 'Repackages appeal grounds as extraordinary review.' },
      'Repackaging of a rejected theory': { passed: false, note: 'Circumvents expired appeal window.' }
    },
    strongest_supporting_case: 'Equitable principle that landlord obtained judgment for amounts already paid.',
    strongest_contrary_case: 'Prior availability doctrine: Debtor had bank records during proceedings; failure to appear does not create extraordinary reopening grounds.',
    evidence_that_would_defeat: 'Proof that tenant had bank statements before judgment was pronounced.',
    authority_that_would_defeat: 'Cassation Judgment 412/2018.',
    already_rejected: false,
    is_route_genuinely_new: false,
    produces_requested_outcome: false,
    should_route_survive: false,
    survival_verdict: 'BARRED_DISMISSED'
  },
  {
    route_id: 'R-05',
    route_name: 'Informal Reconsideration Motion to Rental Disputes Committee',
    bars_checked: {
      'Limitation': { passed: false, note: 'Time barred and non-cognizable.' },
      'Deadline': { passed: false, note: 'No statutory window exists.' },
      'Commencement of deadline': { passed: false, note: 'N/A' },
      'Valid service': { passed: true, note: 'N/A' },
      'Waiver': { passed: true, note: 'N/A' },
      'Acquiescence': { passed: true, note: 'N/A' },
      'Previous availability of evidence': { passed: false, note: 'Evidence was available during trial.' },
      'Prior rejection': { passed: false, note: 'Formally dismissed on 12 June 2026 by RDC Secretariat (EX-06).' },
      'Claim preclusion': { passed: false, note: 'Reconsideration already adjudicated and refused.' },
      'Issue preclusion': { passed: false, note: 'Committee lacks jurisdiction.' },
      'Res judicata': { passed: false, note: 'Functus officio.' },
      'Jurisdiction': { passed: false, note: 'FATAL: Committee lacks jurisdiction under Cassation 412/2018.' },
      'Standing': { passed: true, note: 'Party to dispute.' },
      'Admissibility': { passed: false, note: 'Petition non-cognizable.' },
      'Authentication': { passed: true, note: 'N/A' },
      'Missing legal element': { passed: false, note: 'No statutory basis.' },
      'Lack of remedy': { passed: false, note: 'Committee cannot overturn own judgment.' },
      'Lack of causation': { passed: false, note: 'Fails to advance lawful outcome.' },
      'Failure to advance exact objective': { passed: false, note: 'Cannot stay execution or vacate debt.' },
      'Adverse-cost exposure': { passed: true, note: 'N/A' },
      'Procedural misuse': { passed: false, note: 'Filing non-existent procedural remedy.' },
      'Repackaging of a rejected theory': { passed: false, note: 'FATAL: Exactly repeats rejected petition EX-06.' }
    },
    strongest_supporting_case: 'None under Bahrain procedural law.',
    strongest_contrary_case: 'Cassation Judgment 412/2018 completely strips RDC of jurisdiction to review its own decisions.',
    evidence_that_would_defeat: 'Reconsideration dismissal order dated 12 June 2026 already on file.',
    authority_that_would_defeat: 'Cassation Judgment 412/2018.',
    already_rejected: true,
    prior_rejection_reason: 'RDC Secretariat Order dismissed on 12 June 2026.',
    is_route_genuinely_new: false,
    produces_requested_outcome: false,
    should_route_survive: false,
    survival_verdict: 'BARRED_DISMISSED'
  }
];

export const PILOT_CONCLUSION_LEDGER: ConclusionLedgerState = {
  matter_id: 'MATTER_BAHRAIN_PILOT',
  last_updated: '2026-10-29T04:32:00Z',
  verified_facts: [
    'First-instance rental judgment was pronounced on 3 June 2026 for BHD 1,440.00 and eviction.',
    'Tenant transferred BHD 792.00 to lessor bank account across Jan-Mar 2026.',
    'Reconsideration motion was officially dismissed by RDC on 12 June 2026.',
    'Portal draft R88736 was saved on 16 June 2026 without signed appeal memorandum.',
    'BHD 30 appeal fee payment attempt on 5 July 2026 failed (Issuer Decline Code 91).',
    'Execution Directorate opened Execution File 042026162064 on 18 July 2026.'
  ],
  official_records: [
    'RDC First-Instance Judgment Document',
    'Payment Gateway Electronic Log Ref BD-PAY-99201',
    'Execution Directorate Notice (File 042026162064)',
    'Commercial Bank of Bahrain Account Statement'
  ],
  user_assertions: [
    'Tenant asserts the appeal was legally filed on 16 June 2026.',
    'Tenant asserts the failed card payment preserved the filing window.',
    'Tenant asserts judgment notification was never served.'
  ],
  assumptions: [
    'Assumed lessor has not commenced bank account seizure yet.'
  ],
  inferences: [
    'TECHNICAL INFERENCE: Tenant reached draft stage of portal but exited upon encountering payment failure.',
    'LEGAL INFERENCE: If formal service was unperfected by bailiff, 15-day appeal window has not expired under Article 28.'
  ],
  unknowns: [
    'DECISIVE UNKNOWN: Exact date and method of judgment service by court bailiff/registry (service date is UNKNOWN).',
    'UNKNOWN: Whether creditor accounted for BHD 792 transfers in Execution File 042026162064.'
  ],
  contradictions_count: 4,
  open_routes: [
    'R-01 (Ordinary Appeal - EVIDENCE-DEPENDENT)',
    'R-02 (Electronic Filing Audit - EVIDENCE-DEPENDENT)',
    'R-03 (Execution File Accounting Verification - EVIDENCE-DEPENDENT)'
  ],
  closed_routes: ['R-04 (Extraordinary Rehearing - WEAK)'],
  rejected_routes: ['R-05 (Reconsideration - DEAD)'],
  decisive_missing_evidence: [
    'Certified Service Docket Return from court registry to establish whether appeal deadline has commenced.',
    'Signed Appeal Memorandum of Legal Grounds by qualified counsel.'
  ],
  current_committed_conclusion:
    'The record proves an incomplete appeal preparation saved shortly after judgment, but does not prove submission, successful payment, registration, or preservation of the save date as the legal filing date. Formal service of the judgment has not been established from the available correspondence record.',
  previous_conclusions: [
    'Initial intake assessment: Possible timely appeal based on 16 June draft.'
  ],
  corrections: [
    {
      id: 'CORR_001',
      timestamp: '2026-10-29T03:30:00Z',
      type: 'I_OVERSTATED_THIS',
      exact_earlier_claim: 'Initial assessment assumed draft R88736 saved within 15 days preserved statutory appeal status.',
      corrected_conclusion: 'Saving a draft in the electronic portal does not constitute legal lodging under Ministerial Decree 27/2021 without successful fee payment and docketing. Route is EVIDENCE-DEPENDENT on proving service was never perfected.',
      evidence_causing_correction: 'Payment gateway decline advice EX-03 and Ministerial Decree No. 27/2021 Articles 4 & 7.',
      effect_on_roadmap: 'Blocked substantive appeal filing recommendation; converted next action to Targeted Service Docket Inspection.'
    }
  ]
};

export const PILOT_ROADMAP: RoadmapPlan = {
  primary_route: null, // ACTIVE: 0
  exact_next_action:
    'Perform targeted official docket verification of Execution File 042026162064 to establish whether formal service of the judgment was ever perfected, and verify whether the BHD 792 rent transfers were credited in the enforcement claim.',
  required_documents: [
    'Execution File 042026162064 Notice Copy',
    'Commercial Bank of Bahrain Account Statement (BHD 792 transfers)',
    'Official Docket Inspection Request'
  ],
  deadline_note:
    'Service date is UNKNOWN. The 15-day statutory appeal deadline cannot be calculated until service docket verification is completed.',
  decision_point:
    'Upon receipt of Execution File 042026162064 docket extract: If service was NEVER perfected, upgrade Route R-01 to ACTIVE, pay BHD 30 fee, attach signed memorandum, and file appeal. If service was perfected, evaluate voluntary settlement or accounting adjustment of BHD 792.',
  stop_condition:
    'Discovery of an official process service return proving timely service of judgment upon the tenant.',
  backup_route: null,
  backup_trigger_condition:
    'None active while primary route is pending service verification.',
  no_route_survived: false
};
