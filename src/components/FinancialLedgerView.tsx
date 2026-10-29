import React, { useState } from 'react';
import { useMatter } from '../context/MatterContext';
import { FinancialEntry } from '../types';
import { reconcileFinancialEntries } from '../utils/financialReconciliation';
import {
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Plus,
  Scale,
  Receipt,
  Building,
  CreditCard,
  HelpCircle
} from 'lucide-react';

export const FinancialLedgerView: React.FC = () => {
  const { financialEntries, addFinancialEntry, isRedactedView } = useMatter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newEntry, setNewEntry] = useState<Partial<FinancialEntry>>({
    category: 'amount_paid_directly',
    amount: 0,
    currency: 'BHD',
    date: new Date().toISOString().split('T')[0],
    payment_reference: '',
    recipient_account_evidence: '',
    notes: '',
    is_allocation_disputed: false,
    status: 'VERIFIED'
  });

  const reconciliation = reconcileFinancialEntries(financialEntries);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.amount || Number(newEntry.amount) <= 0) return;

    addFinancialEntry({
      category: newEntry.category || 'amount_paid_directly',
      amount: Number(newEntry.amount),
      currency: newEntry.currency || 'BHD',
      date: newEntry.date || new Date().toISOString().split('T')[0],
      payment_reference: newEntry.payment_reference || '',
      recipient_account_evidence: newEntry.recipient_account_evidence || 'Bank statement',
      notes: newEntry.notes || '',
      is_allocation_disputed: Boolean(newEntry.is_allocation_disputed),
      status: newEntry.status || 'VERIFIED'
    });

    setIsAddModalOpen(false);
  };

  const redactValue = (val: string) => {
    if (!isRedactedView) return val;
    return val.replace(/\b\d{4,}\b/g, '••••••').replace(/BH\d{2}[A-Z0-9]+/g, 'BH••[REDACTED]');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      {/* Directive Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 flex items-start gap-3 shadow">
        <DollarSign className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-100">
            FINANCIAL RECONCILIATION DIRECTIVE:
          </span>{' '}
          Tracks claimed vs awarded vs verified payments. The system automatically audits for
          duplicate payment references, arithmetic shortfalls, conflicting totals, and failed card
          transactions erroneously recorded as successful debt satisfaction.
        </div>
      </div>

      {/* Reconciliation Summary Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Awarded / Claimed */}
        <div className="bg-[#1C2541]/70 border border-slate-700 p-3.5 rounded-lg shadow">
          <div className="text-[11px] font-mono uppercase text-slate-400">Awarded Principal</div>
          <div className="text-xl font-bold font-mono text-purple-300 mt-1">
            {reconciliation.amount_awarded.toFixed(2)} BHD
          </div>
          <div className="text-[10px] text-slate-400 mt-1">First-instance order</div>
        </div>

        {/* Verified Paid */}
        <div className="bg-[#1C2541]/70 border border-emerald-900/60 p-3.5 rounded-lg shadow">
          <div className="text-[11px] font-mono uppercase text-emerald-400">Verified Paid</div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            {reconciliation.total_paid_verified.toFixed(2)} BHD
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Proved bank debits</div>
        </div>

        {/* Amount Outstanding */}
        <div className="bg-[#1C2541]/70 border border-amber-900/60 p-3.5 rounded-lg shadow">
          <div className="text-[11px] font-mono uppercase text-amber-400">Net Outstanding</div>
          <div className="text-xl font-bold font-mono text-amber-400 mt-1">
            {reconciliation.amount_outstanding.toFixed(2)} BHD
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Remaining deficit</div>
        </div>

        {/* Failed Payments */}
        <div className="bg-[#1C2541]/70 border border-rose-900/60 p-3.5 rounded-lg shadow">
          <div className="text-[11px] font-mono uppercase text-rose-400">Failed Transactions</div>
          <div className="text-xl font-bold font-mono text-rose-400 mt-1">
            {reconciliation.total_failed_payments.toFixed(2)} BHD
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Declined fee attempts</div>
        </div>
      </div>

      {/* Automated Flags Register */}
      {reconciliation.flags.length > 0 && (
        <div className="bg-amber-950/30 border border-amber-600/70 rounded-lg p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 font-mono uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            AUTOMATIC FINANCIAL DISCREPANCY FLAGS ({reconciliation.flags.length})
          </div>
          <div className="space-y-2">
            {reconciliation.flags.map(flag => (
              <div
                key={flag.id}
                className="bg-slate-900/90 border border-amber-800/50 p-3 rounded text-xs flex items-start gap-3"
              >
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <div className="font-semibold text-amber-300 font-mono text-[11px] mb-0.5">
                    [{flag.type}] — Severity: {flag.severity}
                  </div>
                  <p className="text-slate-300">{flag.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Control Bar */}
      <div className="flex items-center justify-between bg-[#1C2541]/70 p-3 rounded-lg border border-slate-800">
        <div className="text-xs text-slate-300 font-medium">
          Detailed Financial Ledgers & Transaction Tracing
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-teal-700 hover:bg-teal-600 text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 shadow transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Transaction Entry</span>
        </button>
      </div>

      {/* Financial Table */}
      <div className="bg-[#0B132B] border border-slate-800 rounded-lg overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Reference</th>
                <th className="py-2.5 px-3">Recipient Evidence</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Audit Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 font-sans">
              {financialEntries.map(entry => (
                <tr key={entry.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-300 whitespace-nowrap">
                    {entry.date}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="font-mono text-[11px] text-slate-200">
                      {entry.category.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-100 whitespace-nowrap">
                    {entry.amount.toFixed(2)} {entry.currency}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-teal-400 whitespace-nowrap">
                    {redactValue(entry.payment_reference)}
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 max-w-xs truncate text-[11px]">
                    {redactValue(entry.recipient_account_evidence)}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        entry.status === 'VERIFIED'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-700/60'
                          : entry.status === 'FAILED'
                          ? 'bg-rose-950 text-rose-300 border-rose-700/60'
                          : 'bg-amber-950 text-amber-300 border-amber-700/60'
                      }`}
                    >
                      {entry.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 text-xs max-w-sm">
                    {redactValue(entry.notes)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-[#1C2541] border border-slate-700 rounded-lg max-w-md w-full p-5 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-teal-400" /> Ingest Financial Transaction
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEntry} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={newEntry.category}
                    onChange={e =>
                      setNewEntry({
                        ...newEntry,
                        category: e.target.value as FinancialEntry['category']
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                  >
                    <option value="amount_paid_directly">amount paid directly</option>
                    <option value="amount_paid_into_court">amount paid into court</option>
                    <option value="amount_awarded">amount awarded</option>
                    <option value="amount_claimed">amount claimed</option>
                    <option value="fees">statutory fees</option>
                    <option value="failed_payments">failed payments</option>
                    <option value="reversed_payments">reversed payments</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newEntry.amount}
                    onChange={e => setNewEntry({ ...newEntry, amount: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newEntry.date}
                    onChange={e => setNewEntry({ ...newEntry, date: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Payment Reference</label>
                  <input
                    type="text"
                    placeholder="e.g. FT2601599182"
                    value={newEntry.payment_reference}
                    onChange={e => setNewEntry({ ...newEntry, payment_reference: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Recipient Account Evidence</label>
                <input
                  type="text"
                  placeholder="e.g. Commercial Bank of Bahrain Statement IBAN BH88...901"
                  value={newEntry.recipient_account_evidence}
                  onChange={e =>
                    setNewEntry({ ...newEntry, recipient_account_evidence: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Audit Notes</label>
                <textarea
                  rows={2}
                  placeholder="Record reconciliation details, bank debit notes, or gateway codes..."
                  value={newEntry.notes}
                  onChange={e => setNewEntry({ ...newEntry, notes: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100"
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
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
