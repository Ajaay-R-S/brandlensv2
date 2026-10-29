import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  HelpCircle,
  Eye,
  RotateCcw
} from 'lucide-react';
import { checkContrast } from '../api';

export default function ContrastChecker() {
  const [fg, setFg] = useState('#94A3B8');
  const [bg, setBg] = useState('#FFFFFF');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const evaluateCurrentColors = async (foregroundHex, backgroundHex) => {
    try {
      setLoading(true);
      const res = await checkContrast(foregroundHex, backgroundHex);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    evaluateCurrentColors(fg, bg);
  }, [fg, bg]);

  const presetPairs = [
    { name: 'Low Contrast Failure (Plan Demo)', fg: '#94A3B8', bg: '#FFFFFF' },
    { name: 'FreshNest Emerald AA Pass', fg: '#047857', bg: '#FFFFFF' },
    { name: 'Dark Slate Header AA Pass', fg: '#0F172A', bg: '#F8FAFC' },
    { name: 'White on FreshNest Navy AAA', fg: '#FFFFFF', bg: '#0F172A' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-slate-900">WCAG 2.1 Color Contrast Checker</h1>
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-mono font-medium">
              Accessibility Engine
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Evaluates visual text overlay contrast against WCAG 2.1 AA standards (minimum 4.5:1 for body text, 3:1 for large text).
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {presetPairs.map((pair, idx) => (
            <button
              key={idx}
              onClick={() => { setFg(pair.fg); setBg(pair.bg); }}
              className="text-xs font-semibold px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              {pair.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Palette className="w-4 h-4 text-indigo-600" />
              <span>Select Color Pair</span>
            </h3>

            {/* Foreground */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Text / Foreground Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={fg}
                  onChange={(e) => setFg(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-slate-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={fg}
                  onChange={(e) => setFg(e.target.value)}
                  className="w-32 px-3 py-2 text-xs font-mono uppercase border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            {/* Background */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Background Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-slate-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                  className="w-32 px-3 py-2 text-xs font-mono uppercase border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            {/* Invert button */}
            <button
              onClick={() => { const temp = fg; setFg(bg); setBg(temp); }}
              className="flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Swap Foreground & Background</span>
            </button>
          </div>

          {/* Standards Guide Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs text-slate-600 space-y-2">
            <h4 className="font-bold text-slate-800">WCAG 2.1 Criteria:</h4>
            <p><strong>Level AA Normal Text (16px):</strong> Requires at least 4.5:1 contrast.</p>
            <p><strong>Level AA Large Text (≥18pt or bold ≥14pt):</strong> Requires at least 3.0:1 contrast.</p>
            <p><strong>Level AAA Enhanced:</strong> Requires 7.0:1 for normal and 4.5:1 for large text.</p>
          </div>
        </div>

        {/* Preview & Results Column */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Live Preview Box */}
          <div 
            className="rounded-2xl p-8 border border-slate-300 shadow-sm transition-colors duration-200 min-h-[220px] flex flex-col justify-center"
            style={{ backgroundColor: bg, color: fg }}
          >
            <h2 className="text-2xl font-black tracking-tight mb-2">
              FreshNest Chef-Designed Meal Kits
            </h2>
            <p className="text-sm font-medium leading-relaxed max-w-xl">
              Pre-portioned fresh ingredients delivered weekly in 100% recyclable insulated paper boxes. 
              Enjoy free delivery on orders of Rs 499 and above.
            </p>
            <div className="mt-4">
              <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded border" style={{ borderColor: fg }}>
                Verified Nutritional Fact
              </span>
            </div>
          </div>

          {/* Test Results Card */}
          {result && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Computed Contrast Ratio
                </span>
                <span className="text-2xl font-black font-mono text-slate-900">
                  {result.ratio}:1
                </span>
              </div>

              {/* Status Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center ${
                  result.passes_aa ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}>
                  <span className="text-[10px] uppercase font-bold tracking-wider mb-1">WCAG AA Normal</span>
                  {result.passes_aa ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  <span className="text-xs font-bold mt-1">{result.passes_aa ? 'PASS' : 'FAIL'}</span>
                </div>

                <div className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center ${
                  result.ratio >= 3.0 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}>
                  <span className="text-[10px] uppercase font-bold tracking-wider mb-1">WCAG AA Large</span>
                  {result.ratio >= 3.0 ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  <span className="text-xs font-bold mt-1">{result.ratio >= 3.0 ? 'PASS' : 'FAIL'}</span>
                </div>

                <div className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center ${
                  result.passes_aaa ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}>
                  <span className="text-[10px] uppercase font-bold tracking-wider mb-1">WCAG AAA Normal</span>
                  {result.passes_aaa ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  <span className="text-xs font-bold mt-1">{result.passes_aaa ? 'PASS' : 'FAIL'}</span>
                </div>

                <div className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center ${
                  result.ratio >= 4.5 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}>
                  <span className="text-[10px] uppercase font-bold tracking-wider mb-1">WCAG AAA Large</span>
                  {result.ratio >= 4.5 ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  <span className="text-xs font-bold mt-1">{result.ratio >= 4.5 ? 'PASS' : 'FAIL'}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                {result.description}
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
