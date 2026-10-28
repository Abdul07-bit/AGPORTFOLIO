// Site-wide metadata. Read by the app (document titles) and by vite.config.ts
// (meta tags, Open Graph, JSON-LD, sitemap). The production URL comes from the
// VITE_SITE_URL environment variable so no domain is hard-coded here.

export const site = {
  title: 'Abdul Gaffar — AI Engineer & Software Developer',
  shortTitle: 'Abdul Gaffar',
  description:
    "Explore Abdul Gaffar's work across AI, software engineering, data systems, automation, cloud technologies, and digital product development.",
  themeColor: '#080706',
  locale: 'en_IN',
  ogImage: { path: '/og-image.jpg', width: 1200, height: 630, alt: 'Abdul Gaffar — I build intelligent digital systems.' },
} as const
