import React from 'react';
import {
  LayoutDashboard,
  UserCheck,
  FileText,
  Layers,
  Activity,
  CheckSquare,
  TrendingUp,
  Map,
  Bot,
  Settings,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { SkillForgeState } from '../../types';
import { calculateOverallReadiness } from '../../services/readinessEngine';

interface SidebarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  state: SkillForgeState;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  isOpen,
  onClose,
  state
}) => {
  const readiness = calculateOverallReadiness(
    state.profile,
    state.skills,
    state.projects.length,
    state.resumeAnalysis,
    state.assessmentSubmissions
  );

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: null },
    { id: 'profile', label: 'My Profile', icon: UserCheck, badge: state.profile.name ? 'Ready' : null },
    { id: 'resume', label: 'Resume', icon: FileText, badge: state.resumeAnalysis ? 'Analyzed' : 'Upload' },
    { id: 'skills', label: 'Skills', icon: Layers, badge: state.skills.length > 0 ? `${state.skills.length}` : null },
    { id: 'readiness', label: 'Readiness', icon: Activity, badge: readiness.hasEnoughData ? `${readiness.overallReadiness}%` : null },
    { id: 'assessments', label: 'Assessments', icon: CheckSquare, badge: state.assessmentSubmissions.length > 0 ? `${state.assessmentSubmissions.length} done` : 'Start' },
    { id: 'progress', label: 'Progress', icon: TrendingUp, badge: null },
    { id: 'roadmap', label: 'Career Roadmap', icon: Map, badge: null },
    { id: 'coach', label: 'AI Career Coach', icon: Bot, badge: 'Live AI', highlight: true }
  ];

  const bottomItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Methodology', icon: HelpCircle }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Logo & Brand Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div 
              onClick={() => { onNavigate('overview'); onClose(); }}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-xs shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-extrabold text-slate-900 text-base tracking-tight leading-none">
                  SKILLFORGE
                </h1>
                <p className="text-[10px] font-medium text-slate-400 mt-1">
                  Experience Career Readiness
                </p>
              </div>
            </div>
          </div>

          {/* Primary Navigation */}
          <div className="px-3 py-4 space-y-1 flex-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Core Platform
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? item.highlight
                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xs shadow-indigo-500/25'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200/60 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? (item.highlight ? 'text-white' : 'text-indigo-600') : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? item.highlight
                            ? 'bg-white/20 text-white'
                            : 'bg-indigo-100 text-indigo-700'
                          : item.highlight
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Practical Assessment Quick Launch Callout */}
          <div className="px-4 py-3 m-3 bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-pink-50/40 border border-indigo-100 rounded-2xl">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 mb-1">
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
              <span>Practical Assessment</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed mb-2.5">
              Verify your technical readiness with a timed real-world scenario.
            </p>
            <button
              onClick={() => {
                onNavigate('assessments');
                onClose();
              }}
              className="w-full py-1.5 px-3 bg-white hover:bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 flex items-center justify-center gap-1 shadow-2xs cursor-pointer transition-colors"
            >
              <span>Take Assessment</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Bottom Settings / Help */}
          <div className="p-3 border-t border-slate-100 space-y-1">
            {bottomItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-2 px-3 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" /> Private Local Data
              </span>
              <span>v1.0</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
