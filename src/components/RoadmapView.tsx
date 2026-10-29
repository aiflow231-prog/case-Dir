import React from 'react';
import { useMatter } from '../context/MatterContext';
import {
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldAlert,
  FileText,
  AlertCircle,
  HelpCircle,
  Layers,
  StopCircle
} from 'lucide-react';

export const RoadmapView: React.FC = () => {
  const { roadmap, routes, requestHumanApproval, setActiveView } = useMatter();
  const [actionNotice, setActionNotice] = React.useState<string | null>(null);

  const handleExecuteNextAction = () => {
    requestHumanApproval({
      action_name: roadmap.exact_next_action,
      category: 'FILING_DOCUMENT',
      impact_warning:
        'Executing this procedural roadmap step initiates records inquiries for Execution File 042026162064. Confirm client authorization.',
      onApprove: () => {
        setActionNotice('Procedural verification inquiry successfully logged in audit records.');
        setTimeout(() => setActionNotice(null), 5000);
      }
    });
  };

  if (roadmap.no_route_survived) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-12 text-center">
        <div className="bg-rose-950/40 border-2 border-rose-700 rounded-xl p-8 shadow-2xl space-y-4">
          <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto" />
          <h2 className="text-2xl font-bold font-mono text-rose-200">
            No currently supportable route was found.
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Case Architect evaluated all potential procedural vehicles across ordinary appeal,
            reconsideration, and collateral review. Every route encounters a fatal jurisdictional,
            statutory, or evidentiary bar. The application refuses to manufacture or fabricate a
            route merely because a favorable result is desired.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={() => setActiveView('overview')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded text-xs font-semibold"
            >
              Back to Overview
            </button>
            <button
              onClick={() => setActiveView('audit')}
              className="px-4 py-2 bg-rose-900/60 hover:bg-rose-900 text-rose-200 rounded text-xs font-semibold border border-rose-600"
            >
              Inspect Audit Log
            </button>
          </div>
        </div>
      </div>
    );
  }

  const primary = roadmap.primary_route;
  const backup = roadmap.backup_route;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      {/* Action Notification */}
      {actionNotice && (
        <div className="bg-emerald-950/80 border border-emerald-600 text-emerald-200 px-4 py-2.5 rounded-lg text-xs flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Commitment Directive */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 flex items-start gap-3 shadow">
        <Navigation className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-100">COMMITTED ROADMAP ARCHITECTURE:</span>{' '}
          Produces exactly ONE committed primary route when active. Backup routes are restricted to exactly one
          and activate ONLY upon an objectively defined trigger event. When ACTIVE = 0, substantive court
          filings are prohibited and only targeted verification inquiries are permitted.
        </div>
      </div>

      {/* Primary Route Focus Card (If Active Route Exists) */}
      {primary && (
        <div className="bg-[#1C2541] border border-teal-600/80 rounded-lg p-5 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 pb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-mono bg-teal-950 text-teal-300 border border-teal-600 px-2 py-0.5 rounded font-bold">
                  PRIMARY COMMITTED ROUTE
                </span>
                <span className="font-mono text-xs font-bold text-teal-400">
                  {primary.route_id}
                </span>
                <span className="text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded">
                  {primary.status}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-100">{primary.route_name}</h2>
              <div className="text-xs text-slate-400">
                Forum: <strong>{primary.jurisdiction_or_authority}</strong> | Vehicle:{' '}
                <strong>{primary.procedural_vehicle}</strong>
              </div>
            </div>

            <button
              onClick={handleExecuteNextAction}
              className="bg-teal-700 hover:bg-teal-600 text-white px-4 py-2 rounded text-xs font-semibold flex items-center gap-2 shadow-lg transition-all"
            >
              <span>Execute Action Gate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Exact Next Action Box */}
          <div className="bg-slate-950/90 p-4 rounded-lg border border-teal-900/60 space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-teal-300 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400" /> EXACT SINGLE ACTION THAT MUST
              HAPPEN NEXT
            </span>
            <p className="text-sm font-medium text-slate-100 leading-relaxed">
              {roadmap.exact_next_action}
            </p>
          </div>

          {/* Grid: Required Docs & Deadlines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Required Documents */}
            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-lg space-y-2">
              <span className="text-[10px] uppercase font-mono text-teal-400 font-semibold block">
                Required Evidence & Documents
              </span>
              <ul className="space-y-1.5 text-slate-300">
                {roadmap.required_documents.map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <FileText className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Deadline Note & Stop Condition */}
            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-lg space-y-2">
              <div>
                <span className="text-[10px] uppercase font-mono text-amber-400 font-semibold block">
                  Deadline Criticality
                </span>
                <p className="text-slate-200 mt-0.5">{roadmap.deadline_note}</p>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[10px] uppercase font-mono text-rose-400 font-semibold block">
                  Mandatory Stop Condition
                </span>
                <p className="text-slate-300 text-[11px] mt-0.5">{roadmap.stop_condition}</p>
              </div>
            </div>
          </div>

          {/* Decision Point Protocol */}
          <div className="bg-indigo-950/30 border border-indigo-800/60 p-3.5 rounded-lg text-xs space-y-1">
            <span className="text-[10px] font-mono uppercase text-indigo-300 font-semibold block">
              DECISION FORK / ARBITRATION POINT
            </span>
            <p className="text-slate-200 leading-relaxed">{roadmap.decision_point}</p>
          </div>
        </div>
      )}

      {/* Gateway / Investigative Roadmap (When ACTIVE = 0) */}
      {!primary && (
        <div className="bg-[#1C2541] border border-amber-600/80 rounded-lg p-5 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 pb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-mono bg-amber-950 text-amber-300 border border-amber-600 px-2 py-0.5 rounded font-bold">
                  ROUTE ACTIVATION GATEWAY
                </span>
                <span className="font-mono text-xs font-bold text-amber-400">
                  STATUS: ZERO ACTIVE FILING ROUTES (ACTIVE: 0)
                </span>
                <span className="text-xs font-mono bg-slate-900 text-slate-300 border border-slate-700 px-2 py-0.5 rounded">
                  EVIDENCE-DEPENDENT: 3 CANDIDATES
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-100">
                Substantive Court Filing Barred Until Evidentiary Conditions Satisfied
              </h2>
              <div className="text-xs text-slate-400">
                Forensic Rule: <strong>Only an ACTIVE route may produce a recommendation to file or take substantive action.</strong>
              </div>
            </div>

            <button
              onClick={handleExecuteNextAction}
              className="bg-amber-800 hover:bg-amber-700 text-white px-4 py-2 rounded text-xs font-semibold flex items-center gap-2 shadow-lg transition-all"
            >
              <span>Initiate Verification Inquiry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Exact Next Action Box */}
          <div className="bg-slate-950/90 p-4 rounded-lg border border-amber-900/60 space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-300 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400" /> EXACT SINGLE ACTION THAT MUST HAPPEN NEXT
            </span>
            <p className="text-sm font-medium text-slate-100 leading-relaxed">
              {roadmap.exact_next_action}
            </p>
          </div>

          {/* Grid: Required Docs & Deadlines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Required Documents */}
            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-lg space-y-2">
              <span className="text-[10px] uppercase font-mono text-teal-400 font-semibold block">
                Required Evidence & Documents To Activate Route
              </span>
              <ul className="space-y-1.5 text-slate-300">
                {roadmap.required_documents.map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <FileText className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Deadline Note & Stop Condition */}
            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-lg space-y-2">
              <div>
                <span className="text-[10px] uppercase font-mono text-amber-400 font-semibold block">
                  Deadline Criticality & Calculation Rule
                </span>
                <p className="text-slate-200 mt-0.5">{roadmap.deadline_note}</p>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[10px] uppercase font-mono text-rose-400 font-semibold block">
                  Mandatory Stop Condition
                </span>
                <p className="text-slate-300 text-[11px] mt-0.5">{roadmap.stop_condition}</p>
              </div>
            </div>
          </div>

          {/* Decision Point Protocol */}
          <div className="bg-indigo-950/30 border border-indigo-800/60 p-3.5 rounded-lg text-xs space-y-1">
            <span className="text-[10px] font-mono uppercase text-indigo-300 font-semibold block">
              DECISION FORK / ROUTE ACTIVATION CRITERIA
            </span>
            <p className="text-slate-200 leading-relaxed">{roadmap.decision_point}</p>
          </div>
        </div>
      )}

      {/* Backup Route Section (Single Backup Only) */}
      {backup && (
        <div className="bg-[#0B132B] border border-slate-800 rounded-lg p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                CONDITIONAL BACKUP ROUTE (1 OF 1)
              </span>
              <span className="font-mono text-xs font-bold text-teal-400">
                {backup.route_id}
              </span>
              <span className="text-xs font-semibold text-slate-200">{backup.route_name}</span>
            </div>
            <span className="text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-700 px-2 py-0.5 rounded">
              {backup.status}
            </span>
          </div>

          <div className="text-xs text-amber-200/90 bg-amber-950/20 border border-amber-800/40 p-2.5 rounded">
            <strong>Activation Trigger:</strong> {roadmap.backup_trigger_condition}
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {backup.exact_objective_advanced}
          </p>
        </div>
      )}
    </div>
  );
};
