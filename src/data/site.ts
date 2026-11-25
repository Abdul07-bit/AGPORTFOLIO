// Site-wide metadata. Read by the app (document titles) and by vite.config.ts
// (meta tags, Open Graph, JSON-LD, sitemap). The production URL comes from the
// VITE_SITE_URL environment variable so no domain is hard-coded here.

export const site = {
  title: 'Abdul Gaffar — AI Engineer, Agentic AI & Multi-Agent Systems',
  shortTitle: 'Abdul Gaffar',
  description:
    "Abdul Gaffar builds agentic AI: multi-agent systems, RAG and secure Python APIs — FormLaw, IntelliScrutiny, SAF Flow and AI agents for 7 small-business clients.",
  themeColor: '#080706',
  locale: 'en_IN',
  ogImage: { path: '/og-image.jpg', width: 1200, height: 630, alt: 'Abdul Gaffar — I build intelligent digital systems.' },
} as const
