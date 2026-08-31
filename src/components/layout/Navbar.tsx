import React from 'react';
import { 
  Sparkles, 
  Target, 
  ChevronRight, 
  Menu, 
  X, 
  Eye, 
  RefreshCw,
  Compass
} from 'lucide-react';
import { CAREER_ROLES } from '../../data/careerRoles';
import { CareerRole, SkillForgeState } from '../../types';
import { calculateOverallReadiness } from '../../services/readinessEngine';

interface NavbarProps {
  state: SkillForgeState;
  onNavigate: (tab: string) => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  isExampleMode: boolean;
  onExitExample: () => void;
  onRoleChange: (role: CareerRole) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  state,
  onNavigate,
  onToggleSidebar,
  isSidebarOpen,
  isExampleMode,
  onExitExample,
  onRoleChange
}) => {
  const readiness = calculateOverallReadiness(
    state.profile,
    state.skills,
    state.projects.length,
    state.resumeAnalysis,
    state.assessmentSubmissions
  );

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3 transition-all">
      {isExampleMode && (
        <div className="mb-2 bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-violet-500/10 border border-amber-200/80 rounded-xl px-4 py-2 flex items-center justify-between text-xs text-amber-900 font-medium">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-800 border border-amber-300">
              <Eye className="w-3 h-3 mr-1" /> Example Preview Mode
            </span>
            <span>You are viewing a demonstration profile for <strong>{state.profile.name || 'Alex Carter'}</strong>. Your personal data is not overwritten.</span>
          </div>
          <button
            onClick={onExitExample}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 hover:border-indigo-300 shadow-xs cursor-pointer transition-all"
          >
            <RefreshCw className="w-3 h-3" /> Exit Preview
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div 
            onClick={() => onNavigate('overview')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-xs shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-lg tracking-tight flex items-center gap-1.5">
                SKILLFORGE
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-md border border-indigo-200/60">
                  Ready
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Center/Right Career Target and Readiness quick stats */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Target Role Selector */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs text-slate-700">
            <Target className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-medium text-slate-500">Target Role:</span>
            <select
              value={state.profile.targetRole || ''}
              onChange={(e) => onRoleChange(e.target.value as CareerRole)}
              className="bg-transparent font-semibold text-slate-800 outline-hidden cursor-pointer"
            >
              <option value="" disabled>Select Target Career</option>
              {CAREER_ROLES.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Readiness Score Pill */}
          <div 
            onClick={() => onNavigate('readiness')}
            className="flex items-center gap-2.5 bg-white border border-slate-200 hover:border-indigo-300 rounded-xl px-3 py-1.5 shadow-xs cursor-pointer group transition-all"
          >
            <div className="relative w-6 h-6 flex items-center justify-center">
              <svg className="w-6 h-6 transform -rotate-90">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#e2e8f0"
                  strokeWidth="2.5"
                  fill="none"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#6366f1"
                  strokeWidth="2.5"
                  strokeDasharray={2 * Math.PI * 10}
                  strokeDashoffset={2 * Math.PI * 10 * (1 - readiness.overallReadiness / 100)}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-700"
                />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Readiness</div>
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                {readiness.hasEnoughData ? `${readiness.overallReadiness}%` : 'Pending'}
                <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </div>
            </div>
          </div>

          {/* AI Career Coach Quick Button */}
          <button
            onClick={() => onNavigate('coach')}
            className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-medium text-xs px-3.5 py-2 rounded-xl shadow-xs shadow-indigo-500/20 cursor-pointer transition-all hover:shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Career Coach</span>
          </button>
        </div>
      </div>
    </header>
  );
};
