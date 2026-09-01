import { AssessmentEvaluation, AssessmentSubmission, PracticalAssessment, UserSkill } from '../types';

/**
 * Validates whether candidate submission text is meaningful or blank/gibberish
 */
function analyzeSubmissionSubstance(answers: Array<{ question: string; answerText: string }>, files: any[] = []) {
  const combinedText = answers.map(a => (a.answerText || '').trim()).join(' ');
  const words = combinedText.split(/\s+/).filter(w => w.length > 0);
  const totalLength = combinedText.length;

  if (totalLength === 0 || words.length === 0) {
    return { isInvalid: true, reason: 'blank', score: 0, wordCount: 0 };
  }

  // Check for short dismissive / junk phrases
  const junkRegex = /^(rubbish|junk|test|testing|asdf|asdfgh|qwerty|zxcv|1234|idk|i don'?t know|nothing|none|n\/a|na|no idea|skip|bla|blah|xyz|null|empty|\?+|\.+)$/i;
  const meaningfulAnswers = answers.filter(a => {
    const text = (a.answerText || '').trim();
    return text.length >= 8 && !junkRegex.test(text);
  });

  // Check for repeated character mashing (e.g. "aaaaa", "asdfasdfasdf", "zzzzzzzz")
  const hasKeyboardMash = /(.)\1{5,}/.test(combinedText) || 
    (/^[asdfghjklqwertyuiopzxcvbnm1234567890\s.,!?]{1,30}$/i.test(combinedText) && words.length < 5);

  if (words.length < 5 || meaningfulAnswers.length === 0 || (hasKeyboardMash && words.length < 8)) {
    return { isInvalid: true, reason: 'gibberish_or_minimal', score: 0, wordCount: words.length };
  }

  return { isInvalid: false, reason: 'valid', score: 0, wordCount: words.length, meaningfulCount: meaningfulAnswers.length };
}

/**
 * Client-Side Deterministic Assessment Evaluator
 * Runs when backend /api/assessment/evaluate is offline or deployed to static hosting (Vercel)
 */
export function evaluateAssessmentClientSide(
  assessment: PracticalAssessment,
  answers: Array<{ questionIndex: number; question: string; answerText: string }>,
  files: Array<{ name: string; type: string; size: number; contentSnippet?: string }> = [],
  timeSpentSeconds: number = 60,
  userSkills: UserSkill[] = []
): AssessmentEvaluation {
  const substance = analyzeSubmissionSubstance(answers, files);

  // Rejection of blank/dismissive answers
  if (substance.isInvalid) {
    return {
      overallScore: 0,
      technicalAccuracy: 0,
      problemSolving: 0,
      practicalApplication: 0,
      reasoning: 0,
      communication: 0,
      strengths: [
        'No valid technical content submitted in this attempt.'
      ],
      weaknesses: [
        'Prompt questions were left blank, incomplete, or filled with placeholder/non-technical text.',
        'Did not provide root-cause analysis, system telemetry diagnostics, or remediation steps.'
      ],
      specificFeedback: `Your submission received an overall score of 0% because it did not contain meaningful technical answers addressing "${assessment.title}". In professional engineering and technical incident environments, candidates are expected to demonstrate structured troubleshooting, code/configuration fixes, and telemetry analysis. Please review the scenario background and resubmit a thoughtful response.`,
      skillScoreUpdates: (assessment.skillsAssessed || []).map((s: string) => {
        const existingSkill = userSkills.find((us) => us.name?.toLowerCase() === s.toLowerCase());
        const currentLevel = existingSkill ? existingSkill.currentLevel : 4;
        return {
          skillName: s,
          previousScore: currentLevel,
          newScore: currentLevel,
          delta: 0,
          rationale: `No competency points awarded (Submission was blank or invalid).`
        };
      }),
      nextSkillFocus: assessment.skillsAssessed?.[0] || 'Technical Incident Response',
      recommendedNextChallengeTitle: `Re-attempt: ${assessment.title}`,
      recommendedNextChallengeDescription: 'Revisit the scenario logs and submit structured technical explanations to earn competency advancement.'
    };
  }

  // Calculate score based on technical depth, keyword density, completion ratio, and files
  const totalWords = substance.wordCount;
  const answeredPrompts = answers.filter(a => (a.answerText || '').trim().length > 20).length;
  const totalPrompts = answers.length || 1;
  const promptCompletionRatio = answeredPrompts / totalPrompts;

  const combinedLower = answers.map(a => (a.answerText || '').toLowerCase()).join(' ');
  const domainKeywords = [
    'log', 'latency', 'memory', 'cpu', 'database', 'index', 'query', 'cache', 'redis',
    'docker', 'container', 'kubernetes', 'cluster', 'timeout', 'retry', 'circuit breaker',
    'schema', 'validation', 'drift', 'mlops', 'fastapi', 'async', 'thread', 'lock',
    'pipeline', 'rollback', 'canary', 'telemetry', 'prometheus', 'alert', 'root cause',
    'mitigation', 'patch', 'regression', 'health check', 'load balancer', 'connection pool',
    'rate limit', 'buffer', 'threadpool', 'worker', 'deadlock', 'heap', 'garbage collection'
  ];
  const matchedDomainKeywords = domainKeywords.filter(k => combinedLower.includes(k));

  let calculatedScore = 0;
  if (totalWords < 25 || promptCompletionRatio < 0.25) {
    calculatedScore = Math.min(28, Math.round(totalWords * 0.8));
  } else {
    const depthScore = Math.min(40, (totalWords / 150) * 40);
    const keywordScore = Math.min(30, (matchedDomainKeywords.length / 5) * 30);
    const completionScore = promptCompletionRatio * 20;
    const fileBonus = files.length > 0 ? 5 : 0;
    calculatedScore = Math.min(92, Math.max(25, Math.round(depthScore + keywordScore + completionScore + fileBonus)));
  }

  const passed = calculatedScore >= 60;
  const delta = passed ? (calculatedScore >= 80 ? 2 : 1) : 0;

  return {
    overallScore: calculatedScore,
    technicalAccuracy: Math.min(100, calculatedScore + 2),
    problemSolving: Math.max(10, calculatedScore - 2),
    practicalApplication: calculatedScore,
    reasoning: Math.min(100, calculatedScore + 1),
    communication: Math.min(100, Math.max(25, Math.round(totalWords * 0.45))),
    strengths: passed ? [
      `Addressed ${answeredPrompts} of ${totalPrompts} questions with relevant technical terminology.`,
      `Referenced key domain concepts: ${matchedDomainKeywords.slice(0, 4).join(', ') || 'Incident remediation'}.`,
      `Demonstrated structured troubleshooting aligned with ${assessment.targetRole} expectations.`
    ] : [
      'Attempted to outline a response, but lacked technical depth, telemetry benchmarks, and root-cause analysis.'
    ],
    weaknesses: [
      `Addressed ${answeredPrompts}/${totalPrompts} questions in full technical depth.`,
      'Needs more explicit configuration benchmarks, automated regression checks, and telemetry threshold specifications.'
    ],
    specificFeedback: passed 
      ? `Your submission for "${assessment.title}" demonstrated solid technical awareness with an evaluated score of ${calculatedScore}%. You correctly identified key operational and engineering considerations. To achieve Staff/Principal-level mastery, deepen your root-cause telemetry instrumentation, automated canary deployment checks, and rollback assertions.`
      : `Your submission for "${assessment.title}" received a score of ${calculatedScore}% (below passing threshold of 60%). The explanation was too brief or lacked sufficient technical depth, diagnostic proof, and code/configuration fixes. Please review the scenario artifacts and re-attempt.`,
    skillScoreUpdates: (assessment.skillsAssessed || ['System Architecture']).map((s: string) => {
      const existingSkill = userSkills.find((us) => us.name?.toLowerCase() === s.toLowerCase());
      const currentLevel = existingSkill ? existingSkill.currentLevel : 5;
      return {
        skillName: s,
        previousScore: currentLevel,
        newScore: currentLevel + delta,
        delta,
        rationale: passed 
          ? `Demonstrated applied competency in ${assessment.title} (Scored ${calculatedScore}%).`
          : `Score below passing threshold (Scored ${calculatedScore}% in ${assessment.title}). No level increase.`
      };
    }),
    nextSkillFocus: assessment.skillsAssessed?.[0] || 'Technical Incident Response',
    recommendedNextChallengeTitle: passed 
      ? `Advanced Scenario: Production Resilience in ${assessment.targetRole}`
      : `Re-attempt: ${assessment.title}`,
    recommendedNextChallengeDescription: passed
      ? 'Level up your skills by testing multi-region failure domain handling and distributed tracing.'
      : 'Revisit the scenario telemetry logs and submit structured technical explanations to earn competency advancement.'
  };
}
