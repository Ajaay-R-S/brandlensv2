import React, { useState } from 'react';
import { 
  GitCompare, 
  MessageSquare, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Send, 
  ShieldCheck, 
  User, 
  History,
  Lock,
  CornerDownRight
} from 'lucide-react';
import { addComment, recordDecision, saveRevision } from '../api';

// Compute simple word-level diff between original and revised text
function computeWordDiff(origText, revText) {
  const origWords = origText.split(/\s+/);
  const revWords = revText.split(/\s+/);

  // If identical
  if (origText.trim() === revText.trim()) {
    return [{ type: 'unchanged', text: origText }];
  }

  // Simple clean LCS-based diff for words
  const m = origWords.length;
  const n = revWords.length;
  const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (origWords[i - 1] === revWords[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  function max(a, b) {
    return a > b ? a : b;
  }

  let i = m;
  let j = n;
  const result = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && origWords[i - 1] === revWords[j - 1]) {
      result.unshift({ type: 'unchanged', text: origWords[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'addition', text: revWords[j - 1] });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      result.unshift({ type: 'deletion', text: origWords[i - 1] });
      i--;
    }
  }

  return result;
}

export default function ReviewWorkflow({
  submission,
  onRefreshSubmission,
  currentRole
}) {
  const [commentText, setCommentText] = useState('');
  const [decisionFeedback, setDecisionFeedback] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isSubmittingDecision, setIsSubmittingDecision] = useState(false);
  const [diffViewMode, setDiffViewMode] = useState('side_by_side'); // 'side_by_side' | 'inline'
  
  // Custom manual editor state
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [manualEditText, setManualEditText] = useState(submission.current_text);
  const [revisionSummary, setRevisionSummary] = useState('');

  if (!submission) return null;

  const diffTokens = computeWordDiff(submission.original_text, submission.current_text);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setIsSubmittingComment(true);
      const authorName = currentRole === 'creator' ? 'Jane Doe' : 
                         currentRole === 'reviewer' ? 'Rahul Sharma' : 'Priya Patel';
      const authorRole = currentRole;

      await addComment(submission.id, {
        author_name: authorName,
        author_role: authorRole,
        message: commentText.trim()
      });
      setCommentText('');
      onRefreshSubmission();
    } catch (err) {
      alert(`Error posting comment: ${err.message}`);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDecision = async (decision) => {
    const reviewerName = currentRole === 'reviewer' ? 'Rahul Sharma' : 
                         currentRole === 'manager' ? 'Priya Patel' : 'Jane Doe';
    const reviewerRole = currentRole === 'reviewer' ? 'Legal & Brand Reviewer' : 
                         currentRole === 'manager' ? 'Brand Manager' : 'Content Creator';

    const confirmMsg = decision === 'approve' 
      ? `Are you sure you want to APPROVE and LOCK Version ${submission.version}? This generates an audit log and locks further edits.`
      : `Record decision: ${decision.toUpperCase()}?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      setIsSubmittingDecision(true);
      await recordDecision(submission.id, {
        decision,
        reviewer_name: reviewerName,
        reviewer_role: reviewerRole,
        feedback: decisionFeedback.trim()
      });
      setDecisionFeedback('');
      onRefreshSubmission();
    } catch (err) {
      alert(`Error recording decision: ${err.message}`);
    } finally {
      setIsSubmittingDecision(false);
    }
  };

  const handleSaveManualRevision = async (e) => {
    e.preventDefault();
    if (!manualEditText.trim()) return;

    try {
      const authorName = currentRole === 'creator' ? 'Jane Doe (Creator)' : 
                         currentRole === 'reviewer' ? 'Rahul Sharma (Reviewer)' : 'Priya Patel (Brand Manager)';
      await saveRevision(submission.id, {
        text: manualEditText.trim(),
        changed_by: authorName,
        change_summary: revisionSummary.trim() || `Manual revision update to version ${submission.version + 1}`
      });
      setIsEditingDraft(false);
      setRevisionSummary('');
      onRefreshSubmission();
    } catch (err) {
      alert(`Error saving revision: ${err.message}`);
    }
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'approved':
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-300">APPROVED & LOCKED</span>;
      case 'changes_requested':
        return <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-bold border border-amber-300">CHANGES REQUESTED</span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-lg text-xs font-bold border border-rose-300">REJECTED</span>;
      default:
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-bold border border-blue-300">UNDER REVIEW</span>;
    }
  };

  const openFindingsCount = submission.findings?.filter(f => f.status === 'open' || f.status === 'sent_to_reviewer').length || 0;

  return (
    <div className="space-y-6">
      
      {/* Header & Status Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-slate-900">Reviewer Diff & Decision Workflow</h3>
            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-mono font-medium">
              Step 6: Review & Decide
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Compare original submission vs revised copy. Review threaded feedback and sign off or request adjustments.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {getStatusBadge(submission.status)}
          <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 font-semibold">
            v{submission.version}
          </span>
        </div>
      </div>

      {/* Side-by-side Intent-Preserving Diff Viewer */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GitCompare className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-800">
              Intent-Preserving Diff: Original Draft (v1) vs Current Revised Text (v{submission.version})
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setDiffViewMode('side_by_side')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                diffViewMode === 'side_by_side' ? 'bg-white shadow-2xs text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setDiffViewMode('inline')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                diffViewMode === 'inline' ? 'bg-white shadow-2xs text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Inline Highlights
            </button>
          </div>
        </div>

        {/* Diff Content Box */}
        {diffViewMode === 'side_by_side' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            {/* Original Draft Pane */}
            <div className="p-5 bg-rose-50/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">
                  Original Submission (v1)
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Unrevised Draft</span>
              </div>
              <div className="text-xs leading-relaxed text-slate-800 p-4 bg-white rounded-xl border border-rose-100 min-h-[140px] whitespace-pre-wrap font-sans">
                {submission.original_text}
              </div>
            </div>

            {/* Current Revised Copy Pane */}
            <div className="p-5 bg-emerald-50/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                  Current Revised Copy (v{submission.version})
                </span>
                {!submission.is_locked && (
                  <button
                    onClick={() => {
                      setManualEditText(submission.current_text);
                      setIsEditingDraft(!isEditingDraft);
                    }}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    {isEditingDraft ? 'Cancel Manual Edit' : 'Edit Text Directly'}
                  </button>
                )}
              </div>

              {isEditingDraft ? (
                <form onSubmit={handleSaveManualRevision} className="space-y-3">
                  <textarea
                    rows={5}
                    value={manualEditText}
                    onChange={(e) => setManualEditText(e.target.value)}
                    className="w-full p-3 text-xs border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                  <input
                    type="text"
                    value={revisionSummary}
                    onChange={(e) => setRevisionSummary(e.target.value)}
                    placeholder="Summary of changes (e.g. Adjusted headline claim)"
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
                    >
                      Save Version {submission.version + 1}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-xs leading-relaxed text-slate-900 p-4 bg-white rounded-xl border border-emerald-100 min-h-[140px] whitespace-pre-wrap font-sans">
                  {submission.current_text}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Inline Diff Highlighting */
          <div className="p-5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Inline Word-Level Changes (<span className="text-rose-600">Red = Deleted</span>, <span className="text-emerald-600">Green = Added</span>)
            </span>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm leading-relaxed font-sans min-h-[120px]">
              {diffTokens.map((tok, idx) => {
                if (tok.type === 'deletion') {
                  return (
                    <span key={idx} className="bg-rose-100 text-rose-800 line-through px-1 py-0.5 rounded mr-1">
                      {tok.text}
                    </span>
                  );
                } else if (tok.type === 'addition') {
                  return (
                    <span key={idx} className="bg-emerald-100 text-emerald-800 font-semibold px-1 py-0.5 rounded mr-1">
                      {tok.text}
                    </span>
                  );
                } else {
                  return <span key={idx} className="text-slate-800 mr-1">{tok.text}</span>;
                }
              })}
            </div>
          </div>
        )}

      </div>

      {/* Reviewer Decision Controls & Audit Sign-Off Box */}
      {!submission.is_locked ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 mb-4">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <h4 className="text-sm font-bold text-slate-900">
              Reviewer Decision Controls
            </h4>
            <span className="text-xs text-slate-400">
              (Active Role: <strong className="text-slate-700 capitalize">{currentRole}</strong>)
            </span>
          </div>

          {openFindingsCount > 0 && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>
                <strong>{openFindingsCount} open or pending findings</strong> remain unaddressed in this draft.
                You may request changes, or approve if marketing exceptions/dismissals are accepted.
              </span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reviewer Feedback / Editorial Sign-off Note
              </label>
              <textarea
                rows={2}
                value={decisionFeedback}
                onChange={(e) => setDecisionFeedback(e.target.value)}
                placeholder="Enter feedback for the creator or sign-off audit justification..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="text-xs text-slate-500">
                Approving locks the version, writes an immutable audit record, and disables further edits.
              </span>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  disabled={isSubmittingDecision}
                  onClick={() => handleDecision('reject')}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  Reject Submission
                </button>

                <button
                  type="button"
                  disabled={isSubmittingDecision}
                  onClick={() => handleDecision('request_changes')}
                  className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  Request Changes
                </button>

                <button
                  type="button"
                  disabled={isSubmittingDecision}
                  onClick={() => handleDecision('approve')}
                  className="flex items-center space-x-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Approve & Lock Version</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Submission is already locked */
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center shadow-xs">
          <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
          <h4 className="text-base font-bold text-emerald-950">
            This submission has been Approved & Locked
          </h4>
          <p className="text-xs text-emerald-800 mt-1">
            Approved by <strong>{submission.approved_by}</strong> on {new Date(submission.approved_at || Date.now()).toLocaleString()}.
            Review the complete audit trail and applied guideline versions in the Audit Log below.
          </p>
        </div>
      )}

      {/* Threaded Comments & Revision History Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Threaded Comments */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 mb-4">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-bold text-slate-900">Threaded Comments & Notes</h4>
            <span className="text-xs font-mono text-slate-400">({submission.comments?.length || 0})</span>
          </div>

          {/* Comment list */}
          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
            {(!submission.comments || submission.comments.length === 0) ? (
              <p className="text-xs text-slate-400 italic text-center py-4">No comments yet.</p>
            ) : (
              submission.comments.map((cmt) => (
                <div key={cmt.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>{cmt.author_name}</span>
                      <span className="text-[10px] uppercase font-semibold text-slate-500 bg-slate-200 px-1 rounded">
                        {cmt.author_role}
                      </span>
                    </div>
                    <span className="text-slate-400 font-mono">
                      {new Date(cmt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-sans">{cmt.message}</p>
                </div>
              ))
            )}
          </div>

          {/* Add comment form */}
          <form onSubmit={handleAddComment} className="flex items-center space-x-2 pt-2 border-t border-slate-100">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={`Comment as ${currentRole}...`}
              className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50"
            />
            <button
              type="submit"
              disabled={isSubmittingComment || !commentText.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Revision History Snapshot */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 mb-4">
            <History className="w-4 h-4 text-purple-600" />
            <h4 className="text-sm font-bold text-slate-900">Revision History</h4>
            <span className="text-xs font-mono text-slate-400">({submission.history?.length || 1} versions)</span>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {submission.history?.map((h) => (
              <div key={h.version} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-700 font-mono text-xs">
                    Version {h.version}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-800 font-medium">{h.change_summary}</p>
                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Author: {h.changed_by}</span>
                  <span>Findings remaining: {h.findings_count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
