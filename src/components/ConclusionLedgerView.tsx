import React, { useState } from 'react';
import { useMatter } from '../context/MatterContext';
import { CorrectionEntry } from '../types';
import {
  FileCheck2,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  Plus,
  Scale
} from 'lucide-react';

export const ConclusionLedgerView: React.FC = () => {
  const { conclusionLedger, logCorrection } = useMatter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newCorrection, setNewCorrection] = useState<Partial<CorrectionEntry>>({
    type: 'I_OVERSTATED_THIS',
    exact_earlier_claim: '',
    corrected_conclusion: '',
    evidence_causing_correction: '',
    effect_on_roadmap: ''
  });

  const handleSaveCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCorrection.exact_earlier_claim || !newCorrection.corrected_conclusion) return;

    logCorrection({
      type: newCorrection.type || 'I_WAS_WRONG',
      exact_earlier_claim: newCorrection.exact_earlier_claim,
      corrected_conclusion: newCorrection.corrected_conclusion,
      evidence_causing_correction:
        newCorrection.evidence_causing_correction || 'Newly retrieved controlling evidence',
      effect_on_roadmap: newCorrection.effect_on_roadmap || 'Roadmap revised'
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      {/* Principle Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 flex items-start gap-3 shadow">
        <Scale className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-100">
            DISCIPLINARY CORRECTION PRINCIPLE:
          </span>{' '}
          Correction outranks consistency with an earlier answer. When new authority or evidence
          disproves an earlier stance, the system explicitly confesses error (“I was wrong” or “I
          overstated this”) and updates the roadmap. The newest corrected ledger controls over
          previous outputs.
        </div>
      </div>

      {/* Current Committed Master Conclusion Card */}
      <div className="bg-[#1C2541]/90 border border-teal-800/80 rounded-lg p-5 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-teal-300 font-semibold flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4 text-teal-400" /> CURRENT COMMITTED ROADMAP CONCLUSION
          </span>
          <span className="text-[10px] bg-slate-900 text-slate-400 font-mono px-2 py-0.5 rounded border border-slate-800">
            Last Updated: {new Date(conclusionLedger.last_updated).toLocaleString()}
          </span>
        </div>
        <p className="text-sm font-medium text-slate-100 leading-relaxed italic bg-teal-950/20 p-3 rounded border-l-2 border-teal-500">
          "{conclusionLedger.current_committed_conclusion}"
        </p>
      </div>

      {/* Corrections Ledger ("I Was Wrong" Register) */}
      <div className="bg-[#0B132B] border border-slate-800 rounded-lg p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-400" /> Disciplinary Correction Ledger
            </h3>
            <p className="text-xs text-slate-400">
              Audit trail of every prior claim explicitly retracted or corrected upon contrary
              evidence.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-600 px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Correction</span>
          </button>
        </div>

        <div className="space-y-3">
          {conclusionLedger.corrections.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-500 font-mono">
              Zero corrections currently logged. Baseline intact.
            </div>
          ) : (
            conclusionLedger.corrections.map(corr => (
              <div
                key={corr.id}
                className="bg-slate-900/90 border border-amber-800/60 p-4 rounded-lg text-xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                      corr.type === 'I_WAS_WRONG'
                        ? 'bg-rose-950 text-rose-300 border-rose-700'
                        : 'bg-amber-950 text-amber-300 border-amber-600'
                    }`}
                  >
                    {corr.type === 'I_WAS_WRONG' ? '“I WAS WRONG”' : '“I OVERSTATED THIS”'}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {new Date(corr.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {/* Earlier claim */}
                  <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800">
                    <span className="text-[10px] uppercase font-mono text-rose-400 block mb-0.5">
                      Exact Earlier Claim Retracted:
                    </span>
                    <p className="text-slate-300 leading-relaxed italic">
                      "{corr.exact_earlier_claim}"
                    </p>
                  </div>

                  {/* Corrected Conclusion */}
                  <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800">
                    <span className="text-[10px] uppercase font-mono text-teal-400 block mb-0.5">
                      Corrected Conclusion:
                    </span>
                    <p className="text-slate-100 font-medium leading-relaxed">
                      "{corr.corrected_conclusion}"
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] pt-1 border-t border-slate-800/80">
                  <div>
                    <span className="text-slate-400 font-medium">Evidence Causing Correction:</span>{' '}
                    <span className="text-slate-300 font-mono">{corr.evidence_causing_correction}</span>
                  </div>
                  <div>
                    <span className="text-teal-400 font-medium">Effect on Roadmap:</span>{' '}
                    <span className="text-slate-300">{corr.effect_on_roadmap}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Multi-Dimensional Evidence Ledger (Facts, Assertions, Unknowns, Records) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Verified Facts vs User Assertions */}
        <div className="bg-[#0B132B] border border-slate-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-mono text-xs uppercase text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified Facts ({conclusionLedger.verified_facts.length})
            </span>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800">
              PROVED
            </span>
          </div>
          <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
            {conclusionLedger.verified_facts.map((fact, i) => (
              <li key={i} className="leading-relaxed">
                {fact}
              </li>
            ))}
          </ul>
        </div>

        {/* Decisive Unknowns & User Assertions */}
        <div className="bg-[#0B132B] border border-slate-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-mono text-xs uppercase text-amber-400 font-semibold flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> Decisive Unknowns ({conclusionLedger.unknowns.length})
            </span>
            <span className="text-[10px] bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded border border-amber-800">
              GAPS
            </span>
          </div>
          <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
            {conclusionLedger.unknowns.map((unk, i) => (
              <li key={i} className="leading-relaxed text-amber-200/90">
                {unk}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modal to log correction */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-[#1C2541] border border-slate-700 rounded-lg max-w-lg w-full p-5 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-amber-400" /> Record Disciplinary Correction
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCorrection} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Correction Classification</label>
                <select
                  value={newCorrection.type}
                  onChange={e =>
                    setNewCorrection({
                      ...newCorrection,
                      type: e.target.value as CorrectionEntry['type']
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 font-mono"
                >
                  <option value="I_OVERSTATED_THIS">I OVERSTATED THIS</option>
                  <option value="I_WAS_WRONG">I WAS WRONG</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Exact Earlier Claim</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Record the earlier claim that must be retracted..."
                  value={newCorrection.exact_earlier_claim}
                  onChange={e =>
                    setNewCorrection({ ...newCorrection, exact_earlier_claim: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Corrected Conclusion</label>
                <textarea
                  rows={2}
                  required
                  placeholder="State the accurate conclusion supported by evidence..."
                  value={newCorrection.corrected_conclusion}
                  onChange={e =>
                    setNewCorrection({ ...newCorrection, corrected_conclusion: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Evidence Causing Correction</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Payment decline slip EX-03 and Decree 27/2021"
                  value={newCorrection.evidence_causing_correction}
                  onChange={e =>
                    setNewCorrection({
                      ...newCorrection,
                      evidence_causing_correction: e.target.value
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Effect on Roadmap</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Blocked substantive filing; required docket inspection first"
                  value={newCorrection.effect_on_roadmap}
                  onChange={e =>
                    setNewCorrection({ ...newCorrection, effect_on_roadmap: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-amber-700 hover:bg-amber-600 text-white font-semibold"
                >
                  Commit Correction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
