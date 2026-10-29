import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, ShieldAlert, Sparkles, X } from 'lucide-react';
import { actOnFinding } from '../api';

export default function ReviseModal({
  isOpen,
  onClose,
  mode, // 'dismiss' | 'edit'
  finding,
  submissionId,
  onSuccess
}) {
  if (!isOpen || !finding) return null;

  // Dismissal form state
  const [selectedReason, setSelectedReason] = useState('Approved marketing exception');
  const [dismissalNote, setDismissalNote] = useState('');

  // Edit suggestion form state
  const [customRevision, setCustomRevision] = useState(finding.suggested_revision || '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dismissalOptions = [
    { 
      label: 'Approved marketing exception', 
      desc: 'Campaign leadership explicitly pre-approved this specific creative deviation.' 
    },
    { 
      label: 'Context qualifies claim', 
      desc: 'The surrounding copy or footnote contains sufficient qualifying disclosures.' 
    },
    { 
      label: 'Creative wordplay / brand voice nuance', 
      desc: 'Intentional poetic, rhyming, or idiomatic phrasing aligned with brand personality.' 
    },
    { 
      label: 'Rule is outdated or inaccurate', 
      desc: 'The guideline or fact does not reflect current product specs (flags for guideline review).' 
    },
    { 
      label: 'Other', 
      desc: 'Provide custom reasoning in the notes field below.' 
    }
  ];

  const handleDismissSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReason) {
      setError('Please select a dismissal reason.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await actOnFinding(submissionId, finding.id, {
        action: 'dismiss',
        dismissal_reason: selectedReason,
        dismissal_note: dismissalNote.trim() || null
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!customRevision.trim()) {
      setError('Revision cannot be blank.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await actOnFinding(submissionId, finding.id, {
        action: 'edit',
        user_revision: customRevision.trim()
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {mode === 'dismiss' ? 'Dismiss Finding — Reason Required' : 'Edit Suggested Revision'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {mode === 'dismiss' 
                ? 'Disputed rules feed the guideline-gap dashboard to improve brand rules.' 
                : 'Customize the suggestion while keeping compliance with approved facts.'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Flagged Item Context Box */}
        <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
            Flagged Passage ({finding.cited_source_id})
          </span>
          <p className="text-xs font-medium text-slate-800">
            "{finding.flagged_text}"
          </p>
        </div>

        {/* Mode: Dismissal Reason Form */}
        {mode === 'dismiss' && (
          <form onSubmit={handleDismissSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Select Dismissal Reason <span className="text-rose-500">*</span>
              </label>
              <div className="space-y-2">
                {dismissalOptions.map((opt) => (
                  <label
                    key={opt.label}
                    className={`flex items-start space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedReason === opt.label
                        ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="dismissal_reason"
                      checked={selectedReason === opt.label}
                      onChange={() => setSelectedReason(opt.label)}
                      className="mt-0.5 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 block">{opt.label}</span>
                      <span className="text-[11px] text-slate-500">{opt.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Additional Justification or Context Note (Optional)
              </label>
              <textarea
                rows={2}
                value={dismissalNote}
                onChange={(e) => setDismissalNote(e.target.value)}
                placeholder="Explain why this dismissal is acceptable for this campaign..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 text-xs font-bold bg-slate-900 hover:bg-black text-white rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Recording...' : 'Confirm Dismissal'}
              </button>
            </div>
          </form>
        )}

        {/* Mode: Custom Edit Form */}
        {mode === 'edit' && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Suggestion from BrandLens:
              </label>
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900">
                "{finding.suggested_revision}"
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Intent-Preserving Revision:
              </label>
              <textarea
                rows={3}
                required
                value={customRevision}
                onChange={(e) => setCustomRevision(e.target.value)}
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-sans"
                placeholder="Enter customized compliant text..."
              />
              <span className="text-[11px] text-slate-400 block mt-1">
                Must remain compliant with cited approved fact: {finding.cited_source_id}
              </span>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Applying...' : 'Apply Revision to Draft'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
