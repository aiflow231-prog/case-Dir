import React, { useState } from 'react';
import { useMatter } from '../context/MatterContext';
import { ChronologyEvent, DateType } from '../types';
import { auditChronologyEvents } from '../utils/chronologyEngine';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Plus,
  Filter,
  Calendar,
  Layers,
  HelpCircle,
  FileText
} from 'lucide-react';

const ALL_DATE_TYPES: DateType[] = [
  'Event date',
  'Document date',
  'Issue date',
  'Service date',
  'Knowledge date',
  'Creation date',
  'Save date',
  'Filing date',
  'Registration date',
  'Payment date',
  'Decision date',
  'Publication date',
  'Effective date'
];

export const ChronologyView: React.FC = () => {
  const { chronology, addChronologyEvent } = useMatter();
  const [dateTypeFilter, setDateTypeFilter] = useState<string>('ALL');
  const [routeFilter, setRouteFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newEvent, setNewEvent] = useState<Partial<ChronologyEvent>>({
    event_id: `EVT_00${chronology.length + 1}`,
    date_and_time: new Date().toISOString().substring(0, 16),
    date_type: 'Event date',
    event_description: '',
    evidence_supporting: [],
    evidence_contradicting: [],
    procedural_effect: '',
    deadline_effect: 'None',
    related_route: 'R-01',
    confidence: 'MODERATE CONFIDENCE',
    unknowns: [],
    is_date_proved: true
  });

  const audit = auditChronologyEvents(chronology);

  const filteredEvents = audit.sortedEvents.filter(evt => {
    const matchesDateType = dateTypeFilter === 'ALL' || evt.date_type === dateTypeFilter;
    const matchesRoute = routeFilter === 'ALL' || evt.related_route === routeFilter;
    return matchesDateType && matchesRoute;
  });

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.event_description || !newEvent.date_and_time) return;

    addChronologyEvent({
      event_id: newEvent.event_id || `EVT_${Date.now()}`,
      date_and_time: newEvent.date_and_time,
      date_type: (newEvent.date_type as DateType) || 'Event date',
      event_description: newEvent.event_description,
      evidence_supporting: newEvent.evidence_supporting || [],
      evidence_contradicting: newEvent.evidence_contradicting || [],
      procedural_effect: newEvent.procedural_effect || 'None',
      deadline_effect: newEvent.deadline_effect || 'None',
      related_route: newEvent.related_route || 'R-01',
      confidence: newEvent.confidence || 'MODERATE CONFIDENCE',
      unknowns: newEvent.unknowns || [],
      is_date_proved: Boolean(newEvent.is_date_proved)
    });

    setIsModalOpen(false);
  };

  const getDateTypeBadgeColor = (type: DateType) => {
    switch (type) {
      case 'Decision date':
        return 'bg-purple-950 text-purple-300 border-purple-700';
      case 'Save date':
        return 'bg-amber-950 text-amber-300 border-amber-600 font-bold';
      case 'Filing date':
        return 'bg-emerald-950 text-emerald-300 border-emerald-600 font-bold';
      case 'Service date':
        return 'bg-rose-950 text-rose-300 border-rose-600 font-bold';
      case 'Payment date':
        return 'bg-teal-950 text-teal-300 border-teal-600';
      case 'Knowledge date':
        return 'bg-slate-800 text-amber-200 border-amber-800';
      default:
        return 'bg-slate-900 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto pb-8">
      {/* Date Distinction Constitution Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 flex items-start gap-3 shadow">
        <Clock className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-100">
            CHRONOLOGICAL RIGOR DIRECTIVE:
          </span>{' '}
          Each event strictly separates save dates, filing dates, service dates, payment dates, and
          decision dates. Never merge save date with legal filing date. The system warns whenever a
          deadline calculation relies on an unproved date.
        </div>
      </div>

      {/* Warnings Banner if any */}
      {audit.warnings.length > 0 && (
        <div className="bg-amber-950/40 border border-amber-600/70 rounded-lg p-3.5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 font-mono">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            {audit.warnings.length} UNPROVED COMMENCEMENT WARNING(S) ACTIVE
          </div>
          <div className="space-y-1.5 text-xs text-amber-200/90">
            {audit.warnings.map((w, i) => (
              <div key={i} className="pl-4 border-l-2 border-amber-500 py-0.5">
                {w.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1C2541]/70 p-3 rounded-lg border border-slate-800">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Date Type Filter */}
          <select
            value={dateTypeFilter}
            onChange={e => setDateTypeFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Date Types (13 Separate Types)</option>
            {ALL_DATE_TYPES.map(dt => (
              <option key={dt} value={dt}>
                {dt}
              </option>
            ))}
          </select>

          {/* Route filter */}
          <select
            value={routeFilter}
            onChange={e => setRouteFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Routes</option>
            <option value="R-01">Route R-01 (Ordinary Appeal)</option>
            <option value="R-02">Route R-02 (Reconsideration)</option>
            <option value="R-03">Route R-03 (Execution Dispute)</option>
          </select>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-teal-700 hover:bg-teal-600 text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 shadow transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Chronology Event</span>
        </button>
      </div>

      {/* Chronology Timeline List */}
      <div className="space-y-3">
        {filteredEvents.map((evt, idx) => (
          <div
            key={evt.event_id}
            className={`border rounded-lg p-4 shadow-sm transition-all ${
              !evt.is_date_proved
                ? 'bg-amber-950/20 border-amber-700/60'
                : 'bg-[#0B132B] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-teal-400">
                  {evt.event_id}
                </span>
                <span className="font-mono text-xs text-slate-200 font-semibold">
                  {new Date(evt.date_and_time).toLocaleString()}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getDateTypeBadgeColor(
                    evt.date_type
                  )}`}
                >
                  {evt.date_type}
                </span>

                {evt.is_date_proved ? (
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Date Proved
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-300 bg-amber-950 border border-amber-600 px-1.5 py-0.5 rounded font-mono font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-400" /> DATE UNPROVED
                  </span>
                )}
              </div>

              <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                Route: {evt.related_route}
              </span>
            </div>

            <p className="text-xs text-slate-100 font-medium leading-relaxed mb-3">
              {evt.event_description}
            </p>

            {/* Procedural & Deadline Impact Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-950/70 p-2.5 rounded border border-slate-850">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
                  Procedural Effect:
                </span>
                <span className="text-slate-300">{evt.procedural_effect}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
                  Deadline Effect:
                </span>
                <span
                  className={
                    !evt.is_date_proved && evt.deadline_effect !== 'None'
                      ? 'text-amber-300 font-semibold'
                      : 'text-slate-300'
                  }
                >
                  {evt.deadline_effect}
                </span>
              </div>
            </div>

            {/* Supporting Evidence & Unknowns Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <span>Supporting Proof:</span>
                {evt.evidence_supporting.length > 0 ? (
                  evt.evidence_supporting.map(ev => (
                    <span
                      key={ev}
                      className="font-mono text-teal-400 bg-teal-950/60 px-1 rounded border border-teal-800"
                    >
                      {ev}
                    </span>
                  ))
                ) : (
                  <span className="text-rose-400 font-mono">None in record</span>
                )}
              </div>

              {evt.unknowns.length > 0 && (
                <div className="text-amber-400/90 text-[10px] flex items-center gap-1">
                  <HelpCircle className="w-3 h-3" />
                  <span>Unknown: {evt.unknowns.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-[#1C2541] border border-slate-700 rounded-lg max-w-xl w-full p-5 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-400" /> Add Chronology Event
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Date and Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={newEvent.date_and_time}
                    onChange={e => setNewEvent({ ...newEvent, date_and_time: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">
                    Date Type (Strict Distinction)
                  </label>
                  <select
                    value={newEvent.date_type}
                    onChange={e => setNewEvent({ ...newEvent, date_type: e.target.value as DateType })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-mono"
                  >
                    {ALL_DATE_TYPES.map(dt => (
                      <option key={dt} value={dt}>
                        {dt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Event Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Record factual event without inferring unproved filing or service..."
                  value={newEvent.event_description}
                  onChange={e => setNewEvent({ ...newEvent, event_description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Procedural Effect</label>
                  <input
                    type="text"
                    placeholder="e.g. Initiates execution dispute window"
                    value={newEvent.procedural_effect}
                    onChange={e => setNewEvent({ ...newEvent, procedural_effect: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Deadline Effect</label>
                  <input
                    type="text"
                    placeholder="e.g. 15 days under Article 28"
                    value={newEvent.deadline_effect}
                    onChange={e => setNewEvent({ ...newEvent, deadline_effect: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="dateProvedCheck"
                  checked={newEvent.is_date_proved}
                  onChange={e => setNewEvent({ ...newEvent, is_date_proved: e.target.checked })}
                  className="rounded bg-slate-900 border-slate-700 text-teal-600 focus:ring-0"
                />
                <label htmlFor="dateProvedCheck" className="text-slate-300">
                  Date is strictly proved by primary authenticated document in Evidence Vault
                </label>
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
                  className="px-4 py-1.5 rounded bg-teal-700 hover:bg-teal-600 text-white font-semibold"
                >
                  Add to Chronology
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
