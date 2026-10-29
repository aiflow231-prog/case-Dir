import React, { useState } from 'react';
import { useMatter } from '../context/MatterContext';
import { AuditLogEntry } from '../types';
import {
  History,
  Search,
  Filter,
  CheckCircle2,
  ShieldAlert,
  RotateCcw,
  FileDown,
  Layers,
  ArrowRight
} from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const { auditLogs } = useMatter();
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter(log => {
    if (typeFilter === 'ALL') return true;
    return log.action_type === typeFilter;
  });

  const getBadgeColor = (type: AuditLogEntry['action_type']) => {
    switch (type) {
      case 'HUMAN_APPROVAL':
        return 'bg-purple-950 text-purple-300 border-purple-700 font-bold';
      case 'CORRECTION_LOGGED':
        return 'bg-amber-950 text-amber-300 border-amber-600 font-bold';
      case 'ROUTE_STATUS_CHANGE':
        return 'bg-teal-950 text-teal-300 border-teal-600';
      case 'REPORT_EXPORTED':
        return 'bg-emerald-950 text-emerald-300 border-emerald-700';
      case 'SEARCH_RUN':
      case 'AUTHORITY_RETRIEVED':
        return 'bg-slate-800 text-slate-300 border-slate-700';
      case 'CONTRADICTION_FLAGGED':
        return 'bg-rose-950 text-rose-300 border-rose-700';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto pb-8">
      {/* Directive Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 flex items-start gap-3 shadow">
        <History className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-100">IMMUTABLE FORENSIC AUDIT TRAIL:</span>{' '}
          Every query, authority citation, human gate authorization, route transition, error
          correction, and export is recorded chronologically to guarantee chain of custody.
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1C2541]/70 p-3 rounded-lg border border-slate-800">
        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Event Types</option>
            <option value="HUMAN_APPROVAL">HUMAN APPROVAL</option>
            <option value="CORRECTION_LOGGED">CORRECTION LOGGED</option>
            <option value="ROUTE_STATUS_CHANGE">ROUTE STATUS CHANGE</option>
            <option value="SEARCH_RUN">SEARCH RUN</option>
            <option value="AUTHORITY_RETRIEVED">AUTHORITY RETRIEVED</option>
            <option value="CONTRADICTION_FLAGGED">CONTRADICTION FLAGGED</option>
            <option value="REPORT_EXPORTED">REPORT EXPORTED</option>
          </select>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          {filteredLogs.length} logged events
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-[#0B132B] border border-slate-800 rounded-lg overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Action Type</th>
                <th className="py-2.5 px-3">Actor / Agent</th>
                <th className="py-2.5 px-3">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 font-sans">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getBadgeColor(
                        log.action_type
                      )}`}
                    >
                      {log.action_type.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-200 whitespace-nowrap text-[11px]">
                    {log.actor}
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 text-xs leading-relaxed max-w-xl">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
