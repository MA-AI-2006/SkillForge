import React from 'react';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  Award,
  Calendar,
  Layers,
  ArrowRight,
  Activity,
  FileText
} from 'lucide-react';
import { SkillForgeState } from '../../types';

interface ProgressViewProps {
  state: SkillForgeState;
  onNavigate: (tab: string, extraData?: any) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ state, onNavigate }) => {
  const submissions = state.assessmentSubmissions;

  // Calculate real average score
  const avgScore = submissions.length > 0
    ? Math.round(submissions.reduce((sum, s) => sum + (s.evaluation?.overallScore || 0), 0) / submissions.length)
    : 0;

  const totalMinutes = submissions.reduce((sum, s) => sum + Math.round(s.timeSpentSeconds / 60), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 lg:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <TrendingUp className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Verified Progression History
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Performance & Progress Logs
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl">
            Detailed chronological record of your practical simulations, evaluated scores, and verified skill adjustments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('assessments')}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs cursor-pointer transition-colors"
          >
            Take New Assessment
          </button>
        </div>
      </div>

      {/* Honest Empty State if 0 assessments completed */}
      {submissions.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Activity className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            No Assessment History Yet
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            SkillForge never populates fake charts or placeholder trends. Once you complete your first timed workplace simulation, your performance trajectory and rubric scores will appear here.
          </p>
          <button
            onClick={() => onNavigate('assessments')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>Launch First Practical Assessment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Key Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Completed Simulations
              </div>
              <div className="text-3xl font-black text-slate-900">
                {submissions.length}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Total timed workplace tests
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Average Practical Score
              </div>
              <div className="text-3xl font-black text-indigo-600">
                {avgScore}%
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Rubric-grounded average
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Active Assessment Time
              </div>
              <div className="text-3xl font-black text-violet-600">
                {totalMinutes} mins
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Hands-on problem solving
              </div>
            </div>
          </div>

          {/* Chronological Submission History List */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 lg:p-8 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              Verified Submission History
            </h2>

            <div className="space-y-4">
              {submissions.map((sub, idx) => (
                <div
                  key={sub.id}
                  className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:border-indigo-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {sub.targetRole}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(sub.submittedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900">
                      {sub.assessmentTitle}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {sub.evaluation?.specificFeedback}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-black text-indigo-600">
                        {sub.evaluation?.overallScore}%
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">
                        {Math.round(sub.timeSpentSeconds / 60)} mins spent
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigate('assessments', { assessmentId: sub.assessmentId })}
                      className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
