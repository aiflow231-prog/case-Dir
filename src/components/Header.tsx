import React from 'react';
import { useMatter } from '../context/MatterContext';
import {
  ShieldAlert,
  Play,
  Square,
  FileDown,
  Eye,
  EyeOff,
  PlusCircle,
  RotateCcw,
  Scale,
  Sparkles
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    matter,
    isResearching,
    runAnalysisCycle,
    stopResearch,
    setExportModalOpen,
    setIntakeWizardOpen,
    isRedactedView,
    setIsRedactedView,
    resetToPilotMatter,
    evidenceList
  } = useMatter();

  const getConfidenceBadgeColor = (conf: string) => {
    switch (conf) {
      case 'HIGH CONFIDENCE':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-600/60';
      case 'MODERATE CONFIDENCE':
        return 'bg-amber-950/80 text-amber-300 border-amber-600/60';
      case 'LOW CONFIDENCE':
        return 'bg-rose-950/80 text-rose-300 border-rose-600/60';
      case 'NOT SUPPORTABLE':
        return 'bg-red-950 text-red-400 border-red-700';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-600';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ANALYSIS IN PROGRESS':
        return 'bg-amber-950 text-amber-300 border-amber-500 font-semibold';
      case 'RESEARCHING':
        return 'bg-teal-950 text-teal-300 border-teal-500 animate-pulse';
      case 'COMPLETED':
        return 'bg-slate-800 text-teal-400 border-teal-700/60';
      case 'SATURATED':
        return 'bg-amber-950 text-amber-300 border-amber-600';
      case 'STOPPED':
        return 'bg-rose-950 text-rose-300 border-rose-600';
      default:
        return 'bg-slate-850 text-slate-400 border-slate-700';
    }
  };

  return (
    <header className="bg-[#0B132B] border-b border-slate-800 text-slate-200 sticky top-0 z-30 shadow-lg">
      {/* Top Banner Warning */}
      <div className="bg-slate-950/90 border-b border-slate-800/80 px-4 py-1.5 flex flex-wrap items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="font-mono tracking-wider font-bold text-amber-400 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-amber-400" /> CASE ARCHITECT
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 font-medium hidden sm:inline">Exhaustive Route Validator</span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 truncate max-w-md hidden md:inline">
            Evidence outranks intuition. Controlling authority outranks commentary.
          </span>
        </div>
        <div className="flex items-center space-x-3 text-[11px]">
          <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/50">
            <ShieldAlert className="w-3 h-3 text-emerald-400" />
            {matter.confidentiality_classification} • LOCAL ISOLATED
          </span>
          {matter.is_sample_pilot && (
            <button
              onClick={resetToPilotMatter}
              title="Reset state to pristine pilot data"
              className="text-slate-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset Pilot
            </button>
          )}
        </div>
      </div>

      {/* Main Top Bar */}
      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Matter Identity Info */}
        <div className="min-w-0 max-w-xl">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold text-slate-100 truncate tracking-tight">
              {matter.title}
            </h1>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getStatusBadgeColor(
                matter.research_status
              )}`}
            >
              {matter.research_status}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-0.5">
            <span className="truncate">
              <strong className="text-slate-300 font-medium">Jurisdiction:</strong> {matter.jurisdiction}
            </span>
            <span>•</span>
            <span>
              <strong className="text-slate-300 font-medium">Cutoff:</strong>{' '}
              <span className="font-mono text-slate-200">{matter.analysis_cutoff_date}</span>
            </span>
          </div>
        </div>

        {/* Indicators & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Completeness Gauge */}
          <div className="hidden lg:flex flex-col items-end pr-2 border-r border-slate-800 text-right">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
              Evidence Completeness
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-teal-500 rounded-full transition-all duration-500"
                  style={{ width: `${matter.evidence_completeness_pct}%` }}
                />
              </div>
              <span className="font-mono text-xs font-semibold text-teal-300">
                {matter.evidence_completeness_pct}%
              </span>
            </div>
          </div>

          {/* Confidence Indicator */}
          <div
            className={`px-2.5 py-1 rounded text-xs font-mono font-semibold border flex items-center gap-1.5 ${getConfidenceBadgeColor(
              matter.confidence_indicator
            )}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{matter.confidence_indicator}</span>
          </div>

          {/* Redaction Toggle */}
          <button
            onClick={() => setIsRedactedView(!isRedactedView)}
            className={`px-2.5 py-1.5 rounded text-xs font-medium border flex items-center gap-1.5 transition-colors ${
              isRedactedView
                ? 'bg-amber-950/70 border-amber-500 text-amber-300'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
            title="Toggle Redacted View for client / third-party sharing"
          >
            {isRedactedView ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isRedactedView ? 'Redacted' : 'Unredacted'}</span>
          </button>

          {/* Research Loop Controls */}
          {isResearching ? (
            <button
              onClick={stopResearch}
              className="bg-rose-900/90 hover:bg-rose-800 text-rose-100 border border-rose-600 px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 shadow transition-all"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop Research</span>
            </button>
          ) : (
            <button
              onClick={runAnalysisCycle}
              className="bg-teal-700 hover:bg-teal-600 text-white border border-teal-500/80 px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 shadow transition-all hover:shadow-teal-900/30"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Analysis</span>
            </button>
          )}

          {/* Export Report */}
          <button
            onClick={() => setExportModalOpen(true)}
            className="bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-600 px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <FileDown className="w-3.5 h-3.5 text-teal-400" />
            <span>Export Report</span>
          </button>

          {/* Intake New Matter */}
          <button
            onClick={() => setIntakeWizardOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-500 px-2.5 py-1.5 rounded text-xs font-medium flex items-center gap-1 transition-colors"
            title="Create or Intake a New Matter"
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">New Matter</span>
          </button>
        </div>
      </div>
    </header>
  );
};
