import React from 'react';
import { useMatter } from '../context/MatterContext';
import { ShieldAlert, AlertTriangle, CheckCircle2, XCircle, Lock } from 'lucide-react';

export const HumanApprovalModal: React.FC = () => {
  const { pendingApproval, resolveHumanApproval } = useMatter();

  if (!pendingApproval) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-[#1C2541] border-2 border-amber-600/90 rounded-xl max-w-lg w-full p-6 shadow-2xl text-slate-200 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3 border-b border-slate-700 pb-3">
          <div className="p-2 bg-amber-950 rounded-lg border border-amber-600">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase text-amber-400 font-bold tracking-wider">
              HUMAN APPROVAL GATE REQUIRED
            </div>
            <h2 className="text-base font-bold text-slate-100">{pendingApproval.action_name}</h2>
          </div>
        </div>

        {/* Impact Warning */}
        <div className="bg-slate-900/90 border border-amber-800/60 rounded-lg p-3.5 space-y-2 text-xs">
          <div className="font-semibold text-amber-300 flex items-center gap-1.5 font-mono">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> CONSEQUENTIAL PROCEDURAL IMPACT
          </div>
          <p className="text-slate-200 leading-relaxed">{pendingApproval.impact_warning}</p>
        </div>

        {/* Security / No Credential Storage Credo */}
        <div className="bg-slate-950 p-3 rounded border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
          <Lock className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <span>
            <strong>Zero Credential Retention:</strong> Case Architect never asks for, manages, or
            stores passwords, OTP codes, biometrics, recovery phrases, or government login tokens.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-700">
          <button
            type="button"
            onClick={() => resolveHumanApproval(false)}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors"
          >
            Decline & Abort Action
          </button>
          <button
            type="button"
            onClick={() => resolveHumanApproval(true)}
            className="px-5 py-2 rounded-lg bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs shadow-lg transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Approve & Authorize</span>
          </button>
        </div>
      </div>
    </div>
  );
};
