import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { OverviewView } from './components/overview/OverviewView';
import { ProfileView } from './components/profile/ProfileView';
import { ResumeView } from './components/resume/ResumeView';
import { SkillsView } from './components/skills/SkillsView';
import { ReadinessView } from './components/readiness/ReadinessView';
import { AssessmentsView } from './components/assessments/AssessmentsView';
import { ProgressView } from './components/progress/ProgressView';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { CoachView } from './components/coach/CoachView';
import { SettingsView } from './components/settings/SettingsView';
import { HelpView } from './components/help/HelpView';
import {
  AssessmentSubmission,
  CareerRole,
  ProjectItem,
  ResumeAnalysisResult,
  SkillForgeState,
  UserProfile,
  UserSkill
} from './types';
import {
  getExampleState,
  getInitialState,
  loadState,
  saveState
} from './services/storageService';

export function App() {
  const [state, setState] = useState<SkillForgeState>(() => loadState());
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [isLandingPage, setIsLandingPage] = useState<boolean>(() => {
    // If state is completely empty with no target role selected, show landing page first
    return !state.profile.targetRole && !state.profile.name;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isExampleMode, setIsExampleMode] = useState<boolean>(false);
  const [activeAssessmentId, setActiveAssessmentId] = useState<string | null>(null);

  // Sync to local storage whenever state changes (unless in temporary example preview)
  useEffect(() => {
    if (!isExampleMode) {
      saveState(state);
    }
  }, [state, isExampleMode]);

  // Navigate handler
  const handleNavigate = (tab: string, extraData?: any) => {
    setCurrentTab(tab);
    setIsLandingPage(false);
    if (extraData?.assessmentId) {
      setActiveAssessmentId(extraData.assessmentId);
    } else if (tab !== 'assessments') {
      setActiveAssessmentId(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Start from Landing page
  const handleStartFromLanding = (role?: CareerRole) => {
    if (role) {
      const updatedProfile = {
        ...state.profile,
        targetRole: role,
        updatedAt: new Date().toISOString()
      };
      const newState = { ...state, profile: updatedProfile };
      setState(newState);
    }
    setIsLandingPage(false);
    setCurrentTab('overview');
  };

  // View Example Mode
  const handleViewExample = () => {
    const exampleState = getExampleState();
    setState(exampleState);
    setIsExampleMode(true);
    setIsLandingPage(false);
    setCurrentTab('overview');
  };

  const handleExitExample = () => {
    setIsExampleMode(false);
    const restored = loadState();
    setState(restored);
  };

  // Role change handler
  const handleRoleChange = (role: CareerRole) => {
    const updatedProfile: UserProfile = {
      ...state.profile,
      targetRole: role,
      updatedAt: new Date().toISOString()
    };
    setState((prev) => ({ ...prev, profile: updatedProfile }));
  };

  // Profile update handler
  const handleUpdateProfile = (profile: UserProfile) => {
    setState((prev) => ({ ...prev, profile }));
  };

  // Skills update handler
  const handleUpdateSkills = (skills: UserSkill[]) => {
    setState((prev) => ({ ...prev, skills }));
  };

  // Projects update handler
  const handleUpdateProjects = (projects: ProjectItem[]) => {
    setState((prev) => ({ ...prev, projects }));
  };

  // Resume analysis update handler
  const handleUpdateResumeAnalysis = (analysis: ResumeAnalysisResult) => {
    setState((prev) => ({
      ...prev,
      resumeAnalysis: analysis,
      profile: {
        ...prev.profile,
        targetRole: analysis.targetRole || prev.profile.targetRole || 'AI / ML Engineer'
      }
    }));
  };

  // Sync extracted skills and profile from resume
  const handleApplyExtractedSkills = (newSkills: UserSkill[], profileUpdates: any) => {
    setState((prev) => {
      // Merge skills avoiding duplicates
      const merged = [...prev.skills];
      newSkills.forEach((ns) => {
        if (!merged.some((s) => s.name.toLowerCase() === ns.name.toLowerCase())) {
          merged.push(ns);
        }
      });

      return {
        ...prev,
        skills: merged,
        profile: {
          ...prev.profile,
          ...profileUpdates,
          updatedAt: new Date().toISOString()
        }
      };
    });
  };

  // Practical assessment submission handler
  const handleSubmitAssessment = (submission: AssessmentSubmission, updatedSkills: UserSkill[]) => {
    setState((prev) => ({
      ...prev,
      assessmentSubmissions: [
        ...prev.assessmentSubmissions.filter((s) => s.assessmentId !== submission.assessmentId),
        submission
      ],
      skills: updatedSkills
    }));
  };

  // Start specific assessment
  const handleStartAssessment = (assessmentId: string) => {
    setActiveAssessmentId(assessmentId);
    setCurrentTab('assessments');
    setIsLandingPage(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // AI Coach message update handler
  const handleUpdateCoachHistory = (coachHistory: any[]) => {
    setState((prev) => ({ ...prev, coachHistory }));
  };

  if (isLandingPage) {
    return (
      <LandingPage
        onStart={handleStartFromLanding}
        onViewExample={handleViewExample}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        state={state}
        onNavigate={handleNavigate}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        isExampleMode={isExampleMode}
        onExitExample={handleExitExample}
        onRoleChange={handleRoleChange}
      />

      {/* Main Container with Persistent Sidebar */}
      <div className="flex-1 flex">
        <Sidebar
          currentTab={currentTab}
          onNavigate={handleNavigate}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          state={state}
        />

        {/* Dynamic Content Main View */}
        <main className="flex-1 lg:pl-64 p-4 lg:p-8 overflow-x-hidden min-h-[calc(100vh-60px)]">
          {currentTab === 'overview' && (
            <OverviewView
              state={state}
              onNavigate={handleNavigate}
              onStartAssessment={handleStartAssessment}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileView
              state={state}
              onUpdateProfile={handleUpdateProfile}
              onUpdateSkills={handleUpdateSkills}
              onUpdateProjects={handleUpdateProjects}
              onNavigate={handleNavigate}
            />
          )}

          {currentTab === 'resume' && (
            <ResumeView
              state={state}
              onUpdateResumeAnalysis={handleUpdateResumeAnalysis}
              onApplyExtractedSkills={handleApplyExtractedSkills}
              onNavigate={handleNavigate}
            />
          )}

          {currentTab === 'skills' && (
            <SkillsView
              state={state}
              onUpdateSkills={handleUpdateSkills}
              onNavigate={handleNavigate}
            />
          )}

          {currentTab === 'readiness' && (
            <ReadinessView
              state={state}
              onNavigate={handleNavigate}
              onStartAssessment={handleStartAssessment}
            />
          )}

          {currentTab === 'assessments' && (
            <AssessmentsView
              state={state}
              activeAssessmentId={activeAssessmentId}
              onSelectAssessment={(id) => setActiveAssessmentId(id)}
              onSubmitAssessment={handleSubmitAssessment}
              onNavigate={handleNavigate}
            />
          )}

          {currentTab === 'progress' && (
            <ProgressView
              state={state}
              onNavigate={handleNavigate}
            />
          )}

          {currentTab === 'roadmap' && (
            <RoadmapView
              state={state}
              onNavigate={handleNavigate}
              onStartAssessment={handleStartAssessment}
            />
          )}

          {currentTab === 'coach' && (
            <CoachView
              state={state}
              onUpdateCoachHistory={handleUpdateCoachHistory}
              onNavigate={handleNavigate}
              onStartAssessment={handleStartAssessment}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              state={state}
              onStateChange={(s) => setState(s)}
              onRoleChange={handleRoleChange}
              onToggleExampleMode={() => {
                if (isExampleMode) handleExitExample();
                else handleViewExample();
              }}
              isExampleMode={isExampleMode}
              onNavigate={handleNavigate}
            />
          )}

          {currentTab === 'help' && <HelpView />}
        </main>
      </div>
    </div>
  );
}

export default App;
