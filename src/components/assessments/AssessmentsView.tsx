import React, { useState, useEffect, useRef } from 'react';
import {
  CheckSquare,
  Clock,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  FileText,
  UploadCloud,
  FileCode,
  Code2,
  Play,
  RotateCcw,
  Award,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Download,
  Terminal
} from 'lucide-react';
import {
  AssessmentEvaluation,
  AssessmentSubmission,
  CareerRole,
  PracticalAssessment,
  SkillForgeState,
  UserSkill
} from '../../types';
import { DEFAULT_ASSESSMENTS } from '../../data/defaultAssessments';
import { parseUploadedFile } from '../../utils/fileParser';

interface AssessmentsViewProps {
  state: SkillForgeState;
  activeAssessmentId: string | null;
  onSelectAssessment: (assessmentId: string | null) => void;
  onSubmitAssessment: (submission: AssessmentSubmission, updatedSkills: UserSkill[]) => void;
  onNavigate: (tab: string, extraData?: any) => void;
}

export const AssessmentsView: React.FC<AssessmentsViewProps> = ({
  state,
  activeAssessmentId,
  onSelectAssessment,
  onSubmitAssessment,
  onNavigate
}) => {
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>(state.profile.targetRole || 'all');
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState<string>('all');
  
  // Active Assessment Workspace State
  const [activeAssessment, setActiveAssessment] = useState<PracticalAssessment | null>(null);
  const [answers, setAnswers] = useState<{ questionIndex: number; question: string; answerText: string }[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; type: string; size: number; contentSnippet?: string }[]>([]);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(1200); // 20 mins default
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationStage, setEvaluationStage] = useState<string>('');
  const [activeSubmissionResult, setActiveSubmissionResult] = useState<AssessmentSubmission | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Sync activeAssessmentId prop
  useEffect(() => {
    if (activeAssessmentId) {
      const found = DEFAULT_ASSESSMENTS.find((a) => a.id === activeAssessmentId);
      if (found) {
        startAssessment(found);
      }
    }
  }, [activeAssessmentId]);

  // Reverse Countdown Timer
  useEffect(() => {
    let interval: any = null;
    if (activeAssessment && isTimerRunning && !activeSubmissionResult && !isEvaluating) {
      interval = setInterval(() => {
        setTimeRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            // Auto submit when time runs out
            handleAssessmentSubmit();
            return 0;
          }
          return prev - 1;
        });
        setTimeSpentSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeAssessment, isTimerRunning, activeSubmissionResult, isEvaluating]);

  const startAssessment = (assessment: PracticalAssessment) => {
    setActiveAssessment(assessment);
    setTimeRemainingSeconds(assessment.estimatedMinutes * 60);
    setTimeSpentSeconds(0);
    setIsTimerRunning(true);
    setActiveSubmissionResult(null);

    // Check if previously completed
    const previousSub = state.assessmentSubmissions.find((s) => s.assessmentId === assessment.id);
    if (previousSub) {
      setActiveSubmissionResult(previousSub);
      setAnswers(previousSub.answers);
      setUploadedFiles(previousSub.files || []);
    } else {
      setAnswers(
        assessment.promptQuestions.map((q, idx) => ({
          questionIndex: idx,
          question: q,
          answerText: ''
        }))
      );
      setUploadedFiles([]);
    }
  };

  const handleAnswerChange = (index: number, text: string) => {
    setAnswers((prev) =>
      prev.map((a, i) => (i === index ? { ...a, answerText: text } : a))
    );
  };

  const handleFileUpload = async (file: File) => {
    const parsed = await parseUploadedFile(file);
    setUploadedFiles((prev) => [
      ...prev,
      {
        name: parsed.fileName,
        type: parsed.mimeType,
        size: parsed.fileSize,
        contentSnippet: parsed.extractedText.slice(0, 3000)
      }
    ]);
  };

  const handleAssessmentSubmit = async () => {
    if (!activeAssessment) return;

    try {
      setIsEvaluating(true);
      setIsTimerRunning(false);

      const stages = [
        'Analyzing submission and telemetry diagnosis...',
        'Evaluating technical accuracy and depth...',
        'Checking practical engineering trade-offs...',
        'Scoring against senior industry rubric...',
        'Updating candidate skill level deltas...'
      ];

      let stageIdx = 0;
      setEvaluationStage(stages[0]);
      const stageInterval = setInterval(() => {
        stageIdx = (stageIdx + 1) % stages.length;
        setEvaluationStage(stages[stageIdx]);
      }, 1200);

      const response = await fetch('/api/assessment/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessment: activeAssessment,
          answers,
          files: uploadedFiles,
          timeSpentSeconds: timeSpentSeconds || 60,
          userSkills: state.skills
        })
      });

      clearInterval(stageInterval);

      if (!response.ok) {
        throw new Error('Evaluation failed.');
      }

      const result = await response.json();
      const evaluation: AssessmentEvaluation = result.evaluation;

      const submission: AssessmentSubmission = {
        id: `sub-${Date.now()}`,
        assessmentId: activeAssessment.id,
        assessmentTitle: activeAssessment.title,
        targetRole: activeAssessment.targetRole,
        submittedAt: new Date().toISOString(),
        timeSpentSeconds,
        answers,
        files: uploadedFiles,
        evaluation
      };

      // Update skills based on evaluation deltas
      const updatedSkills: UserSkill[] = [...state.skills];
      (evaluation.skillScoreUpdates || []).forEach((update) => {
        const existingIdx = updatedSkills.findIndex((s) => s.name.toLowerCase() === update.skillName.toLowerCase());
        if (existingIdx >= 0) {
          updatedSkills[existingIdx] = {
            ...updatedSkills[existingIdx],
            currentLevel: update.newScore,
            confidence: 'high',
            lastTestedDate: new Date().toISOString().split('T')[0],
            evidence: [
              ...updatedSkills[existingIdx].evidence,
              {
                source: 'assessment',
                description: `${update.rationale} (Scored ${evaluation.overallScore}% in ${activeAssessment.title})`,
                date: new Date().toISOString().split('T')[0],
                scoreImpact: evaluation.overallScore
              }
            ]
          };
        } else {
          updatedSkills.push({
            name: update.skillName,
            category: 'Core Concepts',
            currentLevel: update.newScore,
            requiredLevel: 7,
            confidence: 'high',
            lastTestedDate: new Date().toISOString().split('T')[0],
            evidence: [
              {
                source: 'assessment',
                description: `Assessed in ${activeAssessment.title} with score ${evaluation.overallScore}%.`,
                date: new Date().toISOString().split('T')[0],
                scoreImpact: evaluation.overallScore
              }
            ]
          });
        }
      });

      setActiveSubmissionResult(submission);
      onSubmitAssessment(submission, updatedSkills);
      setIsEvaluating(false);
    } catch (err: any) {
      console.error('Error submitting assessment:', err);
      setIsEvaluating(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = (seconds: number) => {
    if (seconds <= 120) return 'text-rose-600 bg-rose-50 border-rose-200 animate-pulse';
    if (seconds <= 300) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-indigo-700 bg-indigo-50 border-indigo-200';
  };

  // Filter Catalog
  const filteredAssessments = DEFAULT_ASSESSMENTS.filter((a) => {
    const matchesRole = selectedRoleFilter === 'all' || a.targetRole === selectedRoleFilter;
    const matchesDiff = selectedDifficultyFilter === 'all' || a.difficulty === selectedDifficultyFilter;
    return matchesRole && matchesDiff;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ======================================================== */}
      {/* VIEW MODE: CATALOG */}
      {/* ======================================================== */}
      {!activeAssessment && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 lg:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                  <CheckSquare className="w-5 h-5" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Real Incident Simulations & Workspaces
                </span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                Practical Assessments
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl">
                Experience real workplace tasks: investigate production alerts, debug code, inspect telemetry logs, or submit architecture solutions under timed conditions.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
                {state.assessmentSubmissions.length} of {DEFAULT_ASSESSMENTS.length} Completed
              </span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-bold text-slate-500 mr-1">Role:</span>
              {['all', 'AI / ML Engineer', 'Software Engineer', 'Backend Developer', 'Data Scientist', 'Cloud Engineer', 'Cybersecurity Analyst'].map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRoleFilter(r)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    selectedRoleFilter === r
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {r === 'all' ? 'All Roles' : r}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Difficulty:</span>
              {['all', 'Beginner', 'Intermediate', 'Advanced'].map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDifficultyFilter(d)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    selectedDifficultyFilter === d
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Catalog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssessments.map((item) => {
              const submission = state.assessmentSubmissions.find((s) => s.assessmentId === item.id);
              const isCompleted = !!submission;

              return (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs hover:shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {item.difficulty}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5" /> {item.estimatedMinutes} mins
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 mb-1 leading-snug">
                      {item.title}
                    </h3>
                    <div className="text-xs font-semibold text-indigo-600 mb-3">
                      {item.targetRole}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                      {item.scenarioContext}
                    </p>

                    <div className="space-y-1 mb-4">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Skills Tested
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {item.skillsAssessed.map((s) => (
                          <span
                            key={s}
                            className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    {isCompleted ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-700">
                          Completed: {submission?.evaluation?.overallScore}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Not started</span>
                    )}

                    <button
                      onClick={() => startAssessment(item)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1 transition-colors"
                    >
                      <span>{isCompleted ? 'Review Submission' : 'Launch Workspace'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW MODE: ACTIVE ASSESSMENT WORKSPACE */}
      {/* ======================================================== */}
      {activeAssessment && (
        <div className="space-y-6">
          {/* Top Bar / Navigation */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-4 lg:px-6 shadow-xs flex items-center justify-between">
            <button
              onClick={() => {
                if (!activeSubmissionResult) setShowExitConfirm(true);
                else {
                  setActiveAssessment(null);
                  onSelectAssessment(null);
                }
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Assessment Catalog</span>
            </button>

            {/* Reverse Countdown Timer */}
            {!activeSubmissionResult && (
              <div className="flex items-center gap-3">
                <div className={`px-4 py-1.5 rounded-xl border font-mono font-bold text-sm flex items-center gap-2 ${getTimerColor(timeRemainingSeconds)}`}>
                  <Clock className="w-4 h-4" />
                  <span>{formatTimer(timeRemainingSeconds)}</span>
                </div>
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  {isTimerRunning ? 'Pause' : 'Resume'}
                </button>
              </div>
            )}

            {activeSubmissionResult && (
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-xl border border-emerald-200 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Score: {activeSubmissionResult.evaluation.overallScore}%</span>
              </div>
            )}
          </div>

          {/* Exit Confirmation Modal */}
          {showExitConfirm && (
            <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4">
                <h3 className="font-bold text-base text-slate-900">Leave Active Assessment?</h3>
                <p className="text-xs text-slate-600">
                  Your timer is still running. Do you want to return to the catalog?
                </p>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowExitConfirm(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Stay in Workspace
                  </button>
                  <button
                    onClick={() => {
                      setShowExitConfirm(false);
                      setActiveAssessment(null);
                      onSelectAssessment(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold cursor-pointer"
                  >
                    Exit Workspace
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Evaluating Modal Overlay */}
          {isEvaluating && (
            <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center space-y-4 shadow-2xl border border-indigo-200 animate-pulse">
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto animate-spin">
                  <Zap className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">Evaluating Practical Submission</h3>
                <p className="text-xs font-bold text-indigo-600">{evaluationStage}</p>
                <p className="text-[11px] text-slate-400">
                  Principal engineering AI model is scoring technical accuracy, reasoning, and rubric adherence.
                </p>
              </div>
            </div>
          )}

          {/* EVALUATION RESULTS VIEW (if submitted) */}
          {activeSubmissionResult && (
            <div className="space-y-6">
              {/* Score Banner */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 lg:p-8 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                      Assessment Evaluation Complete
                    </span>
                    <h2 className="text-2xl font-extrabold text-slate-900">
                      {activeAssessment.title}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Completed in {Math.round(activeSubmissionResult.timeSpentSeconds / 60)} minutes • Evaluated against senior rubrics
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-black text-indigo-600">
                        {activeSubmissionResult.evaluation.overallScore}%
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Overall Score
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5-Category Breakdown Bars */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                    <span className="text-[10px] font-bold text-slate-400 block">Tech Accuracy</span>
                    <span className="text-lg font-black text-slate-900">{activeSubmissionResult.evaluation.technicalAccuracy}%</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                    <span className="text-[10px] font-bold text-slate-400 block">Problem Solving</span>
                    <span className="text-lg font-black text-slate-900">{activeSubmissionResult.evaluation.problemSolving}%</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                    <span className="text-[10px] font-bold text-slate-400 block">Practical App</span>
                    <span className="text-lg font-black text-slate-900">{activeSubmissionResult.evaluation.practicalApplication}%</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                    <span className="text-[10px] font-bold text-slate-400 block">Reasoning</span>
                    <span className="text-lg font-black text-slate-900">{activeSubmissionResult.evaluation.reasoning}%</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-bold text-slate-400 block">Communication</span>
                    <span className="text-lg font-black text-slate-900">{activeSubmissionResult.evaluation.communication}%</span>
                  </div>
                </div>
              </div>

              {/* Strengths & Weaknesses 2-col */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                      Observed Technical Strengths
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {activeSubmissionResult.evaluation.strengths.map((str, i) => (
                      <div key={i} className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-slate-800 flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{str}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                      Identified Gaps & Missed Nuances
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {activeSubmissionResult.evaluation.weaknesses.map((w, i) => (
                      <div key={i} className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-xs text-slate-800 flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{w}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Specific Constructive Feedback */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 lg:p-8 shadow-xs space-y-3">
                <h3 className="font-bold text-base text-slate-900">
                  Assessor Feedback & Guidance
                </h3>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {activeSubmissionResult.evaluation.specificFeedback}
                </div>
              </div>

              {/* Skill Score Updates */}
              {activeSubmissionResult.evaluation.skillScoreUpdates && activeSubmissionResult.evaluation.skillScoreUpdates.length > 0 && (
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                      Verified Competency Adjustments
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {activeSubmissionResult.evaluation.skillScoreUpdates.map((update, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                        <div className="font-bold text-xs text-slate-900 mb-1">{update.skillName}</div>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-slate-500">Level {update.previousScore} → <strong>{update.newScore}/10</strong></span>
                          <span className="font-bold text-emerald-600">+{update.delta}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 italic">"{update.rationale}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Adaptive Next Challenge */}
              {activeSubmissionResult.evaluation.recommendedNextChallengeTitle && (
                <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 text-white rounded-3xl p-6 lg:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-xl">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20">
                      Adaptive Loop Recommendation
                    </span>
                    <h3 className="text-xl font-bold">
                      {activeSubmissionResult.evaluation.recommendedNextChallengeTitle}
                    </h3>
                    <p className="text-xs text-indigo-100 leading-relaxed">
                      {activeSubmissionResult.evaluation.recommendedNextChallengeDescription}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setActiveAssessment(null);
                        onSelectAssessment(null);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-xs shadow-xs hover:bg-slate-50 cursor-pointer"
                    >
                      Browse More Challenges
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ACTIVE WORKSPACE QUESTION FORM (if not yet submitted) */}
          {!activeSubmissionResult && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Context, Problem statement, files (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {activeAssessment.difficulty} • {activeAssessment.targetRole}
                    </span>
                    <h2 className="text-lg font-extrabold text-slate-900 mt-2">
                      {activeAssessment.title}
                    </h2>
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <h4 className="text-xs font-bold text-slate-900 mb-1">Scenario Background:</h4>
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                      {activeAssessment.scenarioContext}
                    </p>
                  </div>

                  {activeAssessment.instructions && (
                    <div className="border-t border-slate-100 pt-3">
                      <h4 className="text-xs font-bold text-slate-900 mb-2">Instructions:</h4>
                      <div className="space-y-1.5">
                        {activeAssessment.instructions.map((inst, i) => (
                          <div key={i} className="text-xs text-slate-700 flex items-start gap-2">
                            <span className="font-bold text-indigo-600">{i + 1}.</span>
                            <span>{inst}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeAssessment.resourceFiles && activeAssessment.resourceFiles.length > 0 && (
                    <div className="border-t border-slate-100 pt-3 space-y-2">
                      <h4 className="text-xs font-bold text-slate-900">Incident Artifacts / Data:</h4>
                      {activeAssessment.resourceFiles.map((rf, i) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] space-y-1">
                          <div className="flex items-center justify-between text-slate-400">
                            <span>{rf.name}</span>
                            <span>{rf.type}</span>
                          </div>
                          <pre className="overflow-x-auto text-emerald-400 max-h-36">
                            {rf.content}
                          </pre>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Execution textareas and file uploads (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 lg:p-8 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-base font-bold text-slate-900">
                      Your Technical Response & Diagnosis
                    </h3>
                    <span className="text-xs text-slate-400">
                      Auto-saving in browser
                    </span>
                  </div>

                  {/* Question Prompt Inputs */}
                  <div className="space-y-6">
                    {activeAssessment.promptQuestions.map((q, idx) => (
                      <div key={idx} className="space-y-2">
                        <label className="block text-xs font-bold text-slate-800">
                          <span className="text-indigo-600 mr-1">Q{idx + 1}:</span> {q}
                        </label>
                        <textarea
                          rows={4}
                          value={answers[idx]?.answerText || ''}
                          onChange={(e) => handleAnswerChange(idx, e.target.value)}
                          placeholder="Provide your specific technical explanation, root cause, code fix, or operational steps..."
                          className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500 transition-colors"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Optional File Upload Dropzone */}
                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800">
                      Attach Supporting Code / Logs / Configs (Optional)
                    </h4>
                    <label className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors">
                      <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
                      <span className="text-xs font-semibold text-indigo-600">Upload code script, Dockerfile, or ZIP</span>
                      <span className="text-[10px] text-slate-400">.py, .ts, .yaml, .json, .zip, .sql</span>
                      <input
                        type="file"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileUpload(e.target.files[0]);
                          }
                        }}
                        className="hidden"
                      />
                    </label>

                    {uploadedFiles.length > 0 && (
                      <div className="space-y-1.5">
                        {uploadedFiles.map((f, i) => (
                          <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-800">{f.name} ({(f.size / 1024).toFixed(1)} KB)</span>
                            <span className="text-[10px] text-emerald-600 font-bold">Attached</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit Action */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-[11px] text-slate-400">
                      Elapsed: {Math.floor(timeSpentSeconds / 60)}m {timeSpentSeconds % 60}s
                    </div>

                    <button
                      onClick={handleAssessmentSubmit}
                      disabled={isEvaluating}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-extrabold text-xs shadow-md shadow-indigo-500/25 cursor-pointer flex items-center gap-2 transition-all"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Submit Solution for Evaluation</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
