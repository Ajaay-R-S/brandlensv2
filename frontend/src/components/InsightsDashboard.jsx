import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  ShieldAlert, 
  HelpCircle, 
  PieChart, 
  Lightbulb, 
  Filter, 
  ArrowUpRight,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { fetchInsights } from '../api';

export default function InsightsDashboard() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadInsightsData = async () => {
    try {
      setLoading(true);
      const data = await fetchInsights();
      setInsights(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsightsData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-slate-400">
        Loading Recurring-Issue Insights...
      </div>
    );
  }

  if (error || !insights) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-rose-500">
        Failed to load insights: {error}
      </div>
    );
  }

  const { summary, finding_types, content_type_distribution, top_recurring_rules, dismissal_reasons, guideline_gaps } = insights;

  const totalTypes = (finding_types.RULE_VIOLATION || 0) + (finding_types.CONTRADICTED_CLAIM || 0) + (finding_types.NOT_VERIFIABLE || 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-slate-900">Guideline-Gap & Recurring-Issue Insights</h1>
            <span className="text-xs bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full font-mono font-medium">
              Step 8: Learn
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Treating disputed rules as feedback on guidelines, not just user error. Identify ambiguous rules, recurring compliance hurdles, and adoption rates.
          </p>
        </div>

        <button
          onClick={loadInsightsData}
          className="self-start md:self-auto px-3.5 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors cursor-pointer"
        >
          Refresh Metrics
        </button>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Total Scanned
          </span>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {summary.total_submissions_scanned}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Submissions checked</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Findings Caught
          </span>
          <div className="text-2xl font-black text-blue-600 font-mono">
            {summary.total_findings_caught}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Rules & claims flagged</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Acceptance Rate
          </span>
          <div className="text-2xl font-black text-emerald-600 font-mono">
            {summary.suggestion_acceptance_rate}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Suggestions adopted</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Citation Accuracy
          </span>
          <div className="text-2xl font-black text-indigo-600 font-mono">
            {summary.citation_accuracy}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">100% verified KB sources</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs col-span-2 md:col-span-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Avg Turnaround
          </span>
          <div className="text-2xl font-black text-purple-600 font-mono">
            {summary.avg_review_turnaround}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Per-item review time</span>
        </div>

      </div>

      {/* Main Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Finding Types Breakdown & Content Types */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Finding Types Distribution */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center space-x-2">
              <PieChart className="w-4 h-4 text-blue-600" />
              <span>Findings Distribution by Category</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Breakdown across the 3 core finding classifications defined in the architecture plan.
            </p>

            <div className="space-y-4">
              {/* Rule Violation */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold">
                  <span className="text-rose-700 flex items-center space-x-1">
                    <span>Rule Violations (Banned terms / Glossary)</span>
                  </span>
                  <span className="font-mono text-slate-900">
                    {finding_types.RULE_VIOLATION || 0} ({totalTypes > 0 ? Math.round(((finding_types.RULE_VIOLATION || 0) / totalTypes) * 100) : 0}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-rose-500 h-2.5 rounded-full"
                    style={{ width: `${totalTypes > 0 ? ((finding_types.RULE_VIOLATION || 0) / totalTypes) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Contradicted Claim */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold">
                  <span className="text-amber-800 flex items-center space-x-1">
                    <span>Contradicted Claims (Conflicts with approved facts)</span>
                  </span>
                  <span className="font-mono text-slate-900">
                    {finding_types.CONTRADICTED_CLAIM || 0} ({totalTypes > 0 ? Math.round(((finding_types.CONTRADICTED_CLAIM || 0) / totalTypes) * 100) : 0}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-amber-500 h-2.5 rounded-full"
                    style={{ width: `${totalTypes > 0 ? ((finding_types.CONTRADICTED_CLAIM || 0) / totalTypes) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Not Verifiable */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold">
                  <span className="text-orange-950 flex items-center space-x-1">
                    <span>Not Verifiable (Health / Superlative claims without proof)</span>
                  </span>
                  <span className="font-mono text-slate-900">
                    {finding_types.NOT_VERIFIABLE || 0} ({totalTypes > 0 ? Math.round(((finding_types.NOT_VERIFIABLE || 0) / totalTypes) * 100) : 0}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-orange-500 h-2.5 rounded-full"
                    style={{ width: `${totalTypes > 0 ? ((finding_types.NOT_VERIFIABLE || 0) / totalTypes) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Top Recurring Violations */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span>Top Recurring Violations Leaderboard</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Specific rules and fact thresholds most frequently triggered by creator drafts.
            </p>

            <div className="space-y-3">
              {top_recurring_rules.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono text-[10px] flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <span className="font-mono font-bold text-slate-800">{item.rule}</span>
                  </div>
                  <span className="font-mono font-semibold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                    {item.count} occurrences
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Guideline-Gap Insights & Dismissal Reasons */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Guideline Gap Analysis Card */}
          <div className="bg-gradient-to-br from-indigo-50/70 to-blue-50/40 rounded-2xl border-2 border-indigo-200 p-6 shadow-xs">
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">
                Guideline-Gap Analysis
              </h3>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              When content creators repeatedly dismiss a rule, BrandLens flags it as a <em>potential guideline gap</em>.
              This indicates the rule may be too rigid, ambiguous, or detached from marketing reality.
            </p>

            <div className="space-y-3">
              {guideline_gaps.length === 0 ? (
                <div className="p-4 bg-white rounded-xl border border-indigo-100 text-xs text-slate-500">
                  No guideline gaps flagged yet.
                </div>
              ) : (
                guideline_gaps.map((gap, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-xl border border-indigo-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                        {gap.rule_id}
                      </span>
                      <span className="text-[11px] font-bold text-rose-600">
                        {gap.dismissal_count} creator dismissals
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans">
                      {gap.recommendation}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Breakdown of Dismissal Reasons */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-slate-700" />
              <span>Dismissal Reasons Breakdown</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Mandatory dismissal justifications supplied by creators when overriding suggestions:
            </p>

            <div className="space-y-2.5">
              {Object.entries(dismissal_reasons).map(([reason, count]) => (
                <div key={reason} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800">{reason}</span>
                  <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {count} times
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
