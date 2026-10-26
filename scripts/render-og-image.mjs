// Renders public/og-image.jpg (1200×630) from the live hero of the production build.
// Usage: npm run build && npm run og && npm run build
import { spawn } from 'node:child_process'
import { rm } from 'node:fs/promises'
import { chromium } from 'playwright-core'
import sharp from 'sharp'

const channel = process.env.BROWSER_CHANNEL ?? 'msedge'
const base = 'http://localhost:4318'
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--port', '4318', '--strictPort'], { stdio: 'ignore' })

try {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(base)).ok) break
    } catch {
      // not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  const browser = await chromium.launch({ channel, headless: true })
  const context = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
  await context.addInitScript(() => sessionStorage.setItem('ag:intro-seen', '1'))
  const page = await context.newPage()
  await page.goto(base, { waitUntil: 'networkidle' })
  // Wait for the 3D scene to fade in (or the fallback to settle).
  await page.waitForFunction(() => document.querySelector('.hero-scene')?.getAttribute('data-ready') === 'true', null, { timeout: 15_000 }).catch(() => {})
  await page.waitForTimeout(2500)
  // Social cards are small: drop interface chrome that would only add noise.
  await page.addStyleTag({ content: '.hero__readout, .hero__scroll, .progress, .nav__links { display: none !important; }' })
  const png = await page.screenshot({ type: 'png' })
  await browser.close()
  await sharp(png).jpeg({ quality: 86, mozjpeg: true }).toFile('public/og-image.jpg')
  await rm('public/og-image.png', { force: true })
  console.log('Wrote public/og-image.jpg — rebuild to include it in dist/.')
} finally {
  server.kill()
}
