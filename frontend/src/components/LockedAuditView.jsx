import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Copy, 
  Check, 
  Download, 
  FileText, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { unlockSubmission } from '../api';

export default function LockedAuditView({
  submission,
  onRefreshSubmission,
  currentRole
}) {
  const [copied, setCopied] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  if (!submission) return null;

  const handleCopyCleanText = () => {
    navigator.clipboard.writeText(submission.current_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUnlock = async () => {
    if (!window.confirm("Unlock this approved version for editorial corrections? An unlock entry will be added to the audit trail.")) return;
    try {
      setIsUnlocking(true);
      await unlockSubmission(submission.id, currentRole === 'manager' ? 'Priya Patel (Brand Manager)' : 'Jane Doe (Creator)');
      onRefreshSubmission();
    } catch (err) {
      alert(`Error unlocking submission: ${err.message}`);
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleDownloadJSON = () => {
    const auditRecord = {
      brandlens_audit_id: `AUDIT-${submission.id}`,
      generated_at: new Date().toISOString(),
      submission_title: submission.title,
      content_type: submission.content_type,
      approved_version: submission.version,
      approved_by: submission.approved_by,
      approved_at: submission.approved_at,
      approval_notes: submission.approval_notes,
      final_text: submission.current_text,
      ai_disclosure: {
        ai_service_disclosed: submission.ai_service_disclosed,
        notes: submission.ai_disclosure_notes,
        external_training_prevented: true
      },
      applied_guideline_versions: submission.applied_guideline_versions,
      findings_resolution_log: submission.findings?.map(f => ({
        finding_number: f.finding_number,
        type: f.type,
        flagged_text: f.flagged_text,
        cited_source: f.cited_source_id,
        resolution_status: f.status,
        dismissal_reason: f.dismissal_reason || null,
        dismissal_note: f.dismissal_note || null,
        suggested_revision: f.suggested_revision
      })),
      history: submission.history
    };

    const blob = new Blob([JSON.stringify(auditRecord, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brandlens_audit_${submission.id}_v${submission.version}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const appliedVersions = submission.applied_guideline_versions || {};
  const findings = submission.findings || [];
  const acceptedCount = findings.filter(f => f.status === 'accepted' || f.status === 'edited').length;
  const dismissedCount = findings.filter(f => f.status === 'dismissed').length;

  return (
    <div className="space-y-6">
      
      {/* Step 7 Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-slate-900">Locked Version & Audit Record</h3>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono font-medium">
              Step 7: Approve & Lock
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Immutable pre-publication compliance record. Certified for publishing with full traceability.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownloadJSON}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Audit JSON</span>
          </button>

          {currentRole === 'manager' && submission.is_locked && (
            <button
              onClick={handleUnlock}
              disabled={isUnlocking}
              className="flex items-center space-x-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock for Editorial Changes</span>
            </button>
          )}
        </div>
      </div>

      {/* Audit Certificate Card */}
      <div className="bg-white rounded-2xl border-2 border-emerald-300 shadow-md p-6 relative overflow-hidden">
        
        {/* Security watermark badge */}
        <div className="absolute right-6 top-6 flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-300">
          <Lock className="w-3.5 h-3.5" />
          <span className="text-xs font-bold font-mono uppercase tracking-wider">
            {submission.is_locked ? `Locked v${submission.version}` : `Draft v${submission.version}`}
          </span>
        </div>

        <div className="max-w-2xl mb-6">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Certified Approved Text
          </span>
          <h2 className="text-xl font-bold text-slate-900 mb-2">{submission.title}</h2>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 text-sm leading-relaxed font-sans relative">
            {submission.current_text}
            
            <button
              onClick={handleCopyCleanText}
              className="absolute top-3 right-3 flex items-center space-x-1 text-xs font-semibold bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700 hover:text-blue-600 shadow-2xs transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Clean Text'}</span>
            </button>
          </div>
        </div>

        {/* Audit Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200 text-xs">
          
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-500 uppercase text-[10px] block mb-1">Approver</span>
            <span className="font-semibold text-slate-900 block">
              {submission.approved_by || 'Pending Reviewer Sign-off'}
            </span>
            <span className="text-slate-400 text-[11px]">
              {submission.approved_at ? new Date(submission.approved_at).toLocaleString() : 'Not yet locked'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-500 uppercase text-[10px] block mb-1">Resolution Summary</span>
            <div className="flex items-center space-x-2 font-medium text-slate-800">
              <span className="text-emerald-700">{acceptedCount} Accepted</span>
              <span>•</span>
              <span className="text-slate-600">{dismissedCount} Dismissed</span>
            </div>
            <span className="text-slate-400 text-[11px]">
              Total {findings.length} findings evaluated
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-500 uppercase text-[10px] block mb-1">Responsible AI Disclosure</span>
            <span className="font-semibold text-emerald-700 block flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>External Training Off</span>
            </span>
            <span className="text-slate-500 text-[11px] block mt-0.5">
              Deterministic rules + Approved-source retrieval only.
            </span>
          </div>

        </div>

      </div>

      {/* Applied Guideline Versions & Findings Resolution Log */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Applied Guideline Versions Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 mb-4">
            <FileText className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-bold text-slate-900">Applied Guideline & Fact Versions</h4>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            The exact guideline versions active when this content was approved:
          </p>

          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {Object.entries(appliedVersions).length === 0 ? (
              <span className="text-xs text-slate-400">Default FreshNest Seed KB v1.0 applied</span>
            ) : (
              Object.entries(appliedVersions).map(([key, ver]) => (
                <div key={key} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="font-mono font-medium text-slate-800">{key}</span>
                  <span className="font-mono text-slate-500 text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200">
                    version {ver}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Detailed Findings Resolution Log */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 mb-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h4 className="text-sm font-bold text-slate-900">Findings Resolution Audit Trail</h4>
          </div>
          
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {findings.length === 0 ? (
              <p className="text-xs text-slate-400">No findings logged for this submission.</p>
            ) : (
              findings.map((f) => (
                <div key={f.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      Finding {f.finding_number}: {f.cited_source_id}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      f.status === 'accepted' || f.status === 'edited'
                        ? 'bg-emerald-100 text-emerald-800'
                        : f.status === 'dismissed'
                          ? 'bg-slate-200 text-slate-800'
                          : 'bg-rose-100 text-rose-800'
                    }`}>
                      {f.status}
                    </span>
                  </div>
                  <p className="text-slate-600 font-mono text-[11px]">"{f.flagged_text}"</p>
                  {f.dismissal_reason && (
                    <div className="text-[11px] text-slate-500 pt-0.5">
                      Dismissal reason: <strong className="text-slate-700">{f.dismissal_reason}</strong>
                      {f.dismissal_note && <span> — "{f.dismissal_note}"</span>}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
