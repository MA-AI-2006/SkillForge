import React from 'react';
import {
  Map,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Zap,
  Clock,
  Layers,
  Target
} from 'lucide-react';
import { CareerRoadmapMilestone, SkillForgeState } from '../../types';
import { DEFAULT_ASSESSMENTS } from '../../data/defaultAssessments';

interface RoadmapViewProps {
  state: SkillForgeState;
  onNavigate: (tab: string, extraData?: any) => void;
  onStartAssessment: (assessmentId: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  state,
  onNavigate,
  onStartAssessment
}) => {
  const targetRole = state.profile.targetRole || 'AI / ML Engineer';

  // Build default roadmap for the role if empty
  const defaultMilestones: CareerRoadmapMilestone[] = [
    {
      id: 'ms-01',
      title: 'Foundational Diagnostics & Triage',
      category: 'Core Competency',
      description: 'Master reading production telemetry logs, detecting schema drift, and assessing performance metrics.',
      skillsTargeted: ['Python', 'Machine Learning Fundamentals'],
      status: state.assessmentSubmissions.length > 0 ? 'completed' : 'recommended_next',
      linkedAssessmentId: 'aiml-01-model-drift-triage',
      estimatedHours: 10
    },
    {
      id: 'ms-02',
      title: 'Packaging & Containerized Microservices',
      category: 'Infrastructure & Serving',
      description: 'Build multi-stage Dockerfiles, configure asynchronous API endpoints, and optimize cold start times.',
      skillsTargeted: ['Docker & Containerization', 'FastAPI / API Serving'],
      status: state.assessmentSubmissions.length > 0 ? 'recommended_next' : 'locked',
      linkedAssessmentId: 'aiml-02-fastapi-inference-optimization',
      estimatedHours: 14
    },
    {
      id: 'ms-03',
      title: 'MLOps Pipeline Automation & Drift Alerting',
      category: 'Production & Reliability',
      description: 'Configure automated model retraining triggers, MLflow registries, and automated canary deployment gates.',
      skillsTargeted: ['MLOps & Pipeline Automation', 'Cloud AI Services & GPUs'],
      status: 'locked',
      estimatedHours: 18
    },
    {
      id: 'ms-04',
      title: 'High-Throughput Vector Retrieval & Search',
      category: 'Databases & Retrieval',
      description: 'Deploy low-latency semantic indexing using vector databases with hybrid keyword/embedding search.',
      skillsTargeted: ['SQL & Vector Databases', 'Python'],
      status: 'locked',
      estimatedHours: 16
    }
  ];

  const milestones = state.roadmap.length > 0 ? state.roadmap : defaultMilestones;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 lg:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Map className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Adaptive Career Path
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Target Career Roadmap
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl">
            A dynamic sequence of milestones tailored for <strong className="text-slate-800">{targetRole}</strong>. As you complete practical simulations, your roadmap evolves.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
            {milestones.filter((m) => m.status === 'completed').length} of {milestones.length} Milestones Achieved
          </span>
        </div>
      </div>

      {/* Roadmap Timeline Nodes */}
      <div className="space-y-4 relative">
        {milestones.map((ms, index) => {
          const isCompleted = ms.status === 'completed';
          const isRecommended = ms.status === 'recommended_next';
          const isLocked = ms.status === 'locked';

          return (
            <div
              key={ms.id}
              className={`p-6 rounded-3xl border transition-all ${
                isCompleted
                  ? 'bg-white border-emerald-200/90 shadow-2xs'
                  : isRecommended
                  ? 'bg-gradient-to-r from-white via-indigo-50/30 to-white border-indigo-500 shadow-md ring-2 ring-indigo-500/10'
                  : 'bg-white/80 border-slate-200/70 opacity-80'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Status Node Icon */}
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-700'
                      : isRecommended
                      ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-500/30'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : isLocked ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {ms.category}
                      </span>
                      {isRecommended && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                          Recommended Next
                        </span>
                      )}
                      {isCompleted && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Verified Complete
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-base text-slate-900">
                      {ms.title}
                    </h3>
                    <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                      {ms.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {ms.skillsTargeted.map((s) => (
                        <span
                          key={s}
                          className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {ms.linkedAssessmentId && (
                    <button
                      onClick={() => onStartAssessment(ms.linkedAssessmentId!)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                        isRecommended
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                          : 'bg-white border border-slate-200 hover:border-indigo-300 text-slate-700'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{isCompleted ? 'Re-take Scenario' : 'Launch Scenario'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
