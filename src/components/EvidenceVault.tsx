import React, { useState } from 'react';
import { useMatter } from '../context/MatterContext';
import { EvidenceItem } from '../types';
import {
  Archive,
  Plus,
  Search,
  Filter,
  FileText,
  AlertTriangle,
  ShieldAlert,
  CheckCircle,
  EyeOff,
  Copy,
  Info
} from 'lucide-react';

export const EvidenceVault: React.FC = () => {
  const { evidenceList, addEvidenceItem, isRedactedView } = useMatter();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [authFilter, setAuthFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New item form state
  const [newItem, setNewItem] = useState<Partial<EvidenceItem>>({
    exhibit_id: `EX-0${evidenceList.length + 1}`,
    filename: '',
    document_type: 'Court Record / Pleading',
    date: new Date().toISOString().split('T')[0],
    source: '',
    author_or_issuer: '',
    page_count: 1,
    authentication_status: 'UNVERIFIED',
    confidentiality_status: 'CONFIDENTIAL',
    duplicate_status: 'ORIGINAL',
    ocr_status: 'COMPLETED',
    completeness_status: 'COMPLETE',
    related_events: [],
    related_routes: [],
    notes: '',
    source_citation_identifier: '',
    raw_text: ''
  });

  const filteredEvidence = evidenceList.filter(item => {
    const matchesSearch =
      item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.exhibit_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author_or_issuer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'ALL' || item.document_type === typeFilter;
    const matchesAuth = authFilter === 'ALL' || item.authentication_status === authFilter;

    return matchesSearch && matchesType && matchesAuth;
  });

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.filename || !newItem.exhibit_id) return;

    addEvidenceItem({
      exhibit_id: newItem.exhibit_id,
      filename: newItem.filename,
      document_type: newItem.document_type || 'General Document',
      date: newItem.date || new Date().toISOString().split('T')[0],
      source: newItem.source || 'Direct User Upload',
      author_or_issuer: newItem.author_or_issuer || 'Unknown Issuer',
      page_count: Number(newItem.page_count) || 1,
      authentication_status: newItem.authentication_status || 'UNVERIFIED',
      confidentiality_status: newItem.confidentiality_status || 'CONFIDENTIAL',
      duplicate_status: newItem.duplicate_status || 'ORIGINAL',
      ocr_status: newItem.ocr_status || 'NOT_REQUIRED',
      completeness_status: newItem.completeness_status || 'COMPLETE',
      related_events: [],
      related_routes: [],
      notes: newItem.notes || '',
      source_citation_identifier: newItem.source_citation_identifier || `${newItem.exhibit_id} Ref`,
      raw_text: newItem.raw_text || ''
    });

    setIsAddModalOpen(false);
  };

  const getAuthBadge = (status: EvidenceItem['authentication_status']) => {
    switch (status) {
      case 'AUTHENTICATED':
        return 'bg-emerald-950 text-emerald-300 border-emerald-700/60';
      case 'UNVERIFIED':
        return 'bg-amber-950 text-amber-300 border-amber-700/60';
      case 'CHALLENGED':
        return 'bg-rose-950 text-rose-300 border-rose-700/60';
      case 'SUSPECT':
        return 'bg-red-950 text-red-300 border-red-700';
    }
  };

  const redactValue = (val: string) => {
    if (!isRedactedView) return val;
    // Mask numbers, personal identifiers
    return val.replace(/\b\d{4,}\b/g, '••••••').replace(/BH\d{2}[A-Z0-9]+/g, 'BH••[REDACTED]');
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto pb-8">
      {/* Redaction Notice */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-3 shadow">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-teal-400 shrink-0" />
          <span>
            <strong className="text-slate-100">Evidence Vault & Metadata Index:</strong> All documents
            maintain permanent chain-of-custody metadata. Redaction warnings enforce data privacy
            before external export.
          </span>
        </div>
        {isRedactedView && (
          <span className="text-[11px] font-mono text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600 flex items-center gap-1">
            <EyeOff className="w-3 h-3" /> Redacted View Engaged
          </span>
        )}
      </div>

      {/* Control Bar: Search & Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1C2541]/70 p-3 rounded-lg border border-slate-800">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by exhibit ID, filename, author, notes..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Auth filter */}
          <select
            value={authFilter}
            onChange={e => setAuthFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Authentication</option>
            <option value="AUTHENTICATED">AUTHENTICATED</option>
            <option value="UNVERIFIED">UNVERIFIED</option>
            <option value="CHALLENGED">CHALLENGED</option>
            <option value="SUSPECT">SUSPECT</option>
          </select>
        </div>

        {/* Ingest Item Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-teal-700 hover:bg-teal-600 text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 shadow transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ingest Evidence</span>
        </button>
      </div>

      {/* Exhibits Table */}
      <div className="bg-[#0B132B] border border-slate-800 rounded-lg overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Exhibit</th>
                <th className="py-2.5 px-3">Filename / Type</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Issuer / Source</th>
                <th className="py-2.5 px-3">Auth Status</th>
                <th className="py-2.5 px-3">OCR / Dup</th>
                <th className="py-2.5 px-3">Evidentiary Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 font-sans">
              {filteredEvidence.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                    No matching evidence items in vault.
                  </td>
                </tr>
              ) : (
                filteredEvidence.map(item => (
                  <tr key={item.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-teal-400 whitespace-nowrap">
                      {item.exhibit_id}
                    </td>
                    <td className="py-2.5 px-3 min-w-[180px]">
                      <div className="font-medium text-slate-100 truncate max-w-xs">
                        {item.filename}
                      </div>
                      <div className="text-[11px] text-slate-400">{item.document_type}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-300 whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-300 max-w-xs truncate">
                      <div className="text-slate-200">{redactValue(item.author_or_issuer)}</div>
                      <div className="text-slate-400 text-[10px]">{redactValue(item.source)}</div>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getAuthBadge(
                          item.authentication_status
                        )}`}
                      >
                        {item.authentication_status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-[11px]">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-slate-400 font-mono">
                          OCR: {item.ocr_status}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {item.duplicate_status}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 text-xs max-w-sm">
                      <p className="line-clamp-2 leading-relaxed">{redactValue(item.notes)}</p>
                      <div className="text-[10px] font-mono text-teal-500/80 mt-0.5">
                        {item.source_citation_identifier}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ingestion Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-[#1C2541] border border-slate-700 rounded-lg max-w-2xl w-full p-5 shadow-2xl text-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-400" /> Ingest Documentary Evidence
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Exhibit ID</label>
                  <input
                    type="text"
                    required
                    value={newItem.exhibit_id}
                    onChange={e => setNewItem({ ...newItem, exhibit_id: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Filename / Record Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Service_Bailiff_Docket.pdf"
                    value={newItem.filename}
                    onChange={e => setNewItem({ ...newItem, filename: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Document Type</label>
                  <select
                    value={newItem.document_type}
                    onChange={e => setNewItem({ ...newItem, document_type: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                  >
                    <option value="Court Judgment / Official Order">Court Judgment / Order</option>
                    <option value="Process Server Return / Bailiff Notice">Bailiff / Service Return</option>
                    <option value="Electronic Portal Screenshot">Portal Screenshot</option>
                    <option value="Bank Account Statement">Bank Account Statement</option>
                    <option value="Payment Gateway Receipt">Payment Receipt</option>
                    <option value="Advocacy Pleading">Advocacy Pleading</option>
                    <option value="Email / Correspondence">Email / Correspondence</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Document Date</label>
                  <input
                    type="date"
                    required
                    value={newItem.date}
                    onChange={e => setNewItem({ ...newItem, date: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Authentication Status</label>
                  <select
                    value={newItem.authentication_status}
                    onChange={e =>
                      setNewItem({
                        ...newItem,
                        authentication_status: e.target.value as EvidenceItem['authentication_status']
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 font-mono"
                  >
                    <option value="AUTHENTICATED">AUTHENTICATED</option>
                    <option value="UNVERIFIED">UNVERIFIED</option>
                    <option value="CHALLENGED">CHALLENGED</option>
                    <option value="SUSPECT">SUSPECT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Author / Issuer</label>
                  <input
                    type="text"
                    placeholder="e.g. Court Bailiff, Bank, Registry Clerk"
                    value={newItem.author_or_issuer}
                    onChange={e => setNewItem({ ...newItem, author_or_issuer: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Source Citation Identifier</label>
                  <input
                    type="text"
                    placeholder="e.g. RDC Case # 04/2026/812 Judg. p. 1"
                    value={newItem.source_citation_identifier}
                    onChange={e =>
                      setNewItem({ ...newItem, source_citation_identifier: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Evidentiary Notes & Significance</label>
                <textarea
                  rows={2}
                  placeholder="Record factual assertions, limitations, or missing attachments..."
                  value={newItem.notes}
                  onChange={e => setNewItem({ ...newItem, notes: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Extracted Text Content (Simulated OCR)</label>
                <textarea
                  rows={3}
                  placeholder="Paste or simulate parsed text from record..."
                  value={newItem.raw_text}
                  onChange={e => setNewItem({ ...newItem, raw_text: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-teal-700 hover:bg-teal-600 text-white font-semibold"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
