import React from 'react';
import {
  HelpCircle,
  ShieldCheck,
  Zap,
  Activity,
  CheckCircle2,
  Lock,
  Layers,
  FileText
} from 'lucide-react';

export const HelpView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 lg:p-8 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
            <HelpCircle className="w-5 h-5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Platform Methodology & FAQ
          </span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
          How SkillForge Works & Evaluates
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Understanding the science, formulas, and rubrics behind AI career readiness verification.
        </p>
      </div>

      {/* FAQ Sections */}
      <div className="space-y-4">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-2">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            How is Job Readiness calculated?
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            SkillForge uses a deterministic 3-factor formula:
            <br />
            <strong>(Profile Completeness × 15%) + (Resume Evidence Alignment × 30%) + (Practical Assessment Score × 55%)</strong>.
            <br />
            We heavily weigh practical simulations because genuine workplace execution (analyzing production incidents, diagnosing schema drift, writing optimized code) is the true measure of job readiness.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-2">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            How does SkillForge parse resumes?
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            When you upload a PDF, DOCX, or text file, our server-side AI model extracts candidate background, coursework, and technical skills while strictly distinguishing between <strong>explicit evidence</strong> (directly stated) and <strong>inferred competencies</strong>. We benchmark this directly against the selected target role to uncover missing evidence.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-2">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-600" />
            What happens during a Practical Assessment?
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Assessments put you in realistic engineering scenarios. You're given production logs, incident tickets, or codebases under a reverse countdown timer. Upon submission, an AI Assessor grades technical accuracy, problem solving, practical application, and reasoning against senior industry rubrics.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-2">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            Where is my data stored?
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            All your profile details, uploaded resumes, and simulation submissions are stored locally in your browser's persistent storage. You can export or reset your data at any time via the Settings tab.
          </p>
        </div>
      </div>
    </div>
  );
};
