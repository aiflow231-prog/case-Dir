import React from 'react';
import { useMatter } from '../context/MatterContext';
import {
  LayoutDashboard,
  Archive,
  FileSpreadsheet,
  Clock,
  DollarSign,
  AlertTriangle,
  BookOpen,
  GitBranch,
  ShieldAlert,
  Server,
  FileCheck2,
  Navigation,
  History,
  TestTube2,
  Settings,
  Scale,
  Flame
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    evidenceList,
    documentIndex,
    financialEntries,
    contradictions,
    propositions,
    routes,
    chronology,
    conclusionLedger
  } = useMatter();

  const unprovedDates = chronology.filter(c => !c.is_date_proved).length;
  const openContradictions = contradictions.filter(c => c.current_status === 'OPEN').length;
  const activeRoutes = routes.filter(r => r.status === 'ACTIVE').length;
  const correctionsCount = conclusionLedger.corrections.length;

  const navItems = [
    {
      id: 'overview',
      label: 'Matter Overview',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'evidence',
      label: 'Evidence Vault',
      icon: Archive,
      badge: evidenceList.length
    },
    {
      id: 'docindex',
      label: 'Document Index',
      icon: FileSpreadsheet,
      badge: documentIndex.length
    },
    {
      id: 'chronology',
      label: 'Chronology',
      icon: Clock,
      badge: unprovedDates > 0 ? `${unprovedDates} unproved` : null,
      badgeColor: 'bg-amber-900/60 text-amber-300 border-amber-600/50'
    },
    {
      id: 'financial',
      label: 'Financial Ledger',
      icon: DollarSign,
      badge: financialEntries.length
    },
    {
      id: 'contradictions',
      label: 'Contradictions',
      icon: AlertTriangle,
      badge: openContradictions > 0 ? `${openContradictions} open` : null,
      badgeColor: 'bg-rose-900/60 text-rose-300 border-rose-600/50'
    },
    {
      id: 'authorities',
      label: 'Authorities',
      icon: BookOpen,
      badge: propositions.length
    },
    {
      id: 'routes',
      label: 'Route Lab',
      icon: GitBranch,
      badge: routes.length
    },
    {
      id: 'adversarial',
      label: 'Adversarial Review',
      icon: ShieldAlert,
      badge: 'Hostile'
    },
    {
      id: 'electronic',
      label: 'Electronic Forensics',
      icon: Server,
      badge: 'R88736',
      badgeColor: 'bg-teal-900/60 text-teal-300 border-teal-600/50'
    },
    {
      id: 'conclusion',
      label: 'Conclusion Ledger',
      icon: FileCheck2,
      badge: correctionsCount > 0 ? `${correctionsCount} corr.` : null
    },
    {
      id: 'roadmap',
      label: 'Roadmap',
      icon: Navigation,
      badge: activeRoutes > 0 ? '1 Active' : '0 Active',
      badgeColor: activeRoutes > 0 ? 'bg-teal-900/60 text-teal-300' : 'bg-slate-800 text-slate-400'
    },
    {
      id: 'audit',
      label: 'Audit Log',
      icon: History,
      badge: null
    },
    {
      id: 'tests',
      label: 'Automated Tests',
      icon: TestTube2,
      badge: '8 Scenarios',
      badgeColor: 'bg-indigo-950/80 text-indigo-300 border-indigo-700/50'
    },
    {
      id: 'settings',
      label: 'Settings & Privacy',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside className="w-64 bg-[#0B132B] border-r border-slate-800 flex flex-col justify-between shrink-0 select-none">
      <div className="py-3">
        <div className="px-4 pb-2 mb-2 border-b border-slate-800/80">
          <div className="text-[11px] font-mono tracking-wider uppercase text-slate-400 font-semibold flex items-center justify-between">
            <span>WORKSPACE NAVIGATION</span>
            <span className="text-[10px] text-teal-400 font-mono">FORENSIC</span>
          </div>
        </div>

        <nav className="space-y-0.5 px-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-colors text-left group ${
                  isActive
                    ? 'bg-slate-800/90 text-teal-300 border-l-2 border-teal-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/60'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-teal-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== null && item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${
                      item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Disciplinary Credo Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-[10px] text-slate-400 space-y-1">
        <div className="flex items-center gap-1.5 text-slate-300 font-medium">
          <Scale className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>FORENSIC PROTOCOL</span>
        </div>
        <p className="leading-tight text-slate-400">
          Verification outranks plausibility. Correction outranks consistency.
        </p>
      </div>
    </aside>
  );
};
