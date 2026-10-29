import React from 'react';
import { useMatter } from '../context/MatterContext';
import {
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
  Server,
  FileText,
  DollarSign,
  Scale,
  XCircle,
  Play
} from 'lucide-react';
import { auditChronologyEvents } from '../utils/chronologyEngine';

export const MatterOverview: React.FC = () => {
  const {
    matter,
    conclusionLedger,
    routes,
    chronology,
    contradictions,
    financialEntries,
    setActiveView,
    runAnalysisCycle,
    isResearching
  } = useMatter();

  const audit = auditChronologyEvents(chronology);

  const activeRoutes = routes.filter(r => r.status === 'ACTIVE');
  const evidenceDepRoutes = routes.filter(r => r.status === 'EVIDENCE-DEPENDENT');
  const rejectedRoutes = routes.filter(r => r.status === 'REJECTED' || r.status === 'DEAD');
  const weakRoutes = routes.filter(r => r.status === 'WEAK');

  // Primary risk
  const primaryRisk =
    'Active Execution File 042026162064 may proceed before unproved judgment service status is clarified or rent transfers of BHD 792 are formally reconciled.';

  // Next action
  const nextAction =
    'Perform targeted official docket verification of Execution File 042026162064 to establish whether formal service of the judgment was ever perfected, and verify whether the BHD 792 rent transfers were credited in the enforcement claim.';

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      {/* Mandatory Statutory Notice */}
      <div className="bg-amber-950/40 border border-amber-600/60 rounded-lg p-3 text-xs text-amber-200/90 flex items-start gap-3 shadow-sm">
        <Scale className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-300">CORE FORENSIC DIRECTIVE:</span>{' '}
          Case Architect evaluates whether a supportable route exists. It does not manufacture a route
          merely because a particular result is desired. A negative but accurate conclusion outranks an
          optimistic theory.
        </div>
      </div>

      {/* Grid: Objective & Committed Conclusion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Exact Objective Card */}
        <div className="bg-[#1C2541]/80 border border-slate-700/80 rounded-lg p-4 shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-teal-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> EXACT OBJECTIVE
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
              MANDATORY REQUIREMENT
            </span>
          </div>
          <p className="text-sm font-medium text-slate-100 leading-relaxed mb-3">
            {matter.exact_objective}
          </p>
          <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800 text-xs text-slate-300 space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Requested Outcome:</span>
              <span className="font-mono text-slate-200">{matter.requested_outcome}</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Matter Type:</span>
              <span className="text-slate-200">{matter.matter_type}</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Adjudicating Body:</span>
              <span className="text-slate-200">{matter.relevant_court_or_authority}</span>
            </div>
          </div>
        </div>

        {/* Current Committed Conclusion Card */}
        <div className="bg-[#0f172a] border border-teal-800/60 rounded-lg p-4 shadow relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-teal-300 font-semibold flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-teal-400" /> CURRENT COMMITTED CONCLUSION
            </span>
            <span className="text-[10px] bg-teal-950 text-teal-300 px-2 py-0.5 rounded border border-teal-700 font-mono">
              SUPPORTED BY CURRENT RECORD
            </span>
          </div>
          <blockquote className="text-sm text-slate-100 border-l-2 border-teal-500 pl-3 my-2 italic leading-relaxed bg-teal-950/20 py-1.5 pr-2 rounded-r">
            "{conclusionLedger.current_committed_conclusion}"
          </blockquote>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800">
            <span className="text-slate-400">
              Corrections logged:{' '}
              <strong className="text-slate-200">{conclusionLedger.corrections.length}</strong>
            </span>
            <button
              onClick={() => setActiveView('conclusion')}
              className="text-teal-400 hover:text-teal-300 text-xs font-medium flex items-center gap-1"
            >
              Inspect Ledger <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Risk & Next Action */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Main Risk */}
        <div className="bg-rose-950/30 border border-rose-900/60 rounded-lg p-3.5 text-xs text-rose-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-rose-300 mb-0.5 uppercase tracking-wider text-[11px]">
              MAIN FORENSIC RISK
            </div>
            <p className="leading-relaxed text-slate-300">{primaryRisk}</p>
          </div>
        </div>

        {/* Next Action */}
        <div className="bg-teal-950/30 border border-teal-800/60 rounded-lg p-3.5 text-xs text-teal-200 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-teal-300 mb-0.5 uppercase tracking-wider text-[11px]">
              COMMITTED NEXT ACTION
            </div>
            <p className="leading-relaxed text-slate-300">{nextAction}</p>
          </div>
        </div>
      </div>

      {/* Deadline Warnings Section (If Any Unproved Dates Exist) */}
      {audit.warnings.length > 0 && (
        <div className="bg-amber-950/30 border border-amber-700/60 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-300 font-mono">
              PROCEDURAL DEADLINE AUDIT ({audit.warnings.length} CRITICAL WARNINGS)
            </h3>
          </div>
          <div className="space-y-2">
            {audit.warnings.map((w, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 border border-amber-900/50 p-2.5 rounded text-xs text-slate-300 flex items-start gap-2.5"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-semibold text-amber-300 font-mono">
                    [{w.dateType} — {w.eventId}]:
                  </span>{' '}
                  {w.message}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Active Routes */}
        <div
          onClick={() => setActiveView('routes')}
          className="bg-slate-900/90 border border-slate-800 hover:border-teal-600/70 p-3 rounded-lg cursor-pointer transition-all shadow"
        >
          <div className="text-[11px] text-slate-400 font-mono uppercase">Active Routes</div>
          <div className="text-2xl font-bold font-mono text-teal-400 mt-1">
            {activeRoutes.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Only active routes may file
          </div>
        </div>

        {/* Evidence-Dependent Routes */}
        <div
          onClick={() => setActiveView('routes')}
          className="bg-slate-900/90 border border-slate-800 hover:border-amber-600/70 p-3 rounded-lg cursor-pointer transition-all shadow"
        >
          <div className="text-[11px] text-slate-400 font-mono uppercase">Evidence Dependent</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
            {evidenceDepRoutes.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Investigative steps permitted
          </div>
        </div>

        {/* Weak Routes */}
        <div
          onClick={() => setActiveView('routes')}
          className="bg-slate-900/90 border border-slate-800 hover:border-yellow-600/70 p-3 rounded-lg cursor-pointer transition-all shadow"
        >
          <div className="text-[11px] text-slate-400 font-mono uppercase">Weak Routes</div>
          <div className="text-2xl font-bold font-mono text-yellow-400 mt-1">
            {weakRoutes.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            High procedural vulnerability
          </div>
        </div>

        {/* Barred / Rejected */}
        <div
          onClick={() => setActiveView('routes')}
          className="bg-slate-900/90 border border-slate-800 hover:border-rose-600/70 p-3 rounded-lg cursor-pointer transition-all shadow"
        >
          <div className="text-[11px] text-slate-400 font-mono uppercase">Dead / Barred</div>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
            {rejectedRoutes.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Revival prohibited
          </div>
        </div>

        {/* Open Contradictions */}
        <div
          onClick={() => setActiveView('contradictions')}
          className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/70 p-3 rounded-lg cursor-pointer transition-all shadow"
        >
          <div className="text-[11px] text-slate-400 font-mono uppercase">Contradictions</div>
          <div className="text-2xl font-bold font-mono text-amber-300 mt-1">
            {contradictions.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Factual / procedural conflicts
          </div>
        </div>
      </div>

      {/* Fast Shortcuts Bar */}
      <div className="bg-[#1C2541]/50 border border-slate-800 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-300">
          <span className="font-semibold text-slate-200">Matter Quick Navigator:</span> Inspect the
          specialized forensic modules for deep record reconstruction.
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveView('electronic')}
            className="px-2.5 py-1 rounded bg-teal-950 text-teal-300 border border-teal-700 hover:bg-teal-900 text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <Server className="w-3.5 h-3.5" /> Electronic Appeal Forensics (R88736)
          </button>
          <button
            onClick={() => setActiveView('financial')}
            className="px-2.5 py-1 rounded bg-slate-900 text-slate-200 border border-slate-700 hover:bg-slate-800 text-xs flex items-center gap-1.5 transition-colors"
          >
            <DollarSign className="w-3.5 h-3.5 text-teal-400" /> Financial Reconciliation
          </button>
          <button
            onClick={() => setActiveView('adversarial')}
            className="px-2.5 py-1 rounded bg-slate-900 text-slate-200 border border-slate-700 hover:bg-slate-800 text-xs flex items-center gap-1.5 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Hostile Review Panel
          </button>
          <button
            onClick={() => setActiveView('tests')}
            className="px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-700 hover:bg-indigo-900 text-xs flex items-center gap-1.5 transition-colors"
          >
            Run 8 Mandatory Tests
          </button>
        </div>
      </div>
    </div>
  );
};
