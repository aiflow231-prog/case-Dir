import React, { useState } from 'react';
import { useMatter } from '../context/MatterContext';
import { Matter } from '../types';
import { PlusCircle, AlertTriangle, Scale, Shield, CheckCircle } from 'lucide-react';

export const MatterIntakeWizard: React.FC = () => {
  const { intakeWizardOpen, setIntakeWizardOpen, createNewMatter, setActiveView } = useMatter();

  const [formData, setFormData] = useState<Partial<Matter>>({
    title: '',
    jurisdiction: 'Kingdom of Bahrain — High Civil Court / Commercial Division',
    exact_objective: '',
    requested_outcome: '',
    matter_type: 'Regulatory & Administrative Review',
    relevant_court_or_authority: '',
    known_decision_dates: [new Date().toISOString().split('T')[0]],
    known_deadlines: ['Statutory 30-day appeal period'],
    current_procedural_stage: 'Initial Intake',
    opposing_party: '',
    existing_representative: 'Self-Represented',
    confidentiality_classification: 'CONFIDENTIAL',
    analysis_cutoff_date: new Date().toISOString().split('T')[0],
    user_factual_narrative: '',
    user_known_concerns: '',
    known_prior_filings: [],
    known_rejected_or_closed_routes: []
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  if (!intakeWizardOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.title.trim()) {
      setValidationError('Matter title is required.');
      return;
    }
    if (!formData.exact_objective || !formData.exact_objective.trim()) {
      setValidationError(
        'MANDATORY REQUIREMENT: You must define the exact objective before analysis can begin.'
      );
      return;
    }

    const newMatter: Matter = {
      id: `MATTER_${Date.now()}`,
      title: formData.title.trim(),
      jurisdiction: formData.jurisdiction || 'General Jurisdiction',
      exact_objective: formData.exact_objective.trim(),
      requested_outcome: formData.requested_outcome || 'Lawful procedural route determination',
      matter_type: formData.matter_type || 'General Case Analysis',
      relevant_court_or_authority: formData.relevant_court_or_authority || 'Competent Court',
      known_decision_dates: formData.known_decision_dates || [],
      known_deadlines: formData.known_deadlines || [],
      current_procedural_stage: formData.current_procedural_stage || 'Intake Phase',
      opposing_party: formData.opposing_party || 'Adverse Party',
      existing_representative: formData.existing_representative || 'None',
      confidentiality_classification:
        formData.confidentiality_classification || 'CONFIDENTIAL',
      analysis_cutoff_date:
        formData.analysis_cutoff_date || new Date().toISOString().split('T')[0],
      user_factual_narrative: formData.user_factual_narrative || '',
      user_known_concerns: formData.user_known_concerns || '',
      known_prior_filings: formData.known_prior_filings || [],
      known_rejected_or_closed_routes: formData.known_rejected_or_closed_routes || [],
      research_status: 'IDLE',
      confidence_indicator: 'UNRESOLVED',
      evidence_completeness_pct: 15,
      is_sample_pilot: false
    };

    createNewMatter(newMatter);
    setIntakeWizardOpen(false);
    setActiveView('overview');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
      <div className="bg-[#1C2541] border border-slate-700 rounded-xl max-w-3xl w-full p-6 shadow-2xl text-slate-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-700 shrink-0">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-teal-400" /> Matter Intake & Procedural Definition
          </h2>
          <button
            onClick={() => setIntakeWizardOpen(false)}
            className="text-slate-400 hover:text-slate-200 font-bold px-2"
          >
            ✕
          </button>
        </div>

        {/* Mandatory Warning Banner */}
        <div className="bg-amber-950/40 border border-amber-600/70 p-3 rounded-lg text-xs text-amber-200/95 flex items-start gap-2.5 my-3 shrink-0">
          <Scale className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-amber-300">STATUTORY INTAKE WARNING:</span> Case
            Architect evaluates whether a supportable route exists. It does not manufacture a route
            merely because a particular result is desired.
          </div>
        </div>

        {validationError && (
          <div className="bg-rose-950 border border-rose-700 p-2.5 rounded text-xs text-rose-200 mb-2 shrink-0">
            {validationError}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">
                Matter Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Commercial Lease Appeal / Judicial Review"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Jurisdiction</label>
              <input
                type="text"
                required
                value={formData.jurisdiction}
                onChange={e => setFormData({ ...formData, jurisdiction: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
          </div>

          {/* Exact Objective - Mandatory */}
          <div className="bg-slate-900/90 p-3 rounded-lg border border-teal-800/60">
            <label className="block text-teal-300 mb-1 font-bold font-mono uppercase tracking-wider text-[11px]">
              Exact Objective <span className="text-rose-400">*</span> (Mandatory before analysis)
            </label>
            <p className="text-[11px] text-slate-400 mb-1.5">
              Specify precisely what legal or procedural remedy is required (e.g., vacate judgment,
              compel disclosure, stay execution).
            </p>
            <textarea
              rows={2}
              required
              placeholder="Define the exact objective without ambiguous rhetoric..."
              value={formData.exact_objective}
              onChange={e => setFormData({ ...formData, exact_objective: e.target.value })}
              className="w-full bg-slate-950 border border-teal-700/60 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-teal-400 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Requested Outcome</label>
              <input
                type="text"
                placeholder="e.g. Order staying execution and allowing late appeal"
                value={formData.requested_outcome}
                onChange={e => setFormData({ ...formData, requested_outcome: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Relevant Court or Authority</label>
              <input
                type="text"
                placeholder="e.g. High Civil Court / Disciplinary Tribunal"
                value={formData.relevant_court_or_authority}
                onChange={e =>
                  setFormData({ ...formData, relevant_court_or_authority: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Current Procedural Stage</label>
              <input
                type="text"
                value={formData.current_procedural_stage}
                onChange={e =>
                  setFormData({ ...formData, current_procedural_stage: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Opposing Party</label>
              <input
                type="text"
                value={formData.opposing_party}
                onChange={e => setFormData({ ...formData, opposing_party: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Confidentiality</label>
              <select
                value={formData.confidentiality_classification}
                onChange={e =>
                  setFormData({
                    ...formData,
                    confidentiality_classification: e.target
                      .value as Matter['confidentiality_classification']
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 font-mono"
              >
                <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                <option value="HIGHLY_CONFIDENTIAL">HIGHLY CONFIDENTIAL</option>
                <option value="PRIVILEGED">PRIVILEGED</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">User's Factual Narrative</label>
            <textarea
              rows={3}
              placeholder="Provide chronological facts, actions taken, and known communications..."
              value={formData.user_factual_narrative}
              onChange={e => setFormData({ ...formData, user_factual_narrative: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Known Concerns & Rejected Routes</label>
            <input
              type="text"
              placeholder="e.g. Prior reconsideration motion dismissed on jurisdictional grounds"
              value={formData.user_known_concerns}
              onChange={e => setFormData({ ...formData, user_known_concerns: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-700">
            <button
              type="button"
              onClick={() => setIntakeWizardOpen(false)}
              className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 rounded bg-teal-700 hover:bg-teal-600 text-white font-bold"
            >
              Initialize Matter Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
