export type CareerRole =
  | 'AI / ML Engineer'
  | 'Software Engineer'
  | 'Backend Developer'
  | 'Data Scientist'
  | 'Cloud Engineer'
  | 'Cybersecurity Analyst';

export type SkillCategory = 'Languages' | 'Frameworks' | 'Infrastructure' | 'Databases' | 'Core Concepts' | 'Security & Ops';

export type ExperienceLevel = 'Student' | 'Recent Graduate' | 'Junior Developer' | 'Early Career (1-3 years)' | 'Career Transitioner' | 'Mid-Level' | '';

export interface RequiredSkillDef {
  name: string;
  category: SkillCategory;
  requiredLevel: number; // 1 to 10
  importance: 'critical' | 'high' | 'medium';
  description: string;
}

export interface CareerRoleDefinition {
  id: string;
  name: CareerRole;
  category: string;
  iconName: string;
  badge: string;
  description: string;
  salaryRange: string;
  marketDemand: 'Very High' | 'High' | 'Explosive';
  coreSkills: RequiredSkillDef[];
  recommendedProjects: string[];
}

export interface UserProfile {
  name: string;
  email?: string;
  education: string;
  university?: string;
  degree?: string;
  graduationYear?: string;
  experienceLevel: ExperienceLevel;
  targetRole: CareerRole | '';
  bio?: string;
  careerGoals?: string;
  certifications: string[];
  linkedinUrl?: string;
  githubUrl?: string;
  isComplete: boolean;
  updatedAt: string;
}

export interface SkillEvidence {
  source: 'resume' | 'project' | 'assessment' | 'user_input' | 'self_assessment';
  description: string;
  date: string;
  scoreImpact?: number;
}

export interface UserSkill {
  name: string;
  category: string;
  currentLevel: number; // 0 to 10
  requiredLevel: number; // 0 to 10 for current target role
  confidence: 'low' | 'medium' | 'high';
  evidence: SkillEvidence[];
  lastTestedDate?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  role?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  files?: { name: string; size: number; type: string }[];
  addedAt: string;
}

export interface ResumeExtractedSkill {
  name: string;
  category: string;
  evidenceType: 'explicit' | 'inferred';
  snippet: string;
}

export interface ResumeAnalysisResult {
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  extractedProfile: {
    name?: string;
    education?: string;
    university?: string;
    degree?: string;
    experienceYears?: number;
    summary?: string;
  };
  extractedSkills: ResumeExtractedSkill[];
  extractedProjects: {
    name: string;
    description: string;
    technologies: string[];
  }[];
  extractedExperience: {
    role: string;
    company: string;
    duration: string;
    highlights: string[];
  }[];
  targetRole: CareerRole;
  roleAlignmentScore: number; // 0-100
  strengths: string[];
  missingEvidence: string[];
  potentialSkillGaps: string[];
  rawSummary: string;
}

export interface AssessmentResource {
  name: string;
  type: string;
  size: string;
  description: string;
  content?: string;
}

export interface PracticalAssessment {
  id: string;
  title: string;
  targetRole: CareerRole;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Production Incidents';
  type: 'written' | 'file_upload' | 'code_submission' | 'dataset_analysis' | 'multi_step';
  estimatedMinutes: number;
  skillsAssessed: string[];
  scenarioContext: string;
  instructions: string[];
  providedResources?: AssessmentResource[];
  promptQuestions: string[];
  starterCodeOrSnippet?: string;
  requiredDeliverables: string[];
  isAdaptive?: boolean;
  triggerReason?: string;
}

export interface AssessmentEvaluationResult {
  overallScore: number; // 0-100
  technicalAccuracy: number; // 0-100
  problemSolving: number; // 0-100
  practicalApplication: number; // 0-100
  reasoning: number; // 0-100
  communication: number; // 0-100
  strengths: string[];
  weaknesses: string[];
  specificFeedback: string;
  skillScoreUpdates: {
    skillName: string;
    previousScore: number;
    newScore: number;
    delta: number;
    rationale: string;
  }[];
  nextSkillFocus: string;
  recommendedNextChallengeTitle: string;
  recommendedNextChallengeDescription: string;
}

export type AssessmentEvaluation = AssessmentEvaluationResult;

export interface AssessmentSubmission {
  id: string;
  assessmentId: string;
  assessmentTitle: string;
  targetRole: CareerRole;
  submittedAt: string;
  timeSpentSeconds: number;
  answers: { questionIndex: number; question: string; answerText: string }[];
  files: { name: string; size: number; type: string; contentSnippet?: string }[];
  evaluation: AssessmentEvaluationResult;
}

export interface ReadinessScoreResult {
  overallReadiness: number; // 0-100
  profileReadiness: number; // 0-100
  resumeReadiness: number; // 0-100
  practicalReadiness: number; // 0-100
  status: 'Insufficient Evidence' | 'Early Exploration' | 'Developing Readiness' | 'Approaching Target' | 'Job Ready';
  hasEnoughData: boolean;
  calculationRationale: string;
  strengthsCount: number;
  gapsCount: number;
}

export interface CareerRoadmapMilestone {
  id: string;
  title: string;
  category: string;
  description: string;
  skillsTargeted: string[];
  status: 'completed' | 'in_progress' | 'recommended_next' | 'locked';
  linkedAssessmentId?: string;
  estimatedHours: number;
  completedAt?: string;
}

export interface CoachMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  contextPills?: string[];
  quickActions?: {
    label: string;
    actionType: 'navigate' | 'start_assessment';
    target: string;
  }[];
}

export interface SkillForgeState {
  profile: UserProfile;
  skills: UserSkill[];
  projects: ProjectItem[];
  resumeAnalysis: ResumeAnalysisResult | null;
  assessmentSubmissions: AssessmentSubmission[];
  roadmap: CareerRoadmapMilestone[];
  coachHistory: CoachMessage[];
  lastActiveTab: string;
}
