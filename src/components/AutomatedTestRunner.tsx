import React, { useState } from 'react';
import { TEST_SUITE, TestCaseScenario } from '../data/testScenarios';
import {
  TestTube2,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  ShieldAlert,
  ChevronDown,
  ChevronRight,
  Terminal
} from 'lucide-react';

export const AutomatedTestRunner: React.FC = () => {
  const [testResults, setTestResults] = useState<
    Record<string, { passed: boolean; finding: string; logs: string[] }>
  >({});
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [expandedTest, setExpandedTest] = useState<string | null>(null);

  const handleRunSingleTest = (test: TestCaseScenario) => {
    const outcome = test.executeTest();
    setTestResults(prev => ({
      ...prev,
      [test.id]: {
        passed: outcome.passed,
        finding: outcome.actualFinding,
        logs: outcome.assertionLog
      }
    }));
  };

  const handleRunAllTests = () => {
    setIsRunningAll(true);
    const newResults: Record<string, { passed: boolean; finding: string; logs: string[] }> = {};

    TEST_SUITE.forEach(test => {
      const outcome = test.executeTest();
      newResults[test.id] = {
        passed: outcome.passed,
        finding: outcome.actualFinding,
        logs: outcome.assertionLog
      };
    });

    setTimeout(() => {
      setTestResults(newResults);
      setIsRunningAll(false);
    }, 400);
  };

  const handleResetTests = () => {
    setTestResults({});
    setExpandedTest(null);
  };

  const passedCount = Object.values(testResults).filter(r => r.passed).length;
  const totalRun = Object.keys(testResults).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      {/* Test Banner */}
      <div className="bg-indigo-950/40 border border-indigo-700/60 rounded-lg p-3 text-xs text-indigo-200 flex items-start gap-3 shadow">
        <TestTube2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-indigo-300">
            MANDATORY ACCEPTANCE TEST HARNESS (8 AUTOMATED SCENARIOS):
          </span>{' '}
          Validates that the system never fabricates a route upon user command, correctly blocks the
          11 prohibited reasoning jumps, enforces date separation, halts bounded research loops upon
          saturation, and logs formal corrections.
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1C2541]/80 p-4 rounded-lg border border-slate-700">
        <div>
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <span>Regression & Forensic Acceptance Test Suite</span>
            {totalRun > 0 && (
              <span
                className={`text-xs font-mono px-2 py-0.5 rounded border ${
                  passedCount === TEST_SUITE.length
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    : 'bg-rose-950 text-rose-300 border-rose-700'
                }`}
              >
                {passedCount} / {TEST_SUITE.length} PASSED
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Executes the 8 mandatory test conditions specified in the Case Architect architecture.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {totalRun > 0 && (
            <button
              onClick={handleResetTests}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          )}

          <button
            onClick={handleRunAllTests}
            disabled={isRunningAll}
            className="bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 shadow transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunningAll ? 'Executing Suite...' : 'Run All 8 Tests'}</span>
          </button>
        </div>
      </div>

      {/* Test List */}
      <div className="space-y-3">
        {TEST_SUITE.map(test => {
          const res = testResults[test.id];
          const isExpanded = expandedTest === test.id;

          return (
            <div
              key={test.id}
              className={`border rounded-lg transition-all shadow-sm ${
                res
                  ? res.passed
                    ? 'bg-[#0B132B] border-emerald-800/60'
                    : 'bg-[#0B132B] border-rose-800/60'
                  : 'bg-[#0B132B] border-slate-800 hover:border-slate-750'
              }`}
            >
              <div className="p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex-1 min-w-[280px]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-indigo-400">
                      {test.id}
                    </span>
                    <h3 className="text-xs font-bold text-slate-100">{test.name}</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{test.description}</p>
                </div>

                <div className="flex items-center gap-3">
                  {res ? (
                    <span
                      className={`text-xs font-mono px-2.5 py-1 rounded border font-bold flex items-center gap-1.5 ${
                        res.passed
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                          : 'bg-rose-950 text-rose-300 border-rose-600'
                      }`}
                    >
                      {res.passed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      )}
                      <span>{res.passed ? 'PASSED' : 'FAILED'}</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRunSingleTest(test)}
                      className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-mono"
                    >
                      Execute
                    </button>
                  )}

                  <button
                    onClick={() => setExpandedTest(isExpanded ? null : test.id)}
                    className="text-slate-400 hover:text-slate-200 p-1"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Test Details & Logs */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-850 bg-slate-950/70 text-xs space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-slate-900/90 p-2.5 rounded border border-slate-800">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">
                        Input Conditions:
                      </span>
                      <p className="text-slate-300 font-mono text-[11px]">
                        {test.inputConditions.fact_description}
                      </p>
                    </div>

                    <div className="bg-slate-900/90 p-2.5 rounded border border-slate-800">
                      <span className="text-[10px] font-mono uppercase text-teal-400 block mb-0.5">
                        Expected Result:
                      </span>
                      <p className="text-teal-200 font-mono text-[11px] font-semibold">
                        "{test.expectedResult.verdict}"
                      </p>
                    </div>
                  </div>

                  {res && (
                    <div className="bg-slate-900/90 p-3 rounded border border-slate-800 space-y-2">
                      <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
                        <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Assertion Verification Trace:</span>
                      </div>
                      <div className="space-y-1 font-mono text-[11px] text-slate-300 bg-black/50 p-2.5 rounded border border-slate-850">
                        {res.logs.map((log, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span
                              className={
                                log.includes('pass: false')
                                  ? 'text-rose-400 font-bold'
                                  : 'text-emerald-400'
                              }
                            >
                              {log.includes('pass: false') ? '✗' : '✓'}
                            </span>
                            <span>{log}</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-[11px] text-slate-300 pt-1">
                        <strong>Verified Finding:</strong> {res.finding}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
