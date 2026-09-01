import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Bot,
  Send,
  Sparkles,
  UserCheck,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Target,
  FileText,
  Zap,
  HelpCircle
} from 'lucide-react';
import { CoachMessage, SkillForgeState } from '../../types';
import { calculateOverallReadiness, computeSkillGaps } from '../../services/readinessEngine';

interface CoachViewProps {
  state: SkillForgeState;
  onUpdateCoachHistory: (history: CoachMessage[]) => void;
  onNavigate: (tab: string, extraData?: any) => void;
  onStartAssessment: (assessmentId: string) => void;
}

export const CoachView: React.FC<CoachViewProps> = ({
  state,
  onUpdateCoachHistory,
  onNavigate,
  onStartAssessment
}) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const readiness = calculateOverallReadiness(
    state.profile,
    state.skills,
    state.projects.length,
    state.resumeAnalysis,
    state.assessmentSubmissions
  );

  const targetRole = state.profile.targetRole || 'AI / ML Engineer';
  const skillGaps = computeSkillGaps(state.skills, targetRole);
  const topGap = skillGaps.find((g) => g.isGap);
  const topStrength = skillGaps.find((g) => g.isStrength);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.coachHistory, isLoading]);

  const suggestedPrompts = [
    'What is my biggest skill gap right now?',
    'Recommend my next hands-on simulation challenge',
    'How does SkillForge calculate my readiness score?',
    'What evidence is missing from my resume?'
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: CoachMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString()
    };

    const newHistory = [...state.coachHistory, userMsg];
    onUpdateCoachHistory(newHistory);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: newHistory,
          userContext: {
            profile: state.profile,
            skills: state.skills,
            resumeAnalysis: state.resumeAnalysis,
            recentSubmissions: state.assessmentSubmissions,
            targetRole
          }
        })
      });

      if (!response.ok) {
        throw new Error('AI Coach response failed');
      }

      const data = await response.json();
      const aiMsg: CoachMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.text,
        timestamp: new Date().toISOString(),
        contextPills: data.contextPills,
        quickActions: data.quickActions
      };

      onUpdateCoachHistory([...newHistory, aiMsg]);
      setIsLoading(false);
    } catch (err: any) {
      console.error('Error in Coach Chat:', err);
      
      // Smart contextual fallback based on exact prompt
      const q = text.toLowerCase();
      let fallbackText = '';
      if (q.includes('gap') || q.includes('weak') || q.includes('focus')) {
        const gapList = state.skills.filter(s => s.currentLevel < s.requiredLevel);
        if (gapList.length > 0) {
          fallbackText = `### Your Current Skill Gaps for ${targetRole}:\n\n` +
            gapList.map(g => `• **${g.name}** (Current: ${g.currentLevel}/10, Target: ${g.requiredLevel}/10) — Deficit of ${g.requiredLevel - g.currentLevel} pts`).join('\n') +
            `\n\n**Action Plan:** Focus on practical assessments that provide hands-on code and telemetry troubleshooting to quickly close these gaps.`;
        } else {
          fallbackText = `You have strong verified foundation scores across your logged competencies for **${targetRole}**. Focus on taking advanced practical challenges to test production incident handling.`;
        }
      } else if (q.includes('score') || q.includes('readiness') || q.includes('calculate')) {
        fallbackText = `### How SkillForge Calculates Your Verified Readiness (${readiness.overallReadiness}%):\n\n` +
          `1. **Practical Assessments (40% Weight)**: Verified hands-on execution and telemetry diagnostics (${readiness.practicalReadiness}%).\n` +
          `2. **Profile & Skill Benchmarks (35% Weight)**: Competency ratings across requirements (${readiness.profileReadiness}%).\n` +
          `3. **Resume Evidence (25% Weight)**: Extracted career accomplishments and projects (${readiness.resumeReadiness}%).\n\n` +
          `**Calculation Logic:**\n${readiness.calculationRationale}`;
      } else if (q.includes('resume') || q.includes('cv')) {
        fallbackText = state.resumeAnalysis 
          ? `### Resume Insights for ${targetRole} (${state.resumeAnalysis.roleAlignmentScore}% Alignment):\n\n` +
            `**Key Strengths:**\n` + (state.resumeAnalysis.strengths?.map(s => `• ${s}`).join('\n') || '• Core foundations identified.') +
            `\n\n**Areas for Improvement:**\n` + (state.resumeAnalysis.missingEvidence?.map(m => `• ${m}`).join('\n') || '• Add more production metrics and links to code.')
          : `Upload your resume in the **Resume Analysis** tab to get automated extraction of verified competencies, alignment scoring, and tailored feedback!`;
      } else {
        fallbackText = `### Career Coaching Guidance for ${targetRole}:\n\n` +
          `To accelerate your readiness towards **${targetRole}**:\n\n` +
          `• **Deepen Practical Execution:** Focus on diagnosing production incidents, writing clean modular code, and containerizing microservices.\n` +
          `• **Demonstrate Real Evidence:** Complete practical scenario simulations to earn verified skill increases.\n` +
          `• **Current Standing:** Your verified readiness is at **${readiness.overallReadiness}%**. Keep building verified evidence!`;
      }

      const fallbackMsg: CoachMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: fallbackText,
        timestamp: new Date().toISOString(),
        contextPills: [`Target: ${targetRole}`, `Readiness: ${readiness.overallReadiness}%`]
      };
      onUpdateCoachHistory([...newHistory, fallbackMsg]);
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: { label: string; actionType: string; target: string }) => {
    if (action.actionType === 'start_assessment') {
      onStartAssessment(action.target);
    } else if (action.actionType === 'navigate') {
      onNavigate(action.target);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 lg:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Bot className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Connected AI Career Strategist
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            AI Career Coach
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl">
            Directly connected to your verified skills, resume analysis, and practical simulation scores. Ask for strategic guidance, gap analysis, and challenge suggestions.
          </p>
        </div>
      </div>

      {/* Main Layout: Chat (8 cols) + Verified Context Sidebar (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chat Thread (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl shadow-xs flex flex-col h-[650px]">
          {/* Messages Scroll Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {state.coachHistory.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                    isUser
                      ? 'bg-slate-900 text-white'
                      : 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-xs'
                  }`}>
                    {isUser ? 'You' : <Sparkles className="w-4 h-4" />}
                  </div>

                  <div className={`space-y-2 max-w-xl ${isUser ? 'text-right' : 'text-left'}`}>
                    <div
                      className={`p-4 rounded-2xl text-xs leading-relaxed inline-block ${
                        isUser
                          ? 'bg-slate-900 text-white rounded-tr-xs'
                          : 'bg-slate-50 border border-slate-200/70 text-slate-800 rounded-tl-xs text-left'
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-line">{msg.text}</p>
                      ) : (
                        <div className="markdown-body space-y-2 prose prose-xs max-w-none text-slate-800">
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      )}
                    </div>

                    {/* Context Pills */}
                    {msg.contextPills && msg.contextPills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.contextPills.map((pill, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100"
                          >
                            {pill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Quick Action Buttons */}
                    {msg.quickActions && msg.quickActions.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {msg.quickActions.map((act, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleQuickAction(act)}
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200 shadow-2xs cursor-pointer flex items-center gap-1 transition-colors"
                          >
                            <span>{act.label}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 text-xs text-slate-500 font-medium">
                  Reviewing verified candidate profile & generating strategy...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompt Chips */}
          <div className="px-6 py-2 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2 overflow-x-auto">
            {suggestedPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                className="px-3 py-1 rounded-full bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-[11px] font-medium border border-slate-200 whitespace-nowrap cursor-pointer transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Message Input Box */}
          <div className="p-4 border-t border-slate-100 flex items-center gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder={`Ask your AI Coach about ${targetRole} preparation, skill gaps, or assessment advice...`}
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500 bg-slate-50 focus:bg-white transition-colors"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isLoading}
              className="p-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-40 text-white cursor-pointer shadow-xs transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real Candidate Context Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                Connected Candidate Context
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Candidate</span>
                <span className="font-bold text-slate-900">{state.profile.name || 'Anonymous Candidate'}</span>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Target Track</span>
                <span className="font-bold text-indigo-600">{targetRole}</span>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Verified Job Readiness</span>
                <span className="text-base font-black text-slate-900">
                  {readiness.hasEnoughData ? `${readiness.overallReadiness}%` : 'Pending Evidence'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Resume Match Score</span>
                <span className="font-semibold text-slate-800">
                  {state.resumeAnalysis ? `${state.resumeAnalysis.roleAlignmentScore}%` : 'Not uploaded'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Top Strength</span>
                <span className="font-semibold text-emerald-700">
                  {topStrength ? `${topStrength.name} (${topStrength.currentLevel}/10)` : 'None verified yet'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Critical Skill Gap</span>
                <span className="font-semibold text-amber-700">
                  {topGap ? `${topGap.name} (${topGap.currentLevel}/${topGap.requiredLevel})` : 'None detected yet'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Simulations Completed</span>
                <span className="font-semibold text-slate-800">
                  {state.assessmentSubmissions.length} assessments
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={() => onNavigate('readiness')}
                className="w-full py-2 bg-slate-50 hover:bg-indigo-50 text-indigo-700 font-bold text-xs rounded-xl border border-slate-200 hover:border-indigo-200 cursor-pointer transition-colors text-center"
              >
                View Full Readiness Breakdown
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
