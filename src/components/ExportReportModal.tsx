import React, { useState } from 'react';
import { useMatter } from '../context/MatterContext';
import {
  FileDown,
  Printer,
  Copy,
  CheckCircle2,
  AlertTriangle,
  EyeOff,
  Shield,
  Scale
} from 'lucide-react';

export const ExportReportModal: React.FC = () => {
  const {
    matter,
    conclusionLedger,
    propositions,
    routes,
    roadmap,
    evidenceList,
    chronology,
    financialEntries,
    contradictions,
    exportModalOpen,
    setExportModalOpen,
    isRedactedView,
    setIsRedactedView,
    logAuditEvent
  } = useMatter();

  const [reportFormat, setReportFormat] = useState<
    'FULL' | 'EXECUTIVE' | 'LAWYER_PACK' | 'REDACTED'
  >('FULL');
  const [copied, setCopied] = useState(false);

  if (!exportModalOpen) return null;

  const handlePrint = () => {
    logAuditEvent({
      action_type: 'REPORT_EXPORTED',
      actor: 'Export Engine',
      details: `Printed forensic report (Format: ${reportFormat}, Redacted: ${isRedactedView}).`
    });
    window.print();
  };

  const handleCopyText = () => {
    const reportText = generateReportText();
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    logAuditEvent({
      action_type: 'REPORT_EXPORTED',
      actor: 'Export Engine',
      details: `Copied 12-section forensic report to clipboard.`
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const generateReportText = () => {
    return `
================================================================================
CASE ARCHITECT — EXHAUSTIVE ROUTE VALIDATOR
MATTER REPORT: ${matter.title}
JURISDICTION: ${matter.jurisdiction}
ANALYSIS CUTOFF DATE: ${matter.analysis_cutoff_date}
CONFIDENTIALITY: ${matter.confidentiality_classification}
REDACTION ENGAGED: ${isRedactedView ? 'YES' : 'NO'}
================================================================================

1. EXACT QUESTION / OBJECTIVE
--------------------------------------------------------------------------------
Objective: ${matter.exact_objective}
Requested Outcome: ${matter.requested_outcome}
Notice: Case Architect evaluates whether a supportable route exists. It does not
manufacture a route merely because a particular result is desired.

2. COMMITTED CONCLUSION
--------------------------------------------------------------------------------
"${conclusionLedger.current_committed_conclusion}"

3. VERIFIED FACTS (SUPPORTED BY CURRENT RECORD)
--------------------------------------------------------------------------------
${conclusionLedger.verified_facts.map(f => `• ${f}`).join('\n')}

4. CONTROLLING RULES OR AUTHORITIES
--------------------------------------------------------------------------------
${propositions
  .map(
    p =>
      `• [Tier ${p.priority_tier}] ${p.authority_title} (${p.article_or_paragraph})\n  Citation: ${p.source_citation}\n  Passage: "${p.exact_supporting_passage}"`
  )
  .join('\n\n')}

5. APPLICATION TO THE FACTS
--------------------------------------------------------------------------------
• What is Proved: First-instance judgment (3 June 2026), bank transfers of BHD 792, portal draft R88736 saved on 16 June 2026, failed card payment attempt on 5 July 2026.
• What is Not Proved: Formal court service of the judgment; submission or docketing of the electronic appeal; discharge of mandatory appeal fees.
• What is Closed: Reconsideration before original committee (Route R-05 is DEAD).
• What Can Still Be Done: Targeted official docket verification of Execution File 042026162064 to establish whether formal service of the judgment was ever perfected, and verify whether the BHD 792 rent transfers were credited in the enforcement claim. Substantive court filing is barred while ACTIVE = 0.

6. STRONGEST CONTRARY CASE
--------------------------------------------------------------------------------
Opposing counsel will establish that respondent demonstrated actual knowledge by saving draft R88736, failed to submit the appeal for weeks, fee payment was declined, and judgment service is presumptively regular under execution procedures.

7. ATTEMPT TO DISPROVE THE CONCLUSION
--------------------------------------------------------------------------------
Tested whether draft save date tolls limitation under Decree 27/2021: Disproved.
Tested whether failed payment discharges statutory fee: Disproved.
Tested whether informal awareness equals statutory service: Disproved.

8. REMAINING UNKNOWNS
--------------------------------------------------------------------------------
${conclusionLedger.unknowns.map(u => `• ${u}`).join('\n')}

9. ROUTE STATUS SUMMARY
--------------------------------------------------------------------------------
${routes.map(r => `• ${r.route_id}: ${r.route_name} [${r.status}] (Survival Score: ${r.survival_score}%)`).join('\n')}

10. ONE ROADMAP
--------------------------------------------------------------------------------
Primary Committed Route: ${roadmap.primary_route?.route_name || 'None'}
Exact Next Action: ${roadmap.exact_next_action}
Required Evidence: ${roadmap.required_documents.join('; ')}
Deadline Note: ${roadmap.deadline_note}
Decision Fork: ${roadmap.decision_point}
Backup Route: ${roadmap.backup_route?.route_name || 'None'} (Trigger: ${roadmap.backup_trigger_condition})

11. STOP CONDITIONS
--------------------------------------------------------------------------------
${roadmap.stop_condition}

12. CONFIDENCE AND LIMITATIONS
--------------------------------------------------------------------------------
Confidence Level: ${matter.confidence_indicator}
Limitations: Based exclusively on documentary record in Evidence Vault. If primary service docket confirms perfected service prior to 1 July 2026, appellate window is permanently barred.
================================================================================
Generated by Case Architect. Evidence outranks intuition.
`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
      <div className="bg-[#1C2541] border border-slate-700 rounded-xl max-w-4xl w-full p-6 shadow-2xl text-slate-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-700 shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <FileDown className="w-5 h-5 text-teal-400" /> Export Forensic Matter Report
            </h2>
            <p className="text-xs text-slate-400">
              Complies with the 12-section Case Architect reporting constitution.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRedactedView(!isRedactedView)}
              className={`px-3 py-1.5 rounded text-xs font-semibold border flex items-center gap-1.5 ${
                isRedactedView
                  ? 'bg-amber-950 text-amber-300 border-amber-600'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>{isRedactedView ? 'Redacted View' : 'Unredacted View'}</span>
            </button>
            <button
              onClick={() => setExportModalOpen(false)}
              className="text-slate-400 hover:text-slate-200 text-base font-bold px-2"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-amber-950/40 border border-amber-600/70 p-2.5 rounded text-xs text-amber-200 flex items-center gap-2 my-3 shrink-0">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Redaction Warning:</strong> Before transmitting this report to external parties
            or counsel, verify that all sensitive client bank details and identity numbers are masked.
          </span>
        </div>

        {/* Report Preview Body (Scrollable & Printable) */}
        <div className="flex-1 overflow-y-auto bg-[#0B132B] border border-slate-800 rounded-lg p-5 font-mono text-xs space-y-4 text-slate-300 leading-relaxed shadow-inner">
          <div className="border-b border-slate-800 pb-3 text-center">
            <h1 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              CASE ARCHITECT — FORENSIC MATTER AUDIT REPORT
            </h1>
            <div className="text-[11px] text-teal-400 mt-1">
              Matter: {matter.title} ({matter.jurisdiction})
            </div>
            <div className="text-[10px] text-slate-500">
              Cutoff: {matter.analysis_cutoff_date} | Classification: {matter.confidentiality_classification}
            </div>
          </div>

          {/* Section 1 */}
          <div>
            <div className="text-[11px] font-bold text-teal-300 uppercase">
              1. EXACT QUESTION / OBJECTIVE
            </div>
            <p className="text-slate-200 mt-1 font-sans">{matter.exact_objective}</p>
          </div>

          {/* Section 2 */}
          <div>
            <div className="text-[11px] font-bold text-teal-300 uppercase">
              2. COMMITTED CONCLUSION
            </div>
            <p className="text-slate-100 mt-1 font-sans italic bg-teal-950/30 p-2 rounded border-l-2 border-teal-500">
              "{conclusionLedger.current_committed_conclusion}"
            </p>
          </div>

          {/* Section 3 */}
          <div>
            <div className="text-[11px] font-bold text-teal-300 uppercase">
              3. VERIFIED FACTS (SUPPORTED BY CURRENT RECORD)
            </div>
            <ul className="list-disc list-inside mt-1 font-sans space-y-1 text-slate-300">
              {conclusionLedger.verified_facts.map((fact, i) => (
                <li key={i}>{fact}</li>
              ))}
            </ul>
          </div>

          {/* Section 4 */}
          <div>
            <div className="text-[11px] font-bold text-teal-300 uppercase">
              4. CONTROLLING RULES OR AUTHORITIES
            </div>
            <div className="mt-1 space-y-2 font-sans">
              {propositions.map(p => (
                <div key={p.proposition_id} className="bg-slate-900 p-2 rounded border border-slate-800 text-[11px]">
                  <strong className="text-slate-200">{p.authority_title}</strong> ({p.article_or_paragraph}):{' '}
                  <span className="text-slate-300 italic">"{p.exact_supporting_passage}"</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5 */}
          <div>
            <div className="text-[11px] font-bold text-teal-300 uppercase">
              5. APPLICATION TO THE FACTS
            </div>
            <div className="mt-1 font-sans text-slate-300 space-y-1">
              <div>• <strong>What is Proved:</strong> Valid first-instance judgment debt of BHD 1,440.00; authenticated bank transfers of BHD 792.00; unsubmitted portal draft R88736.</div>
              <div>• <strong>What is Not Proved:</strong> Formal legal service of the judgment; timely docketed appeal; fee payment.</div>
              <div>• <strong>What Can Still Be Done:</strong> Targeted official docket verification of Execution File 042026162064 to establish whether formal service of the judgment was ever perfected, and verify whether the BHD 792 rent transfers were credited in the enforcement claim. Substantive court filing remains barred while ACTIVE = 0.</div>
            </div>
          </div>

          {/* Section 6 & 7 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="text-[11px] font-bold text-rose-300 uppercase">
                6. STRONGEST CONTRARY CASE
              </div>
              <p className="mt-1 font-sans text-slate-300 text-[11px]">
                Opposing party will argue tenant demonstrated actual awareness via portal draft on 16 June, payment gateway decline failed to discharge fees, and 15 days elapsed.
              </p>
            </div>
            <div>
              <div className="text-[11px] font-bold text-amber-300 uppercase">
                7. ATTEMPT TO DISPROVE CONCLUSION
              </div>
              <p className="mt-1 font-sans text-slate-300 text-[11px]">
                Tested electronic filing portal rules: Draft save carries zero legal effect. Failed payment does not toll deadline. Reconsideration is permanently barred.
              </p>
            </div>
          </div>

          {/* Section 8 */}
          <div>
            <div className="text-[11px] font-bold text-teal-300 uppercase">
              8. REMAINING UNKNOWNS
            </div>
            <ul className="list-disc list-inside mt-1 font-sans text-slate-300">
              {conclusionLedger.unknowns.map((u, i) => (
                <li key={i}>{u}</li>
              ))}
            </ul>
          </div>

          {/* Section 9 */}
          <div>
            <div className="text-[11px] font-bold text-teal-300 uppercase">
              9. ROUTE STATUS REGISTER
            </div>
            <div className="mt-1 font-sans space-y-1">
              {routes.map(r => (
                <div key={r.route_id} className="flex justify-between text-[11px] border-b border-slate-850 pb-0.5">
                  <span><strong>{r.route_id}:</strong> {r.route_name}</span>
                  <span className="font-mono text-teal-400">[{r.status}] (Score: {r.survival_score}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 10 */}
          <div>
            <div className="text-[11px] font-bold text-teal-300 uppercase">
              10. ONE COMMITTED ROADMAP
            </div>
            <div className="mt-1 font-sans text-slate-200 bg-slate-900 p-2.5 rounded border border-slate-800 space-y-1 text-xs">
              <div><strong>Single Next Action:</strong> {roadmap.exact_next_action}</div>
              <div><strong>Required Documents:</strong> {roadmap.required_documents.join('; ')}</div>
              <div><strong>Deadline:</strong> {roadmap.deadline_note}</div>
            </div>
          </div>

          {/* Section 11 & 12 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="text-[11px] font-bold text-rose-300 uppercase">
                11. STOP CONDITIONS
              </div>
              <p className="mt-1 font-sans text-slate-300 text-[11px]">{roadmap.stop_condition}</p>
            </div>
            <div>
              <div className="text-[11px] font-bold text-teal-300 uppercase">
                12. CONFIDENCE & LIMITATIONS
              </div>
              <p className="mt-1 font-sans text-slate-300 text-[11px]">
                Confidence: {matter.confidence_indicator}. Evidence outranks intuition.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-700 shrink-0">
          <div className="text-xs text-slate-400 font-mono">
            {isRedactedView ? 'MASKED FOR EXTERNAL DISTRIBUTION' : 'CONTAINS UNMASKED ACCOUNT DATA'}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy Plaintext'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
