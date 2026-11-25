// Explicit extension: this file is also loaded by vite.config.ts.
import type { Project } from './types.ts'

// ─────────────────────────────────────────────────────────────────────────────
// Project content. Every claim here is either supplied by Abdul or verified
// against the live site (checked 25 Oct 2026; SAF Flow on 25 Nov 2026). Do not add metrics, clients or
// features that cannot be verified — see README.md → "Content accuracy".
// ─────────────────────────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    slug: 'formlaw',
    index: '01',
    name: 'FormLaw',
    title: 'FormLaw — Agentic AI Legal Intelligence & Case Management',
    subtitle: 'Agentic AI Legal Intelligence & Case Management',
    type: 'Agentic AI platform',
    status: { kind: 'demo', label: 'Project · Aug 2026' },
    categories: ['Multi-agent system', 'RAG', 'Legal tech'],
    summary:
      'A multi-agent legal platform: 12 stateful, tool-using AI agents collaborate on research, case analysis, contract review, drafting and evidence verification, with RAG answers that cite their sources and a person approving every consequential action.',
    cover: 'formlaw',
    theme: { accent: '#D07A5C', surface: '#13100E', ink: '#E8DFCC' },
    role: 'AI & full-stack engineering',
    overview:
      'FormLaw brings clients and advocates into one workspace for managing cases, and puts a team of 12 stateful, tool-using AI agents behind it. The agents collaborate on legal research, case analysis, contract review, drafting and evidence verification, while retrieval-augmented generation grounds every answer in cited sources. It is secure by design: a default-deny policy engine, RBAC and JWT authentication, human approval for consequential agent actions, and a full audit trail.',
    problem:
      'Legal work runs on documents, deadlines and trust. Research and evidence review are slow, and an AI assistant is only useful in this setting if its answers can be traced back to sources and its actions stay under a professional’s control.',
    goals: [
      'Give clients and advocates a shared place to collaborate on cases.',
      'Split research, case analysis, contract review, drafting and evidence verification across specialised agents.',
      'Answer questions about legal documents with source-grounded citations.',
      'Keep AI actions secure, approved by a person and auditable.',
    ],
    contribution: [
      'Built the platform for client–advocate collaboration and case management.',
      'Designed and orchestrated 12 stateful, tool-using AI agents for research, case analysis, contract review, drafting and evidence verification.',
      'Built RAG document analysis that grounds every answer in cited sources, and engineered prompts for reliable, structured agent outputs.',
      'Built the security layer: a default-deny policy engine, RBAC, JWT, human approval for consequential actions and a full audit trail.',
      'Wrote 183 pytest and 6 Playwright tests, and deployed the platform as a Docker Compose stack.',
    ],
    workflow: {
      title: 'Agentic workflow',
      caption: 'How a case moves through FormLaw’s agents, as designed.',
      steps: [
        { label: 'Collaborate', detail: 'Clients and advocates work on the case together in one place.' },
        { label: 'Research', detail: 'A research agent gathers relevant legal material.' },
        { label: 'Analyse', detail: 'A case-analysis agent reasons over the facts and the research.' },
        { label: 'Review evidence', detail: 'An evidence-review agent works through the case documents.' },
        { label: 'Ground', detail: 'RAG over the documents produces answers with source citations.' },
        { label: 'Approve', detail: 'A person approves AI actions; every step is written to an audit log.' },
      ],
    },
    features: [
      { title: 'Client–advocate collaboration', detail: 'A shared workspace for the people on a case.' },
      { title: 'Case management', detail: 'Cases, their documents and their progress in one place.' },
      { title: '12 orchestrated agents', detail: 'Stateful, tool-using agents for research, case analysis, contract review, drafting and evidence verification.' },
      { title: 'RAG document analysis', detail: 'Retrieval over legal documents, stored with pgvector.' },
      { title: 'Source-grounded citations', detail: 'Answers point back to the passages they came from.' },
      { title: 'Default-deny policy engine', detail: 'Agents and users can do nothing that a policy has not explicitly allowed.' },
      { title: 'RBAC & JWT', detail: 'Role-based access control and token authentication decide who can see and do what.' },
      { title: 'Human approval', detail: 'AI actions wait for a person to approve them.' },
      { title: 'Audit trail', detail: 'A full record of what each agent and user did.' },
      { title: 'Tested', detail: '183 pytest and 6 Playwright end-to-end tests.' },
    ],
    stack: {
      title: 'Technology',
      note: 'From Abdul’s resume (November 2026).',
      groups: [
        { label: 'Front end', items: ['React', 'TypeScript'] },
        { label: 'Backend', items: ['Python', 'FastAPI', 'JWT', 'RBAC'] },
        { label: 'Data', items: ['PostgreSQL', 'pgvector'] },
        { label: 'AI', items: ['Multi-agent orchestration', 'LLMs', 'RAG', 'Prompt engineering'] },
        { label: 'Quality & delivery', items: ['pytest', 'Playwright', 'Docker Compose'] },
      ],
    },
    screenshots: [],
    lessonsTitle: 'Design considerations',
    lessons: [
      {
        title: 'Ground every answer',
        detail: 'In legal work an answer without a source is a liability, so retrieval and citations are part of the core design, not an add-on.',
      },
      {
        title: 'Keep a person in the loop',
        detail: 'Agents can research and draft, but approval stays with the professional responsible for the case.',
      },
      {
        title: 'Access and audit are features',
        detail: 'Role-based access and audit logs make it possible to trust a system that touches sensitive documents.',
      },
    ],
    links: [
      {
        label: 'Live project',
        href: 'https://formlaw.vercel.app',
        kind: 'live',
        verified: false,
        note: 'Vercel returned DEPLOYMENT_NOT_FOUND on 25 Oct 2026. Set verified: true once it is redeployed.',
      },
      { label: 'Source on GitHub', href: 'https://github.com/Abdul07-bit/Formlaw', kind: 'repo', verified: true },
    ],
    sourceNote: 'Project details as described by Abdul. The artwork is an original illustration, not a product screenshot.',
  },

  {
    slug: 'intelliscrutiny',
    index: '02',
    name: 'IntelliScrutiny',
    title: 'IntelliScrutiny — Multi-Agent Compliance Review System',
    subtitle: 'Multi-Agent Compliance Review System',
    type: 'Multi-agent system',
    status: { kind: 'demo', label: 'Project · Oct 2026' },
    categories: ['LangGraph', 'Hybrid RAG', 'Compliance'],
    summary:
      'Validation, verification and compliance agents run as a stateful LangGraph workflow, with hybrid RAG, an OCR pipeline and a human reviewer who confirms every agent decision.',
    cover: 'intelliscrutiny',
    theme: { accent: '#7FB89A', surface: '#0C1110', ink: '#E8DFCC' },
    role: 'AI & full-stack engineering',
    overview:
      'IntelliScrutiny reviews compliance submissions with a team of agents. Validation, verification and compliance agents are orchestrated as a stateful LangGraph workflow, and their decisions follow a versioned rule engine rather than free-form model judgement. Scanned documents pass through an OCR pipeline, hybrid retrieval finds the evidence behind each check, and a human reviewer confirms every agent decision before it stands.',
    problem:
      'Compliance review means checking large, often scanned submissions against detailed and changing rules. Done by hand it is slow and inconsistent; done by an unchecked model it cannot be trusted. The review needs to be fast, explainable, tied to a specific version of the rules, and still signed off by a person.',
    goals: [
      'Split review into validation, verification and compliance stages, each handled by an agent.',
      'Drive decisions from a versioned rule engine, so every outcome can be traced to a rule set.',
      'Read scanned documents and retrieve the evidence behind each check.',
      'Keep a human reviewer in charge of every decision, with a tamper-evident record.',
    ],
    contribution: [
      'Orchestrated validation, verification and compliance agents as a stateful LangGraph workflow.',
      'Built the decision logic on a versioned rule engine.',
      'Built hybrid RAG over two pgvector indexes (vector + full-text) and an OCR pipeline with Tesseract.',
      'Built the FastAPI and Next.js 15 application with RBAC, a hash-chained audit log, 37 tests and one-command Docker deployment.',
    ],
    workflow: {
      title: 'Review workflow',
      caption: 'How a submission moves through the agents, as designed.',
      steps: [
        { label: 'Ingest', detail: 'Documents are uploaded; scanned pages are read by the OCR pipeline.' },
        { label: 'Validate', detail: 'A validation agent checks the submission.' },
        { label: 'Verify', detail: 'A verification agent retrieves evidence with hybrid search across two pgvector indexes.' },
        { label: 'Comply', detail: 'A compliance agent applies the current version of the rule engine.' },
        { label: 'Confirm', detail: 'A human reviewer confirms every agent decision.' },
        { label: 'Record', detail: 'Each step is written to a hash-chained audit log.' },
      ],
    },
    features: [
      { title: 'Stateful LangGraph workflow', detail: 'Validation, verification and compliance agents share state across the review.' },
      { title: 'Versioned rule engine', detail: 'Decisions follow an explicit, versioned rule set.' },
      { title: 'Hybrid RAG', detail: 'Vector and full-text search over two pgvector indexes.' },
      { title: 'OCR pipeline', detail: 'Scanned documents become searchable text with Tesseract.' },
      { title: 'Human-in-the-loop', detail: 'A reviewer confirms every agent decision.' },
      { title: 'Hash-chained audit log', detail: 'Each entry is chained to the previous one, so the record is tamper-evident.' },
      { title: 'RBAC', detail: 'Role-based access control for every user.' },
      { title: 'One-command deployment', detail: 'The whole stack starts with Docker; covered by 37 tests.' },
    ],
    stack: {
      title: 'Technology',
      note: 'From Abdul’s resume (November 2026).',
      groups: [
        { label: 'Agents', items: ['LangGraph', 'LLMs', 'Rule engine'] },
        { label: 'Retrieval', items: ['PostgreSQL', 'pgvector', 'Full-text search', 'Tesseract OCR'] },
        { label: 'Application', items: ['Python', 'FastAPI', 'Next.js 15'] },
        { label: 'Delivery', items: ['Docker', 'RBAC', 'Automated tests'] },
      ],
    },
    screenshots: [],
    lessonsTitle: 'Design considerations',
    lessons: [
      {
        title: 'Rules decide, models assist',
        detail: 'Putting decision logic in a versioned rule engine makes every outcome explainable and repeatable — the agents gather and check, the rules decide.',
      },
      {
        title: 'Two kinds of search beat one',
        detail: 'Vector search finds meaning; full-text search finds exact clauses and numbers. Compliance evidence needs both.',
      },
      {
        title: 'Make the record tamper-evident',
        detail: 'A hash-chained audit log means a reviewer’s sign-off can be trusted later, not just at the moment it was given.',
      },
    ],
    links: [{ label: 'Source on GitHub', href: 'https://github.com/Abdul07-bit/AICTE-IntelliScrutiny', kind: 'repo', verified: true }],
    sourceNote: 'Project details from Abdul’s resume (November 2026). The artwork is an original illustration, not a product screenshot.',
  },

  {
    slug: 'saf-flow',
    index: '03',
    name: 'SAF Flow',
    title: 'SAF Flow — Multi-Tenant SaaS Business Suite',
    subtitle: 'Multi-Tenant SaaS Business Suite',
    type: 'SaaS platform',
    status: { kind: 'live', label: 'Live product' },
    categories: ['SaaS', 'Multi-tenant', 'PWA'],
    summary:
      'One account for a restaurant, hotel and shop: restaurant, hotel and retail billing modules under a single sign-in, with each business’s data isolated from every other, shipped as an installable app.',
    cover: 'safflow',
    theme: { accent: '#E0A458', surface: '#100E0C', ink: '#F1E7D6' },
    role: 'Product design & full-stack engineering',
    overview:
      'SAF Flow is a business suite for owners who run more than one kind of business. One sign-in opens every SAF application the business has subscribed to — SAF Dine Flow for restaurants and food service, SAF Stay Flow for hotels and accommodation, and SAF Bill Flow for retail billing and inventory. Every business’s data is isolated from every other, and the suite installs as an app on phones, tablets and computers.',
    problem:
      'Small business owners often run a restaurant, a lodge and a shop side by side — and end up with a different system, login and bill book for each. They need one place to run all of them, that staff can use on whatever device is at hand, without data leaking between businesses.',
    goals: [
      'Put restaurant, hotel and retail modules behind a single account.',
      'Keep each business’s data strictly separate on shared infrastructure.',
      'Let staff sign in with a login ID their manager gives them.',
      'Run on phones, tablets and computers without manual updates.',
    ],
    contribution: [
      'Built the restaurant, hotel and retail billing modules under one login.',
      'Designed per-business data isolation for the multi-tenant platform.',
      'Built the shared sign-in, with email or manager-issued staff login IDs.',
      'Shipped the suite as an installable progressive web app.',
    ],
    workflow: {
      title: 'One account, three businesses',
      caption: 'How a business uses SAF Flow, from the live product.',
      steps: [
        { label: 'Sign in', detail: 'Owners use their email; staff use the login ID their manager gave them.' },
        { label: 'Open', detail: 'One sign-in opens every SAF application the business has subscribed to.' },
        { label: 'Dine', detail: 'SAF Dine Flow — restaurant and food-service management.' },
        { label: 'Stay', detail: 'SAF Stay Flow — hotel and accommodation management.' },
        { label: 'Bill', detail: 'SAF Bill Flow — retail billing and inventory.' },
        { label: 'Install', detail: 'Add it to a phone, tablet or computer; it always loads the latest version.' },
      ],
    },
    features: [
      { title: 'SAF Dine Flow', detail: 'Restaurant and food-service management.' },
      { title: 'SAF Stay Flow', detail: 'Hotel and accommodation management.' },
      { title: 'SAF Bill Flow', detail: 'Retail billing and inventory.' },
      { title: 'Single sign-in', detail: 'One account for every subscribed application.' },
      { title: 'Per-business isolation', detail: 'Each business’s data is isolated from every other business.' },
      { title: 'Staff login IDs', detail: 'Managers issue and reset login IDs for their staff.' },
      { title: 'Installable app', detail: 'Installs on Android, iPhone, iPad, Windows, Mac and Linux as a PWA.' },
      { title: 'Always up to date', detail: 'The app loads the latest version; nothing to update by hand.' },
    ],
    stack: {
      title: 'Building blocks',
      note: 'Product structure, verified against the live site (November 2026).',
      groups: [
        { label: 'Modules', items: ['Dine Flow', 'Stay Flow', 'Bill Flow'] },
        { label: 'Platform', items: ['Multi-tenant', 'Per-business data isolation', 'Shared sign-in'] },
        { label: 'Delivery', items: ['Progressive web app', 'Android, iOS & desktop install'] },
      ],
    },
    screenshots: [],
    lessonsTitle: 'Design considerations',
    lessons: [
      {
        title: 'Tenancy is the foundation',
        detail: 'Isolation between businesses has to be designed in from the first table, not added once there are customers.',
      },
      {
        title: 'Sign-in for the real staff',
        detail: 'Not every cashier has an email address. Manager-issued login IDs fit how small businesses actually work.',
      },
      {
        title: 'Install without an app store',
        detail: 'A PWA reaches every device a business already owns and never asks anyone to update it.',
      },
    ],
    links: [{ label: 'Visit SAF Flow', href: 'https://saf-flow.vercel.app/', kind: 'live', verified: true }],
    sourceNote: 'Features verified against the live product and Abdul’s resume (November 2026). Cover artwork is an original illustration.',
  },

  {
    slug: 'smartautoflex',
    index: '04',
    name: 'SmartAutoFlex',
    title: 'SmartAutoFlex — AI Chatbots, Voice Agents & Workflow Automation',
    subtitle: 'AI Chatbots, Voice Agents & Workflow Automation',
    type: 'Freelance client work',
    status: { kind: 'live', label: 'Live website' },
    categories: ['AI automation', 'Voice & chat agents', 'Workflow automation'],
    summary:
      'Freelance AI work for 7 small-business clients: chatbots and voice agents for customer support and bookings, and event-driven automation workflows with n8n, FastAPI and the OpenAI API.',
    cover: 'smartautoflex',
    theme: { accent: '#c9a45c', surface: '#0C0D10', ink: '#e8dfcc' },
    role: 'Product, AI & DevOps engineering',
    overview:
      'SmartAutoFlex is the name I do freelance AI work under. Since December 2025 I have designed and deployed AI agents for 7 small-business clients, owning each solution from requirement gathering and design to deployment: chatbots and voice agents that handle customer support and bookings, and event-driven automation workflows and REST API integrations that move routine work off people’s desks.',
    problem:
      'Many businesses repeat the same operational work every day: answering the same questions, taking bookings, moving data between tools. Most cannot justify a custom software team to fix it — but the tools to automate much of it now exist.',
    goals: [
      'Understand how a business actually works before proposing technology.',
      'Automate support and bookings with chatbots and voice agents.',
      'Connect tools with workflows so routine work runs on its own.',
      'Build the websites, applications and integrations that tie it together.',
    ],
    contribution: [
      'Designed and deployed AI agents for 7 small-business clients, from requirement gathering to deployment.',
      'Built AI chatbots and voice agents for support and bookings with Python, FastAPI, the OpenAI API and prompt engineering.',
      'Built event-driven n8n workflows and REST API integrations exchanging JSON between business tools.',
      'Containerised with Docker and deployed on AWS; ran client demos and turned feedback into fast iterations.',
    ],
    workflow: {
      title: 'Three stages',
      caption: 'How SmartAutoFlex approaches a business problem.',
      steps: [
        { label: '01 — Understand', detail: 'Map the real workflow, the repetitive steps and where customers wait.' },
        { label: '02 — Automate', detail: 'Deploy chat and voice agents and connect tools with workflows, with people in control.' },
        { label: '03 — Scale', detail: 'Package what works into reliable, observable products that can serve more businesses.' },
      ],
    },
    features: [
      { title: 'AI chatbots', detail: 'Conversational agents for customer support.', status: 'Built' },
      { title: 'Voice agents', detail: 'AI voice agents that answer calls for support and bookings.', status: 'Built' },
      { title: 'Booking automation', detail: 'Agents and workflows that capture and handle bookings.', status: 'Built' },
      { title: 'Workflow automation', detail: 'n8n and FastAPI workflows that move data between tools.', status: 'Built' },
      { title: 'Websites, stores & apps', detail: 'Websites, online stores, mobile apps and custom software for clients.', status: 'Offered' },
      { title: 'Operational dashboards', detail: 'A single view of automated workflows and their results.', status: 'Concept' },
    ],
    stack: {
      title: 'Technology',
      note: 'From Abdul’s resume.',
      groups: [
        { label: 'AI', items: ['OpenAI API', 'LLMs', 'Prompt engineering', 'Chatbots', 'Voice agents'] },
        { label: 'Automation', items: ['n8n', 'FastAPI', 'REST APIs'] },
        { label: 'Product', items: ['Next.js', 'React', 'TypeScript', 'PostgreSQL'] },
        { label: 'Infrastructure', items: ['Docker', 'Git & GitHub', 'AWS (EC2, S3)'] },
      ],
    },
    screenshots: [],
    lessonsTitle: 'Principles',
    lessons: [
      {
        title: 'Workflow before tooling',
        detail: 'The useful question is not “where can we add AI?” but “which step wastes the most time, and for whom?”',
      },
      {
        title: 'Label concepts as concepts',
        detail: 'Being precise about what is built, what is offered and what is still an idea is what makes a project trustworthy.',
      },
      {
        title: 'Automation needs an off switch',
        detail: 'Automated workflows should be observable and easy to override — especially when they talk to customers.',
      },
    ],
    links: [{ label: 'Visit SmartAutoFlex', href: 'https://smartautoflex.vercel.app/', kind: 'live', verified: true }],
    sourceNote: 'Details from Abdul’s resume and the SmartAutoFlex website (October 2026). Items marked Concept are not launched products.',
  },

  {
    slug: 'rizan-jewellery',
    index: '05',
    name: 'Rizan Jewellery',
    title: 'Rizan Jewellery — E-commerce Experience',
    subtitle: 'E-commerce Experience',
    type: 'E-commerce website',
    status: { kind: 'live', label: 'Live website' },
    categories: ['E-commerce', 'Live pricing', 'Web development'],
    summary:
      'A bullion e-commerce site for a Singapore gold and silver seller — a live-priced catalogue, cart and an order flow confirmed over WhatsApp, on a Supabase backend.',
    cover: 'rizan',
    theme: { accent: '#D9B26F', surface: '#121110', ink: '#F1E7D6' },
    role: 'Website design & development',
    overview:
      'Rizan Jewellery sells gold and silver bullion in Singapore. The website presents the catalogue by metal and weight, prices products from the live market, and turns a cart into a saved order that the customer confirms with the business over WhatsApp. There is no online payment step — payment, collection and delivery are arranged directly.',
    problem:
      'Bullion prices move throughout the day, so a static price list is out of date almost immediately. The business needed a site that shows current prices transparently, lets customers build an order online, and still keeps payment as a personal conversation.',
    goals: [
      'Show gold and silver prices from the live market, in Singapore dollars.',
      'Make the catalogue easy to browse by metal and by weight.',
      'Turn a cart into a saved order without taking online payment.',
      'Explain clearly how prices are calculated, to build trust.',
    ],
    visualDirection:
      'Dark, warm surfaces with gold accents and night-time Singapore imagery. Cormorant Garamond sets an editorial tone for headlines, Jost keeps the interface crisp, and a live market ticker frames every page — premium, but practical.',
    contribution: [
      'Designed the dark, gold-accented visual direction and typography.',
      'Built the catalogue, pricing display, cart and checkout pages.',
      'Connected the front end to a Supabase backend for catalogue, market data and orders.',
      'Implemented the WhatsApp order hand-off and customer account pages.',
    ],
    workflow: {
      title: 'Customer journey',
      caption: 'From browsing to a confirmed order — payment is arranged directly with the business.',
      steps: [
        { label: 'Browse', detail: 'Shop gold or silver, organised by metal and popular weights.' },
        { label: 'Price', detail: 'Products are priced per gram from the live spot price, in S$.' },
        { label: 'Cart', detail: 'Customers add bullion to a cart and review it.' },
        { label: 'Details', detail: 'Checkout collects the customer’s details.' },
        { label: 'Save', detail: 'The server recalculates the total if the market has moved, then saves the order.' },
        { label: 'WhatsApp', detail: 'The saved order is sent on WhatsApp to confirm payment and collection or delivery.' },
      ],
    },
    features: [
      { title: 'Live market ticker', detail: 'Gold, silver and USD/SGD prices shown across the site.' },
      { title: 'Transparent pricing', detail: 'Spot prices from gold-api.com, converted with the ECB USD/SGD reference rate, explained on the page.' },
      { title: 'Catalogue by metal & weight', detail: 'Gold bars, silver bars and grains, with popular weights.' },
      { title: 'Search & filters', detail: 'Search by name, brand or weight; filter by metal, brand, weight and availability; sort results.' },
      { title: 'Unit toggle', detail: 'The market ticker switches between per-ounce and per-kilogram prices.' },
      { title: 'Server-side repricing', detail: 'If the market moves during checkout, the server recalculates and asks the customer to confirm the new total.' },
      { title: 'WhatsApp ordering', detail: 'Orders are saved, then confirmed personally over WhatsApp — no online payment.' },
      { title: 'Orders, accounts & admin', detail: 'My Orders and My Account pages for customers, plus an admin area for the store.' },
      { title: 'Marketplace links', detail: 'Links to the business’s Shopee and Carousell storefronts.' },
    ],
    stack: {
      title: 'Technology',
      note: 'Identified from the live site.',
      groups: [
        { label: 'Front end', items: ['HTML', 'CSS', 'JavaScript (ES modules)', 'Cormorant Garamond & Jost'] },
        { label: 'Backend', items: ['Supabase', 'Postgres functions (Data API)', 'Edge Functions', 'Row Level Security'] },
        { label: 'Data', items: ['gold-api.com spot prices', 'ECB reference rates'] },
        { label: 'Commerce', items: ['WhatsApp order hand-off'] },
      ],
    },
    screenshots: [
      {
        src: '/images/projects/rizan-home.webp',
        alt: 'Rizan Jewellery home page: the headline “Invest in gold. Built on trust.” over a night-time Singapore skyline, a live gold, silver and USD/SGD ticker, and a “Today’s rate per gram” card.',
        caption: 'Home page with the live market ticker — live site, October 2026.',
        width: 1440,
        height: 900,
        device: 'desktop',
      },
      {
        src: '/images/projects/rizan-shop.webp',
        alt: 'Rizan Jewellery gold products page with a search field, sorting, and filters for metal, brand and weight above a grid of gold bars.',
        caption: 'Gold catalogue with search, filters and sorting — live site, October 2026.',
        width: 1440,
        height: 900,
        device: 'desktop',
      },
      {
        src: '/images/projects/rizan-mobile.webp',
        alt: 'Rizan Jewellery home page on a phone: ticker, headline, Shop gold and Shop silver buttons, and the per-gram rate card.',
        caption: 'Mobile home page — live site, October 2026.',
        width: 640,
        height: 1385,
        device: 'mobile',
      },
    ],
    lessonsTitle: 'Challenges & lessons',
    lessons: [
      {
        title: 'Prices are state, not content',
        detail:
          'Because the market moves, the server — not the browser — recalculates an order before it is saved, and the interface has to explain that clearly when it happens.',
      },
      {
        title: 'Trust is a design requirement',
        detail:
          'For a high-value purchase, explaining how prices are calculated and keeping payment as a direct conversation matter as much as visual polish.',
      },
      {
        title: 'Keep the backend boundary explicit',
        detail:
          'Public pages go through a thin API client, and database row-level policies decide what each request is allowed to do.',
      },
    ],
    links: [{ label: 'Visit the live site', href: 'https://rizanjewellerysingapore.com/', kind: 'live', verified: true }],
    sourceNote: 'Features and technology verified against the live site in October 2026. Cover artwork is an original illustration.',
  },

  {
    slug: 'vkt-shopping-centre',
    index: '06',
    name: 'VKT Shopping Centre',
    title: 'VKT Shopping Centre — Digital Storefront',
    subtitle: 'Digital Storefront',
    type: 'E-commerce website',
    status: { kind: 'live', label: 'Live website' },
    categories: ['E-commerce', 'Storefront', 'Next.js'],
    summary:
      'An online storefront for faith-themed gifts and devotional items from Nagapattinam, Tamil Nadu — collections, product pages, cart, saved items and sign-in, built with Next.js.',
    cover: 'vkt',
    theme: { accent: '#3BA3F2', surface: '#F5F9FC', ink: '#0F2233' },
    role: 'Storefront design & development',
    overview:
      'VKT Shopping Centre — “Faith · Family · Lifestyle” — offers devotional items, home décor and gifts. The storefront organises a broad catalogue into browsable collections and keeps the path from discovery to cart short, with contact options close at hand for a local store.',
    problem:
      'A store with a wide, varied catalogue — statues, candles, wall art, jewellery, seasonal nativity sets — needed an online presence where customers could find the right item quickly and reach the store easily.',
    goals: [
      'Organise a broad catalogue into clear, browsable collections.',
      'Give every product its own page with stock status.',
      'Support a cart, saved items and customer sign-in.',
      'Keep phone, WhatsApp, email and directions one tap away.',
    ],
    visualDirection:
      'Navy and gold on warm, light backgrounds, with Playfair Display headlines and Lato for body text — a calm, devotional tone that keeps products in focus. (The sky-blue cover on this page is an original illustration, not the site’s palette.)',
    contribution: [
      'Built the storefront’s visual presentation in navy and gold.',
      'Built collection, product, cart and wishlist pages in Next.js.',
      'Implemented customer sign-in and profile pages.',
      'Built responsive navigation, including the mobile menu.',
    ],
    workflow: {
      title: 'Product discovery journey',
      caption: 'The publicly visible path through the storefront.',
      steps: [
        { label: 'Arrive', detail: '“Where Faith Meets Family.” — the home page introduces collections and new arrivals.' },
        { label: 'Discover', detail: 'Fifteen categories, from church supplies to car & travel blessings.' },
        { label: 'Evaluate', detail: 'Product pages show details, price in ₹ and stock status.' },
        { label: 'Save', detail: 'Items can be saved to a wishlist for later.' },
        { label: 'Cart', detail: 'Products are added to the cart from listings and product pages.' },
        { label: 'Contact', detail: 'Phone, WhatsApp, email, opening hours and a map link.' },
      ],
    },
    features: [
      { title: 'Collections', detail: 'Fifteen product categories with dedicated listings.' },
      { title: 'Search, filters & sorting', detail: 'Search products, filter by category and sort the shop listing.' },
      { title: 'Product pages', detail: 'Individual product pages with stock status and pricing in ₹.' },
      { title: 'Cart', detail: 'Add-to-cart from listings and product pages.' },
      { title: 'Saved items', detail: 'A wishlist with heart toggles on products.' },
      { title: 'Sign-in & profile', detail: 'Customer sign-in with a profile page.' },
      { title: 'Newsletter', detail: '“Letters from VKT” email sign-up.' },
      { title: 'Contact & directions', detail: 'Phone, WhatsApp, email, opening hours and a map link.' },
      { title: 'Responsive navigation', detail: 'A dedicated menu for smaller screens.' },
    ],
    stack: {
      title: 'Technology',
      note: 'Identified from the live site.',
      groups: [
        { label: 'Framework', items: ['Next.js (App Router)', 'React'] },
        { label: 'Media', items: ['Vercel Blob storage'] },
        { label: 'Typography', items: ['Playfair Display', 'Lato'] },
        { label: 'Experience', items: ['Responsive layout', 'Search & filters', 'Wishlist & cart', 'Sign-in'] },
      ],
    },
    screenshots: [
      {
        src: '/images/projects/vkt-home.webp',
        alt: 'VKT Shopping Centre home page: the headline “Where Faith Meets Family.” with Explore Collections and Discover Our Story buttons beside a painted devotional scene.',
        caption: 'Home page — live site, October 2026.',
        width: 1440,
        height: 900,
        device: 'desktop',
      },
      {
        src: '/images/projects/vkt-mobile.webp',
        alt: 'VKT Shopping Centre home page on a phone, with the account and Menu buttons in the header above the hero.',
        caption: 'Mobile home page with the compact menu — live site, October 2026.',
        width: 640,
        height: 1385,
        device: 'mobile',
      },
    ],
    lessonsTitle: 'Challenges & lessons',
    lessons: [
      {
        title: 'Structure before decoration',
        detail: 'Fifteen categories only work if navigation and collection pages do the sorting for the customer.',
      },
      {
        title: 'Contact is part of the journey',
        detail: 'For a local store, WhatsApp, phone and directions belong in the buying journey, not just the footer.',
      },
      {
        title: 'Core path first',
        detail: 'Saved items and accounts sit on top of a solid browse-to-cart path. This case study covers the public storefront; checkout is not described here.',
      },
    ],
    links: [{ label: 'Visit the live site', href: 'https://vktshoppingcentre.com/', kind: 'live', verified: true }],
    sourceNote: 'Features and technology verified against the live site in October 2026. Cover artwork is an original illustration.',
  },

  {
    slug: 'datafusion',
    index: '07',
    name: 'DataFusion',
    title: 'DataFusion — B2B Data Fusion & Quality Intelligence',
    subtitle: 'B2B Data Fusion & Quality Intelligence',
    type: 'Data quality project',
    status: { kind: 'demo', label: 'Demo project' },
    categories: ['Data processing', 'Data quality', 'Conversational AI'],
    summary:
      'A data-focused project exploring how records from different sources can be combined, validated and explained — with quality checks, QA reporting and a chatbot that helps interpret the findings.',
    cover: 'datafusion',
    theme: { accent: '#5CE1C6', surface: '#0B0F12', ink: '#e8dfcc' },
    role: 'Concept, data workflow & interface',
    overview:
      'DataFusion explores the unglamorous part of working with data: getting records from different sources into one place, checking them, and explaining what is wrong in a way people can act on. It combines CSV processing and Google Sheets integration with validation rules, a QA report with confidence scores, and a chatbot-based interface for interpreting the results.',
    problem:
      'B2B data rarely arrives clean. Records come from exports, spreadsheets and shared sheets — each with its own format and its own mistakes. Before anyone can trust the combined data, someone has to find the errors, understand them and decide what to fix.',
    goals: [
      'Bring CSV files and Google Sheets data into a single workflow.',
      'Run validation and quality checks that detect data errors.',
      'Summarise the results as a QA report with confidence scores.',
      'Let people ask questions about the findings in plain language.',
    ],
    contribution: [
      'Defined the data-quality workflow, from ingestion to reporting.',
      'Built the data processing and validation steps.',
      'Designed how QA results and confidence scores are presented.',
      'Explored a chatbot interface and dashboard concepts for errors and suggestions.',
    ],
    workflow: {
      title: 'Data-quality workflow',
      caption: 'How data moves through DataFusion, from raw sources to explained findings.',
      steps: [
        { label: 'Ingest', detail: 'CSV files and Google Sheets data are brought into one workflow.' },
        { label: 'Validate', detail: 'Validation and quality checks run across the combined records.' },
        { label: 'Detect', detail: 'Data errors are identified and flagged for review.' },
        { label: 'Score', detail: 'Findings are presented with a confidence score.' },
        { label: 'Report', detail: 'A QA report summarises what was checked and what was found.' },
        { label: 'Explain', detail: 'A chatbot interface helps interpret the data-quality findings.' },
      ],
    },
    features: [
      { title: 'CSV processing', detail: 'Reads and processes tabular data exported from other systems.' },
      { title: 'Google Sheets integration', detail: 'Works with data that lives in shared spreadsheets.' },
      { title: 'Validation & quality checks', detail: 'Rules that check records and detect data errors.' },
      { title: 'QA reporting', detail: 'A structured report of the checks and their results.' },
      { title: 'Confidence scores', detail: 'Findings carry a confidence score instead of a bare pass/fail.' },
      { title: 'Chatbot interface', detail: 'Ask questions about the quality findings conversationally.' },
      { title: 'Error & suggestion dashboards', detail: 'Dashboard concepts for reviewing errors and suggested fixes.', status: 'Concept' },
    ],
    stack: {
      title: 'Building blocks',
      note: 'Grouped by role in the workflow.',
      groups: [
        { label: 'Sources', items: ['CSV', 'Google Sheets'] },
        { label: 'Processing', items: ['Data validation', 'Error detection'] },
        { label: 'Output', items: ['QA report', 'Confidence scoring'] },
        { label: 'Interface', items: ['Chatbot', 'Dashboard concepts'] },
      ],
    },
    screenshots: [],
    lessonsTitle: 'Challenges & lessons',
    lessons: [
      {
        title: 'Quality is contextual',
        detail:
          'A value can be valid in one source and wrong in another. Checks have to describe why something was flagged, not only that it was.',
      },
      {
        title: 'Confidence over verdicts',
        detail:
          'Showing a confidence score rather than a pass/fail result keeps a person involved in the decision instead of hiding it behind the tool.',
      },
      {
        title: 'Explanation is a feature',
        detail:
          'A conversational layer over the findings lowers the barrier for people who would never read a raw QA report.',
      },
    ],
    links: [
      {
        label: 'Live demo',
        href: 'https://datafusiondemo.netlify.app/',
        kind: 'demo',
        verified: false,
        note: 'Returned a Netlify 404 (site not found) on 25 Oct 2026. Set verified: true once the demo is redeployed.',
      },
    ],
    sourceNote: 'Project scope as described by Abdul. Artwork on this page is an original illustration, not a product screenshot.',
  },

  {
    slug: 'ai-ticketing-assistant',
    index: '08',
    name: 'AI Ticketing Assistant',
    title: 'AI Ticketing Assistant — Conversational Support',
    subtitle: 'Conversational Support',
    type: 'Chatbot prototype',
    status: { kind: 'prototype', label: 'Prototype' },
    categories: ['Chatbot', 'Support workflows', 'Prototype'],
    summary:
      'A chatbot prototype exploring AI-supported ticketing workflows — how a conversation can capture a support issue and move it towards resolution.',
    cover: 'ticketing',
    theme: { accent: '#8FA8FF', surface: '#0E1016', ink: '#e8dfcc' },
    role: 'Chatbot prototype',
    overview:
      'The AI Ticketing Assistant is a prototype that explores conversational assistance for support teams: instead of filling in a form, a user describes their problem in a chat, and the assistant helps turn that conversation into a ticket that can be followed up.',
    problem:
      'Support requests often arrive as unstructured messages. Someone has to read each one, work out what is being asked and route it before any real help happens.',
    goals: [
      'Let users describe an issue in their own words.',
      'Capture the details a support team needs to act.',
      'Explore where AI assistance helps — and where a person should take over.',
    ],
    contribution: [
      'Built the chatbot prototype.',
      'Designed the intended conversational ticketing flow.',
    ],
    workflow: {
      title: 'Intended interaction flow',
      caption: 'The flow the prototype explores. This describes the design intent, not a production system.',
      steps: [
        { label: 'Describe', detail: 'The user explains the problem in a chat, in their own words.' },
        { label: 'Clarify', detail: 'The assistant asks follow-up questions to fill in missing details.' },
        { label: 'Capture', detail: 'Key details are captured as a structured ticket.' },
        { label: 'Hand off', detail: 'The ticket is passed on for follow-up by a person.' },
      ],
    },
    features: [
      { title: 'Conversational intake', detail: 'Issues are described in natural language instead of a form.' },
      { title: 'AI-supported ticketing', detail: 'Exploring how AI can assist in creating and organising tickets.' },
    ],
    stack: {
      title: 'Focus areas',
      groups: [{ label: 'Prototype', items: ['Chatbot development', 'Conversational interface design', 'Ticketing workflows'] }],
    },
    screenshots: [],
    lessonsTitle: 'Design considerations',
    lessons: [
      {
        title: 'A conversation is a form',
        detail: 'The assistant still needs the same fields a support form would — it just gathers them more naturally.',
      },
      {
        title: 'Know when to hand off',
        detail: 'A support assistant is only helpful if it recognises when a person should take over.',
      },
    ],
    links: [],
    sourceNote: 'Prototype. The illustration on this page is original artwork, not a screenshot of the prototype.',
  },
]

export const getProject = (slug: string | undefined): Project | undefined =>
  projects.find((project) => project.slug === slug)

export const getAdjacentProject = (slug: string, direction: 1 | -1): Project => {
  const index = projects.findIndex((project) => project.slug === slug)
  return projects[(index + direction + projects.length) % projects.length]
}

export const projectHref = (slug: string) => `/work/${slug}`
