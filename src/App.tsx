/**
 * CASE ARCHITECT
 * Exhaustive Route Validator & Forensic Case Analysis Workspace
 */

import React from 'react';
import { MatterProvider, useMatter } from './context/MatterContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MatterOverview } from './components/MatterOverview';
import { EvidenceVault } from './components/EvidenceVault';
import { DocumentIndex } from './components/DocumentIndex';
import { ChronologyView } from './components/ChronologyView';
import { FinancialLedgerView } from './components/FinancialLedgerView';
import { ContradictionsView } from './components/ContradictionsView';
import { AuthoritiesWorkspace } from './components/AuthoritiesWorkspace';
import { RouteLabView } from './components/RouteLabView';
import { AdversarialReviewView } from './components/AdversarialReviewView';
import { ElectronicAppealForensics } from './components/ElectronicAppealForensics';
import { ConclusionLedgerView } from './components/ConclusionLedgerView';
import { RoadmapView } from './components/RoadmapView';
import { AuditLogView } from './components/AuditLogView';
import { AutomatedTestRunner } from './components/AutomatedTestRunner';
import { SettingsView } from './components/SettingsView';
import { HumanApprovalModal } from './components/HumanApprovalModal';
import { ExportReportModal } from './components/ExportReportModal';
import { MatterIntakeWizard } from './components/MatterIntakeWizard';

const MainWorkspace: React.FC = () => {
  const { activeView } = useMatter();

  const renderActiveView = () => {
    switch (activeView) {
      case 'overview':
        return <MatterOverview />;
      case 'evidence':
        return <EvidenceVault />;
      case 'docindex':
        return <DocumentIndex />;
      case 'chronology':
        return <ChronologyView />;
      case 'financial':
        return <FinancialLedgerView />;
      case 'contradictions':
        return <ContradictionsView />;
      case 'authorities':
        return <AuthoritiesWorkspace />;
      case 'routes':
        return <RouteLabView />;
      case 'adversarial':
        return <AdversarialReviewView />;
      case 'electronic':
        return <ElectronicAppealForensics />;
      case 'conclusion':
        return <ConclusionLedgerView />;
      case 'roadmap':
        return <RoadmapView />;
      case 'audit':
        return <AuditLogView />;
      case 'tests':
        return <AutomatedTestRunner />;
      case 'settings':
        return <SettingsView />;
      default:
        return <MatterOverview />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#070D1E] text-slate-100 font-sans antialiased">
      {/* Navigation Rail */}
      <Sidebar />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-radial-[at_top_right] from-[#0B132B] via-[#070D1E] to-[#040814]">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Forensic Modals */}
      <HumanApprovalModal />
      <ExportReportModal />
      <MatterIntakeWizard />
    </div>
  );
};

export default function App() {
  return (
    <MatterProvider>
      <MainWorkspace />
    </MatterProvider>
  );
}
