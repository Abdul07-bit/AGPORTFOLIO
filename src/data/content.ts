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

// Most recent first. Dates come from Abdul's resume (October 2026).
export const journey: JourneyEntry[] = [
  {
    kind: 'Project',
    title: 'FormLaw',
    context: 'Agentic AI legal intelligence & case management',
    when: 'Aug 2026',
    description: 'Multi-agent workflows for legal research, case analysis and evidence review, with RAG-based document analysis, citations, RBAC, human approval and audit logging.',
    href: '/work/formlaw',
  },
  {
    kind: 'Certification',
    title: 'REST API Development',
    context: 'FastAPI / API development',
    when: 'Jan 2026',
    description: 'Building REST APIs with FastAPI.',
  },
  {
    kind: 'Project',
    title: 'SmartAutoFlex',
    context: 'AI chatbots, voice agents & workflow automation',
    when: 'Since Dec 2025',
    description: 'Built AI chatbots and voice agents for customer support and bookings, and automation workflows with n8n and FastAPI.',
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
