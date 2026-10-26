// Public, read-only endpoints the portfolio reads at startup.
//   GET /api/settings  → admin-panel settings (JSON)
//   GET /api/resume    → the uploaded resume, or the bundled /resume.pdf
import type { Config } from '@netlify/functions'
import { profile } from '../../src/data/profile.ts'
import { readResume, readSettings } from '../lib/store.ts'

export default async (request: Request) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method not allowed', { status: 405, headers: { allow: 'GET, HEAD' } })

  if (new URL(request.url).pathname === '/api/resume') {
    const resume = await readResume()
    if (!resume) return Response.redirect(new URL(profile.resume.path, request.url), 302)
    return new Response(resume, {
      headers: {
        'content-type': 'application/pdf',
        'content-disposition': `inline; filename="${profile.resume.downloadName}"`,
        // The site links to ?v=<upload time>, so each upload gets a fresh URL.
        'cache-control': 'public, max-age=300',
        'x-content-type-options': 'nosniff',
      },
    })
  }

  return Response.json(await readSettings(), { headers: { 'cache-control': 'no-cache' } })
}

export const config: Config = {
  path: ['/api/settings', '/api/resume'],
}
