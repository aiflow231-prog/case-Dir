import React, { useState } from 'react';
import { useMatter } from '../context/MatterContext';
import { ContradictionItem, ContradictionType } from '../types';
import {
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Filter,
  Plus,
  ArrowRight,
  GitCompare
} from 'lucide-react';

export const ContradictionsView: React.FC = () => {
  const { contradictions, addContradiction } = useMatter();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [materialityFilter, setMaterialityFilter] = useState('ALL');

  const filtered = contradictions.filter(c => {
    const matchesStatus = statusFilter === 'ALL' || c.current_status === statusFilter;
    const matchesMat = materialityFilter === 'ALL' || c.materiality === materialityFilter;
    return matchesStatus && matchesMat;
  });

  const getMaterialityBadge = (mat: ContradictionItem['materiality']) => {
    switch (mat) {
      case 'FATAL':
        return 'bg-red-950 text-red-300 border-red-700 font-bold';
      case 'MATERIAL':
        return 'bg-amber-950 text-amber-300 border-amber-600 font-semibold';
      case 'COLLATERAL':
        return 'bg-blue-950 text-blue-300 border-blue-700';
      case 'MINOR':
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto pb-8">
      {/* Directive Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 flex items-start gap-3 shadow">
        <GitCompare className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-100">CONTRADICTION ENGINE:</span> Maps
          incompatibilities between opposing claims, portal logs, bank statements, and official
          records. A contradiction marked FATAL prevents the affected route from qualifying as
          ACTIVE until resolved by primary official record.
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1C2541]/70 p-3 rounded-lg border border-slate-800">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">OPEN (Unresolved)</option>
            <option value="RESOLVED_BY_PRIMARY_RECORD">RESOLVED BY PRIMARY RECORD</option>
            <option value="UNRESOLVED">UNRESOLVED</option>
          </select>

          {/* Materiality filter */}
          <select
            value={materialityFilter}
            onChange={e => setMaterialityFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Materiality</option>
            <option value="FATAL">FATAL</option>
            <option value="MATERIAL">MATERIAL</option>
            <option value="COLLATERAL">COLLATERAL</option>
            <option value="MINOR">MINOR</option>
          </select>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          {filtered.length} contradictions recorded
        </div>
      </div>

      {/* Contradiction Cards */}
      <div className="space-y-4">
        {filtered.map(item => (
          <div
            key={item.contradiction_id}
            className="bg-[#0B132B] border border-slate-800 rounded-lg p-4 shadow-lg space-y-3"
          >
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-teal-400">
                  {item.contradiction_id}
                </span>
                <span className="text-xs font-semibold text-slate-200">
                  Type: {item.type}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getMaterialityBadge(
                    item.materiality
                  )}`}
                >
                  {item.materiality}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400">
                  Affects: <strong className="text-slate-200">{item.route_affected}</strong>
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    item.current_status === 'OPEN'
                      ? 'bg-amber-950 text-amber-300 border-amber-600'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                  }`}
                >
                  {item.current_status}
                </span>
              </div>
            </div>

            {/* Split Screen Proposition Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Proposition A */}
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded text-xs space-y-1.5">
                <div className="text-[10px] uppercase font-mono text-amber-400 font-semibold">
                  PROPOSITION A
                </div>
                <p className="text-slate-100 font-medium leading-relaxed">{item.proposition_a}</p>
                <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  <span className="text-slate-500">Source:</span> {item.source_a}
                </div>
              </div>

              {/* Proposition B */}
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded text-xs space-y-1.5">
                <div className="text-[10px] uppercase font-mono text-teal-400 font-semibold">
                  PROPOSITION B (COUNTER-RECORD)
                </div>
                <p className="text-slate-100 font-medium leading-relaxed">{item.proposition_b}</p>
                <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  <span className="text-slate-500">Source:</span> {item.source_b}
                </div>
              </div>
            </div>

            {/* Analysis & Evidence Required to Resolve */}
            <div className="bg-slate-950/80 p-3 rounded border border-slate-850 text-xs space-y-2">
              <div>
                <span className="text-slate-400 font-medium">Forensic Assessment:</span>{' '}
                <span className="text-slate-300">{item.possible_explanation}</span>
              </div>
              <div className="flex items-start gap-1.5 text-teal-300 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Evidence Required to Resolve:</strong>{' '}
                  {item.evidence_required_to_resolve}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
