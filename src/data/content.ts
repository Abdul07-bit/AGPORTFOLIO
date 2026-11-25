import type { JourneyEntry } from './types'

// Copy for the narrative sections of the home page.

export const principles = [
  {
    stage: 'Idea',
    index: '01',
    title: 'Solve the actual problem.',
    body: 'Before choosing a stack, I try to understand who has the problem, what they do today, and what “better” would look like for them.',
  },
  {
    stage: 'Design',
    index: '02',
    title: 'Keep systems understandable.',
    body: 'Clear data flows, readable code and simple architecture beat cleverness. If I can’t explain a system on one page, it isn’t ready to be built.',
  },
  {
    stage: 'Build',
    index: '03',
    title: 'Build for real users.',
    body: 'Interfaces are shaped around real tasks — browsing a catalogue, placing an order, finding an answer. Responsive, accessible markup is part of the build, not an afterthought.',
  },
  {
    stage: 'Integrate',
    index: '04',
    title: 'Automate repetitive work thoughtfully.',
    body: 'Automation should remove busywork without hiding what is happening. I connect APIs, workflows and AI models so people stay in control of the decisions that matter.',
  },
  {
    stage: 'Deploy',
    index: '05',
    title: 'Measure before making claims.',
    body: 'Containers, pipelines and monitoring make behaviour observable. I would rather show what a system does than describe what it might do.',
  },
  {
    stage: 'Improve',
    index: '06',
    title: 'Improve through iteration.',
    body: 'Ship something useful, learn from how it is used, then refine. Each project in this portfolio is one turn of that loop.',
  },
] as const

// Most recent first. Dates come from Abdul's resume (November 2026).
export const journey: JourneyEntry[] = [
  {
    kind: 'Project',
    title: 'IntelliScrutiny',
    context: 'Multi-agent compliance review system',
    when: 'Oct 2026',
    description: 'Validation, verification and compliance agents as a stateful LangGraph workflow, with a versioned rule engine, hybrid RAG, OCR and a human reviewer confirming every decision.',
    href: '/work/intelliscrutiny',
  },
  {
    kind: 'Project',
    title: 'FormLaw',
    context: 'Agentic AI legal platform',
    when: 'Aug 2026',
    description: '12 stateful, tool-using agents for legal research, case analysis, contract review, drafting and evidence verification — RAG with citations, a default-deny policy engine, human approval and 189 automated tests.',
    href: '/work/formlaw',
  },
  {
    kind: 'Product',
    title: 'SAF Flow',
    context: 'Multi-tenant SaaS business suite',
    when: '2026',
    description: 'Restaurant, hotel and retail billing modules under one login, with per-business data isolation, shipped as an installable PWA.',
    href: '/work/saf-flow',
  },
  {
    kind: 'Certification',
    title: 'REST API Development',
    context: 'FastAPI / API development',
    when: 'Jan 2026',
    description: 'Building REST APIs with FastAPI.',
  },
  {
    kind: 'Freelance AI developer',
    title: 'Client projects · SmartAutoFlex',
    context: 'AI agents for 7 small-business clients',
    when: 'Dec 2025 – Present',
    description: 'Designed and deployed AI chatbots, voice agents and event-driven n8n automations for 7 small businesses, from requirements to deployment on AWS.',
    href: '/work/smartautoflex',
  },
  {
    kind: 'Hackathon · Team lead',
    title: 'BusJao',
    context: 'Real-time public transport tracking for small cities',
    when: 'Nov 2025',
    description: 'Led a five-member team; collected, organised and prepared transportation data to support data-driven decisions.',
  },
  {
    kind: 'Web projects',
    title: 'Rizan Jewellery & VKT Shopping Centre',
    context: 'Two live e-commerce websites',
    when: 'Live',
    description: 'A live-priced bullion catalogue with WhatsApp ordering, and a faith-and-lifestyle storefront built with Next.js.',
    href: '/work/rizan-jewellery',
  },
  {
    kind: 'Projects',
    title: 'DataFusion & AI Ticketing Assistant',
    context: 'Data quality · conversational support',
    when: 'Project · prototype',
    description: 'Combining and validating data with QA reporting and a chatbot over the findings; and a chatbot prototype for support ticketing.',
    href: '/work/datafusion',
  },
  {
    kind: 'Certification',
    title: 'SQL & Database Fundamentals',
    context: 'SQL, PostgreSQL',
    when: 'Feb 2025',
    description: 'Relational databases, SQL queries and PostgreSQL.',
  },
  {
    kind: 'Academic',
    title: 'B.Tech in Artificial Intelligence & Data Science',
    context: 'Dhaanish Ahmed Institute of Technology, Coimbatore',
    when: '2023 – 2027',
    description: 'Undergraduate degree in progress — CGPA 8.03 / 10.',
  },
  {
    kind: 'Certification',
    title: 'Joy of Python',
    context: 'Python programming · Hope Foundation',
    when: 'May 2023',
    description: 'Python programming foundations.',
  },
  {
    kind: 'School',
    title: 'Higher & senior secondary education',
    context: 'St. Antony’s HSS, Nagapattinam · Modern Matriculation HSS, Nagore',
    when: '2021 – 2023',
    description: 'Higher secondary (2023) and senior secondary (2021) education.',
  },
  {
    kind: 'Learning track',
    title: 'Currently learning',
    context: 'Azure AI · LLM fine-tuning · GraphQL · C#/.NET',
    when: 'Ongoing',
    description: 'Microsoft Azure (Azure OpenAI, AI Agent Service, Functions, ML), LLM fine-tuning, GraphQL, Microsoft Graph, C#/.NET, and Power BI with D3.js / Chart.js visuals.',
  },
  {
    kind: 'Learning track',
    title: 'DevOps & cloud engineering',
    context: 'Containers · CI/CD · IaC · Monitoring',
    when: 'Ongoing',
    description: 'Docker, Kubernetes, GitHub Actions, Jenkins, Terraform, Ansible, AWS and Azure (AKS), Prometheus and Grafana, plus security scanning with Trivy and Gitleaks.',
  },
  {
    kind: 'Language',
    title: 'Japanese',
    context: 'Alongside Tamil and English',
    when: 'N5 level',
    description: 'Learning Japanese — currently at N5 level.',
  },
]
