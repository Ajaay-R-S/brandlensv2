import React, { useState } from 'react';
import { 
  AlertTriangle, 
  HelpCircle, 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  Check, 
  Edit3, 
  X, 
  Send, 
  ShieldAlert, 
  Bookmark,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { actOnFinding } from '../api';

export default function AnalysisView({ 
  submission, 
  onRefreshSubmission, 
  onOpenEditModal, 
  onOpenDismissModal,
  currentRole
}) {
  const [activeFindingId, setActiveFindingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [actingFindingId, setActingFindingId] = useState(null);

  if (!submission) return null;

  const findings = submission.findings || [];

  const handleAccept = async (finding) => {
    try {
      setActingFindingId(finding.id);
      await actOnFinding(submission.id, finding.id, { action: 'accept' });
      onRefreshSubmission();
    } catch (err) {
      alert(`Error accepting finding: ${err.message}`);
    } finally {
      setActingFindingId(null);
    }
  };

  const handleSendToReviewer = async (finding) => {
    try {
      setActingFindingId(finding.id);
      await actOnFinding(submission.id, finding.id, { action: 'send_to_reviewer' });
      onRefreshSubmission();
    } catch (err) {
      alert(`Error routing to reviewer: ${err.message}`);
    } finally {
      setActingFindingId(null);
    }
  };

  const getFindingTypeBadge = (type) => {
    switch (type) {
      case 'RULE_VIOLATION':
        return (
          <span className="px-2.5 py-1 text-xs font-bold bg-rose-100 text-rose-800 rounded-lg border border-rose-300 flex items-center space-x-1">
            <XCircle className="w-3.5 h-3.5 shrink-0" />
            <span>RULE VIOLATION</span>
          </span>
        );
      case 'CONTRADICTED_CLAIM':
        return (
          <span className="px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-900 rounded-lg border border-amber-300 flex items-center space-x-1">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>CONTRADICTED CLAIM</span>
          </span>
        );
      case 'NOT_VERIFIABLE':
        return (
          <span className="px-2.5 py-1 text-xs font-bold bg-orange-100 text-orange-950 rounded-lg border border-orange-300 flex items-center space-x-1">
            <HelpCircle className="w-3.5 h-3.5 shrink-0" />
            <span>NOT VERIFIABLE - needs reviewer</span>
          </span>
        );
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-800 rounded-lg">{type}</span>;
    }
  };

  const getSeverityBadge = (sev) => {
    const s = (sev || 'medium').toLowerCase();
    if (s === 'high') return <span className="text-xs font-bold text-rose-600">Severity: high</span>;
    if (s === 'medium') return <span className="text-xs font-bold text-amber-600">Severity: medium</span>;
    return <span className="text-xs font-bold text-slate-600">Severity: low</span>;
  };

  const filteredFindings = findings.filter(f => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'open') return f.status === 'open';
    if (statusFilter === 'resolved') return ['accepted', 'edited', 'dismissed'].includes(f.status);
    if (statusFilter === 'needs_reviewer') return f.status === 'sent_to_reviewer';
    return true;
  });

  const openCount = findings.filter(f => f.status === 'open').length;
  const acceptedCount = findings.filter(f => f.status === 'accepted' || f.status === 'edited').length;
  const dismissedCount = findings.filter(f => f.status === 'dismissed').length;

  return (
    <div className="space-y-6">
      {/* Top Banner: Step 3 & 4 Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-slate-900">Analysis & Cited Findings</h3>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-mono font-medium">
              Steps 3 & 4: Analyse & Explain
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Every finding links directly to an approved guideline rule or validated fact. Nothing changes until the creator decides.
          </p>
        </div>

        {/* Status Counts Pill */}
        <div className="flex items-center space-x-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({findings.length})
          </button>
          <button
            onClick={() => setStatusFilter('open')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              statusFilter === 'open' ? 'bg-white text-rose-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Open ({openCount})
          </button>
          <button
            onClick={() => setStatusFilter('resolved')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              statusFilter === 'resolved' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Resolved ({acceptedCount + dismissedCount})
          </button>
        </div>
      </div>

      {/* Main Review Grid: Left Pane = Content Text, Right Pane = Finding Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Content Viewer with Highlighted Excerpts */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Current Document
                </span>
                <h4 className="text-sm font-bold text-slate-900">{submission.title}</h4>
              </div>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-xs font-mono">
                v{submission.version}
              </span>
            </div>

            {/* Content Text Block */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm leading-relaxed text-slate-800 font-sans min-h-[160px] whitespace-pre-wrap">
              {submission.current_text}
            </div>

            {/* Optional Attached Image Preview if present */}
            {submission.image_url && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Attached Visual Asset
                </span>
                <img 
                  src={submission.image_url} 
                  alt={submission.alt_text || "Submission visual"} 
                  className="w-full h-40 object-cover rounded-xl border border-slate-200"
                />
                <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span className="font-semibold">Alt Text: </span>
                  {submission.alt_text ? (
                    <span>"{submission.alt_text}"</span>
                  ) : (
                    <span className="text-rose-600 font-semibold italic">Missing alt text! (Violates ACC-01)</span>
                  )}
                </div>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Channel: <strong className="text-slate-600 capitalize">{submission.content_type.replace('_', ' ')}</strong></span>
              <span>Author: <strong className="text-slate-600">{submission.created_by}</strong></span>
            </div>
          </div>
        </div>

        {/* Right Column: Finding Cards matching PDF Page 2 Mockup */}
        <div className="lg:col-span-7 space-y-5">
          {filteredFindings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">Zero Outstanding Issues!</h3>
              <p className="text-xs text-slate-500 mt-1">
                All claims and terminology comply with FreshNest approved brand guidelines.
              </p>
            </div>
          ) : (
            filteredFindings.map((finding) => {
              const isResolved = ['accepted', 'edited', 'dismissed'].includes(finding.status);
              const isActing = actingFindingId === finding.id;

              return (
                <div 
                  key={finding.id}
                  id={`finding-${finding.id}`}
                  className={`bg-white rounded-2xl border-2 transition-all shadow-xs overflow-hidden ${
                    isResolved 
                      ? 'border-slate-200 opacity-80' 
                      : finding.type === 'NOT_VERIFIABLE'
                        ? 'border-orange-300 ring-2 ring-orange-100'
                        : finding.type === 'RULE_VIOLATION'
                          ? 'border-rose-300 ring-2 ring-rose-100'
                          : 'border-amber-300 ring-2 ring-amber-100'
                  }`}
                >
                  {/* Mockup Card Top Bar */}
                  <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2 text-xs text-slate-700">
                      <span className="font-bold text-slate-900">
                        Finding {finding.finding_number} of {findings.length}
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="font-medium text-slate-600">{finding.category}</span>
                      <span className="text-slate-300">|</span>
                      {getSeverityBadge(finding.severity)}
                    </div>

                    <div>
                      {getFindingTypeBadge(finding.type)}
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* FLAGGED TEXT */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        FLAGGED TEXT
                      </span>
                      <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-slate-900 font-medium text-xs leading-relaxed">
                        "{finding.flagged_text}"
                      </div>
                    </div>

                    {/* WHY IT WAS FLAGGED */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        WHY IT WAS FLAGGED
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/80 p-3 rounded-xl border border-slate-200">
                        {finding.why_flagged}
                      </p>
                    </div>

                    {/* SUGGESTED REVISION */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                          SUGGESTED REVISION <span className="font-normal text-slate-500 normal-case">(aims to keep your purpose; only uses approved facts)</span>
                        </span>
                      </div>
                      <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl text-slate-900 text-xs font-semibold leading-relaxed">
                        "{finding.suggested_revision}"
                      </div>
                    </div>

                    {/* Source Citation */}
                    <div className="flex items-center space-x-1.5 text-xs text-slate-500 pt-1">
                      <Bookmark className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>
                        Source: <strong className="text-slate-800">{finding.cited_source_id}</strong> ({finding.cited_source_title}).
                        <span className="text-slate-400 ml-1">Nothing changes until the creator decides.</span>
                      </span>
                    </div>

                    {/* Status Badge if already acted upon */}
                    {finding.status !== 'open' && (
                      <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold uppercase text-[10px] px-2 py-0.5 rounded bg-white border text-slate-700">
                            Status: {finding.status.replace('_', ' ')}
                          </span>
                          {finding.dismissal_reason && (
                            <span className="text-slate-600 font-medium">
                              Reason: "{finding.dismissal_reason}"
                            </span>
                          )}
                        </div>
                        {finding.status === 'sent_to_reviewer' && (
                          <span className="text-indigo-600 font-medium">Awaiting reviewer approval</span>
                        )}
                      </div>
                    )}

                    {/* Action Buttons matching Page 2 Mockup */}
                    {!submission.is_locked && (
                      <div className="pt-2 flex flex-wrap items-center gap-2">
                        {/* Accept Button */}
                        <button
                          type="button"
                          disabled={isActing}
                          onClick={() => handleAccept(finding)}
                          className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept</span>
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          disabled={isActing}
                          onClick={() => onOpenEditModal(finding)}
                          className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        {/* Dismiss (reason needed) Button */}
                        <button
                          type="button"
                          disabled={isActing}
                          onClick={() => onOpenDismissModal(finding)}
                          className="flex items-center space-x-1.5 bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Dismiss (reason needed)</span>
                        </button>

                        {/* Send to Reviewer Button */}
                        <button
                          type="button"
                          disabled={isActing}
                          onClick={() => handleSendToReviewer(finding)}
                          className="flex items-center space-x-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send to reviewer</span>
                        </button>
                      </div>
                    )}

                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
