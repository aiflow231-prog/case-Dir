import React, { useState } from 'react';
import { useMatter } from '../context/MatterContext';
import { DocumentCategoryType, DocumentIndexItem } from '../types';
import {
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  FileText,
  Search,
  Filter,
  Layers,
  Shield,
  HelpCircle
} from 'lucide-react';

export const DocumentIndex: React.FC = () => {
  const { documentIndex, addDocumentIndexItem } = useMatter();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filteredItems = documentIndex.filter(item => {
    const matchesSearch =
      item.document_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.exhibit_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.evidentiary_significance.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = categoryFilter === 'ALL' || item.document_category === categoryFilter;

    return matchesSearch && matchesCat;
  });

  const getCategoryBadge = (cat: DocumentCategoryType) => {
    switch (cat) {
      case 'Official record':
        return 'bg-emerald-950 text-emerald-300 border-emerald-700/60 font-semibold';
      case 'Party assertion':
        return 'bg-amber-950 text-amber-300 border-amber-700/60';
      case 'Advocacy document':
        return 'bg-indigo-950 text-indigo-300 border-indigo-700/60';
      case 'Unverified copy':
      case 'Partial screenshot':
        return 'bg-rose-950 text-rose-300 border-rose-700/60';
      case 'Secondary source':
        return 'bg-slate-800 text-slate-400 border-slate-700';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto pb-8">
      {/* Forensic Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 text-xs text-slate-300 flex items-start gap-3 shadow">
        <Shield className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-100">
            DISCIPLINARY EVIDENTIARY INDEXING RULE:
          </span>{' '}
          Never automatically upgrade a user assertion to a verified fact. Never treat an advocacy
          statement inside a pleading as independent proof merely because it appears in a court file.
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1C2541]/70 p-3 rounded-lg border border-slate-800">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search index by title, exhibit ID, or significance..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Categories (10 Types)</option>
            <option value="Official record">Official record</option>
            <option value="Primary evidence">Primary evidence</option>
            <option value="Advocacy document">Advocacy document</option>
            <option value="Party assertion">Party assertion</option>
            <option value="Partial screenshot">Partial screenshot</option>
            <option value="Duplicate">Duplicate</option>
            <option value="Excerpt">Excerpt</option>
            <option value="Unverified copy">Unverified copy</option>
          </select>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Showing {filteredItems.length} indexed entries
        </div>
      </div>

      {/* Index Table */}
      <div className="bg-[#0B132B] border border-slate-800 rounded-lg overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Exhibit</th>
                <th className="py-2.5 px-3">Page / Range</th>
                <th className="py-2.5 px-3">Document Title</th>
                <th className="py-2.5 px-3">Category Classification</th>
                <th className="py-2.5 px-3">Readability</th>
                <th className="py-2.5 px-3">Evidentiary Significance</th>
                <th className="py-2.5 px-3">Related Assertion / Event</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 font-sans">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-teal-400 whitespace-nowrap">
                    {item.exhibit_id}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-300 whitespace-nowrap">
                    p. {item.page_range || item.page_number}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-100 max-w-xs truncate">
                    {item.document_title}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getCategoryBadge(
                        item.document_category
                      )}`}
                    >
                      {item.document_category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-[11px]">
                    <div className="flex items-center gap-1.5">
                      {item.is_readable ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Readable
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Illegible
                        </span>
                      )}
                      {item.ocr_required && (
                        <span className="text-[10px] bg-slate-800 text-amber-300 px-1 rounded font-mono">
                          OCR Req.
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 max-w-sm">
                    <p className="line-clamp-2 leading-relaxed">{item.evidentiary_significance}</p>
                    {item.related_authority && (
                      <div className="text-[10px] font-mono text-teal-400 mt-0.5">
                        Auth: {item.related_authority}
                      </div>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px] max-w-xs">
                    {item.related_assertion && (
                      <div className="truncate text-amber-300/80">
                        Assert: {item.related_assertion}
                      </div>
                    )}
                    {item.related_event && (
                      <div className="text-slate-400 font-mono text-[10px]">
                        Event: {item.related_event}
                      </div>
                    )}
                    {item.related_contradiction && (
                      <div className="text-rose-400 font-mono text-[10px]">
                        Conflict: {item.related_contradiction}
                      </div>
                    )}
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
