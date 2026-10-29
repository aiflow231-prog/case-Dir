import React, { useState } from 'react';
import { useMatter } from '../context/MatterContext';
import { RouteItem, RouteStatus } from '../types';
import {
  GitBranch,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  Filter,
  DollarSign,
  FileText
} from 'lucide-react';
import { validateRouteActionPermitted } from '../utils/routeValidator';

export const RouteLabView: React.FC = () => {
  const { routes, updateRouteStatus, requestHumanApproval, setActiveView } = useMatter();
  const [selectedRouteId, setSelectedRouteId] = useState<string>(routes[0]?.route_id || 'R-01');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const selectedRoute = routes.find(r => r.route_id === selectedRouteId) || routes[0];

  const filteredRoutes = routes.filter(r => {
    if (statusFilter === 'ALL') return true;
    return r.status === statusFilter;
  });

  const getStatusBadgeColor = (status: RouteStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-950 text-emerald-300 border-emerald-600 font-bold';
      case 'EVIDENCE-DEPENDENT':
        return 'bg-amber-950 text-amber-300 border-amber-600 font-semibold';
      case 'WEAK':
        return 'bg-blue-950 text-blue-300 border-blue-600';
      case 'REJECTED':
      case 'DEAD':
        return 'bg-rose-950 text-rose-300 border-rose-600 font-bold';
      case 'SUPERSEDED':
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const handleAttemptSubstantiveFiling = () => {
    const check = validateRouteActionPermitted(selectedRoute, 'SUBSTANTIVE_FILING');
    if (!check.permitted) {
      requestHumanApproval({
        action_name: `Attempted Substantive Filing on ${selectedRoute.route_name}`,
        category: 'FILING_DOCUMENT',
        impact_warning: check.reason,
        route_id: selectedRoute.route_id,
        onApprove: () => {},
        onReject: () => {}
      });
      return;
    }

    requestHumanApproval({
      action_name: `Formal Substantive Filing under ${selectedRoute.route_name}`,
      category: 'FILING_DOCUMENT',
      impact_warning: `This action commits the client to legal proceedings in the ${selectedRoute.jurisdiction_or_authority}. Filing fees will be incurred and adversary response window will commence.`,
      route_id: selectedRoute.route_id,
      onApprove: () => {
        setActionFeedback(`Substantive filing authorized for ${selectedRoute.route_id}. Proceeding to court portal gate.`);
        setTimeout(() => setActionFeedback(null), 5000);
      }
    });
  };

  const handlePromoteToActive = () => {
    updateRouteStatus(
      selectedRoute.route_id,
      'ACTIVE',
      'Operator confirmed receipt of service docket proof defeating time bar.'
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      {actionFeedback && (
        <div className="bg-emerald-950/80 border border-emerald-600 text-emerald-200 px-4 py-2.5 rounded-lg text-xs flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Route Constitution Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 flex items-start gap-3 shadow">
        <GitBranch className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-100">
            PROCEDURAL ROUTE DISCIPLINE:
          </span>{' '}
          Only an <strong className="text-emerald-400 font-mono">ACTIVE</strong> route may produce a
          recommendation to file or take substantive action. An{' '}
          <strong className="text-amber-400 font-mono">EVIDENCE-DEPENDENT</strong> route may only
          produce targeted records requests, preservation notices, technical verification, or
          neutral inquiries.
        </div>
      </div>

      {/* Main Grid: Left rail of route cards, Right panel of route details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Route List (col-4) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-mono uppercase font-semibold">Evaluated Routes</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[11px] text-slate-300"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="EVIDENCE-DEPENDENT">EVIDENCE-DEPENDENT</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>

          <div className="space-y-2">
            {filteredRoutes.map(route => {
              const isSelected = route.route_id === selectedRoute.route_id;
              return (
                <div
                  key={route.route_id}
                  onClick={() => setSelectedRouteId(route.route_id)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all shadow-sm ${
                    isSelected
                      ? 'bg-[#1C2541] border-teal-500 shadow-teal-950/20'
                      : 'bg-[#0B132B] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="font-mono text-xs font-bold text-teal-400">
                      {route.route_id}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getStatusBadgeColor(
                        route.status
                      )}`}
                    >
                      {route.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-100 line-clamp-1 mb-1">
                    {route.route_name}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                    <span>Survival Score:</span>
                    <span className="font-mono font-bold text-teal-300">
                      {route.survival_score}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Route Detailed Workspace (col-8) */}
        <div className="lg:col-span-8 bg-[#0B132B] border border-slate-800 rounded-lg p-5 shadow-lg space-y-5">
          {/* Top Title & Status */}
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-sm font-bold text-teal-400">
                  {selectedRoute.route_id}
                </span>
                <span
                  className={`text-xs font-mono px-2.5 py-0.5 rounded border ${getStatusBadgeColor(
                    selectedRoute.status
                  )}`}
                >
                  {selectedRoute.status}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Score: {selectedRoute.survival_score}/100
                </span>
              </div>
              <h2 className="text-base font-semibold text-slate-100">
                {selectedRoute.route_name}
              </h2>
              <div className="text-xs text-slate-400 mt-0.5">
                <strong>Vehicle:</strong> {selectedRoute.procedural_vehicle} |{' '}
                <strong>Forum:</strong> {selectedRoute.jurisdiction_or_authority}
              </div>
            </div>

            {/* Substantive Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {selectedRoute.status === 'EVIDENCE-DEPENDENT' && (
                <button
                  onClick={handlePromoteToActive}
                  className="bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-600 px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <span>Promote to ACTIVE (Gate)</span>
                </button>
              )}

              <button
                onClick={handleAttemptSubstantiveFiling}
                className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow ${
                  selectedRoute.status === 'ACTIVE'
                    ? 'bg-teal-700 hover:bg-teal-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Initiate Filing</span>
              </button>
            </div>
          </div>

          {/* Exact Objective Advanced */}
          <div className="bg-slate-900/90 p-3 rounded border border-slate-800 text-xs">
            <span className="text-[10px] uppercase font-mono text-teal-400 block mb-0.5 font-semibold">
              Exact Objective Advanced:
            </span>
            <p className="text-slate-200 font-medium">{selectedRoute.exact_objective_advanced}</p>
          </div>

          {/* Required Legal Elements Checklist */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Statutory & Evidentiary Elements
            </h3>
            <div className="space-y-2">
              {selectedRoute.required_elements.map(el => (
                <div
                  key={el.id}
                  className="bg-slate-950/70 border border-slate-850 p-2.5 rounded text-xs flex items-start justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="font-medium text-slate-200 flex items-center gap-1.5">
                      {el.status === 'MET' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      {el.status === 'UNMET' && <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                      {el.status === 'DEPENDENT_ON_REQUEST' && (
                        <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      {el.status === 'CONTRADICTED' && (
                        <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                      )}
                      <span>{el.element_name}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">Basis: {el.legal_basis}</div>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border whitespace-nowrap ${
                      el.status === 'MET'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : el.status === 'UNMET'
                        ? 'bg-rose-950 text-rose-300 border-rose-800'
                        : 'bg-amber-950 text-amber-300 border-amber-800'
                    }`}
                  >
                    {el.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Deadline Assessment Card */}
          <div className="bg-[#1C2541]/50 border border-slate-800 p-3.5 rounded-lg space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase font-semibold text-teal-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-400" /> Procedural Deadline Analysis
              </span>
              <span className="font-mono text-[10px] text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700">
                Status: {selectedRoute.deadline.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-300">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">Duration:</span>
                <span>{selectedRoute.deadline.duration}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">
                  Commencement Event:
                </span>
                <span>{selectedRoute.deadline.commencement_event}</span>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
              <strong>Calculation Logic:</strong> {selectedRoute.deadline.calculation}
            </div>
          </div>

          {/* Strongest Argument vs Contrary Defense */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-emerald-950/20 border border-emerald-900/50 p-3 rounded space-y-1">
              <div className="text-[10px] font-mono uppercase text-emerald-400 font-semibold">
                Strongest Supporting Argument
              </div>
              <p className="text-slate-200 leading-relaxed">
                {selectedRoute.strongest_supporting_argument}
              </p>
            </div>

            <div className="bg-rose-950/20 border border-rose-900/50 p-3 rounded space-y-1">
              <div className="text-[10px] font-mono uppercase text-rose-400 font-semibold">
                Strongest Hostile Counter-Argument
              </div>
              <p className="text-slate-200 leading-relaxed">
                {selectedRoute.strongest_contrary_argument}
              </p>
            </div>
          </div>

          {/* Missing Evidence & Stop Condition */}
          <div className="bg-slate-950/90 p-3 rounded border border-slate-850 space-y-2 text-xs">
            <div>
              <span className="text-amber-400 font-medium">Decisive Missing Proof:</span>{' '}
              <span className="text-slate-300">
                {selectedRoute.missing_evidence.join('; ') || 'None required.'}
              </span>
            </div>
            <div>
              <span className="text-rose-400 font-medium">Mandatory Stop Condition:</span>{' '}
              <span className="text-slate-300">{selectedRoute.stop_condition}</span>
            </div>
            <div>
              <span className="text-teal-400 font-medium">Cheaper Verification Step:</span>{' '}
              <span className="text-slate-300">{selectedRoute.cheaper_verification_step}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
