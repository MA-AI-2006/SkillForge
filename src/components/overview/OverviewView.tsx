import React from 'react';
import {
  Sparkles,
  Activity,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UserCheck,
  CheckSquare,
  TrendingUp,
  Target,
  Clock,
  Layers,
  ChevronRight,
  ShieldCheck,
  HelpCircle,
  Zap
} from 'lucide-react';
import { SkillForgeState } from '../../types';
import { calculateOverallReadiness, computeSkillGaps } from '../../services/readinessEngine';
import { DEFAULT_ASSESSMENTS } from '../../data/defaultAssessments';

interface OverviewViewProps {
  state: SkillForgeState;
  onNavigate: (tab: string, extraData?: any) => void;
  onStartAssessment: (assessmentId: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  state,
  onNavigate,
  onStartAssessment
}) => {
  const readiness = calculateOverallReadiness(
    state.profile,
    state.skills,
    state.projects.length,
    state.resumeAnalysis,
    state.assessmentSubmissions
  );

  const targetRole = state.profile.targetRole || 'AI / ML Engineer';
  const skillGaps = computeSkillGaps(state.skills, state.profile.targetRole || undefined);
  const strengths = skillGaps.filter((g) => g.isStrength);
  const gaps = skillGaps.filter((g) => g.isGap);

  // Find next recommended assessment
  const roleAssessments = DEFAULT_ASSESSMENTS.filter((a) => !state.profile.targetRole || a.targetRole === state.profile.targetRole);
  const completedIds = new Set(state.assessmentSubmissions.map((s) => s.assessmentId));
  const nextAssessment = roleAssessments.find((a) => !completedIds.has(a.id)) || roleAssessments[0];

  const recentEvaluations = state.assessmentSubmissions.slice(-3).reverse();

  // If brand new user with 0 completed activities
  const isBrandNew = !state.resumeAnalysis && state.skills.length === 0 && state.assessmentSubmissions.length === 0 && !state.profile.name;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 lg:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" /> Target: {targetRole}
            </span>
            {isBrandNew && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                New Candidate Journey
              </span>
            )}
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            {state.profile.name ? `Welcome back, ${state.profile.name}` : 'Welcome to SkillForge'}
          </h1>
          <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
            {isBrandNew
              ? 'Your career readiness journey begins here. SkillForge evaluates your real verified background, resume evidence, and practical task execution.'
              : `Tracking real verified competencies for ${targetRole}. Complete practical assessments to improve your score.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('resume')}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 hover:border-slate-300 shadow-2xs cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Upload Resume</span>
          </button>
          <button
            onClick={() => onNavigate('assessments')}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs shadow-indigo-500/20 cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <CheckSquare className="w-4 h-4" />
            <span>Practical Assessments</span>
          </button>
        </div>
      </div>

      {/* Brand New User Guided Action Steps */}
      {isBrandNew && (
        <div className="bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-white border border-indigo-100 rounded-3xl p-6 lg:p-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Start Your Verified Readiness Assessment
            </h2>
          </div>
          <p className="text-xs text-slate-600 mb-6 max-w-xl">
            SkillForge never invents fake scores. Complete these 4 steps to generate your first mathematically verified job readiness profile:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div 
              onClick={() => onNavigate('resume')}
              className="bg-white hover:bg-indigo-50/40 border border-slate-200 hover:border-indigo-300 rounded-2xl p-5 cursor-pointer transition-all group shadow-2xs"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs mb-3 group-hover:scale-105 transition-transform">
                1
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1 group-hover:text-indigo-600">
                Upload Real Resume
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Let AI extract your explicit skills, coursework, and projects.
              </p>
              <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                Upload now <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            <div 
              onClick={() => onNavigate('profile')}
              className="bg-white hover:bg-indigo-50/40 border border-slate-200 hover:border-indigo-300 rounded-2xl p-5 cursor-pointer transition-all group shadow-2xs"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs mb-3 group-hover:scale-105 transition-transform">
                2
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1 group-hover:text-indigo-600">
                Complete Profile
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Specify your education, career goals, and portfolio projects.
              </p>
              <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                Edit profile <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            <div 
              onClick={() => onNavigate('skills')}
              className="bg-white hover:bg-indigo-50/40 border border-slate-200 hover:border-indigo-300 rounded-2xl p-5 cursor-pointer transition-all group shadow-2xs"
            >
              <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-xs mb-3 group-hover:scale-105 transition-transform">
                3
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1 group-hover:text-indigo-600">
                Benchmark Skills
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Identify your exact skill gaps against {targetRole} requirements.
              </p>
              <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                View matrix <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            <div 
              onClick={() => onNavigate('assessments')}
              className="bg-white hover:bg-indigo-50/40 border border-slate-200 hover:border-indigo-300 rounded-2xl p-5 cursor-pointer transition-all group shadow-2xs"
            >
              <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-xs mb-3 group-hover:scale-105 transition-transform">
                4
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1 group-hover:text-indigo-600">
                Take Assessment
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Test hands-on problem solving under real timed workplace scenarios.
              </p>
              <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                Start challenge <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Asymmetric Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Big Circular Readiness Gauge (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-6 lg:p-8 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Overall Job Readiness
              </span>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                readiness.status === 'Job Ready'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : readiness.status === 'Approaching Target'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : readiness.status === 'Developing Readiness'
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {readiness.status}
              </span>
            </div>

            {/* Circular Gauge */}
            <div className="py-6 flex flex-col items-center justify-center">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="82"
                    stroke="#f1f5f9"
                    strokeWidth="14"
                    fill="none"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="82"
                    stroke="url(#readinessGradient)"
                    strokeWidth="14"
                    strokeDasharray={2 * Math.PI * 82}
                    strokeDashoffset={2 * Math.PI * 82 * (1 - readiness.overallReadiness / 100)}
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="readinessGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                    {readiness.hasEnoughData ? `${readiness.overallReadiness}%` : '0%'}
                  </span>
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-600 mt-1">
                    {readiness.hasEnoughData ? 'Verified Ready' : 'Pending Evidence'}
                  </span>
                </div>
              </div>
            </div>

            {/* Human-friendly explanation */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-600 leading-relaxed">
              <p>{readiness.calculationRationale}</p>
            </div>
          </div>

          {/* Three Component Breakdown Bars */}
          <div className="pt-6 border-t border-slate-100 mt-6 space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600">Profile Foundations (15%)</span>
                <span className="text-slate-900 font-bold">{readiness.profileReadiness}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                  style={{ width: `${readiness.profileReadiness}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600">Resume Alignment (30%)</span>
                <span className="text-slate-900 font-bold">
                  {state.resumeAnalysis ? `${readiness.resumeReadiness}%` : 'Not uploaded'}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                  style={{ width: `${readiness.resumeReadiness}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600">Practical Assessments (55%)</span>
                <span className="text-slate-900 font-bold">
                  {state.assessmentSubmissions.length > 0 ? `${readiness.practicalReadiness}%` : '0 completed'}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-violet-500 rounded-full transition-all duration-500" 
                  style={{ width: `${readiness.practicalReadiness}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Skills & Next Challenge (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Recommended Next Challenge Card */}
          {nextAssessment && (
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/15 text-indigo-100 border border-white/20">
                  <Zap className="w-3 h-3 text-amber-300" /> Recommended Practical Assessment
                </span>
                <span className="text-xs text-indigo-200 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5" /> {nextAssessment.estimatedMinutes} mins
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">
                {nextAssessment.title}
              </h3>
              <p className="text-xs text-indigo-100/90 leading-relaxed mb-4 line-clamp-2">
                {nextAssessment.scenarioContext}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {nextAssessment.skillsAssessed.slice(0, 3).map((s) => (
                    <span key={s} className="text-[10px] font-semibold bg-white/10 px-2 py-0.5 rounded-md border border-white/15">
                      {s}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => onStartAssessment(nextAssessment.id)}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-indigo-900 font-extrabold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <span>Launch Assessment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Strongest Skills vs Critical Gaps Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Strongest Verified Skills */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                    Verified Strengths ({strengths.length})
                  </h3>
                </div>
                <button
                  onClick={() => onNavigate('skills')}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                >
                  View all
                </button>
              </div>

              {strengths.length > 0 ? (
                <div className="space-y-2.5">
                  {strengths.slice(0, 3).map((s) => (
                    <div key={s.name} className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{s.name}</span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {s.currentLevel} / 10
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-xs text-slate-400">
                  No verified strengths yet. Upload your resume or take an assessment.
                </div>
              )}
            </div>

            {/* Critical Skill Gaps */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                    Critical Gaps ({gaps.length})
                  </h3>
                </div>
                <button
                  onClick={() => onNavigate('readiness')}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                >
                  View gaps
                </button>
              </div>

              {gaps.length > 0 ? (
                <div className="space-y-2.5">
                  {gaps.slice(0, 3).map((g) => (
                    <div key={g.name} className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{g.name}</span>
                      <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        {g.currentLevel} / {g.requiredLevel} (-{g.gap})
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-xs text-slate-400">
                  Select a target role or benchmark skills to reveal gaps.
                </div>
              )}
            </div>
          </div>

          {/* Recent Assessment Performance Logs */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                  Recent Practical Submissions ({state.assessmentSubmissions.length})
                </h3>
              </div>
              <button
                onClick={() => onNavigate('progress')}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                Full history
              </button>
            </div>

            {recentEvaluations.length > 0 ? (
              <div className="space-y-2.5">
                {recentEvaluations.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs hover:bg-slate-100/70 transition-colors"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900">{sub.assessmentTitle}</h4>
                      <p className="text-[11px] text-slate-500">
                        {new Date(sub.submittedAt).toLocaleDateString()} • {Math.round(sub.timeSpentSeconds / 60)} mins
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                        {sub.evaluation?.overallScore || 'Pending'}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">
                No practical assessments completed yet. Launch a scenario above to test your skills!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
