import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Target,
  Cpu,
  Code2,
  Server,
  BarChart3,
  Cloud,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Bot,
  Activity,
  FileText,
  Clock,
  ChevronRight,
  TrendingUp,
  Layers,
  Award,
  Eye,
  Terminal,
  Compass
} from 'lucide-react';
import { CAREER_ROLES } from '../../data/careerRoles';
import { CareerRole } from '../../types';

interface LandingPageProps {
  onStart: (targetRole?: CareerRole) => void;
  onViewExample: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStart,
  onViewExample
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [selectedRole, setSelectedRole] = useState<CareerRole>('AI / ML Engineer');

  const roleIcons: Record<string, React.ReactNode> = {
    'AI / ML Engineer': <Cpu className="w-6 h-6 text-indigo-600" />,
    'Software Engineer': <Code2 className="w-6 h-6 text-indigo-600" />,
    'Backend Developer': <Server className="w-6 h-6 text-indigo-600" />,
    'Data Scientist': <BarChart3 className="w-6 h-6 text-indigo-600" />,
    'Cloud Engineer': <Cloud className="w-6 h-6 text-indigo-600" />,
    'Cybersecurity Analyst': <ShieldCheck className="w-6 h-6 text-indigo-600" />
  };

  const steps = [
    {
      step: '01',
      title: 'PROFILE',
      subtitle: 'Tell SkillForge where you are now',
      description: 'Provide your real background, coursework, projects, or upload your resume for automatic skill extraction.',
      icon: FileText,
      badge: 'Input & Evidence'
    },
    {
      step: '02',
      title: 'ANALYZE',
      subtitle: 'We identify your strengths and skill gaps',
      description: 'Our engine benchmarks your explicit and inferred competencies against senior industry standards.',
      icon: Activity,
      badge: 'Deterministic Gaps'
    },
    {
      step: '03',
      title: 'ASSESS',
      subtitle: 'Step into realistic job scenarios',
      description: 'Tackle timed workplace tasks: triage production incidents, debug code, inspect telemetry logs, or submit architecture plans.',
      icon: Zap,
      badge: 'Timed Workspaces'
    },
    {
      step: '04',
      title: 'EVALUATE',
      subtitle: 'See how your decisions perform',
      description: 'Receive rubric-grounded AI evaluation on technical accuracy, problem solving, reasoning, and practical trade-offs.',
      icon: Award,
      badge: 'Multimodal Feedback'
    },
    {
      step: '05',
      title: 'GROW',
      subtitle: 'Receive your personalized next challenge',
      description: 'SkillForge detects your persistent weaknesses and dynamically adapts your next challenge and career roadmap.',
      icon: TrendingUp,
      badge: 'Adaptive Loop'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/20 to-white text-slate-900 overflow-x-hidden">
      {/* Top Simple Landing Navigation */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 text-xl tracking-tight">
              SKILLFORGE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onViewExample}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 shadow-xs cursor-pointer transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-500" />
            <span>Try Live Demo</span>
          </button>
          <button
            onClick={() => onStart()}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-xs shadow-indigo-500/25 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <span>Discover Your Readiness</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* ======================================================== */}
      {/* HERO SECTION */}
      {/* ======================================================== */}
      <section className="relative w-full max-w-7xl mx-auto px-6 pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI-Powered Career Readiness & Practical Assessment Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
            Don't just prepare for the job.{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">
              Experience it.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            SkillForge analyzes your real skills, identifies what you're missing, and puts you into realistic job scenarios to discover how ready you really are.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onStart()}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-base shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
            >
              <span>Discover Your Readiness</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onViewExample}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-200 hover:border-slate-300 shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Eye className="w-4 h-4 text-indigo-600" />
              <span>Try Live Demo (Alex Carter)</span>
            </button>
          </div>
        </div>

        {/* Interactive Hero Pipeline Visualizer */}
        <div className="mt-16 bg-white border border-slate-200/80 rounded-3xl p-6 lg:p-8 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                The SkillForge Intelligence Journey
              </span>
            </div>
            <div className="text-xs font-medium text-slate-500">
              Interactive Architecture Preview
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              {
                title: 'User Profile & Resume',
                desc: 'Upload actual documents or enter coursework & projects',
                score: 'Verified Evidence',
                color: 'from-blue-500/10 to-indigo-500/10 border-blue-200 text-blue-700'
              },
              {
                title: 'Skill Gap Engine',
                desc: 'Deterministic benchmark against 6 career paths',
                score: 'Coverage & Depth',
                color: 'from-indigo-500/10 to-violet-500/10 border-indigo-200 text-indigo-700'
              },
              {
                title: 'Job Simulation',
                desc: 'Production logs, code fixes, and timed triage tasks',
                score: 'Reverse Countdown',
                color: 'from-violet-500/10 to-purple-500/10 border-violet-200 text-violet-700'
              },
              {
                title: 'Performance Evaluation',
                desc: 'Rubric-based scoring on technical accuracy & reasoning',
                score: 'Actionable Critique',
                color: 'from-purple-500/10 to-pink-500/10 border-purple-200 text-purple-700'
              },
              {
                title: 'Adaptive Growth',
                desc: 'Targeted next challenge bridges your specific gaps',
                score: 'Dynamic Roadmap',
                color: 'from-pink-500/10 to-rose-500/10 border-pink-200 text-pink-700'
              }
            ].map((node, i) => (
              <div
                key={i}
                className="bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-4 transition-all duration-300 hover:shadow-xs group cursor-default"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-slate-400">0{i + 1}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border bg-gradient-to-r ${node.color}`}>
                    {node.score}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                  {node.title}
                </h4>
                <p className="text-xs text-slate-500 leading-snug">
                  {node.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>No signup or login required — instant private local persistence</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Real document processing — zero fake progress numbers</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* HOW IT WORKS SECTION */}
      {/* ======================================================== */}
      <section className="w-full max-w-7xl mx-auto px-6 py-16 border-t border-slate-200/60">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="text-xs font-extrabold uppercase tracking-widest text-indigo-600">
            Intelligent Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How SkillForge Works
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Most career platforms simply check off keywords. SkillForge puts you inside real technical situations and adapts to your performance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {steps.map((s, index) => {
            const Icon = s.icon;
            const isSelected = activeStep === index;
            return (
              <div
                key={s.step}
                onClick={() => setActiveStep(index)}
                className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-500/10'
                    : 'bg-white/70 hover:bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    {s.step}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">{s.badge}</span>
                </div>

                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 mb-3 group-hover:bg-indigo-50">
                  <Icon className="w-5 h-5 text-indigo-600" />
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {s.title}
                </h3>
                <p className="text-xs font-semibold text-slate-700 mb-2">
                  "{s.subtitle}"
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {s.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* CAREER ROLE SELECTION */}
      {/* ======================================================== */}
      <section className="w-full max-w-7xl mx-auto px-6 py-16 border-t border-slate-200/60">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="text-xs font-extrabold uppercase tracking-widest text-indigo-600">
            Target Career Tracks
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Select Your Target Career Path
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Choose your specialization to unlock tailored assessments, skill benchmarks, and personalized career roadmaps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAREER_ROLES.map((role) => {
            const isSelected = selectedRole === role.name;
            return (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role.name)}
                className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-indigo-600 shadow-lg ring-2 ring-indigo-500/10 -translate-y-1'
                    : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                      {roleIcons[role.name] || <Sparkles className="w-6 h-6 text-indigo-600" />}
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {role.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center justify-between">
                    <span>{role.name}</span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {role.description}
                  </p>

                  <div className="mb-4">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Core Assessed Skills
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {role.coreSkills.slice(0, 4).map((s) => (
                        <span
                          key={s.name}
                          className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg"
                        >
                          {s.name}
                        </span>
                      ))}
                      {role.coreSkills.length > 4 && (
                        <span className="text-[11px] font-semibold text-indigo-600 px-1.5 py-0.5">
                          +{role.coreSkills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Market Range</span>
                    <span className="font-bold text-slate-800">{role.salaryRange}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStart(role.name);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Start Track</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* CORE PLATFORM FEATURES */}
      {/* ======================================================== */}
      <section className="w-full max-w-7xl mx-auto px-6 py-16 border-t border-slate-200/60">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Real Resume & Document Analysis
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload PDF, DOCX, or TXT documents. AI extracts verified skills, distinguishes explicit from inferred evidence, and highlights missing competencies without fabrication.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Timed Practical Assessments
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Experience authentic workplace challenges under real reverse countdown timers with production log inspection, code submissions, and ZIP file artifact evaluation.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Connected AI Career Coach
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ask questions backed by your verified local data: why scores were low, what skills to target next, and how to improve your portfolio projects.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* BOTTOM CTA */}
      {/* ======================================================== */}
      <section className="w-full max-w-5xl mx-auto px-6 py-16 mb-12">
        <div className="bg-gradient-to-tr from-indigo-900 via-indigo-800 to-violet-900 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to test your real job readiness?
            </h2>
            <p className="text-indigo-100 text-sm sm:text-base">
              Start by selecting your target role, uploading your resume, and taking your first practical assessment.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onStart(selectedRole)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white text-indigo-900 font-extrabold text-sm shadow-md hover:bg-slate-50 cursor-pointer transition-all"
              >
                Start as {selectedRole}
              </button>
              <button
                onClick={onViewExample}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-indigo-700/50 hover:bg-indigo-700 text-white font-semibold text-sm border border-indigo-400/30 cursor-pointer transition-all"
              >
                View Example Profile
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
