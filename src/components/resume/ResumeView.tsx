import React, { useState } from 'react';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Layers,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  Code2,
  Trash2,
  FileCode,
  FileCheck,
  Copy,
  ChevronRight
} from 'lucide-react';
import { CareerRole, ResumeAnalysisResult, SkillForgeState, UserSkill } from '../../types';
import { parseUploadedFile } from '../../utils/fileParser';
import { analyzeResumeClientSide } from '../../services/resumeAnalyzer';
import { CAREER_ROLES } from '../../data/careerRoles';

interface ResumeViewProps {
  state: SkillForgeState;
  onUpdateResumeAnalysis: (analysis: ResumeAnalysisResult) => void;
  onApplyExtractedSkills: (skills: UserSkill[], profileUpdates: any) => void;
  onNavigate: (tab: string) => void;
}

const SAMPLE_RESUMES = [
  {
    title: 'AI / ML Engineer',
    role: 'AI / ML Engineer',
    filename: 'Alex_Chen_AIML_Resume.pdf',
    text: `Alex Chen
San Francisco, CA | alex.chen@example.com | github.com/alexchen-ai

EDUCATION
University of California, Berkeley — B.S. in Computer Science (2020 - 2024)

TECHNICAL SKILLS
Languages: Python, TypeScript, SQL, C++, Bash
Frameworks & Libraries: PyTorch, TensorFlow, Scikit-Learn, Hugging Face Transformers, FastAPI, LangChain, LLM / GenAI
Infrastructure & Cloud: Docker, Kubernetes, AWS (S3, EC2, Lambda), GCP (Vertex AI), MLflow, CI/CD
Databases & Ops: PostgreSQL, Redis, Pinecone (Vector DB), Prometheus & Grafana, Git

EXPERIENCE
Machine Learning Engineer Intern | Synthetix AI (June 2023 - Dec 2023)
- Engineered retrieval-augmented generation (RAG) pipeline using PyTorch, LangChain, and FastAPI, cutting query response latency by 35%.
- Fine-tuned transformer models using Hugging Face and PyTorch on domain datasets.
- Containerized model inference services with Docker and deployed to Kubernetes clusters on AWS.

PROJECTS
OpenSource Vision & LLM Profiler | Python, PyTorch, Docker
- Built real-time inference and evaluation benchmark suite using PyTorch and OpenCV.
- Implemented automated CI/CD evaluation pipelines with GitHub Actions and MLflow tracking.`
  },
  {
    title: 'Full Stack Developer',
    role: 'Full Stack Developer',
    filename: 'Maya_Lin_FullStack_Resume.pdf',
    text: `Maya Lin
Austin, TX | maya.lin@example.com | github.com/mayalin-dev

EDUCATION
University of Washington — B.S. in Software Engineering (2019 - 2023)

TECHNICAL SKILLS
Languages: TypeScript, JavaScript, Python, SQL, HTML & CSS
Frontend: React, Next.js, Tailwind CSS, Redux, Zustand
Backend: Node.js, Express, FastAPI, GraphQL, REST APIs, System Design
Databases & Cloud: PostgreSQL, MongoDB, Redis, AWS (S3, CloudFront), Docker, CI/CD, Git

EXPERIENCE
Full Stack Software Developer | Nexus Cloud Solutions (Aug 2023 - Present)
- Developed responsive React and Next.js web applications handling 50k+ daily active users.
- Built scalable REST and GraphQL microservices in Node.js and TypeScript connected to PostgreSQL.
- Implemented Redis caching layers reducing database query loads by 45%.
- Automated continuous integration and deployment with Docker and GitHub Actions.

PROJECTS
Distributed Task Manager | React, TypeScript, Node.js, Docker
- Architected collaborative workspace with real-time updates and role-based permissions.`
  },
  {
    title: 'DevOps & Cloud Engineer',
    role: 'DevOps & Cloud Platform Engineer',
    filename: 'David_Kim_DevOps_Resume.pdf',
    text: `David Kim
Seattle, WA | david.kim@example.com | github.com/davidkim-ops

EDUCATION
University of Illinois Urbana-Champaign — B.S. in Computer Engineering (2019 - 2023)

TECHNICAL SKILLS
Cloud & Infrastructure: AWS, GCP, Terraform, Kubernetes, Docker, Helm, Linux & Shell, CI/CD
Automation & Languages: Python, Go, Bash, Git, REST APIs
Observability & Security: Prometheus & Grafana, Datadog, Incident Response, System Design, Cybersecurity

EXPERIENCE
Cloud Platform Engineer | CloudSphere Technologies (July 2023 - Present)
- Managed multi-region Kubernetes clusters on AWS EKS using Terraform Infrastructure-as-Code.
- Built automated CI/CD pipelines deploying containerized microservices to production runtimes.
- Configured Prometheus and Grafana alerting dashboards for service telemetry and incident triage.
- Reduced infrastructure provisioning lead time by 60% through reusable Terraform modules.`
  }
];

export const ResumeView: React.FC<ResumeViewProps> = ({
  state,
  onUpdateResumeAnalysis,
  onApplyExtractedSkills,
  onNavigate
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pasteTextMode, setPasteTextMode] = useState(false);
  const [rawText, setRawText] = useState('');
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const targetRole = state.profile.targetRole || 'AI / ML Engineer';

  const stages = [
    'Reading and extracting document streams...',
    'Analyzing candidate background & education...',
    'Identifying explicit technical competencies...',
    `Benchmarking against ${targetRole} industry standards...`,
    'Detecting missing evidence & practical gaps...',
    'Synthesizing verified career readiness report...'
  ];

  const processResumeContent = async (text: string, fileName: string) => {
    try {
      setIsProcessing(true);
      setErrorMessage(null);
      setAppliedSuccess(false);

      // Cycle animated progress stages
      let stageIndex = 0;
      setProcessingStage(stages[0]);
      const stageInterval = setInterval(() => {
        stageIndex = (stageIndex + 1) % stages.length;
        setProcessingStage(stages[stageIndex]);
      }, 1000);

      let analysisResult: ResumeAnalysisResult | null = null;

      // 1. First try backend API if reachable
      try {
        const response = await fetch('/api/resume/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resumeText: text,
            fileName,
            targetRole
          })
        });

        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            analysisResult = await response.json();
          }
        }
      } catch (networkErr) {
        console.warn('Backend /api/resume/analyze unavailable, utilizing client engine:', networkErr);
      }

      clearInterval(stageInterval);

      // 2. If backend was not reached or returned non-JSON, use client engine
      if (!analysisResult) {
        analysisResult = analyzeResumeClientSide(text, fileName, targetRole);
      }

      onUpdateResumeAnalysis(analysisResult);
      setIsProcessing(false);
      setPasteTextMode(false);
    } catch (err: any) {
      console.error('Error processing resume:', err);
      setIsProcessing(false);
      setErrorMessage(err.message || 'Failed to process resume. Please try again or paste resume text.');
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setIsProcessing(true);
      setErrorMessage(null);
      setAppliedSuccess(false);
      setProcessingStage('Reading and extracting document...');

      const parsed = await parseUploadedFile(file);
      
      if (!parsed.extractedText || parsed.extractedText.trim().length < 15) {
        setIsProcessing(false);
        setErrorMessage(`Could not extract readable text from "${file.name}". Please ensure it is not password-protected, or paste your resume text below.`);
        return;
      }

      await processResumeContent(parsed.extractedText, parsed.fileName);
    } catch (err: any) {
      console.error('File parsing failed:', err);
      setIsProcessing(false);
      setErrorMessage('Could not read file. Please try pasting your resume text.');
    }
  };

  const handlePastedTextSubmit = async () => {
    if (!rawText || rawText.trim().length < 25) {
      setErrorMessage('Please paste at least a few sentences of your resume or CV.');
      return;
    }
    await processResumeContent(rawText, 'Pasted_Resume.txt');
  };

  const handleLoadSample = async (sample: typeof SAMPLE_RESUMES[0]) => {
    await processResumeContent(sample.text, sample.filename);
  };

  const handleApplyToProfile = () => {
    if (!state.resumeAnalysis) return;

    const extracted = state.resumeAnalysis;
    const newSkills: UserSkill[] = extracted.extractedSkills.map((s) => ({
      name: s.name,
      category: s.category || 'Languages',
      currentLevel: s.evidenceType === 'explicit' ? 6 : 4,
      requiredLevel: 7,
      confidence: s.evidenceType === 'explicit' ? 'high' : 'medium',
      evidence: [
        {
          source: 'resume',
          description: s.snippet || `Extracted from uploaded resume (${s.evidenceType} evidence).`,
          date: new Date().toISOString().split('T')[0]
        }
      ]
    }));

    const profileUpdates = {
      name: extracted.extractedProfile?.name || state.profile.name,
      education: extracted.extractedProfile?.education || state.profile.education,
      university: extracted.extractedProfile?.university || state.profile.university,
      degree: extracted.extractedProfile?.degree || state.profile.degree,
      bio: extracted.extractedProfile?.summary || state.profile.bio
    };

    onApplyExtractedSkills(newSkills, profileUpdates);
    setAppliedSuccess(true);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 lg:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                <FileText className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Real Evidence Ingestion
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              Analyze Your Real Resume
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl">
              Upload your actual resume (PDF, DOCX, DOC, TXT, MD). SkillForge maps your verified competencies, distinguishes explicit from inferred skills, and detects gaps against {targetRole}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPasteTextMode(!pasteTextMode)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
            >
              {pasteTextMode ? 'Switch to File Upload' : 'Paste Resume Text'}
            </button>
          </div>
        </div>
      </div>

      {/* Upload Dropzone or Text Input */}
      {!pasteTextMode ? (
        <div className="space-y-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileUpload(e.dataTransfer.files[0]);
              }
            }}
            className={`bg-white border-2 border-dashed rounded-3xl p-8 lg:p-12 text-center transition-all ${
              isDragging
                ? 'border-indigo-600 bg-indigo-50/50 scale-[1.01]'
                : 'border-slate-300 hover:border-indigo-400'
            }`}
          >
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-2xs">
                <UploadCloud className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Upload your resume
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Drag and drop your PDF or Word document here, or click to browse
                </p>
              </div>

              <div className="flex items-center justify-center gap-3">
                <label className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs cursor-pointer transition-colors inline-block">
                  <span>Browse Files</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.md,.rtf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="text-[11px] text-slate-400 pt-2">
                Supported Formats: PDF, DOCX, DOC, TXT, MD, RTF • Max 15MB • Client & Server Secure Processing
              </div>
            </div>
          </div>

          {/* Quick Sample Resumes for 1-Click Testing */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Want to test immediately? Try a sample verified resume:
              </span>
              <span className="text-[11px] text-slate-400">1-click instant analysis</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SAMPLE_RESUMES.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLoadSample(sample)}
                  disabled={isProcessing}
                  className="p-2.5 rounded-xl bg-white border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/40 text-left transition-all cursor-pointer flex items-center justify-between group disabled:opacity-50"
                >
                  <div className="overflow-hidden">
                    <div className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 truncate">
                      {sample.title}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {sample.filename}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 shrink-0 ml-1" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 lg:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Paste Raw Resume / CV Content
            </h3>
            <span className="text-xs text-slate-400">Plain text format</span>
          </div>

          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={10}
            placeholder="Paste your education, work experience, technical projects, and skills here..."
            className="w-full p-4 rounded-2xl border border-slate-200 text-xs font-mono text-slate-800 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500 transition-colors resize-y"
          />

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setPasteTextMode(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handlePastedTextSubmit}
              disabled={isProcessing || rawText.trim().length < 25}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs cursor-pointer shadow-xs transition-colors"
            >
              Analyze Pasted Content
            </button>
          </div>
        </div>
      )}

      {/* Processing Animation */}
      {isProcessing && (
        <div className="bg-white border border-indigo-200 rounded-3xl p-8 text-center space-y-4 shadow-sm animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto animate-spin">
            <RefreshCw className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Analyzing Your Resume
          </h3>
          <p className="text-xs font-semibold text-indigo-600">
            {processingStage}
          </p>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-xs font-bold underline cursor-pointer ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Analysis Results Display */}
      {state.resumeAnalysis && !isProcessing && (
        <div className="space-y-6">
          {/* Alignment Banner */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 lg:p-8 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Target Role Alignment
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {state.resumeAnalysis.targetRole}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {state.resumeAnalysis.fileName}
                </h2>
                <p className="text-xs text-slate-500">
                  Analyzed on {new Date(state.resumeAnalysis.uploadedAt).toLocaleString()} • {state.resumeAnalysis.extractedSkills.length} verified technical skills detected
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-black text-indigo-600">
                    {state.resumeAnalysis.roleAlignmentScore}%
                  </div>
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                    Role Alignment
                  </div>
                </div>

                <button
                  onClick={handleApplyToProfile}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Sync to My Profile</span>
                </button>
              </div>
            </div>

            {appliedSuccess && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Successfully synced extracted skills and education to your profile!</span>
              </div>
            )}

            {/* Summary */}
            <div className="pt-6 text-xs text-slate-700 leading-relaxed">
              <h4 className="font-bold text-slate-900 mb-1">Executive Summary:</h4>
              <p className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                {state.resumeAnalysis.rawSummary}
              </p>
            </div>
          </div>

          {/* Strengths and Gaps 2-column breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                  Demonstrated Resume Strengths
                </h3>
              </div>
              <div className="space-y-2">
                {state.resumeAnalysis.strengths.map((str, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-slate-800 flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{str}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Evidence / Gaps */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                  Missing or Weak Evidence
                </h3>
              </div>
              <div className="space-y-2">
                {state.resumeAnalysis.missingEvidence.map((gap, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-xs text-slate-800 flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{gap}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Extracted Skills List */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                  Extracted Technical Skills ({state.resumeAnalysis.extractedSkills.length})
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                Explicit vs Inferred Evidence
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {state.resumeAnalysis.extractedSkills.map((sk, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-slate-900">{sk.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      sk.evidenceType === 'explicit'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {sk.evidenceType}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 italic line-clamp-2">
                    "{sk.snippet}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
