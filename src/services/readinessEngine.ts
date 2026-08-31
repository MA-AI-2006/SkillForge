import { CAREER_ROLES, getCareerRoleById } from '../data/careerRoles';
import {
  AssessmentSubmission,
  CareerRole,
  ReadinessScoreResult,
  ResumeAnalysisResult,
  UserProfile,
  UserSkill
} from '../types';

export interface SkillGapItem {
  name: string;
  category: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number; // required - current (positive means missing)
  importance: 'critical' | 'high' | 'medium';
  description: string;
  isStrength: boolean;
  isGap: boolean;
  confidence: 'low' | 'medium' | 'high';
  evidenceCount: number;
}

/**
 * Calculates deterministic profile completeness score (0-100)
 */
export function calculateProfileReadiness(profile: UserProfile, projectCount: number, skillsCount: number): number {
  if (!profile) return 0;
  let points = 0;
  const maxPoints = 100;

  if (profile.name?.trim()) points += 10;
  if (profile.education?.trim()) points += 10;
  if (profile.experienceLevel) points += 10;
  if (profile.targetRole) points += 15;
  if (profile.bio?.trim() || profile.careerGoals?.trim()) points += 10;
  if (profile.certifications && profile.certifications.length > 0) points += 10;
  if (profile.githubUrl || profile.linkedinUrl) points += 5;
  
  // Projects contribution
  if (projectCount >= 1) points += 10;
  if (projectCount >= 2) points += 10;
  
  // Skills contribution
  if (skillsCount >= 3) points += 10;

  return Math.min(maxPoints, points);
}

export const calculateProfileCompleteness = (profile: UserProfile, skillsCount: number, projectCount: number): number => {
  return calculateProfileReadiness(profile, projectCount, skillsCount);
};

/**
 * Calculates practical readiness score (0-100) strictly from real user assessment evaluations
 */
export function calculatePracticalReadiness(submissions: AssessmentSubmission[], targetRole?: CareerRole): number {
  const evaluated = submissions.filter((s) => s.evaluation && (!targetRole || s.targetRole === targetRole));
  if (evaluated.length === 0) return 0;

  const totalScore = evaluated.reduce((sum, s) => sum + (s.evaluation?.overallScore || 0), 0);
  return Math.round(totalScore / evaluated.length);
}

/**
 * Calculates the holistic job readiness breakdown using transparent deterministic formulas
 */
export function calculateOverallReadiness(
  profile: UserProfile,
  skills: UserSkill[],
  projectCount: number,
  resumeAnalysis: ResumeAnalysisResult | null,
  submissions: AssessmentSubmission[]
): ReadinessScoreResult {
  const targetRole = profile.targetRole;
  const profileScore = calculateProfileReadiness(profile, projectCount, skills.length);
  const resumeScore = resumeAnalysis ? Math.min(100, Math.max(0, resumeAnalysis.roleAlignmentScore)) : 0;
  const evaluatedSubmissions = submissions.filter((s) => s.evaluation && (!targetRole || s.targetRole === targetRole));
  const practicalScore = calculatePracticalReadiness(submissions, targetRole || undefined);

  const hasResume = resumeAnalysis !== null;
  const hasAssessments = evaluatedSubmissions.length > 0;
  const hasEnoughData = hasResume || hasAssessments || (profileScore > 50 && skills.length >= 3);

  let overall = 0;
  let rationale = '';

  if (!hasEnoughData) {
    overall = Math.round(profileScore * 0.2); // max 20%
    rationale = 'Your profile is just getting started. Upload your real resume or complete a practical assessment to generate your verified readiness score.';
  } else if (!hasAssessments && hasResume) {
    // Only profile + resume evidence
    overall = Math.round(profileScore * 0.25 + resumeScore * 0.35); // capped at ~60% without practical testing
    rationale = `Based on your resume and profile evidence (${resumeScore}% alignment). Complete practical assessments to verify real workplace execution and increase your score.`;
  } else if (hasAssessments && !hasResume) {
    // Profile + practical assessments
    overall = Math.round(profileScore * 0.25 + practicalScore * 0.75);
    rationale = `Calculated from ${evaluatedSubmissions.length} completed practical assessment(s) (avg. ${practicalScore}%) and your profile foundations.`;
  } else {
    // Comprehensive: Profile (15%) + Resume (30%) + Practical Assessments (55%)
    overall = Math.round(profileScore * 0.15 + resumeScore * 0.30 + practicalScore * 0.55);
    rationale = `Holistic verification combining resume evidence (${resumeScore}%), profile foundations (${profileScore}%), and ${evaluatedSubmissions.length} practical assessment(s) (${practicalScore}%).`;
  }

  overall = Math.max(0, Math.min(100, overall));

  // Determine status label
  let status: ReadinessScoreResult['status'] = 'Insufficient Evidence';
  if (!hasEnoughData || overall < 30) {
    status = 'Insufficient Evidence';
  } else if (overall < 50) {
    status = 'Early Exploration';
  } else if (overall < 70) {
    status = 'Developing Readiness';
  } else if (overall < 85) {
    status = 'Approaching Target';
  } else {
    status = 'Job Ready';
  }

  const roleDef = targetRole ? getCareerRoleById(targetRole) : undefined;
  const gapsList = computeSkillGaps(skills, targetRole || undefined);
  const strengthsCount = gapsList.filter((g) => g.isStrength).length;
  const gapsCount = gapsList.filter((g) => g.isGap).length;

  return {
    overallReadiness: overall,
    profileReadiness: profileScore,
    resumeReadiness: resumeScore,
    practicalReadiness: practicalScore,
    status,
    hasEnoughData,
    calculationRationale: rationale,
    strengthsCount,
    gapsCount
  };
}

/**
 * Computes skill gaps against the target role requirements
 */
export function computeSkillGaps(userSkills: UserSkill[], targetRole?: CareerRole): SkillGapItem[] {
  if (!targetRole) return [];
  const roleDef = getCareerRoleById(targetRole);
  if (!roleDef) return [];

  const userSkillMap = new Map<string, UserSkill>();
  userSkills.forEach((s) => userSkillMap.set(s.name.toLowerCase(), s));

  return roleDef.coreSkills.map((req) => {
    const matched = userSkillMap.get(req.name.toLowerCase());
    const current = matched ? matched.currentLevel : 0;
    const gap = Math.max(0, req.requiredLevel - current);
    const isStrength = current >= req.requiredLevel;
    const isGap = current < req.requiredLevel;
    const confidence = matched ? matched.confidence : 'low';
    const evidenceCount = matched ? matched.evidence.length : 0;

    return {
      name: req.name,
      category: req.category,
      currentLevel: current,
      requiredLevel: req.requiredLevel,
      gap,
      importance: req.importance,
      description: req.description,
      isStrength,
      isGap,
      confidence,
      evidenceCount
    };
  });
}
