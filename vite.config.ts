import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import netlify from '@netlify/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { profile } from './src/data/profile.ts'
import { projects } from './src/data/projects.ts'
import { site } from './src/data/site.ts'

const root = fileURLToPath(new URL('.', import.meta.url))

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * Generates SEO metadata from src/data at build time:
 * - <title>, description, Open Graph, Twitter and JSON-LD tags in index.html
 * - canonical / og:url / absolute image URLs when VITE_SITE_URL is set
 * - robots.txt, plus sitemap.xml when VITE_SITE_URL is set
 */
function seo(siteUrl: string | undefined): Plugin {
  const base = siteUrl?.replace(/\/+$/, '')
  const absolute = (path: string) => (base ? `${base}${path}` : path)

  const sameAs = profile.social.flatMap((link) => (link.href ? [link.href] : []))
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.role,
    description: site.description,
    ...(base ? { url: `${base}/`, image: absolute(`${profile.portrait.base}-768.jpg`) } : {}),
    affiliation: { '@type': 'CollegeOrUniversity', name: profile.education.institution },
    knowsLanguage: profile.languages.map((language) => language.name),
    knowsAbout: ['Artificial intelligence', 'Data science', 'Software engineering', 'Workflow automation', 'DevOps', 'Cloud computing'],
    ...(sameAs.length ? { sameAs } : {}),
  }

  const tags = [
    `<title>${escapeHtml(site.title)}</title>`,
    `<meta name="description" content="${escapeHtml(site.description)}" />`,
    `<meta name="author" content="${escapeHtml(profile.name)}" />`,
    `<meta name="theme-color" content="${site.themeColor}" />`,
    base ? `<link rel="canonical" href="${base}/" />` : '',
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeHtml(site.shortTitle)}" />`,
    `<meta property="og:locale" content="${site.locale}" />`,
    `<meta property="og:title" content="${escapeHtml(site.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(site.description)}" />`,
    base ? `<meta property="og:url" content="${base}/" />` : '',
    `<meta property="og:image" content="${absolute(site.ogImage.path)}" />`,
    `<meta property="og:image:width" content="${site.ogImage.width}" />`,
    `<meta property="og:image:height" content="${site.ogImage.height}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(site.ogImage.alt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(site.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(site.description)}" />`,
    `<meta name="twitter:image" content="${absolute(site.ogImage.path)}" />`,
    `<script type="application/ld+json">${JSON.stringify(personJsonLd).replace(/</g, '\\u003c')}</script>`,
  ]
    .filter(Boolean)
    .join('\n    ')

  return {
    name: 'ag-seo',
    transformIndexHtml: (html) => html.replace('<!-- %SEO% -->', tags),
    generateBundle() {
      const robots = ['User-agent: *', 'Allow: /', 'Disallow: /admin', base ? `Sitemap: ${base}/sitemap.xml` : ''].filter(Boolean).join('\n')
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `${robots}\n` })

      if (!base) {
        this.warn('VITE_SITE_URL is not set — skipping sitemap.xml and absolute canonical/Open Graph URLs.')
        return
      }
      const lastmod = new Date().toISOString().slice(0, 10)
      const urls = ['/', ...projects.map((project) => `/work/${project.slug}`)]
        .map((path) => `  <url><loc>${base}${path}</loc><lastmod>${lastmod}</lastmod></url>`)
        .join('\n')
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      })
    },
  }
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, root, 'VITE_')

  // Admin credentials from .env for the local functions. Server-side only:
  // the browser bundle only ever sees VITE_* variables.
  if (command === 'serve') {
    for (const [key, value] of Object.entries(loadEnv(mode, root, 'ADMIN_'))) process.env[key] ??= value
  }

  return {
    // netlify() runs the functions in netlify/ (admin API) and a local Blobs store in `vite dev`.
    // The site has no edge functions, so their Deno-based emulator is switched off.
    plugins: [react(), netlify({ edgeFunctions: { enabled: false } }), seo(env.VITE_SITE_URL || undefined)],
    define: {
      // The resume button only renders when a real file exists at public/resume.pdf.
      __RESUME_AVAILABLE__: JSON.stringify(existsSync(`${root}public/resume.pdf`)),
    },
    build: {
      target: 'es2022',
      chunkSizeWarningLimit: 900,
    },
  }
})
