import React from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ArrowRight,
  ShieldCheck,
  Info,
  Layers,
  HelpCircle,
  Clock,
  Target
} from 'lucide-react';
import { SkillForgeState } from '../../types';
import { calculateOverallReadiness, computeSkillGaps } from '../../services/readinessEngine';
import { DEFAULT_ASSESSMENTS } from '../../data/defaultAssessments';

interface ReadinessViewProps {
  state: SkillForgeState;
  onNavigate: (tab: string, extraData?: any) => void;
  onStartAssessment: (assessmentId: string) => void;
}

export const ReadinessView: React.FC<ReadinessViewProps> = ({
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
  const skillGaps = computeSkillGaps(state.skills, targetRole);

  const findAssessmentForSkill = (skillName: string) => {
    return DEFAULT_ASSESSMENTS.find((a) =>
      a.skillsAssessed.some((s) => s.toLowerCase().includes(skillName.toLowerCase()) || skillName.toLowerCase().includes(s.toLowerCase()))
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 lg:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                <Activity className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Deterministic Job Readiness Intelligence
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              Job Readiness Evaluation
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl">
              Transparent, multi-factor career readiness scoring for <strong className="text-slate-800">{targetRole}</strong>. We never estimate scores with vague percentages — every point is grounded in verified evidence.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
            <div className="text-center">
              <div className="text-3xl font-black text-indigo-600">
                {readiness.hasEnoughData ? `${readiness.overallReadiness}%` : 'Pending'}
              </div>
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                Overall Readiness
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transparent Math Breakdown */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 lg:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              Mathematical Formula & Factor Weights
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">100% Deterministic</span>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-950 font-mono flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div>
            <strong>Readiness Formula:</strong> (Profile Completeness × 15%) + (Resume Alignment × 30%) + (Practical Assessment Performance × 55%)
          </div>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pillar 1 (15%)</span>
              <span className="text-lg font-black text-blue-600">{readiness.profileReadiness}%</span>
            </div>
            <h3 className="font-bold text-sm text-slate-900">Profile Foundations</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Education, degree program, portfolio projects, certifications, and explicit self-ratings.
            </p>
            <div className="pt-2 text-[11px] text-slate-400">
              Weight Contribution: {Math.round(readiness.profileReadiness * 0.15)}%
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pillar 2 (30%)</span>
              <span className="text-lg font-black text-indigo-600">
                {state.resumeAnalysis ? `${readiness.resumeReadiness}%` : 'Not Uploaded'}
              </span>
            </div>
            <h3 className="font-bold text-sm text-slate-900">Resume Evidence Alignment</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Verified keywords, project bullets, research/internships, and direct matching with {targetRole}.
            </p>
            <div className="pt-2 text-[11px] text-slate-400">
              Weight Contribution: {Math.round(readiness.resumeReadiness * 0.30)}%
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pillar 3 (55%)</span>
              <span className="text-lg font-black text-violet-600">
                {state.assessmentSubmissions.length > 0 ? `${readiness.practicalReadiness}%` : '0 Completed'}
              </span>
            </div>
            <h3 className="font-bold text-sm text-slate-900">Practical Assessments</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Highest-weighted factor. Timed scenario performance, technical reasoning, log analysis, and code quality.
            </p>
            <div className="pt-2 text-[11px] text-slate-400">
              Weight Contribution: {Math.round(readiness.practicalReadiness * 0.55)}%
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Skill Gap Matrix with Direct Action Triggers */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 lg:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Skill Gap & Assessment Mapping Matrix
            </h2>
            <p className="text-xs text-slate-500">
              Directly launch practical challenges mapped to your specific skill deficiencies.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {skillGaps.length} Target Competencies
          </span>
        </div>

        <div className="space-y-3">
          {skillGaps.map((item) => {
            const mappedAssessment = findAssessmentForSkill(item.name);
            return (
              <div
                key={item.name}
                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:border-indigo-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 md:max-w-md">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900">{item.name}</h3>
                    <span className="text-[10px] font-semibold text-slate-400">({item.category})</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.isStrength
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.isGap
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {item.isStrength ? 'Strength' : item.isGap ? `Gap (-${item.gap})` : 'Satisfied'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>Current Level: <strong className="text-slate-800">{item.currentLevel}/10</strong></span>
                    <span>•</span>
                    <span>Target Required: <strong className="text-indigo-600">{item.requiredLevel}/10</strong></span>
                  </div>
                </div>

                {/* Direct Action Trigger */}
                <div className="flex items-center gap-3">
                  {mappedAssessment ? (
                    <button
                      onClick={() => onStartAssessment(mappedAssessment.id)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Take {mappedAssessment.title.slice(0, 24)}...</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onNavigate('assessments')}
                      className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Browse Related Challenges
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
