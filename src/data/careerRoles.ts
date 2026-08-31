import { CareerRole, CareerRoleDefinition } from '../types';

export const CAREER_ROLES: CareerRoleDefinition[] = [
  {
    id: 'ai-ml-engineer',
    name: 'AI / ML Engineer',
    category: 'Artificial Intelligence & Machine Learning',
    iconName: 'Cpu',
    badge: 'Explosive Demand',
    salaryRange: '$125k – $195k',
    marketDemand: 'Explosive',
    description: 'Build, evaluate, optimize, and deploy machine learning models, LLM systems, neural pipelines, and scalable AI inference microservices into production.',
    coreSkills: [
      { name: 'Python', category: 'Languages', requiredLevel: 8, importance: 'critical', description: 'Core syntax, vector operations, asynchronous processing, and package authoring.' },
      { name: 'PyTorch / TensorFlow', category: 'Frameworks', requiredLevel: 8, importance: 'critical', description: 'Deep learning architecture design, training loops, gradient tuning, and evaluation.' },
      { name: 'Machine Learning Fundamentals', category: 'Core Concepts', requiredLevel: 8, importance: 'critical', description: 'Cross-validation, loss functions, regularization, bias-variance tradeoff, and metrics.' },
      { name: 'MLOps & Pipeline Automation', category: 'Security & Ops', requiredLevel: 7, importance: 'high', description: 'Model registry, continuous training, drift detection, MLflow, and artifact tracking.' },
      { name: 'Docker & Containerization', category: 'Infrastructure', requiredLevel: 7, importance: 'high', description: 'Containerizing inference servers, multi-stage builds, GPU drivers in containers.' },
      { name: 'FastAPI / API Serving', category: 'Frameworks', requiredLevel: 7, importance: 'high', description: 'Building low-latency REST/gRPC endpoints for model inference.' },
      { name: 'Cloud AI Services & GPUs', category: 'Infrastructure', requiredLevel: 6, importance: 'medium', description: 'Cloud compute management, GPU utilization, distributed training orchestration.' },
      { name: 'SQL & Vector Databases', category: 'Databases', requiredLevel: 6, importance: 'medium', description: 'Data querying, embeddings management, similarity search with Pinecone/Qdrant/pgvector.' }
    ],
    recommendedProjects: [
      'Production ML Inference Microservice with Docker & Drift Monitoring',
      'RAG Knowledge Assistant with Vector Database & Custom Embeddings',
      'Computer Vision / NLP Fine-Tuning Pipeline with Real-Time Inference'
    ]
  },
  {
    id: 'software-engineer',
    name: 'Software Engineer',
    category: 'Full-Stack & Systems Engineering',
    iconName: 'Code2',
    badge: 'High Demand',
    salaryRange: '$110k – $170k',
    marketDemand: 'Very High',
    description: 'Design, build, and maintain end-to-end software architectures, robust frontend/backend systems, scalable application logic, and resilient unit/integration testing suites.',
    coreSkills: [
      { name: 'TypeScript / JavaScript', category: 'Languages', requiredLevel: 8, importance: 'critical', description: 'Static typing, async paradigms, modern ES features, functional patterns.' },
      { name: 'React / Frontend Architecture', category: 'Frameworks', requiredLevel: 8, importance: 'critical', description: 'State management, component lifecycles, hook optimization, UI accessibility.' },
      { name: 'Data Structures & Algorithms', category: 'Core Concepts', requiredLevel: 8, importance: 'critical', description: 'Time/space complexity, hash maps, trees, graphs, sorting, memory efficiency.' },
      { name: 'REST APIs & Web Standards', category: 'Core Concepts', requiredLevel: 7, importance: 'high', description: 'HTTP verbs, status codes, authentication protocols, CORS, caching headers.' },
      { name: 'Git & Version Control', category: 'Security & Ops', requiredLevel: 8, importance: 'high', description: 'Branching strategies, interactive rebase, pull request workflows, conflict resolution.' },
      { name: 'Unit & Integration Testing', category: 'Core Concepts', requiredLevel: 7, importance: 'high', description: 'Jest, Vitest, Playwright, test coverage strategies, mock paradigms.' },
      { name: 'CI/CD & Deployment', category: 'Infrastructure', requiredLevel: 6, importance: 'medium', description: 'GitHub Actions, automated build pipelines, containerized deployments.' }
    ],
    recommendedProjects: [
      'Full-Stack Collaborative Workspace with Real-Time State Sync',
      'High-Performance Component Library with Automated Test Suite',
      'Micro-SaaS Billing & Dashboard Platform with Webhook Integrations'
    ]
  },
  {
    id: 'backend-developer',
    name: 'Backend Developer',
    category: 'Backend & Distributed Systems',
    iconName: 'Server',
    badge: 'High Demand',
    salaryRange: '$115k – $180k',
    marketDemand: 'High',
    description: 'Engineer high-throughput server systems, database schemas, asynchronous queues, caching layers, and resilient microservices capable of handling enterprise scale.',
    coreSkills: [
      { name: 'Node.js / Go / Java / Python', category: 'Languages', requiredLevel: 8, importance: 'critical', description: 'Concurrency, thread pools, memory management, stream processing.' },
      { name: 'Database Design & SQL', category: 'Databases', requiredLevel: 8, importance: 'critical', description: 'Schema normalization, indexing, query optimization, ACID transactions, migrations.' },
      { name: 'API Architecture (REST / gRPC)', category: 'Core Concepts', requiredLevel: 8, importance: 'critical', description: 'Idempotency, rate limiting, pagination, serialization, API versioning.' },
      { name: 'Caching & Redis', category: 'Databases', requiredLevel: 7, importance: 'high', description: 'Cache invalidation strategies, pub/sub, distributed locks, session management.' },
      { name: 'Message Queues (Kafka / RabbitMQ)', category: 'Infrastructure', requiredLevel: 7, importance: 'high', description: 'Event-driven architectures, consumer groups, dead letter queues, replayability.' },
      { name: 'Docker & Linux Systems', category: 'Infrastructure', requiredLevel: 7, importance: 'high', description: 'Linux system administration, shell scripting, container networks, volume management.' },
      { name: 'Security & Authentication', category: 'Security & Ops', requiredLevel: 7, importance: 'high', description: 'OAuth2, JWT validation, RBAC, encryption at rest and in transit, OWASP prevention.' }
    ],
    recommendedProjects: [
      'High-Throughput Asynchronous Task Processing Engine with Redis & Workers',
      'E-commerce Inventory Service with Optimistic Locking & ACID Guarantees',
      'Rate-Limited API Gateway with Token Bucket Algorithm & Prometheus Telemetry'
    ]
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    category: 'Data Science & Statistical Analytics',
    iconName: 'BarChart3',
    badge: 'High Demand',
    salaryRange: '$115k – $175k',
    marketDemand: 'High',
    description: 'Transform complex unstructured datasets into mathematical insights, statistical models, predictive algorithms, and executive data visual stories.',
    coreSkills: [
      { name: 'Python (Pandas, NumPy, SciPy)', category: 'Languages', requiredLevel: 8, importance: 'critical', description: 'Data munging, vector calculation, matrix transformations, handling missing data.' },
      { name: 'SQL & Data Warehousing', category: 'Databases', requiredLevel: 8, importance: 'critical', description: 'Window functions, CTEs, complex joins, partitioning, BigQuery/Snowflake queries.' },
      { name: 'Applied Statistics & Probability', category: 'Core Concepts', requiredLevel: 8, importance: 'critical', description: 'Hypothesis testing, A/B experiment design, p-values, regression diagnostics.' },
      { name: 'Data Visualization & Storytelling', category: 'Core Concepts', requiredLevel: 7, importance: 'high', description: 'Matplotlib, Seaborn, interactive dashboards, clear executive communication.' },
      { name: 'Scikit-Learn & ML Algorithms', category: 'Frameworks', requiredLevel: 7, importance: 'high', description: 'Tree models, clustering, PCA, classification algorithms, hyperparameter tuning.' },
      { name: 'Feature Engineering', category: 'Core Concepts', requiredLevel: 7, importance: 'high', description: 'Encoding, scaling, dimensionality reduction, feature selection methods.' }
    ],
    recommendedProjects: [
      'Customer Churn Predictive Pipeline with Feature Importance & Cost Matrix',
      'A/B Testing Statistical Experiment Engine with Power Analysis & Visuals',
      'Automated Financial Forecasting Model with Time-Series Decomposition'
    ]
  },
  {
    id: 'cloud-engineer',
    name: 'Cloud Engineer',
    category: 'Cloud Infrastructure & DevOps',
    iconName: 'Cloud',
    badge: 'Very High Demand',
    salaryRange: '$120k – $185k',
    marketDemand: 'Very High',
    description: 'Architect scalable cloud infrastructure, automate deployment pipelines, provision Infrastructure-as-Code (Terraform), and optimize cloud costs and resilience.',
    coreSkills: [
      { name: 'AWS / GCP / Azure Architecture', category: 'Infrastructure', requiredLevel: 8, importance: 'critical', description: 'VPC design, subnetting, IAM policies, load balancers, serverless architectures.' },
      { name: 'Terraform / CloudFormation (IaC)', category: 'Infrastructure', requiredLevel: 8, importance: 'critical', description: 'Declarative state files, reusable modules, drift detection, plan approvals.' },
      { name: 'Kubernetes & Docker', category: 'Infrastructure', requiredLevel: 8, importance: 'critical', description: 'Pod lifecycles, Ingress controllers, Helm charts, stateful sets, auto-scalers.' },
      { name: 'CI/CD Automation Pipelines', category: 'Security & Ops', requiredLevel: 7, importance: 'high', description: 'Pipeline as code, automated testing stages, blue-green & canary deployments.' },
      { name: 'Linux Administration & Bash', category: 'Infrastructure', requiredLevel: 7, importance: 'high', description: 'Permissions, systemd, networking tools (curl, netstat, tcpdump), SSH hardening.' },
      { name: 'Observability (Prometheus, Grafana, CloudWatch)', category: 'Security & Ops', requiredLevel: 7, importance: 'high', description: 'Metric collection, distributed tracing, SLO/SLA alerting, log aggregation.' }
    ],
    recommendedProjects: [
      'Multi-Tier Resilient AWS Infrastructure with Terraform & Zero-Trust IAM',
      'Production Kubernetes Cluster with GitOps, Ingress-NGINX & Cert-Manager',
      'Automated Zero-Downtime Canary Deployment Pipeline with Rollback Triggers'
    ]
  },
  {
    id: 'cybersecurity-analyst',
    name: 'Cybersecurity Analyst',
    category: 'Information Security & Incident Response',
    iconName: 'ShieldCheck',
    badge: 'Critical Need',
    salaryRange: '$110k – $175k',
    marketDemand: 'Very High',
    description: 'Detect security threats, analyze suspicious telemetry and network logs, remediate vulnerabilities, and respond to critical production incidents.',
    coreSkills: [
      { name: 'Network Security & Protocols', category: 'Core Concepts', requiredLevel: 8, importance: 'critical', description: 'TCP/IP, DNS analysis, TLS handshake, packet inspection, firewall rule sets.' },
      { name: 'SIEM & Log Telemetry (Splunk / ELK)', category: 'Security & Ops', requiredLevel: 8, importance: 'critical', description: 'Querying authentication logs, correlation rules, anomaly detection, query syntax.' },
      { name: 'Threat Detection & Incident Response', category: 'Security & Ops', requiredLevel: 8, importance: 'critical', description: 'MITRE ATT&CK framework, root cause triage, containment strategies, post-mortems.' },
      { name: 'Vulnerability Assessment (OWASP Top 10)', category: 'Security & Ops', requiredLevel: 7, importance: 'high', description: 'SQLi, XSS, SSRF, broken auth, CVE evaluation, automated security scanning.' },
      { name: 'Linux & Scripting (Python / Bash)', category: 'Languages', requiredLevel: 7, importance: 'high', description: 'Automating log parsing, regex extraction, forensic artifact collection.' },
      { name: 'Identity & Access Management (IAM)', category: 'Security & Ops', requiredLevel: 7, importance: 'high', description: 'Least privilege enforcement, MFA auditing, privilege escalation prevention.' }
    ],
    recommendedProjects: [
      'Security Operations Center (SOC) Log Analysis & Intrusion Triage Suite',
      'Automated Vulnerability Scanner & OWASP Compliance Report Generator',
      'Real-Time Brute Force & Anomaly Detection Sentinel with Alerting Rules'
    ]
  }
];

export function getCareerRoleById(idOrName: string): CareerRoleDefinition | undefined {
  return CAREER_ROLES.find(
    (role) => role.id === idOrName || role.name.toLowerCase() === idOrName.toLowerCase()
  );
}
