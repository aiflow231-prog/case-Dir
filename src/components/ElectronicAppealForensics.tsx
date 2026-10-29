import React from 'react';
import { useMatter } from '../context/MatterContext';
import {
  Server,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  CreditCard,
  FileText,
  AlertCircle,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';

export const ElectronicAppealForensics: React.FC = () => {
  const { electronicForensics, routes, updateRouteStatus, requestHumanApproval } = useMatter();
  const [statusNotice, setStatusNotice] = React.useState<string | null>(null);

  const handleAuditLogRequest = () => {
    requestHumanApproval({
      action_name: 'Request Official Electronic Filing System Audit Log (eGovernment MOJ)',
      category: 'ACCESSING_GOVERNMENT_SERVICES',
      impact_warning:
        'Official records request to the IT Directorate of the Ministry of Justice for timestamped portal transaction logs for Preparation No. R88736. Confirms whether a technical force majeure interrupted the session.',
      onApprove: () => {
        setStatusNotice('Official MOJ eGovernment IT transaction log request inquiry initiated and logged.');
        setTimeout(() => setStatusNotice(null), 5000);
      }
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      {statusNotice && (
        <div className="bg-emerald-950/80 border border-emerald-600 text-emerald-200 px-4 py-2.5 rounded-lg text-xs flex items-center gap-2 shadow-lg">
          <Server className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusNotice}</span>
        </div>
      )}

      {/* Banner */}
      <div className="bg-teal-950/40 border border-teal-700/60 rounded-lg p-3 text-xs text-teal-200 flex items-start gap-3 shadow">
        <Server className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-teal-300">
            ELECTRONIC APPEAL FORENSIC WORKBENCH:
          </span>{' '}
          Specialized diagnostic module for electronic court filings. Strictly differentiates draft
          saves, fee payments, and formal registry registration. Prevents common digital fallacies
          such as treating a draft preparation number (R-number) as an enforceable court docket number.
        </div>
      </div>

      {/* Main Forensic Status Display */}
      <div className="bg-[#0B132B] border border-slate-800 rounded-lg p-5 shadow-lg space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              PORTAL SESSION IDENTIFIER
            </div>
            <div className="text-xl font-bold font-mono text-teal-400 flex items-center gap-2">
              <span>Preparation No. {electronicForensics.preparation_number}</span>
              <span className="text-xs bg-amber-950 text-amber-300 border border-amber-600 px-2 py-0.5 rounded font-mono font-normal">
                Draft Saved — Unsubmitted
              </span>
            </div>
          </div>

          <button
            onClick={handleAuditLogRequest}
            className="bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-700/60 px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Server className="w-3.5 h-3.5" />
            <span>Request Ministry Audit Log</span>
          </button>
        </div>

        {/* 12 Forensic Data Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Card 1: Timestamps */}
          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-lg space-y-2">
            <span className="text-[10px] uppercase font-mono text-teal-400 font-semibold block">
              Session Timestamps
            </span>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Draft Save Date:</span>
                <span className="font-mono text-slate-200">
                  {new Date(electronicForensics.draft_save_date).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Last Modified:</span>
                <span className="font-mono text-slate-200">
                  {new Date(electronicForensics.last_modified_date).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-amber-400 font-medium pt-1 border-t border-slate-800">
                <span>Save Date ≠ Filing Date</span>
                <span>VERIFIED RULE</span>
              </div>
            </div>
          </div>

          {/* Card 2: Fee Payment Diagnostic */}
          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-lg space-y-2">
            <span className="text-[10px] uppercase font-mono text-teal-400 font-semibold block">
              Fee Gateway Forensic
            </span>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Ref:</span>
                <span className="font-mono text-slate-200">
                  {electronicForensics.payment_demand_reference}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Attempt:</span>
                <span className="font-mono text-slate-200">
                  {new Date(electronicForensics.payment_attempt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-rose-400 font-bold pt-1 border-t border-slate-800 font-mono">
                <span>Gateway Result:</span>
                <span className="bg-rose-950 px-1.5 py-0.5 rounded border border-rose-700">
                  FAILED (Decline Code 91)
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Registry & Service */}
          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-lg space-y-2">
            <span className="text-[10px] uppercase font-mono text-teal-400 font-semibold block">
              Court Docket & Service
            </span>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Registered Case No:</span>
                <span className="font-mono text-rose-400 font-semibold">NOT FOUND (None)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Final Confirmation:</span>
                <span className="font-mono text-rose-400">NO (Not Reached)</span>
              </div>
              <div className="flex justify-between text-amber-300 pt-1 border-t border-slate-800">
                <span className="text-slate-400">Judgment Service:</span>
                <span className="font-mono font-bold">UNKNOWN / UNPROVED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mandatory Attachments Checklist vs Existing */}
        <div className="bg-slate-950/80 p-4 rounded-lg border border-slate-850 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono font-semibold text-slate-300">
            <span>MANDATORY ATTACHMENTS AUDIT (MINISTERIAL DECREE NO. 27/2021)</span>
            <span className="text-amber-400 text-[11px]">DEFICIT: MISSING SIGNED MEMORANDUM</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {electronicForensics.mandatory_attachments.map((att, idx) => {
              const isUploaded = electronicForensics.existing_attachments.some(ex =>
                ex.toLowerCase().includes(att.split(' ')[0].toLowerCase())
              );
              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded border flex items-center justify-between ${
                    isUploaded
                      ? 'bg-slate-900/80 border-slate-800 text-slate-200'
                      : 'bg-rose-950/30 border-rose-900/60 text-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isUploaded ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                    )}
                    <span>{att}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border">
                    {isUploaded ? 'UPLOADED' : 'MISSING'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Procedural Conclusion */}
        <div className="bg-amber-950/20 border border-amber-700/60 rounded-lg p-4 space-y-1.5 text-xs">
          <div className="text-[10px] font-mono uppercase text-amber-400 font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> OFFICIAL PROCEDURAL CONCLUSION
            FOR ELECTRONIC APPEAL (ROUTE R-01)
          </div>
          <p className="text-slate-200 leading-relaxed italic">
            "{electronicForensics.current_procedural_conclusion}"
          </p>
        </div>
      </div>
    </div>
  );
};
