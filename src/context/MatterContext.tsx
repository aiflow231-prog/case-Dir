/**
 * MATTER CONTEXT & FORENSIC STORE
 *
 * Central persistent state for Case Architect.
 * Synchronizes matter records, evidence vault, chronology, finances,
 * contradictions, authorities, routes, hostile reviews, conclusion ledger,
 * audit logs, and human approval gates.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AdversarialReviewItem,
  AuditLogEntry,
  ChronologyEvent,
  ConclusionLedgerState,
  ContradictionItem,
  CorrectionEntry,
  DocumentIndexItem,
  ElectronicAppealForensicsData,
  EvidenceItem,
  FinancialEntry,
  LegalProposition,
  Matter,
  ResearchCycleRecord,
  RoadmapPlan,
  RouteItem,
  RouteStatus
} from '../types';
import {
  PILOT_ADVERSARIAL_REVIEWS,
  PILOT_CHRONOLOGY,
  PILOT_CONCLUSION_LEDGER,
  PILOT_CONTRADICTIONS,
  PILOT_DOCUMENT_INDEX,
  PILOT_ELECTRONIC_FORENSICS,
  PILOT_EVIDENCE_ITEMS,
  PILOT_FINANCIAL_ENTRIES,
  PILOT_LEGAL_PROPOSITIONS,
  PILOT_MATTER,
  PILOT_ROADMAP,
  PILOT_ROUTES
} from '../data/bahrainPilot';
import { calculateSurvivalScore } from '../utils/routeValidator';
import { evaluateResearchLoopContinuation } from '../utils/boundedLoop';

export interface HumanApprovalRequest {
  id: string;
  action_name: string;
  category:
    | 'FILING_DOCUMENT'
    | 'SUBMITTING_FORM'
    | 'PAYING_FEE'
    | 'DELETING_DRAFT'
    | 'CONTACTING_OPPOSING_PARTY'
    | 'SENDING_CORRESPONDENCE'
    | 'PUBLISHING_CONFIDENTIAL_EVIDENCE'
    | 'ACCUSING_FRAUD_OR_MISCONDUCT'
    | 'ACCESSING_GOVERNMENT_SERVICES'
    | 'CHANGING_ROUTE_TO_ACTIVE';
  impact_warning: string;
  route_id?: string;
  onApprove: () => void;
  onReject?: () => void;
}

interface MatterContextType {
  matter: Matter;
  evidenceList: EvidenceItem[];
  documentIndex: DocumentIndexItem[];
  chronology: ChronologyEvent[];
  financialEntries: FinancialEntry[];
  contradictions: ContradictionItem[];
  propositions: LegalProposition[];
  routes: RouteItem[];
  adversarialReviews: AdversarialReviewItem[];
  conclusionLedger: ConclusionLedgerState;
  electronicForensics: ElectronicAppealForensicsData;
  roadmap: RoadmapPlan;
  auditLogs: AuditLogEntry[];
  researchHistory: ResearchCycleRecord[];
  isResearching: boolean;
  researchCycleLimit: 2 | 5 | 10;
  activeView: string;
  isRedactedView: boolean;
  pendingApproval: HumanApprovalRequest | null;
  exportModalOpen: boolean;
  intakeWizardOpen: boolean;
  researchStopReason: string | null;

  // Actions
  setActiveView: (view: string) => void;
  setIsRedactedView: (val: boolean) => void;
  setExportModalOpen: (val: boolean) => void;
  setIntakeWizardOpen: (val: boolean) => void;
  setResearchCycleLimit: (limit: 2 | 5 | 10) => void;
  requestHumanApproval: (req: Omit<HumanApprovalRequest, 'id'>) => void;
  resolveHumanApproval: (approved: boolean) => void;
  runAnalysisCycle: () => void;
  stopResearch: () => void;
  addEvidenceItem: (item: Omit<EvidenceItem, 'id'>) => void;
  addDocumentIndexItem: (item: Omit<DocumentIndexItem, 'id'>) => void;
  addChronologyEvent: (evt: ChronologyEvent) => void;
  addFinancialEntry: (entry: Omit<FinancialEntry, 'id'>) => void;
  addContradiction: (c: ContradictionItem) => void;
  addLegalProposition: (prop: LegalProposition) => void;
  updateRouteStatus: (routeId: string, newStatus: RouteStatus, reason: string) => void;
  logCorrection: (correction: Omit<CorrectionEntry, 'id' | 'timestamp'>) => void;
  createNewMatter: (newMatter: Matter) => void;
  resetToPilotMatter: () => void;
  logAuditEvent: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
}

const MatterContext = createContext<MatterContextType | null>(null);

const STORAGE_KEY = 'CASE_ARCHITECT_STATE_V1';

export const MatterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [matter, setMatter] = useState<Matter>(PILOT_MATTER);
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>(PILOT_EVIDENCE_ITEMS);
  const [documentIndex, setDocumentIndex] = useState<DocumentIndexItem[]>(PILOT_DOCUMENT_INDEX);
  const [chronology, setChronology] = useState<ChronologyEvent[]>(PILOT_CHRONOLOGY);
  const [financialEntries, setFinancialEntries] = useState<FinancialEntry[]>(PILOT_FINANCIAL_ENTRIES);
  const [contradictions, setContradictions] = useState<ContradictionItem[]>(PILOT_CONTRADICTIONS);
  const [propositions, setPropositions] = useState<LegalProposition[]>(PILOT_LEGAL_PROPOSITIONS);
  const [routes, setRoutes] = useState<RouteItem[]>(PILOT_ROUTES);
  const [adversarialReviews, setAdversarialReviews] = useState<AdversarialReviewItem[]>(PILOT_ADVERSARIAL_REVIEWS);
  const [conclusionLedger, setConclusionLedger] = useState<ConclusionLedgerState>(PILOT_CONCLUSION_LEDGER);
  const [electronicForensics, setElectronicForensics] = useState<ElectronicAppealForensicsData>(PILOT_ELECTRONIC_FORENSICS);
  const [roadmap, setRoadmap] = useState<RoadmapPlan>(PILOT_ROADMAP);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'LOG_INIT',
      timestamp: '2026-10-29T03:59:00Z',
      action_type: 'SEARCH_RUN',
      actor: 'Case Architect Engine',
      details: 'Initial matter baseline constructed for Bahrain Rental Appeal Pilot.'
    }
  ]);
  const [researchHistory, setResearchHistory] = useState<ResearchCycleRecord[]>([]);
  const [isResearching, setIsResearching] = useState<boolean>(false);
  const [researchCycleLimit, setResearchCycleLimit] = useState<2 | 5 | 10>(5);
  const [activeView, setActiveView] = useState<string>('overview');
  const [isRedactedView, setIsRedactedView] = useState<boolean>(false);
  const [pendingApproval, setPendingApproval] = useState<HumanApprovalRequest | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [intakeWizardOpen, setIntakeWizardOpen] = useState<boolean>(false);
  const [researchStopReason, setResearchStopReason] = useState<string | null>(null);

  // Load from local storage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.matter && parsed.matter.id) {
          setMatter(parsed.matter);
          if (parsed.evidenceList) setEvidenceList(parsed.evidenceList);
          if (parsed.chronology) setChronology(parsed.chronology);
          if (parsed.financialEntries) setFinancialEntries(parsed.financialEntries);
          if (parsed.contradictions) setContradictions(parsed.contradictions);
          if (parsed.propositions) setPropositions(parsed.propositions);
          if (parsed.routes) setRoutes(parsed.routes);
          if (parsed.adversarialReviews) setAdversarialReviews(parsed.adversarialReviews);
          if (parsed.conclusionLedger) setConclusionLedger(parsed.conclusionLedger);
          if (parsed.electronicForensics) setElectronicForensics(parsed.electronicForensics);
          if (parsed.roadmap) setRoadmap(parsed.roadmap);
          if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
        }
      }
    } catch (e) {
      console.warn('Failed to restore local state:', e);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      const state = {
        matter,
        evidenceList,
        documentIndex,
        chronology,
        financialEntries,
        contradictions,
        propositions,
        routes,
        adversarialReviews,
        conclusionLedger,
        electronicForensics,
        roadmap,
        auditLogs
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to persist local state:', e);
    }
  }, [
    matter,
    evidenceList,
    documentIndex,
    chronology,
    financialEntries,
    contradictions,
    propositions,
    routes,
    adversarialReviews,
    conclusionLedger,
    electronicForensics,
    roadmap,
    auditLogs
  ]);

  const logAuditEvent = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const newLog: AuditLogEntry = {
      ...entry,
      id: `LOG_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const requestHumanApproval = (req: Omit<HumanApprovalRequest, 'id'>) => {
    const id = `APPR_${Date.now()}`;
    setPendingApproval({ ...req, id });
    logAuditEvent({
      action_type: 'HUMAN_APPROVAL',
      actor: 'Human Gate Controller',
      details: `Gate triggered for action: ${req.action_name}. Consequential approval required.`
    });
  };

  const resolveHumanApproval = (approved: boolean) => {
    if (!pendingApproval) return;
    if (approved) {
      logAuditEvent({
        action_type: 'HUMAN_APPROVAL',
        actor: 'Verified User',
        details: `Consequential action "${pendingApproval.action_name}" APPROVED by human operator.`
      });
      pendingApproval.onApprove();
    } else {
      logAuditEvent({
        action_type: 'HUMAN_APPROVAL',
        actor: 'Verified User',
        details: `Consequential action "${pendingApproval.action_name}" DECLINED by human operator.`
      });
      if (pendingApproval.onReject) pendingApproval.onReject();
    }
    setPendingApproval(null);
  };

  const updateRouteStatus = (routeId: string, newStatus: RouteStatus, reason: string) => {
    // Check if promoting to ACTIVE
    if (newStatus === 'ACTIVE') {
      requestHumanApproval({
        action_name: `Upgrade Route ${routeId} to ACTIVE`,
        category: 'CHANGING_ROUTE_TO_ACTIVE',
        impact_warning: `Upgrading to ACTIVE permits substantive court filings. This legally commits the matter to substantive proceedings and fee liabilities. Confirm that all required elements and proof of non-service are established.`,
        route_id: routeId,
        onApprove: () => {
          applyRouteStatusUpdate(routeId, newStatus, reason);
        }
      });
      return;
    }

    applyRouteStatusUpdate(routeId, newStatus, reason);
  };

  const applyRouteStatusUpdate = (routeId: string, newStatus: RouteStatus, reason: string) => {
    setRoutes(prev =>
      prev.map(r => {
        if (r.route_id === routeId) {
          const updated = { ...r, status: newStatus };
          updated.survival_score = calculateSurvivalScore(updated);
          return updated;
        }
        return r;
      })
    );

    logAuditEvent({
      action_type: 'ROUTE_STATUS_CHANGE',
      actor: 'Route Controller',
      details: `Route ${routeId} status changed to ${newStatus}. Reason: ${reason}`,
      route_id: routeId
    });
  };

  const logCorrection = (correction: Omit<CorrectionEntry, 'id' | 'timestamp'>) => {
    const newEntry: CorrectionEntry = {
      ...correction,
      id: `CORR_${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    setConclusionLedger(prev => ({
      ...prev,
      corrections: [newEntry, ...prev.corrections],
      previous_conclusions: [prev.current_committed_conclusion, ...prev.previous_conclusions],
      current_committed_conclusion: correction.corrected_conclusion,
      last_updated: new Date().toISOString()
    }));

    logAuditEvent({
      action_type: 'CORRECTION_LOGGED',
      actor: 'Decision Controller',
      details: `Correction logged [${correction.type}]: ${correction.corrected_conclusion}`
    });
  };

  const runAnalysisCycle = () => {
    setIsResearching(true);
    setResearchStopReason(null);

    const currentCycleNum = researchHistory.length + 1;

    // Check bounded loop termination conditions
    const decision = evaluateResearchLoopContinuation({
      maxCycles: researchCycleLimit,
      currentCycle: currentCycleNum,
      history: researchHistory,
      activeRouteExists: false, // We look at ordinary appeal R-01 which is still EVIDENCE-DEPENDENT
      allRoutesBarred: false,
      missingFactRequiresExternalParty: true, // Crucial forensic principle: Service proof can only come from court registry!
      userRequestedStop: false
    });

    setTimeout(() => {
      if (!decision.shouldContinue) {
        setIsResearching(false);
        setResearchStopReason(decision.stopReason || 'Bounded research cycle completed.');
        setMatter(m => ({ ...m, research_status: 'SATURATED' }));
        logAuditEvent({
          action_type: 'SEARCH_RUN',
          actor: 'Bounded Research Loop',
          details: `Research terminated: ${decision.stopReason}`
        });
        return;
      }

      // Record simulated cycle
      const cycleRecord: ResearchCycleRecord = {
        cycle_number: currentCycleNum,
        timestamp: new Date().toISOString(),
        reason_for_next_cycle: decision.nextCycleProposal?.reason_for_next_cycle || 'Targeted gap search',
        specific_missing_element: decision.nextCycleProposal?.specific_missing_element || 'Service proof',
        new_query_plan: decision.nextCycleProposal?.new_query_plan || [],
        expected_decision_value: decision.nextCycleProposal?.expected_decision_value || 'Authority resolution',
        duplicate_of_prior_search: currentCycleNum >= 3,
        new_evidence_found: 0,
        new_authorities_found: currentCycleNum === 1 ? 1 : 0,
        material_change_occurred: currentCycleNum === 1
      };

      setResearchHistory(prev => [...prev, cycleRecord]);
      setIsResearching(false);

      logAuditEvent({
        action_type: 'SEARCH_RUN',
        actor: 'Bounded Research Loop',
        details: `Executed Cycle ${currentCycleNum}: ${cycleRecord.reason_for_next_cycle}. Found ${cycleRecord.new_authorities_found} new authority propositions.`
      });
    }, 1200);
  };

  const stopResearch = () => {
    setIsResearching(false);
    setResearchStopReason('User halted research loop via "Stop Research" button.');
    setMatter(m => ({ ...m, research_status: 'STOPPED' }));
    logAuditEvent({
      action_type: 'SEARCH_RUN',
      actor: 'User Operator',
      details: 'Research halted by user override.'
    });
  };

  const addEvidenceItem = (item: Omit<EvidenceItem, 'id'>) => {
    const id = `EV_${Date.now()}`;
    const newItem: EvidenceItem = { ...item, id };
    setEvidenceList(prev => [newItem, ...prev]);
    logAuditEvent({
      action_type: 'EVIDENCE_ADDED',
      actor: 'Evidence Clerk',
      details: `Exhibit ${newItem.exhibit_id} (${newItem.filename}) ingested into Evidence Vault.`
    });
  };

  const addDocumentIndexItem = (item: Omit<DocumentIndexItem, 'id'>) => {
    const id = `IDX_${Date.now()}`;
    setDocumentIndex(prev => [...prev, { ...item, id }]);
  };

  const addChronologyEvent = (evt: ChronologyEvent) => {
    setChronology(prev => [...prev, evt]);
    logAuditEvent({
      action_type: 'SEARCH_RUN',
      actor: 'Chronologist',
      details: `Chronology event ${evt.event_id} added (${evt.date_type}: ${evt.date_and_time}).`
    });
  };

  const addFinancialEntry = (entry: Omit<FinancialEntry, 'id'>) => {
    const id = `FIN_${Date.now()}`;
    setFinancialEntries(prev => [...prev, { ...entry, id }]);
    logAuditEvent({
      action_type: 'SEARCH_RUN',
      actor: 'Forensic Accountant',
      details: `Financial ledger entry added (${entry.category}: ${entry.amount} ${entry.currency}).`
    });
  };

  const addContradiction = (c: ContradictionItem) => {
    setContradictions(prev => [...prev, c]);
    logAuditEvent({
      action_type: 'CONTRADICTION_FLAGGED',
      actor: 'Hostile Reviewer',
      details: `Contradiction ${c.contradiction_id} registered: ${c.type} (${c.materiality}).`
    });
  };

  const addLegalProposition = (prop: LegalProposition) => {
    setPropositions(prev => [...prev, prop]);
    logAuditEvent({
      action_type: 'AUTHORITY_RETRIEVED',
      actor: 'Legal Researcher',
      details: `Authority proposition ${prop.proposition_id} cataloged: ${prop.authority_title}.`
    });
  };

  const createNewMatter = (newMatter: Matter) => {
    setMatter(newMatter);
    setEvidenceList([]);
    setDocumentIndex([]);
    setChronology([]);
    setFinancialEntries([]);
    setContradictions([]);
    setPropositions([]);
    setRoutes([]);
    setAdversarialReviews([]);
    setConclusionLedger({
      matter_id: newMatter.id,
      last_updated: new Date().toISOString(),
      verified_facts: [],
      official_records: [],
      user_assertions: [newMatter.user_factual_narrative],
      assumptions: [],
      inferences: [],
      unknowns: ['Full procedural docket unknown until evidence ingested.'],
      contradictions_count: 0,
      open_routes: [],
      closed_routes: [],
      rejected_routes: [],
      decisive_missing_evidence: ['Primary court decision or administrative order.'],
      current_committed_conclusion: 'Record under initial assembly. No supportable route determined.',
      previous_conclusions: [],
      corrections: []
    });
    setElectronicForensics({
      preparation_number: 'N/A',
      draft_save_date: 'N/A',
      last_modified_date: 'N/A',
      mandatory_attachments: [],
      existing_attachments: [],
      payment_demand_reference: 'N/A',
      payment_attempt: 'N/A',
      payment_result: 'PENDING',
      final_confirmation_reached: false,
      registered_case_number: null,
      service_date: null,
      audit_log_request_status: 'NOT_SUBMITTED',
      current_procedural_conclusion: 'Initial intake complete. Evidence ingestion required.'
    });
    setRoadmap({
      primary_route: null,
      exact_next_action: 'Ingest initial documentary evidence and verify procedural vehicle.',
      required_documents: ['Original decision or notice of action'],
      deadline_note: 'Unknown until decision and service dates are proved.',
      decision_point: 'Verify whether limitation periods remain open.',
      stop_condition: 'No currently supportable route found.',
      backup_route: null,
      backup_trigger_condition: 'N/A',
      no_route_survived: true,
      unsupportable_notice: 'No currently supportable route was found.'
    });
    logAuditEvent({
      action_type: 'SEARCH_RUN',
      actor: 'Matter Intake',
      details: `New matter created: "${newMatter.title}". Exact objective: "${newMatter.exact_objective}".`
    });
  };

  const resetToPilotMatter = () => {
    setMatter(PILOT_MATTER);
    setEvidenceList(PILOT_EVIDENCE_ITEMS);
    setDocumentIndex(PILOT_DOCUMENT_INDEX);
    setChronology(PILOT_CHRONOLOGY);
    setFinancialEntries(PILOT_FINANCIAL_ENTRIES);
    setContradictions(PILOT_CONTRADICTIONS);
    setPropositions(PILOT_LEGAL_PROPOSITIONS);
    setRoutes(PILOT_ROUTES);
    setAdversarialReviews(PILOT_ADVERSARIAL_REVIEWS);
    setConclusionLedger(PILOT_CONCLUSION_LEDGER);
    setElectronicForensics(PILOT_ELECTRONIC_FORENSICS);
    setRoadmap(PILOT_ROADMAP);
    setAuditLogs([
      {
        id: `LOG_RESET_${Date.now()}`,
        timestamp: new Date().toISOString(),
        action_type: 'SEARCH_RUN',
        actor: 'System',
        details: 'Reset workspace state to standard "Bahrain Rental Appeal Pilot".'
      }
    ]);
    setResearchHistory([]);
    setResearchStopReason(null);
  };

  return (
    <MatterContext.Provider
      value={{
        matter,
        evidenceList,
        documentIndex,
        chronology,
        financialEntries,
        contradictions,
        propositions,
        routes,
        adversarialReviews,
        conclusionLedger,
        electronicForensics,
        roadmap,
        auditLogs,
        researchHistory,
        isResearching,
        researchCycleLimit,
        activeView,
        isRedactedView,
        pendingApproval,
        exportModalOpen,
        intakeWizardOpen,
        researchStopReason,
        setActiveView,
        setIsRedactedView,
        setExportModalOpen,
        setIntakeWizardOpen,
        setResearchCycleLimit,
        requestHumanApproval,
        resolveHumanApproval,
        runAnalysisCycle,
        stopResearch,
        addEvidenceItem,
        addDocumentIndexItem,
        addChronologyEvent,
        addFinancialEntry,
        addContradiction,
        addLegalProposition,
        updateRouteStatus,
        logCorrection,
        createNewMatter,
        resetToPilotMatter,
        logAuditEvent
      }}
    >
      {children}
    </MatterContext.Provider>
  );
};

export const useMatter = () => {
  const context = useContext(MatterContext);
  if (!context) throw new Error('useMatter must be used within MatterProvider');
  return context;
};
