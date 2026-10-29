import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import KnowledgeBase from './components/KnowledgeBase';
import SubmissionUpload from './components/SubmissionUpload';
import AnalysisView from './components/AnalysisView';
import ReviseModal from './components/ReviseModal';
import ReviewWorkflow from './components/ReviewWorkflow';
import LockedAuditView from './components/LockedAuditView';
import InsightsDashboard from './components/InsightsDashboard';
import ContrastChecker from './components/ContrastChecker';

import { 
  fetchSubmissions, 
  fetchSubmission, 
  resetKBToSeeds,
  deleteSubmission
} from './api';

import { 
  FileText, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Trash2, 
  ChevronRight,
  GitCompare,
  Eye,
  BookOpen,
  BarChart3,
  Layers
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('workspace'); // 'workspace' | 'kb' | 'insights' | 'accessibility'
  const [workspaceSubTab, setWorkspaceSubTab] = useState('findings'); // 'findings' | 'review' | 'audit' | 'new_submission'
  const [currentRole, setCurrentRole] = useState('creator'); // 'creator' | 'reviewer' | 'manager'
  
  const [submissions, setSubmissions] = useState([]);
  const [activeSubmissionId, setActiveSubmissionId] = useState(null);
  const [activeSubmission, setActiveSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  // Revise Modal state
  const [reviseModalOpen, setReviseModalOpen] = useState(false);
  const [reviseModalMode, setReviseModalMode] = useState('dismiss'); // 'dismiss' | 'edit'
  const [targetFinding, setTargetFinding] = useState(null);

  const loadSubmissions = async (selectId = null) => {
    try {
      setLoading(true);
      const subs = await fetchSubmissions();
      setSubmissions(subs);
      
      const toSelect = selectId || activeSubmissionId || (subs.length > 0 ? subs[0].id : null);
      if (toSelect) {
        setActiveSubmissionId(toSelect);
        const subData = await fetchSubmission(toSelect);
        setActiveSubmission(subData);
      } else {
        setActiveSubmission(null);
      }
    } catch (err) {
      console.error("Failed to load submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleSelectSubmission = async (id) => {
    try {
      setActiveSubmissionId(id);
      setWorkspaceSubTab('findings');
      const subData = await fetchSubmission(id);
      setActiveSubmission(subData);
    } catch (err) {
      console.error("Failed to switch submission:", err);
    }
  };

  const handleRefreshActiveSubmission = async () => {
    if (!activeSubmissionId) return;
    try {
      const updated = await fetchSubmission(activeSubmissionId);
      setActiveSubmission(updated);
      // Also update in list
      setSubmissions(prev => prev.map(s => s.id === updated.id ? updated : s));
    } catch (err) {
      console.error("Failed to refresh submission:", err);
    }
  };

  const handleSubmissionCreated = (newSub) => {
    setSubmissions(prev => [newSub, ...prev]);
    setActiveSubmissionId(newSub.id);
    setActiveSubmission(newSub);
    setWorkspaceSubTab('findings');
  };

  const handleDeleteSubmission = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this submission?")) return;
    try {
      await deleteSubmission(id);
      loadSubmissions();
    } catch (err) {
      alert(`Error deleting submission: ${err.message}`);
    }
  };

  const handleResetData = async () => {
    if (!window.confirm("Reset all Knowledge Base rules and submissions back to default FreshNest seed data?")) return;
    try {
      setIsResetting(true);
      await resetKBToSeeds();
      await loadSubmissions();
      alert("Successfully reset Knowledge Base and demo submissions!");
    } catch (err) {
      alert(`Error resetting: ${err.message}`);
    } finally {
      setIsResetting(false);
    }
  };

  // Open dismiss modal
  const handleOpenDismissModal = (finding) => {
    setTargetFinding(finding);
    setReviseModalMode('dismiss');
    setReviseModalOpen(true);
  };

  // Open custom edit modal
  const handleOpenEditModal = (finding) => {
    setTargetFinding(finding);
    setReviseModalMode('edit');
    setReviseModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      
      {/* Top Main Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        onResetData={handleResetData}
        isResetting={isResetting}
      />

      {/* 8-Step Complete Workflow Interactive Header */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] shrink-0">
              8-Step Flow:
            </span>

            {/* Step 1 */}
            <button
              onClick={() => setCurrentTab('kb')}
              className={`px-2.5 py-1 rounded-md shrink-0 flex items-center space-x-1 cursor-pointer transition-colors ${
                currentTab === 'kb' ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span className="opacity-70 font-mono">1.</span>
              <span>Set up (KB)</span>
            </button>

            <span className="text-slate-300">→</span>

            {/* Step 2 */}
            <button
              onClick={() => { setCurrentTab('workspace'); setWorkspaceSubTab('new_submission'); }}
              className={`px-2.5 py-1 rounded-md shrink-0 flex items-center space-x-1 cursor-pointer transition-colors ${
                currentTab === 'workspace' && workspaceSubTab === 'new_submission'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span className="opacity-70 font-mono">2.</span>
              <span>Submit</span>
            </button>

            <span className="text-slate-300">→</span>

            {/* Step 3 & 4 */}
            <button
              onClick={() => { setCurrentTab('workspace'); setWorkspaceSubTab('findings'); }}
              className={`px-2.5 py-1 rounded-md shrink-0 flex items-center space-x-1 cursor-pointer transition-colors ${
                currentTab === 'workspace' && workspaceSubTab === 'findings'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span className="opacity-70 font-mono">3-4.</span>
              <span>Analyse & Explain</span>
            </button>

            <span className="text-slate-300">→</span>

            {/* Step 5 */}
            <button
              onClick={() => { setCurrentTab('workspace'); setWorkspaceSubTab('findings'); }}
              className={`px-2.5 py-1 rounded-md shrink-0 flex items-center space-x-1 cursor-pointer transition-colors ${
                currentTab === 'workspace' && workspaceSubTab === 'findings'
                  ? 'hover:bg-slate-100 text-slate-700'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span className="opacity-70 font-mono">5.</span>
              <span>Revise Loop</span>
            </button>

            <span className="text-slate-300">→</span>

            {/* Step 6 */}
            <button
              onClick={() => { setCurrentTab('workspace'); setWorkspaceSubTab('review'); }}
              className={`px-2.5 py-1 rounded-md shrink-0 flex items-center space-x-1 cursor-pointer transition-colors ${
                currentTab === 'workspace' && workspaceSubTab === 'review'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span className="opacity-70 font-mono">6.</span>
              <span>Review Diff</span>
            </button>

            <span className="text-slate-300">→</span>

            {/* Step 7 */}
            <button
              onClick={() => { setCurrentTab('workspace'); setWorkspaceSubTab('audit'); }}
              className={`px-2.5 py-1 rounded-md shrink-0 flex items-center space-x-1 cursor-pointer transition-colors ${
                currentTab === 'workspace' && workspaceSubTab === 'audit'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span className="opacity-70 font-mono">7.</span>
              <span>Approve & Lock</span>
            </button>

            <span className="text-slate-300">→</span>

            {/* Step 8 */}
            <button
              onClick={() => setCurrentTab('insights')}
              className={`px-2.5 py-1 rounded-md shrink-0 flex items-center space-x-1 cursor-pointer transition-colors ${
                currentTab === 'insights' ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span className="opacity-70 font-mono">8.</span>
              <span>Learn (Gaps)</span>
            </button>

          </div>
        </div>
      </section>

      {/* Main Workspace Body */}
      <main className="flex-1">
        {currentTab === 'kb' && <KnowledgeBase />}

        {currentTab === 'insights' && <InsightsDashboard />}

        {currentTab === 'accessibility' && <ContrastChecker />}

        {currentTab === 'workspace' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            
            {/* Top Workspace Bar: Active Submissions Switcher + Action Tabs */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
              
              {/* Submission Selector Tabs */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                  Active Drafts:
                </span>
                {submissions.map((sub) => {
                  const isSelected = sub.id === activeSubmissionId;
                  const openCount = sub.findings?.filter(f => f.status === 'open').length || 0;

                  return (
                    <div
                      key={sub.id}
                      onClick={() => handleSelectSubmission(sub.id)}
                      className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs cursor-pointer transition-all whitespace-nowrap shrink-0 ${
                        isSelected 
                          ? 'bg-white border-blue-500 shadow-xs ring-1 ring-blue-500 font-bold text-slate-900'
                          : 'bg-slate-100/70 border-slate-200 text-slate-600 hover:bg-white'
                      }`}
                    >
                      {sub.is_locked ? (
                        <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
                      ) : openCount > 0 ? (
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                      )}
                      
                      <span className="truncate max-w-[150px] sm:max-w-[200px]">
                        {sub.title}
                      </span>
                      
                      <span className="text-[10px] text-slate-400 font-mono">v{sub.version}</span>

                      {/* Delete button on hover */}
                      <button
                        onClick={(e) => handleDeleteSubmission(sub.id, e)}
                        title="Delete submission"
                        className="text-slate-400 hover:text-rose-600 ml-1 p-0.5 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}

                <button
                  onClick={() => setWorkspaceSubTab('new_submission')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer transition-colors ${
                    workspaceSubTab === 'new_submission'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ New Submission</span>
                </button>
              </div>

              {/* Sub-view switcher for selected submission */}
              {activeSubmission && workspaceSubTab !== 'new_submission' && (
                <div className="flex items-center space-x-1 bg-slate-200/70 p-1 rounded-xl self-start lg:self-auto">
                  <button
                    onClick={() => setWorkspaceSubTab('findings')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                      workspaceSubTab === 'findings'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span>Findings ({activeSubmission.findings?.length || 0})</span>
                  </button>

                  <button
                    onClick={() => setWorkspaceSubTab('review')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                      workspaceSubTab === 'review'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <GitCompare className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Diff & Review</span>
                  </button>

                  <button
                    onClick={() => setWorkspaceSubTab('audit')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                      workspaceSubTab === 'audit'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Audit Record</span>
                  </button>
                </div>
              )}

            </div>

            {/* Workspace Content Router */}
            {workspaceSubTab === 'new_submission' ? (
              <SubmissionUpload 
                onSubmissionCreated={handleSubmissionCreated} 
                currentRole={currentRole} 
              />
            ) : !activeSubmission ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-xs">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No Submission Selected</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Choose a demo submission from above or click "+ New Submission" to scan content.
                </p>
              </div>
            ) : (
              <div>
                {workspaceSubTab === 'findings' && (
                  <AnalysisView
                    submission={activeSubmission}
                    onRefreshSubmission={handleRefreshActiveSubmission}
                    onOpenEditModal={handleOpenEditModal}
                    onOpenDismissModal={handleOpenDismissModal}
                    currentRole={currentRole}
                  />
                )}

                {workspaceSubTab === 'review' && (
                  <ReviewWorkflow
                    submission={activeSubmission}
                    onRefreshSubmission={handleRefreshActiveSubmission}
                    currentRole={currentRole}
                  />
                )}

                {workspaceSubTab === 'audit' && (
                  <LockedAuditView
                    submission={activeSubmission}
                    onRefreshSubmission={handleRefreshActiveSubmission}
                    currentRole={currentRole}
                  />
                )}
              </div>
            )}

          </div>
        )}
      </main>

      {/* Revise Modal (Accept / Edit / Dismiss with Mandatory Reason) */}
      <ReviseModal
        isOpen={reviseModalOpen}
        onClose={() => setReviseModalOpen(false)}
        mode={reviseModalMode}
        finding={targetFinding}
        submissionId={activeSubmission?.id}
        onSuccess={handleRefreshActiveSubmission}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-400">
        BrandLens Pre-Publication Review Platform &copy; 2026 Achivers (Inkloom AI) &bull; Problem Statement by Inkloom AI &bull; Solo entry by R S Ajaay
      </footer>

    </div>
  );
}
