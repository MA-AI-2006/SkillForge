import { CareerRoadmapMilestone, CoachMessage, SkillForgeState, UserProfile } from '../types';

const STORAGE_KEY = 'skillforge_app_state_v1';

export const INITIAL_EMPTY_PROFILE: UserProfile = {
  name: '',
  email: '',
  education: '',
  university: '',
  degree: '',
  graduationYear: '',
  experienceLevel: '',
  targetRole: '',
  bio: '',
  careerGoals: '',
  certifications: [],
  linkedinUrl: '',
  githubUrl: '',
  isComplete: false,
  updatedAt: new Date().toISOString()
};

export const INITIAL_COACH_WELCOME: CoachMessage = {
  id: 'welcome-01',
  sender: 'assistant',
  text: `Hello! I am your SkillForge AI Career Coach. 

Unlike generic chatbots, I connect directly to your real verified profile, resume evidence, and practical assessment results.

How can I help you today? You can ask me to:
• Analyze your readiness for your target role
• Highlight your top skill gaps and how to address them
• Recommend your next practical assessment
• Review your resume strengths and missing evidence`,
  timestamp: new Date().toISOString(),
  quickActions: [
    { label: 'How does SkillForge measure readiness?', actionType: 'navigate', target: 'readiness' },
    { label: 'Start my profile', actionType: 'navigate', target: 'profile' },
    { label: 'Upload my resume', actionType: 'navigate', target: 'resume' },
    { label: 'Explore practical assessments', actionType: 'navigate', target: 'assessments' }
  ]
};

export function getInitialState(): SkillForgeState {
  return {
    profile: INITIAL_EMPTY_PROFILE,
    skills: [],
    projects: [],
    resumeAnalysis: null,
    assessmentSubmissions: [],
    roadmap: [],
    coachHistory: [INITIAL_COACH_WELCOME],
    lastActiveTab: 'overview'
  };
}

/**
 * Provides a fully populated, realistic example candidate (Alex Carter) for the landing page "View Example" mode
 */
export function getExampleState(): SkillForgeState {
  return {
    profile: {
      name: 'Alex Carter',
      email: 'alex.carter@university.edu',
      education: 'B.S. in Computer Science',
      university: 'University of Washington',
      degree: 'Computer Science',
      graduationYear: '2025',
      experienceLevel: 'Recent Graduate',
      targetRole: 'AI / ML Engineer',
      bio: 'Graduating CS senior focused on deep learning, computer vision, and building low-latency inference services. Seeking an entry-level AI/ML Engineer role.',
      careerGoals: 'Deploy production-grade LLM applications and scale real-time neural pipelines in cloud environments.',
      certifications: ['AWS Certified Cloud Practitioner', 'DeepLearning.AI TensorFlow Specialization'],
      linkedinUrl: 'https://linkedin.com/in/alexcarter-demo',
      githubUrl: 'https://github.com/alexcarter-dev',
      isComplete: true,
      updatedAt: new Date().toISOString()
    },
    skills: [
      {
        name: 'Python',
        category: 'Languages',
        currentLevel: 8,
        requiredLevel: 8,
        confidence: 'high',
        evidence: [
          { source: 'resume', description: 'Listed on resume as primary language with 3+ years project experience.', date: '2026-08-15' },
          { source: 'project', description: 'Used extensively in "AI Code Reviewer" and "Autonomous Rover Vision" projects.', date: '2026-08-20' },
          { source: 'assessment', description: 'Scored 88/100 in Production Model Drift Triage assessment.', date: '2026-08-28', scoreImpact: 88 }
        ],
        lastTestedDate: '2026-08-28'
      },
      {
        name: 'PyTorch / TensorFlow',
        category: 'Frameworks',
        currentLevel: 7,
        requiredLevel: 8,
        confidence: 'high',
        evidence: [
          { source: 'resume', description: 'Trained CNNs and fine-tuned BERT models in coursework & research.', date: '2026-08-15' },
          { source: 'project', description: 'Implemented custom training loop in Autonomous Rover Vision repo.', date: '2026-08-20' }
        ]
      },
      {
        name: 'Machine Learning Fundamentals',
        category: 'Core Concepts',
        currentLevel: 8,
        requiredLevel: 8,
        confidence: 'high',
        evidence: [
          { source: 'resume', description: 'Completed Advanced Machine Learning & Neural Networks coursework (GPA 3.9).', date: '2026-08-15' },
          { source: 'assessment', description: 'Demonstrated thorough understanding of covariate shift & evaluation metrics.', date: '2026-08-28', scoreImpact: 85 }
        ],
        lastTestedDate: '2026-08-28'
      },
      {
        name: 'MLOps & Pipeline Automation',
        category: 'Security & Ops',
        currentLevel: 4,
        requiredLevel: 7,
        confidence: 'medium',
        evidence: [
          { source: 'assessment', description: 'Identified missing drift monitors but lacked experience with MLflow artifact registry.', date: '2026-08-28', scoreImpact: 60 }
        ],
        lastTestedDate: '2026-08-28'
      },
      {
        name: 'Docker & Containerization',
        category: 'Infrastructure',
        currentLevel: 3,
        requiredLevel: 7,
        confidence: 'low',
        evidence: [
          { source: 'resume', description: 'Mentioned basic Docker commands in resume, but no multi-stage production container evidence.', date: '2026-08-15' }
        ]
      },
      {
        name: 'FastAPI / API Serving',
        category: 'Frameworks',
        currentLevel: 6,
        requiredLevel: 7,
        confidence: 'medium',
        evidence: [
          { source: 'project', description: 'Built REST API endpoints for AI Code Reviewer.', date: '2026-08-20' }
        ]
      },
      {
        name: 'SQL & Vector Databases',
        category: 'Databases',
        currentLevel: 5,
        requiredLevel: 6,
        confidence: 'medium',
        evidence: [
          { source: 'resume', description: 'Used PostgreSQL and Qdrant in senior capstone.', date: '2026-08-15' }
        ]
      }
    ],
    projects: [
      {
        id: 'proj-01',
        name: 'AI Code Reviewer',
        description: 'An automated code analysis CLI and web dashboard that scans pull requests for security vulnerabilities, race conditions, and cyclomatic complexity using LLMs.',
        role: 'Lead Developer',
        technologies: ['Python', 'FastAPI', 'Gemini API', 'React', 'TypeScript', 'Tailwind CSS'],
        githubUrl: 'https://github.com/alexcarter-dev/ai-code-reviewer',
        liveUrl: 'https://ai-code-reviewer-demo.app',
        addedAt: '2026-08-20T10:00:00Z'
      },
      {
        id: 'proj-02',
        name: 'Autonomous Rover Vision Pipeline',
        description: 'Real-time object detection and path planning system utilizing PyTorch YOLOv8 models optimized with TensorRT for edge robotics hardware.',
        role: 'Computer Vision Engineer',
        technologies: ['Python', 'PyTorch', 'OpenCV', 'TensorRT', 'C++'],
        githubUrl: 'https://github.com/alexcarter-dev/rover-vision',
        addedAt: '2026-08-22T14:30:00Z'
      }
    ],
    resumeAnalysis: {
      fileName: 'Alex_Carter_AI_Engineer_Resume.pdf',
      fileSize: 148200,
      uploadedAt: '2026-08-25T11:20:00Z',
      extractedProfile: {
        name: 'Alex Carter',
        education: 'B.S. in Computer Science',
        university: 'University of Washington',
        degree: 'Computer Science',
        experienceYears: 1,
        summary: 'Passionate CS graduate with strong foundations in machine learning, Python development, and neural network fine-tuning.'
      },
      extractedSkills: [
        { name: 'Python', category: 'Languages', evidenceType: 'explicit', snippet: 'Languages: Python (3+ yrs), TypeScript, C++, SQL' },
        { name: 'PyTorch', category: 'Frameworks', evidenceType: 'explicit', snippet: 'Frameworks: PyTorch, TensorFlow, Scikit-learn, FastAPI' },
        { name: 'Machine Learning', category: 'Core Concepts', evidenceType: 'explicit', snippet: 'Coursework: Advanced Machine Learning, Computer Vision, Algorithms' },
        { name: 'Docker', category: 'Infrastructure', evidenceType: 'explicit', snippet: 'Tools: Docker, Git, Linux, Postman' },
        { name: 'FastAPI', category: 'Frameworks', evidenceType: 'explicit', snippet: 'Built REST APIs with FastAPI for ML microservices' }
      ],
      extractedProjects: [
        { name: 'AI Code Reviewer', description: 'Automated PR reviewer using LLM embeddings and AST parsing', technologies: ['Python', 'FastAPI', 'Gemini API'] },
        { name: 'Rover Vision System', description: 'Real-time edge object detection with YOLOv8', technologies: ['PyTorch', 'OpenCV', 'TensorRT'] }
      ],
      extractedExperience: [
        {
          role: 'Machine Learning Research Assistant',
          company: 'UW Robotics & AI Lab',
          duration: 'Sep 2024 – June 2025',
          highlights: [
            'Fine-tuned vision transformers reducing classification error by 14.2% on custom robotics dataset.',
            'Authored benchmarking scripts for edge inference on NVIDIA Jetson modules.'
          ]
        }
      ],
      targetRole: 'AI / ML Engineer',
      roleAlignmentScore: 78,
      strengths: [
        'Strong academic foundation in machine learning and deep learning algorithms',
        'Proven practical Python experience across multiple complex projects',
        'Demonstrated capability in computer vision and API serving with FastAPI'
      ],
      missingEvidence: [
        'Production MLOps pipelines (automated retraining, MLflow, model registry)',
        'Containerized production deployments with Docker multi-stage builds',
        'Large-scale distributed training on cloud GPUs (AWS SageMaker/GCP Vertex AI)'
      ],
      potentialSkillGaps: [
        'Docker & Containerization',
        'MLOps & Pipeline Automation',
        'Cloud AI Infrastructure'
      ],
      rawSummary: 'Alex Carter demonstrates strong candidate alignment for junior AI/ML Engineer roles, showing high competency in Python, PyTorch, and ML fundamentals. Primary development areas are production MLOps and Docker deployment.'
    },
    assessmentSubmissions: [
      {
        id: 'sub-01',
        assessmentId: 'aiml-01-model-drift-triage',
        assessmentTitle: 'Production Model Degradation & Drift Triage',
        targetRole: 'AI / ML Engineer',
        submittedAt: '2026-08-28T16:45:00Z',
        timeSpentSeconds: 940,
        answers: [
          {
            questionIndex: 0,
            question: 'What is the primary root cause of the accuracy collapse based on the telemetry logs and schema difference?',
            answerText: 'The primary root cause is a schema mismatch and covariate shift triggered by the upstream migration of `country_code` from ISO alpha-2 to alpha-3. The logs reveal that token `USA` was unmapped and defaulted to index 0 for 18,490 transactions, stripping out critical geographical signal. Simultaneously, `device_trust_score` variance collapsed from 1.42 to 0.04 due to missing value imputation.'
          },
          {
            questionIndex: 1,
            question: 'Why did the model continue serving predictions instead of hard failing when the schema change occurred?',
            answerText: 'The feature extractor had a silent fallback try/catch that caught unknown categorical tokens and imputed default index 0 instead of triggering a validation exception or alerting the pipeline.'
          },
          {
            questionIndex: 2,
            question: 'What immediate action would you take right now to restore prediction accuracy?',
            answerText: '1. Roll back the upstream ingestion schema change or hotfix the feature extractor dictionary mapping to normalize alpha-3 country codes back to alpha-2. 2. Verify `device_trust_score` upstream telemetry and re-enable active metric streams. 3. Monitor rolling precision on a 1-hour window until it returns above 0.90.'
          },
          {
            questionIndex: 3,
            question: 'What automated MLOps safeguards should be implemented to prevent this from ever happening again?',
            answerText: 'Implement Great Expectations or Pydantic data contract validation at the ingestion layer to reject unmapped schema schemas. Set up an automated drift monitor (Evidently AI / MLflow) that alerts on categorical distribution shifts, and route 5% canary traffic to evaluate candidate models before full rollout.'
          }
        ],
        files: [],
        evaluation: {
          overallScore: 84,
          technicalAccuracy: 88,
          problemSolving: 85,
          practicalApplication: 80,
          reasoning: 86,
          communication: 82,
          strengths: [
            'Accurately identified both the alpha-3 country code token mapping failure and the device_trust_score variance collapse.',
            'Correctly diagnosed the silent fallback imputation vulnerability in the feature extraction pipeline.',
            'Outlined a structured immediate rollback and verification plan.'
          ],
          weaknesses: [
            'Could have provided specific code assertions for Pydantic schema validation.',
            'Did not detail how to backfill missing transaction predictions made during the 48-hour degraded window.'
          ],
          specificFeedback: 'Your diagnosis of the log telemetry was precise and demonstrated strong practical troubleshooting reasoning. You correctly linked the ISO-3166 schema change to the collapse in model accuracy.',
          skillScoreUpdates: [
            { skillName: 'Python', previousScore: 7, newScore: 8, delta: 1, rationale: 'Demonstrated strong diagnostic code analysis.' },
            { skillName: 'Machine Learning Fundamentals', previousScore: 7, newScore: 8, delta: 1, rationale: 'Accurate analysis of covariate shift and precision/recall metrics.' },
            { skillName: 'MLOps & Pipeline Automation', previousScore: 3, newScore: 4, delta: 1, rationale: 'Proposed canary deployment and automated schema contracts.' }
          ],
          nextSkillFocus: 'Docker & Containerization',
          recommendedNextChallengeTitle: 'High-Throughput ML Microservice & Docker Packaging',
          recommendedNextChallengeDescription: 'Package an asynchronous PyTorch transformer model with FastAPI and build an optimized multi-stage Dockerfile to address containerization gaps.'
        }
      }
    ],
    roadmap: [
      {
        id: 'rm-01',
        title: 'Master Model Drift & Data Quality Diagnostics',
        category: 'Core Machine Learning',
        description: 'Learn to detect covariate shift, schema mutations, and evaluate precision/recall degradation in live inference pipelines.',
        skillsTargeted: ['Machine Learning Fundamentals', 'Python'],
        status: 'completed',
        linkedAssessmentId: 'aiml-01-model-drift-triage',
        estimatedHours: 8,
        completedAt: '2026-08-28T16:45:00Z'
      },
      {
        id: 'rm-02',
        title: 'Containerize Inference Microservices with Docker',
        category: 'Infrastructure & Deployment',
        description: 'Build multi-stage Dockerfiles, manage GPU runtime libraries, and optimize container image sizes for fast cold starts.',
        skillsTargeted: ['Docker & Containerization', 'FastAPI / API Serving'],
        status: 'recommended_next',
        linkedAssessmentId: 'aiml-02-fastapi-inference-optimization',
        estimatedHours: 12
      },
      {
        id: 'rm-03',
        title: 'Automate MLOps CI/CD & Model Registry',
        category: 'MLOps & Production',
        description: 'Set up MLflow model tracking, automated retraining triggers, and automated canary deployments.',
        skillsTargeted: ['MLOps & Pipeline Automation', 'Cloud AI Services & GPUs'],
        status: 'in_progress',
        estimatedHours: 16
      },
      {
        id: 'rm-04',
        title: 'Scale Distributed Vector Search with Qdrant/Pinecone',
        category: 'Databases & Retrieval',
        description: 'Architect scalable semantic search with embeddings indexing, chunking strategies, and hybrid search ranking.',
        skillsTargeted: ['SQL & Vector Databases', 'Python'],
        status: 'locked',
        estimatedHours: 14
      }
    ],
    coachHistory: [
      INITIAL_COACH_WELCOME,
      {
        id: 'alex-01',
        sender: 'user',
        text: 'What is my current biggest skill gap and how should I prepare for an AI/ML Engineer role?',
        timestamp: '2026-08-28T17:00:00Z'
      },
      {
        id: 'alex-02',
        sender: 'assistant',
        text: `Based on your analyzed resume, projects, and recent assessment score (84% on Model Drift Triage):

Your strongest verified areas are **Python (8/10)** and **ML Fundamentals (8/10)**.

Your most critical skill gap is **Docker & Containerization (3/10)** and **MLOps (4/10)**. While your resume mentions Docker, your practical evidence shows a need for multi-stage container builds and deployment orchestration.

**Recommended Action:**
Take the **"High-Throughput ML Microservice & Docker Packaging"** assessment next. This directly tests container optimization and async FastAPI serving.`,
        timestamp: '2026-08-28T17:01:00Z',
        contextPills: ['Target: AI / ML Engineer', 'Readiness: 68%', 'Top Gap: Docker & MLOps'],
        quickActions: [
          { label: 'Start Docker Assessment', actionType: 'start_assessment', target: 'aiml-02-fastapi-inference-optimization' },
          { label: 'View Career Roadmap', actionType: 'navigate', target: 'roadmap' }
        ]
      }
    ],
    lastActiveTab: 'overview'
  };
}

export function loadState(): SkillForgeState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialState();
    const parsed = JSON.parse(raw);
    return {
      ...getInitialState(),
      ...parsed,
      profile: { ...INITIAL_EMPTY_PROFILE, ...(parsed.profile || {}) },
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      assessmentSubmissions: Array.isArray(parsed.assessmentSubmissions) ? parsed.assessmentSubmissions : [],
      roadmap: Array.isArray(parsed.roadmap) ? parsed.roadmap : [],
      coachHistory: Array.isArray(parsed.coachHistory) && parsed.coachHistory.length > 0 ? parsed.coachHistory : [INITIAL_COACH_WELCOME]
    };
  } catch (err) {
    console.error('Failed to load state from localStorage:', err);
    return getInitialState();
  }
}

export function saveState(state: SkillForgeState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
}

export function resetState(): SkillForgeState {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to reset state:', err);
  }
  return getInitialState();
}

export function exportStateAsJSON(state: SkillForgeState): string {
  return JSON.stringify(state, null, 2);
}

export function importStateFromJSON(jsonString: string): SkillForgeState {
  const parsed = JSON.parse(jsonString);
  const validatedState: SkillForgeState = {
    ...getInitialState(),
    ...parsed
  };
  saveState(validatedState);
  return validatedState;
}
