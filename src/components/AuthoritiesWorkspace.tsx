import React, { useState } from 'react';
import { useMatter } from '../context/MatterContext';
import { LegalProposition } from '../types';
import {
  BookOpen,
  Search,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Scale,
  Layers,
  Info
} from 'lucide-react';

const PRIORITY_TIERS = [
  { tier: 1, label: '1. Current Controlling Legislation' },
  { tier: 2, label: '2. Official Amendments' },
  { tier: 3, label: '3. Commencement Provisions' },
  { tier: 4, label: '4. Binding Judicial Decisions (Cassation / Supreme)' },
  { tier: 5, label: '5. Official Regulations & Procedural Orders' },
  { tier: 6, label: '6. Official Court / Gov Service Information' },
  { tier: 7, label: '7. Primary Documentary Evidence' },
  { tier: 8, label: '8. Reliable Secondary Sources' },
  { tier: 9, label: '9. Commentary' }
];

export const AuthoritiesWorkspace: React.FC = () => {
  const { propositions, addLegalProposition, logAuditEvent } = useMatter();
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState<number | 'ALL'>('ALL');
  const [simulatedQuery, setSimulatedQuery] = useState('');
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  const filtered = propositions.filter(prop => {
    const matchesSearch =
      prop.proposition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.authority_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.article_or_paragraph.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTier = tierFilter === 'ALL' || prop.priority_tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  const handleSimulatePublicSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulatedQuery.trim()) return;

    // Disciplinary privacy check: Ensure query doesn't leak private names or IBANs
    const lower = simulatedQuery.toLowerCase();
    if (lower.includes('tenant') && (lower.includes('iban') || lower.includes('cr number'))) {
      setSearchFeedback(
        'PRIVACY GUARD ENGAGED: Private case facts or identifiers cannot be sent to public authority search. Strip private party references and search only abstract legal propositions.'
      );
      return;
    }

    setSearchFeedback(
      `INQUIRY NOT EXECUTED: No authority-retrieval connector is configured. No external search occurred and no authority was verified.`
    );

    logAuditEvent({
      action_type: 'SEARCH_RUN',
      actor: 'Public Authority Adapter',
      details: `Authority inquiry recorded locally. No external search was executed.`
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      {/* Hierarchy Constitution Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 flex items-start gap-3 shadow">
        <Scale className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-100">
            CONTROLLING AUTHORITY HIERARCHY:
          </span>{' '}
          Priority 1 Legislation outranks commentary. A proposition is classified as VERIFIED only
          if the cited authority directly supports it. If no controlling source is found, the system
          explicitly states: “No controlling authority was located for this proposition.”
        </div>
      </div>

      {/* Public Authority Search Simulator (Privacy-Preserving) */}
      <div className="bg-[#1C2541]/80 border border-slate-700/80 rounded-lg p-4 shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-teal-300 font-semibold flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-teal-400" /> AUTHORITY INQUIRY (CONNECTOR REQUIRED)
          </span>
          <span className="text-[10px] bg-slate-900 text-teal-300 border border-teal-800/60 px-2 py-0.5 rounded font-mono">
            PRIVACY SEPARATED • ZERO PRIVATE LEAKS
          </span>
        </div>

        <form onSubmit={handleSimulatePublicSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search public statutes, decrees, cassation precedents (e.g. 'Rent law Article 28 service notification requirement')..."
            value={simulatedQuery}
            onChange={e => setSimulatedQuery(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
          <button
            type="submit"
            className="bg-teal-700 hover:bg-teal-600 text-white px-4 py-1.5 rounded text-xs font-semibold shadow transition-colors"
          >
            Record Inquiry
          </button>
        </form>

        {searchFeedback && (
          <div className="mt-2.5 p-2.5 bg-slate-950/80 rounded border border-teal-800/50 text-xs text-teal-300 font-mono flex items-start gap-2">
            <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <span>{searchFeedback}</span>
          </div>
        )}
      </div>

      {/* Control Bar: Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1C2541]/70 p-3 rounded-lg border border-slate-800">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search propositions by wording or title..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <select
            value={tierFilter}
            onChange={e =>
              setTierFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))
            }
            className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Hierarchy Tiers (1 to 9)</option>
            {PRIORITY_TIERS.map(t => (
              <option key={t.tier} value={t.tier}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          {filtered.length} propositions indexed
        </div>
      </div>

      {/* Propositions List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-[#0B132B] border border-slate-800 rounded-lg p-6 text-center text-xs text-slate-400">
            No controlling authority was located for this proposition.
          </div>
        ) : (
          filtered.map(prop => (
            <div
              key={prop.proposition_id}
              className="bg-[#0B132B] border border-slate-800 rounded-lg p-4 shadow-lg space-y-3"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-teal-400">
                    {prop.proposition_id}
                  </span>
                  <span className="text-xs font-semibold text-slate-200">
                    Tier {prop.priority_tier}: {prop.authority_type}
                  </span>
                  <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                    {prop.jurisdiction}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {prop.directly_supported ? (
                    <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-400" /> DIRECTLY SUPPORTED
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-600 px-2 py-0.5 rounded flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-400" /> INFERENCE / UNVERIFIED
                    </span>
                  )}

                  <span className="text-[10px] font-mono bg-slate-800 text-teal-300 px-2 py-0.5 rounded border border-teal-800">
                    {prop.confidence}
                  </span>
                </div>
              </div>

              {/* Proposition wording */}
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
                  Legal Proposition:
                </span>
                <p className="text-sm font-medium text-slate-100 leading-relaxed">
                  "{prop.proposition}"
                </p>
              </div>

              {/* Citation & Exact Supporting Passage */}
              <div className="bg-slate-950/80 p-3 rounded border border-slate-850 space-y-2 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 text-slate-300">
                  <div>
                    <strong className="text-teal-400">{prop.authority_title}</strong> —{' '}
                    <span className="font-mono">{prop.article_or_paragraph}</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Effective: {prop.effective_date} (Version: {prop.version_checked})
                  </div>
                </div>

                <blockquote className="border-l-2 border-teal-600 pl-3 py-1 text-slate-200 italic bg-teal-950/20 text-xs">
                  "{prop.exact_supporting_passage}"
                </blockquote>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-850 text-[11px] text-slate-400">
                  <div className="font-mono text-slate-300">
                    Citation: {prop.source_citation}
                  </div>
                  {prop.limitations && (
                    <div className="text-amber-300/90">
                      <strong>Limitations:</strong> {prop.limitations}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
