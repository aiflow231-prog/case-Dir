import React, { useState } from 'react';
import { useMatter } from '../context/MatterContext';
import {
  Settings,
  ShieldAlert,
  Database,
  Lock,
  RotateCcw,
  Sliders,
  Scale,
  EyeOff,
  CheckCircle2
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    matter,
    researchCycleLimit,
    setResearchCycleLimit,
    isRedactedView,
    setIsRedactedView,
    resetToPilotMatter,
    logAuditEvent
  } = useMatter();

  const [retentionDays, setRetentionDays] = useState('90');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSaveSettings = () => {
    setSavedSuccess(true);
    logAuditEvent({
      action_type: 'SEARCH_RUN',
      actor: 'Security Controller',
      details: `Security settings updated: Retention=${retentionDays} days, ResearchLimit=${researchCycleLimit} cycles, Redaction=${isRedactedView}.`
    });
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleExecuteReset = () => {
    localStorage.clear();
    resetToPilotMatter();
    setShowResetConfirm(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-8">
      {/* Privacy Notice Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 flex items-start gap-3 shadow">
        <Lock className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-100">
            CONFIDENTIALITY & ARCHITECTURAL PRIVACY:
          </span>{' '}
          All matter data is held in local client memory. No personal identifiers or bank details are
          transmitted to external search queries. Never store authentication passwords, OTP codes, or
          government access keys.
        </div>
      </div>

      <div className="bg-[#0B132B] border border-slate-800 rounded-lg p-5 shadow-lg space-y-6 text-xs text-slate-200">
        <h2 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-2.5 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-teal-400" /> Forensic Engine & Security Configuration
        </h2>

        {/* Research Loop Bounded Limit */}
        <div className="space-y-2">
          <label className="block text-slate-300 font-semibold font-mono uppercase text-[11px]">
            Bounded Research Loop Limit (Anti-Infinite Loop Budget)
          </label>
          <p className="text-slate-400 text-xs">
            Controls the maximum number of iterative cycles permitted before mandatory saturation
            stop.
          </p>
          <div className="grid grid-cols-3 gap-3 pt-1">
            {[
              { val: 2, label: 'Quick Review', desc: 'Max 2 cycles' },
              { val: 5, label: 'Standard Review', desc: 'Max 5 cycles' },
              { val: 10, label: 'Exhaustive Review', desc: 'Max 10 cycles' }
            ].map(opt => (
              <button
                key={opt.val}
                type="button"
                onClick={() => setResearchCycleLimit(opt.val as 2 | 5 | 10)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  researchCycleLimit === opt.val
                    ? 'bg-teal-950/70 border-teal-500 text-teal-200'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <div className="font-bold text-xs">{opt.label}</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Privacy Redaction Default */}
        <div className="space-y-2 pt-3 border-t border-slate-800">
          <label className="block text-slate-300 font-semibold font-mono uppercase text-[11px]">
            Redaction & Privacy Masking
          </label>
          <div className="flex items-center justify-between bg-slate-900 p-3 rounded border border-slate-800">
            <div>
              <div className="font-medium text-slate-200">Redact Personal Identifiers & Accounts</div>
              <div className="text-slate-400 text-[11px]">
                Masks bank account numbers, IBANs, and individual personal details in reports and views.
              </div>
            </div>
            <button
              onClick={() => setIsRedactedView(!isRedactedView)}
              className={`px-3 py-1.5 rounded text-xs font-semibold border ${
                isRedactedView
                  ? 'bg-amber-950 text-amber-300 border-amber-600'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              {isRedactedView ? 'Redacted (Active)' : 'Unredacted'}
            </button>
          </div>
        </div>

        {/* Data Retention */}
        <div className="space-y-2 pt-3 border-t border-slate-800">
          <label className="block text-slate-300 font-semibold font-mono uppercase text-[11px]">
            Data Retention Window
          </label>
          <select
            value={retentionDays}
            onChange={e => setRetentionDays(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-200 text-xs font-mono"
          >
            <option value="30">30 Days (Strict Compliance)</option>
            <option value="90">90 Days (Litigation Support Standard)</option>
            <option value="365">1 Year (Long-term Appellate Archive)</option>
            <option value="indefinite">Indefinite (Local Browser Only)</option>
          </select>
        </div>

        {/* Local Storage Reset */}
        <div className="space-y-2 pt-3 border-t border-slate-800">
          <label className="block text-slate-300 font-semibold font-mono uppercase text-[11px]">
            Local Workspace Storage
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 p-3 rounded border border-slate-800">
            <span className="text-slate-400 text-xs">
              Erase cached matter data and reload default pilot parameters.
            </span>
            {showResetConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-300 font-mono">Confirm erase?</span>
                <button
                  onClick={handleExecuteReset}
                  className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-3 py-1.5 rounded bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900 text-xs font-semibold flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset State</span>
              </button>
            )}
          </div>
          {resetSuccess && (
            <div className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Local storage cleared. Pristine pilot state restored.</span>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            onClick={handleSaveSettings}
            className="bg-teal-700 hover:bg-teal-600 text-white px-5 py-2 rounded text-xs font-semibold shadow transition-colors flex items-center gap-1.5"
          >
            {savedSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : null}
            <span>{savedSuccess ? 'Settings Saved' : 'Save Configuration'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
