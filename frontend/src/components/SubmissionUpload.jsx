import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  Image as ImageIcon, 
  FileText, 
  Palette, 
  HelpCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { createSubmission } from '../api';

export default function SubmissionUpload({ onSubmissionCreated, currentRole }) {
  const [title, setTitle] = useState('');
  const [contentType, setContentType] = useState('ad_copy');
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [contrastPairs, setContrastPairs] = useState([
    { foreground: '#94A3B8', background: '#FFFFFF', label: 'Banner Tagline' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Quick Preset Samples from Plan
  const loadPreset = (presetType) => {
    if (presetType === 'freshnest_mockup') {
      setTitle('FreshNest Launch Ad Copy (Round 1 Plan Mockup)');
      setContentType('ad_copy');
      setText('Introducing our new diet boxes! Our boxes are the healthiest in India and guarantee weight loss in 2 weeks. Enjoy fresh ingredients delivered right to your kitchen with free delivery on all orders!');
      setImageUrl('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600');
      setAltText(''); // Intentionally missing alt text
      setContrastPairs([{ foreground: '#94A3B8', background: '#FFFFFF', label: 'Promo Subtitle' }]);
      setShowAccessibility(true);
    } else if (presetType === 'social_post') {
      setTitle('Weekend Social Campaign - Instagram Carousel');
      setContentType('social_post');
      setText('Tired of grocery runs? Fresh Nest delivers farm to table dinners right to your doorstep. Each kit includes a special masala pack for authentic flavour. Delivery is always free with zero minimum spend!');
      setImageUrl('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600');
      setAltText('A rustic wooden table with fresh culinary ingredients');
      setContrastPairs([{ foreground: '#FFFFFF', background: '#059669', label: 'CTA Button' }]);
      setShowAccessibility(true);
    } else if (presetType === 'compliant') {
      setTitle('Compliant Recipe Card Description (Clean Benchmark)');
      setContentType('product_description');
      setText('Explore FreshNest chef-designed meal kits, with nutrition information on every pack. Pre-portioned fresh ingredients help reduce food waste by up to 60% compared to traditional shopping. Enjoy free delivery on orders of Rs 499 and above.');
      setImageUrl('https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600');
      setAltText('Fresh vegetables neatly packed in an insulated kraft box');
      setContrastPairs([{ foreground: '#0F172A', background: '#F1F5F9', label: 'Recipe Header' }]);
      setShowAccessibility(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Please provide text to analyze.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const payload = {
        title: title.trim() || 'Untitled Submission',
        content_type: contentType,
        text: text.trim(),
        image_url: imageUrl.trim() || null,
        alt_text: altText.trim() || null,
        contrast_pairs: showAccessibility ? contrastPairs : [],
        created_by: currentRole === 'creator' ? 'Jane Doe (Creator)' : 
                    currentRole === 'reviewer' ? 'Rahul Sharma (Reviewer)' : 'Priya Patel (Brand Manager)'
      };

      const result = await createSubmission(payload);
      onSubmissionCreated(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 mb-8">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-slate-900">Submit Content for Review</h2>
            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-mono font-medium">
              Step 2: Submit
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit marketing text, select format, and run instant deterministic checks & knowledge retrieval.
          </p>
        </div>

        {/* Demo Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Quick Demo Samples:</span>
          <button
            type="button"
            onClick={() => loadPreset('freshnest_mockup')}
            className="text-xs font-semibold px-2.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
          >
            Mockup 3-Issue Ad
          </button>
          <button
            type="button"
            onClick={() => loadPreset('social_post')}
            className="text-xs font-semibold px-2.5 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors cursor-pointer"
          >
            Social Post (Multi-Issue)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('compliant')}
            className="text-xs font-semibold px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
          >
            100% Compliant
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Campaign / Submission Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. FreshNest Summer Meal Kit Launch Copy"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Content Format / Channel
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="ad_copy">Ad Copy (Paid Ads / Search)</option>
              <option value="social_post">Social Post (Instagram / X / LinkedIn)</option>
              <option value="product_description">Product Description / Packaging</option>
              <option value="blog_post">Blog Article / Editorial</option>
              <option value="email_newsletter">Email Newsletter</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700">
              Content Text to Analyze
            </label>
            <span className="text-[11px] text-slate-400 font-mono">
              {wordCount} words | {charCount} chars
            </span>
          </div>
          <textarea
            required
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your promotional copy or article text here..."
            className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 leading-relaxed font-sans"
          />
        </div>

        {/* Collapsible Accessibility & Visual Asset Section (Round 3 Feature) */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowAccessibility(!showAccessibility)}
            className="flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <Palette className="w-4 h-4 text-indigo-500" />
            <span>{showAccessibility ? 'Hide' : 'Add'} Optional Visual Asset & Accessibility Checks (Alt-Text & WCAG Contrast)</span>
          </button>

          {showAccessibility && (
            <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                    <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>Image Asset URL</span>
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Screen-Reader Alt-Text (Mandatory for images per ACC-01)
                  </label>
                  <input
                    type="text"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="Describe image contents (leave empty to test rule violation)"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  />
                </div>
              </div>

              {/* Color Contrast Pairs */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Color Contrast Pair for Overlay Text (WCAG AA check)
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] text-slate-500">Text:</span>
                    <input
                      type="color"
                      value={contrastPairs[0]?.foreground || '#94A3B8'}
                      onChange={(e) => {
                        const next = [...contrastPairs];
                        next[0] = { ...next[0], foreground: e.target.value };
                        setContrastPairs(next);
                      }}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                    />
                    <span className="text-xs font-mono">{contrastPairs[0]?.foreground || '#94A3B8'}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] text-slate-500">Background:</span>
                    <input
                      type="color"
                      value={contrastPairs[0]?.background || '#FFFFFF'}
                      onChange={(e) => {
                        const next = [...contrastPairs];
                        next[0] = { ...next[0], background: e.target.value };
                        setContrastPairs(next);
                      }}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                    />
                    <span className="text-xs font-mono">{contrastPairs[0]?.background || '#FFFFFF'}</span>
                  </div>

                  {/* Preview Box */}
                  <div 
                    className="px-3 py-1.5 rounded-md text-xs font-medium border border-slate-200"
                    style={{
                      color: contrastPairs[0]?.foreground || '#94A3B8',
                      backgroundColor: contrastPairs[0]?.background || '#FFFFFF'
                    }}
                  >
                    Sample Live Preview
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Submit Action */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span>Deterministic checks first, AI retrieval second. Zero guessing on missing evidence.</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? 'Analyzing Content...' : 'Scan & Analyze Content'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
