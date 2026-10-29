import React, { useState } from 'react';
import { useMatter } from '../context/MatterContext';
import { AdversarialReviewItem } from '../types';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Scale,
  Gavel,
  ShieldX,
  HelpCircle,
  ChevronRight
} from 'lucide-react';

export const AdversarialReviewView: React.FC = () => {
  const { adversarialReviews, routes } = useMatter();
  const [selectedRouteId, setSelectedRouteId] = useState<string>(
    adversarialReviews[0]?.route_id || 'R-01'
  );

  const selectedReview =
    adversarialReviews.find(r => r.route_id === selectedRouteId) || adversarialReviews[0];

  const getVerdictBadge = (verdict: AdversarialReviewItem['survival_verdict']) => {
    switch (verdict) {
      case 'SURVIVES_AS_ACTIVE':
        return 'bg-emerald-950 text-emerald-300 border-emerald-600 font-bold';
      case 'SURVIVES_AS_EVIDENCE_DEPENDENT':
        return 'bg-amber-950 text-amber-300 border-amber-600 font-bold';
      case 'BARRED_DISMISSED':
        return 'bg-rose-950 text-rose-300 border-rose-600 font-bold';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      {/* Hostile Review Credo Banner */}
      <div className="bg-rose-950/40 border border-rose-800/70 rounded-lg p-3 text-xs text-rose-200/90 flex items-start gap-3 shadow">
        <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-rose-300 uppercase tracking-wider">
            HOSTILE APPELLATE REVIEW PANEL:
          </span>{' '}
          Every candidate route is subjected to a hostile bar test simulating an aggressive opposing
          counsel and strict judicial referee. 20 procedural bars are audited to eliminate wishful
          thinking, res judicata violations, repackaged rejections, and expired limitation periods.
        </div>
      </div>

      {/* Route Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {adversarialReviews.map(rev => {
          const isSelected = rev.route_id === selectedReview.route_id;
          return (
            <button
              key={rev.route_id}
              onClick={() => setSelectedRouteId(rev.route_id)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 border transition-all ${
                isSelected
                  ? 'bg-slate-800 text-teal-300 border-teal-500 shadow-md'
                  : 'bg-[#0B132B] text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <span className="font-mono text-teal-400">{rev.route_id}</span>
              <span className="truncate max-w-[200px]">{rev.route_name}</span>
              <span
                className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${getVerdictBadge(
                  rev.survival_verdict
                )}`}
              >
                {rev.survival_verdict === 'BARRED_DISMISSED' ? 'BARRED' : 'SURVIVES'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Review Panel */}
      <div className="bg-[#0B132B] border border-slate-800 rounded-lg p-5 shadow-lg space-y-6">
        {/* Panel Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-teal-400">
                {selectedReview.route_id}
              </span>
              <span className="text-sm font-semibold text-slate-100">
                {selectedReview.route_name}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Hostile review protocol testing preclusion, limitation, jurisdiction, and admissibility.
            </p>
          </div>

          <div
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 ${getVerdictBadge(
              selectedReview.survival_verdict
            )}`}
          >
            {selectedReview.survival_verdict === 'BARRED_DISMISSED' ? (
              <ShieldX className="w-4 h-4 text-rose-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
            <span>VERDICT: {selectedReview.survival_verdict.replace(/_/g, ' ')}</span>
          </div>
        </div>

        {/* 8 Explicit Hostile Questions Answered */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-teal-300 font-semibold flex items-center gap-1.5">
            <Gavel className="w-3.5 h-3.5 text-teal-400" /> 8 Mandatory Hostile Review Inquiries
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Q1 Strongest Case Supporting */}
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded space-y-1">
              <div className="text-[10px] uppercase font-mono text-emerald-400 font-semibold">
                1. What is the strongest case supporting the route?
              </div>
              <p className="text-slate-200 leading-relaxed">
                {selectedReview.strongest_supporting_case}
              </p>
            </div>

            {/* Q2 Strongest Case Against */}
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded space-y-1">
              <div className="text-[10px] uppercase font-mono text-rose-400 font-semibold">
                2. What is the strongest case against it?
              </div>
              <p className="text-slate-200 leading-relaxed">
                {selectedReview.strongest_contrary_case}
              </p>
            </div>

            {/* Q3 Evidence that would defeat */}
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded space-y-1">
              <div className="text-[10px] uppercase font-mono text-amber-400 font-semibold">
                3. What evidence would defeat it?
              </div>
              <p className="text-slate-200 leading-relaxed">
                {selectedReview.evidence_that_would_defeat}
              </p>
            </div>

            {/* Q4 Authority that would defeat */}
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded space-y-1">
              <div className="text-[10px] uppercase font-mono text-purple-400 font-semibold">
                4. What authority would defeat it?
              </div>
              <p className="text-slate-200 leading-relaxed">
                {selectedReview.authority_that_would_defeat}
              </p>
            </div>

            {/* Q5 Already rejected */}
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded space-y-1">
              <div className="text-[10px] uppercase font-mono text-slate-400 font-semibold">
                5. Has it already been rejected?
              </div>
              <p className="text-slate-200 leading-relaxed font-mono">
                {selectedReview.already_rejected ? (
                  <span className="text-rose-400 font-bold">
                    YES — Prior dismissal: {selectedReview.prior_rejection_reason}
                  </span>
                ) : (
                  <span className="text-emerald-400">NO prior judicial rejection in record</span>
                )}
              </p>
            </div>

            {/* Q6 Is route genuinely new */}
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded space-y-1">
              <div className="text-[10px] uppercase font-mono text-slate-400 font-semibold">
                6. Is the route genuinely new?
              </div>
              <p className="text-slate-200 leading-relaxed font-mono">
                {selectedReview.is_route_genuinely_new ? (
                  <span className="text-emerald-400">YES — Distinct cause / procedural vehicle</span>
                ) : (
                  <span className="text-rose-400 font-bold">
                    NO — Repackaging of previously dismissed argument
                  </span>
                )}
              </p>
            </div>

            {/* Q7 Produces requested outcome */}
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded space-y-1">
              <div className="text-[10px] uppercase font-mono text-slate-400 font-semibold">
                7. Does it produce the requested outcome?
              </div>
              <p className="text-slate-200 leading-relaxed font-mono">
                {selectedReview.produces_requested_outcome ? (
                  <span className="text-emerald-400">YES — Advances client's exact objective</span>
                ) : (
                  <span className="text-rose-400">NO — Collateral or symbolic result only</span>
                )}
              </p>
            </div>

            {/* Q8 Should route survive */}
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded space-y-1">
              <div className="text-[10px] uppercase font-mono text-teal-400 font-semibold">
                8. Should the route survive?
              </div>
              <p className="text-slate-200 leading-relaxed font-mono">
                {selectedReview.should_route_survive ? (
                  <span className="text-emerald-400 font-bold">
                    SURVIVES ({selectedReview.survival_verdict})
                  </span>
                ) : (
                  <span className="text-rose-400 font-bold">BARRED AND DISMISSED</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* 20 Procedural Bars Checklist Grid */}
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold mb-2.5 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-amber-400" /> Audit of 20 Procedural Bars
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            {Object.entries(selectedReview.bars_checked).map(([barName, res]) => (
              <div
                key={barName}
                className={`p-2.5 rounded border text-xs flex items-start gap-2 ${
                  res.passed
                    ? 'bg-slate-950/70 border-slate-800 text-slate-300'
                    : 'bg-rose-950/30 border-rose-900/60 text-rose-200'
                }`}
              >
                {res.passed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="min-w-0">
                  <div className="font-semibold truncate text-[11px] font-mono">{barName}</div>
                  <div className="text-[10px] text-slate-400 line-clamp-2 leading-tight mt-0.5">
                    {res.note}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
