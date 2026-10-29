import React from 'react';
import { 
  ShieldCheck, 
  BookOpen, 
  BarChart3, 
  FileText, 
  UserCheck, 
  RotateCcw,
  Sparkles,
  Eye
} from 'lucide-react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  currentRole, 
  setCurrentRole,
  onResetData,
  isResetting
}) {
  const roles = [
    { id: 'creator', name: 'Jane Doe', title: 'Content Creator', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { id: 'reviewer', name: 'Rahul Sharma', title: 'Legal & Brand Reviewer', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { id: 'manager', name: 'Priya Patel', title: 'Brand Manager / Admin', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  ];

  const activeRoleObj = roles.find(r => r.id === currentRole) || roles[0];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('workspace')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">BrandLens</span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                  FreshNest Demo
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Check content against approved facts & rules</p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setCurrentTab('workspace')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'workspace'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Review Workspace</span>
            </button>

            <button
              onClick={() => setCurrentTab('kb')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'kb'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Knowledge Base</span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">Step 1</span>
            </button>

            <button
              onClick={() => setCurrentTab('insights')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'insights'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Guideline Gaps</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-mono">Step 8</span>
            </button>

            <button
              onClick={() => setCurrentTab('accessibility')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'accessibility'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Contrast & Alt</span>
            </button>
          </nav>

          {/* Right Controls: Role Switcher & Reset */}
          <div className="flex items-center space-x-3">
            {/* Role Switcher */}
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-lg p-1">
              <UserCheck className="w-4 h-4 text-slate-500 ml-1.5 hidden sm:block" />
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">Role:</span>
              <select
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                className="text-xs font-semibold bg-white border border-slate-200 rounded-md py-1 px-2 text-slate-800 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {roles.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.title})
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Data Button */}
            <button
              onClick={onResetData}
              disabled={isResetting}
              title="Reset Knowledge Base and Submissions to FreshNest seed"
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors disabled:opacity-50"
            >
              <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
            </button>
          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex space-x-1 pb-3 overflow-x-auto">
          <button
            onClick={() => setCurrentTab('workspace')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              currentTab === 'workspace' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Review Workspace
          </button>
          <button
            onClick={() => setCurrentTab('kb')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              currentTab === 'kb' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Knowledge Base (Step 1)
          </button>
          <button
            onClick={() => setCurrentTab('insights')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              currentTab === 'insights' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Guideline Gaps (Step 8)
          </button>
          <button
            onClick={() => setCurrentTab('accessibility')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              currentTab === 'accessibility' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Contrast & Alt
          </button>
        </div>

      </div>
    </header>
  );
}
