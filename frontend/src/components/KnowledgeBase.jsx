import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Trash2, 
  Tag, 
  ShieldAlert, 
  Info,
  Filter,
  Sparkles
} from 'lucide-react';
import { fetchKB, createKBEntry, updateKBEntry, deleteKBEntry } from '../api';

export default function KnowledgeBase() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    category: 'glossary',
    title: '',
    content: '',
    banned_terms: '',
    approved_terms: '',
    version: '1.0',
    is_approved: true,
    severity_default: 'medium',
    reason_template: '',
    suggested_template: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchKB();
      setEntries(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingEntry(null);
    setFormData({
      id: `R-${Math.floor(10 + Math.random() * 90)}`,
      category: 'glossary',
      title: '',
      content: '',
      banned_terms: '',
      approved_terms: '',
      version: '1.0',
      is_approved: true,
      severity_default: 'medium',
      reason_template: '',
      suggested_template: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (entry) => {
    setEditingEntry(entry);
    setFormData({
      id: entry.id,
      category: entry.category,
      title: entry.title,
      content: entry.content,
      banned_terms: entry.banned_terms?.join(', ') || '',
      approved_terms: entry.approved_terms?.join(', ') || '',
      version: entry.version,
      is_approved: entry.is_approved,
      severity_default: entry.severity_default || 'medium',
      reason_template: entry.reason_template || '',
      suggested_template: entry.suggested_template || ''
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        id: formData.id.trim(),
        category: formData.category,
        title: formData.title.trim(),
        content: formData.content.trim(),
        banned_terms: formData.banned_terms ? formData.banned_terms.split(',').map(s => s.trim()).filter(Boolean) : [],
        approved_terms: formData.approved_terms ? formData.approved_terms.split(',').map(s => s.trim()).filter(Boolean) : [],
        version: formData.version.trim() || '1.0',
        is_approved: Boolean(formData.is_approved),
        severity_default: formData.severity_default,
        reason_template: formData.reason_template.trim(),
        suggested_template: formData.suggested_template.trim()
      };

      if (editingEntry) {
        await updateKBEntry(editingEntry.id, payload);
      } else {
        await createKBEntry(payload);
      }

      setIsModalOpen(false);
      loadData();
    } catch (err) {
      alert(`Error saving entry: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete rule/fact ${id}?`)) return;
    try {
      await deleteKBEntry(id);
      loadData();
    } catch (err) {
      alert(`Error deleting entry: ${err.message}`);
    }
  };

  const handleToggleApproval = async (entry) => {
    try {
      await updateKBEntry(entry.id, {
        ...entry,
        is_approved: !entry.is_approved
      });
      loadData();
    } catch (err) {
      alert(`Error toggling approval: ${err.message}`);
    }
  };

  const filteredEntries = entries.filter(e => {
    if (activeCategory !== 'all' && e.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = e.id.toLowerCase().includes(q);
      const matchTitle = e.title.toLowerCase().includes(q);
      const matchContent = e.content.toLowerCase().includes(q);
      const matchTerms = e.banned_terms?.some(t => t.toLowerCase().includes(q)) || 
                         e.approved_terms?.some(t => t.toLowerCase().includes(q));
      return matchId || matchTitle || matchContent || matchTerms;
    }
    return true;
  });

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'glossary':
        return <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-md border border-emerald-300">Glossary Term</span>;
      case 'guideline':
        return <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-100 text-indigo-800 rounded-md border border-indigo-300">Guideline / Policy</span>;
      case 'fact':
        return <span className="px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800 rounded-md border border-amber-300">Approved Fact</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-800 rounded-md">{cat}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-slate-900">Knowledge Base</h1>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-mono font-medium">
              Step 1: Set Up
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Split into approved facts, guidelines, and glossary rules with ID and version locking.
            Deterministic checks and AI retrieval run strictly against approved entries.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={openCreateModal}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Rule / Fact</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        {/* Category Pills */}
        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Entries', count: entries.length },
            { id: 'glossary', label: 'Glossary', count: entries.filter(e => e.category === 'glossary').length },
            { id: 'guideline', label: 'Guidelines', count: entries.filter(e => e.category === 'guideline').length },
            { id: 'fact', label: 'Approved Facts', count: entries.filter(e => e.category === 'fact').length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === tab.id
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label} <span className="opacity-70 ml-1">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rules, facts, IDs..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Knowledge Base Cards Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading Knowledge Base...</div>
      ) : filteredEntries.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-700">No entries match your search</h3>
          <p className="text-xs text-slate-400 mt-1">Try another filter or add a new guideline entry.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEntries.map(entry => (
            <div 
              key={entry.id} 
              className={`bg-white rounded-2xl border p-5 flex flex-col justify-between transition-all hover:shadow-md ${
                entry.is_approved ? 'border-slate-200' : 'border-amber-300 bg-amber-50/20'
              }`}
            >
              <div>
                {/* Card Top Row: ID, Category & Approval */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-900 text-white rounded-md">
                      {entry.id}
                    </span>
                    {getCategoryBadge(entry.category)}
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      v{entry.version}
                    </span>
                    <button
                      onClick={() => handleToggleApproval(entry)}
                      title={entry.is_approved ? "Active & Approved for checks" : "Draft (Not active in analysis)"}
                      className="cursor-pointer"
                    >
                      {entry.is_approved ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-amber-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                  {entry.title}
                </h3>

                {/* Content */}
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {entry.content}
                </p>

                {/* Banned Terms Tags */}
                {entry.banned_terms && entry.banned_terms.length > 0 && (
                  <div className="mb-3">
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block mb-1">
                      Banned / Flagged Terms:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {entry.banned_terms.map((term, i) => (
                        <span key={i} className="text-[11px] bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-md font-mono">
                          "{term}"
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Approved Terms Tags */}
                {entry.approved_terms && entry.approved_terms.length > 0 && (
                  <div className="mb-3">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                      Approved Phrasing:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {entry.approved_terms.map((term, i) => (
                        <span key={i} className="text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md font-mono">
                          "{term}"
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-2">
                <span className="text-[11px] text-slate-400">
                  Default Severity: <span className="font-semibold text-slate-600 capitalize">{entry.severity_default}</span>
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => openEditModal(entry)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit entry"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              {editingEntry ? `Edit Entry: ${editingEntry.id}` : 'Create Knowledge Base Entry'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Entry ID (e.g. T-07, CL-03, F-12)</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingEntry}
                    value={formData.id}
                    onChange={(e) => setFormData({...formData, id: e.target.value})}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="glossary">Glossary Term</option>
                    <option value="guideline">Guideline / Policy</option>
                    <option value="fact">Approved Fact</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Meal Kits Product Terminology"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Rule / Fact Statement</label>
                <textarea
                  required
                  rows={3}
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the authoritative definition, policy rule, or validated brand fact..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Banned / Restricted Terms (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.banned_terms}
                  onChange={(e) => setFormData({...formData, banned_terms: e.target.value})}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. diet boxes, diet packs, slimming meals"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Approved Phrasing / Suggestions (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.approved_terms}
                  onChange={(e) => setFormData({...formData, approved_terms: e.target.value})}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. meal kits, chef-designed meal kits"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Version</label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => setFormData({...formData, version: e.target.value})}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="1.0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Default Severity</label>
                  <select
                    value={formData.severity_default}
                    onChange={(e) => setFormData({...formData, severity_default: e.target.value})}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="is_approved"
                  checked={formData.is_approved}
                  onChange={(e) => setFormData({...formData, is_approved: e.target.checked})}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="is_approved" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Approved & Active (rules will be enforced during text analysis)
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs transition-colors"
                >
                  {editingEntry ? 'Update Entry' : 'Create Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
