// End-to-end QA for the production build, driven through an installed
// Microsoft Edge (or Chrome) with playwright-core.
//
//   npm run build && npm run qa
//
// Env: QA_URL=http://host:port to test an already running server,
//      BROWSER_CHANNEL=chrome to use Chrome instead of Edge.
import { spawn } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const channel = process.env.BROWSER_CHANNEL ?? 'msedge'
const outDir = 'qa-report'
const slugs = ['formlaw', 'datafusion', 'rizan-jewellery', 'vkt-shopping-centre', 'smartautoflex', 'ai-ticketing-assistant']

const viewports = {
  desktop: { viewport: { width: 1440, height: 900 } },
  laptop: { viewport: { width: 1280, height: 800 } },
  tablet: { viewport: { width: 820, height: 1180 }, hasTouch: true, isMobile: true },
  mobile: { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 },
  small: { viewport: { width: 320, height: 640 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 },
}

const results = []
const record = (name, ok, detail = '') => {
  results.push({ name, ok, detail })
  console.log(`${ok ? '✓' : '✗'} ${name}${detail ? ` — ${detail}` : ''}`)
}

// ── Server ────────────────────────────────────────────────────────────────
let server
let base = process.env.QA_URL
if (!base) {
  base = 'http://localhost:4317'
  server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--port', '4317', '--strictPort'], { stdio: 'ignore' })
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(base)).ok) break
    } catch {
      // not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
}

await mkdir(outDir, { recursive: true })
const browser = await chromium.launch({ channel, headless: true })

// `vite preview` has no Netlify functions. Answer /api/settings as a fresh
// deploy does (no admin-panel changes), so the defaults in src/data are tested.
const withoutAdminChanges = (context) =>
  context.route('**/api/settings', (route) => route.fulfill({ json: { projects: null, social: null, resume: null, updatedAt: null } }))

/** Opens a page that records console errors, page errors and failed requests. */
async function open(path, contextOptions = {}, { skipIntro = true, reducedMotion } = {}) {
  const options = { ...viewports.desktop, ...contextOptions, reducedMotion }
  const context = await browser.newContext(options)
  await withoutAdminChanges(context)
  await context.addInitScript((width) => sessionStorage.setItem('qa:width', String(width)), options.viewport.width)
  if (skipIntro) await context.addInitScript(() => sessionStorage.setItem('ag:intro-seen', '1'))
  const page = await context.newPage()
  const problems = []
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      problems.push(`console.${message.type()}: ${message.text()}`)
    }
  })
  page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`))
  page.on('requestfailed', (request) => problems.push(`requestfailed: ${request.url()}`))
  page.on('response', (response) => {
    if (response.status() >= 400) problems.push(`http ${response.status()}: ${response.url()}`)
  })
  await page.goto(base + path, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)
  return { page, context, problems }
}

/**
 * Horizontal overflow against the configured viewport width. Mobile browsers
 * widen the layout viewport to fit overflowing content, so comparing
 * scrollWidth with innerWidth alone would hide the problem.
 */
const overflow = (page) =>
  page.evaluate(() => {
    const width = Number(sessionStorage.getItem('qa:width') || window.innerWidth)
    return Math.max(document.documentElement.scrollWidth, window.innerWidth) - width
  })
const scrollToSelector = (page, selector, offset = 0) =>
  page.evaluate(
    ([sel, off]) => {
      const element = document.querySelector(sel)
      window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY + off)
    },
    [selector, offset],
  )

try {
  // ── 1. Routes render, direct navigation works, no console errors ───────
  for (const path of ['/', ...slugs.map((slug) => `/work/${slug}`), '/this-does-not-exist']) {
    const { page, context, problems } = await open(path)
    const h1 = await page.locator('h1').count()
    const title = await page.title()
    record(`route ${path} renders`, h1 === 1, `h1×${h1}, title “${title}”`)
    record(`route ${path} has no console/network errors`, problems.length === 0, problems.join(' | '))
    await context.close()
  }

  // ── 2. Layout at every viewport: no horizontal overflow ────────────────
  for (const [name, options] of Object.entries(viewports)) {
    const { page, context, problems } = await open('/', options)
    const total = await page.evaluate(() => document.documentElement.scrollHeight)
    let worst = 0
    for (let y = 0; y < total; y += 900) {
      await page.evaluate((top) => window.scrollTo(0, top), y)
      await page.waitForTimeout(120)
      worst = Math.max(worst, await overflow(page))
    }
    record(`${name}: no horizontal overflow on home`, worst <= 0, `max overflow ${worst}px`)
    record(`${name}: no console errors while scrolling`, problems.length === 0, problems.join(' | '))
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(600)
    await page.screenshot({ path: `${outDir}/home-${name}.png` })
    const detail = await open('/work/rizan-jewellery', options)
    record(`${name}: no horizontal overflow on a case study`, (await overflow(detail.page)) <= 0)
    await detail.context.close()
    await context.close()
  }

  // ── 3. Desktop navigation and active state ─────────────────────────────
  {
    const { page, context } = await open('/')
    for (const [label, id] of [
      ['Stack', 'stack'],
      ['Contact', 'contact'],
      ['About', 'about'],
      ['Work', 'work'],
    ]) {
      await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: label }).click()
      await page.waitForTimeout(2200)
      const distance = await page.evaluate((target) => Math.abs(document.getElementById(target).getBoundingClientRect().top), id)
      const current = await page.locator('.nav__link[aria-current]').textContent()
      record(`nav “${label}” scrolls to #${id}`, distance < 4, `offset ${distance.toFixed(0)}px`)
      record(`nav “${label}” marks itself active`, current?.trim().toLowerCase() === label.toLowerCase(), `active: ${current}`)
    }
    await context.close()
  }

  // ── 4. Desktop gallery: horizontal, scroll-driven, no trap ─────────────
  {
    const { page, context } = await open('/')
    const mode = await page.locator('#work').getAttribute('data-mode')
    record('desktop gallery uses pinned horizontal mode', mode === 'cinematic', `mode=${mode}`)
    await scrollToSelector(page, '#work', 10)
    await page.waitForTimeout(800)
    const before = await page.locator('.work__rail').evaluate((rail) => new DOMMatrix(getComputedStyle(rail).transform).m41)
    await page.mouse.move(700, 450)
    for (let i = 0; i < 12; i++) {
      await page.mouse.wheel(0, 260)
      await page.waitForTimeout(60)
    }
    await page.waitForTimeout(1600)
    const after = await page.locator('.work__rail').evaluate((rail) => new DOMMatrix(getComputedStyle(rail).transform).m41)
    record('vertical wheel moves the gallery horizontally', after < before - 200, `x ${before.toFixed(0)} → ${after.toFixed(0)}`)
    const counterBefore = await page.locator('.work__count').innerText()
    await page.getByRole('button', { name: 'Next project' }).click()
    await page.waitForTimeout(2200)
    const counterAfter = await page.locator('.work__count').innerText()
    record('“Next project” advances the gallery', counterBefore !== counterAfter, `${counterBefore} → ${counterAfter}`)
    for (let i = 0; i < 70; i++) await page.mouse.wheel(0, 400)
    await page.waitForTimeout(2500)
    const aboutTop = await page.evaluate(() => document.getElementById('about').getBoundingClientRect().top)
    record('wheel scrolling continues past the gallery (no trap)', aboutTop < 900, `#about top ${aboutTop.toFixed(0)}px`)
    await context.close()
  }

  // ── 5. Touch gallery: native carousel + vertical scroll still works ────
  {
    const { page, context } = await open('/', viewports.mobile)
    const mode = await page.locator('#work').getAttribute('data-mode')
    record('mobile gallery uses native carousel mode', mode === 'native', `mode=${mode}`)
    await scrollToSelector(page, '.work__track', -200)
    await page.waitForTimeout(600)
    await page.getByRole('button', { name: 'Next project' }).click()
    await page.waitForTimeout(1200)
    const scrollLeft = await page.locator('.work__track').evaluate((track) => track.scrollLeft)
    const counter = await page.locator('.work__count').innerText()
    record('mobile “Next project” scrolls the carousel', scrollLeft > 100 && counter.startsWith('02'), `scrollLeft ${scrollLeft}, ${counter}`)
    const box = await page.locator('.work__track').boundingBox()
    const client = await context.newCDPSession(page)
    const swipe = async ([x0, y0], [x1, y1]) => {
      await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x0, y: y0 }] })
      for (let step = 1; step <= 12; step++) {
        const point = { x: x0 + ((x1 - x0) * step) / 12, y: y0 + ((y1 - y0) * step) / 12 }
        await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [point] })
        await page.waitForTimeout(16)
      }
      await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
      await page.waitForTimeout(900)
    }
    const centerX = Math.round(box.x + box.width / 2)
    const centerY = Math.round(Math.min(box.y + box.height / 2, 700))
    const y0 = await page.evaluate(() => window.scrollY)
    // A vertical swipe that starts on the carousel must still scroll the page.
    await swipe([centerX, centerY], [centerX, centerY - 350])
    const y1 = await page.evaluate(() => window.scrollY)
    record('vertical swipe on the carousel scrolls the page', y1 > y0 + 150, `scrollY ${y0} → ${y1}`)
    await scrollToSelector(page, '.work__track', -120)
    await page.waitForTimeout(600)
    const box2 = await page.locator('.work__track').boundingBox()
    const x0 = await page.locator('.work__track').evaluate((track) => track.scrollLeft)
    await swipe([300, Math.round(box2.y + 150)], [60, Math.round(box2.y + 160)])
    const x1 = await page.locator('.work__track').evaluate((track) => track.scrollLeft)
    record('horizontal swipe browses the carousel', x1 !== x0, `scrollLeft ${x0} → ${x1}`)
    await context.close()
  }

  // ── 6. Mobile menu ─────────────────────────────────────────────────────
  {
    const { page, context } = await open('/', viewports.mobile)
    await page.getByRole('button', { name: 'Menu' }).click()
    await page.waitForTimeout(800)
    const open1 = await page.locator('#mobile-menu').getAttribute('data-open')
    await page.keyboard.press('Escape')
    await page.waitForTimeout(800)
    const open2 = await page.locator('#mobile-menu').getAttribute('data-open')
    record('mobile menu opens and closes with Escape', open1 === 'true' && open2 === 'false')
    await page.getByRole('button', { name: 'Menu' }).click()
    await page.waitForTimeout(800)
    await page.getByRole('navigation', { name: 'Mobile' }).getByRole('link', { name: /Contact/ }).click()
    await page.waitForTimeout(1800)
    const top = await page.evaluate(() => document.getElementById('contact').getBoundingClientRect().top)
    record('mobile menu link scrolls to its section', Math.abs(top) < 8, `#contact top ${top.toFixed(0)}px`)
    await context.close()
  }

  // ── 7. Keyboard ────────────────────────────────────────────────────────
  {
    const { page, context } = await open('/')
    await page.keyboard.press('Tab')
    const first = await page.evaluate(() => document.activeElement?.textContent?.trim())
    record('first Tab reaches the skip link', first === 'Skip to content', `focused “${first}”`)
    const caseLink = page.locator('.work__panel').first().getByRole('link', { name: /View case study/ })
    await caseLink.focus()
    await page.waitForTimeout(2000)
    const box = await caseLink.boundingBox()
    record('focused gallery link is scrolled into view', box && box.x >= 0 && box.x + box.width <= 1440, `x=${box?.x.toFixed(0)}`)
    await page.keyboard.press('Enter')
    await page.waitForURL('**/work/formlaw')
    // React Router renders navigations in a transition, so wait for the new page.
    await page.waitForSelector('#case-title')
    record('Enter on a case-study link opens the case study', page.url().endsWith('/work/formlaw'))
    const focusOutline = await page.evaluate(() => {
      const link = document.querySelector('.case__crumbs a')
      link.focus()
      return getComputedStyle(link).outlineStyle
    })
    record('focused links show a visible outline', focusOutline !== 'none', `outline-style ${focusOutline}`)
    await context.close()
  }

  // ── 8. Back navigation restores the home scroll position ───────────────
  {
    const { page, context } = await open('/')
    await scrollToSelector(page, '#case-files', 200)
    await page.waitForTimeout(1500)
    const before = await page.evaluate(() => window.scrollY)
    await page.locator('.case-row', { hasText: 'VKT' }).click()
    await page.waitForURL('**/work/vkt-shopping-centre')
    await page.waitForSelector('#case-title')
    await page.waitForTimeout(800)
    const detailTop = await page.evaluate(() => window.scrollY)
    await page.goBack()
    await page.waitForTimeout(2000)
    const after = await page.evaluate(() => window.scrollY)
    record('case study opens at the top', detailTop < 5, `scrollY ${detailTop}`)
    // Within a few lines of a ~22 000 px page — late layout (fonts, lazy images) can shift it slightly.
    record('Back returns to the same place on the home page', Math.abs(after - before) < 120, `${before} → ${after}`)
    await context.close()
  }

  // ── 9. Reduced motion ──────────────────────────────────────────────────
  {
    const { page, context, problems } = await open('/', {}, { skipIntro: false, reducedMotion: 'reduce' })
    await page.waitForTimeout(1200)
    const introGone = (await page.locator('.intro').count()) === 0
    record('reduced motion: intro resolves almost immediately', introGone)
    const mode = await page.locator('#work').getAttribute('data-mode')
    record('reduced motion: gallery falls back to native mode', mode === 'native', `mode=${mode}`)
    let hidden = 0
    for (const id of ['about', 'approach', 'stack', 'journey', 'case-files', 'contact']) {
      await scrollToSelector(page, `#${id}`)
      await page.waitForTimeout(150)
      hidden += await page.evaluate(() =>
        [...document.querySelectorAll('h2, p, li')].filter((element) => {
          const rect = element.getBoundingClientRect()
          return rect.top >= 0 && rect.bottom <= innerHeight && rect.height > 0 && Number(getComputedStyle(element).opacity) < 0.1
        }).length,
      )
    }
    record('reduced motion: content is visible without animation', hidden === 0, `${hidden} invisible elements`)
    record('reduced motion: no console errors', problems.length === 0, problems.join(' | '))
    await context.close()
  }

  // ── 10. WebGL fallback ─────────────────────────────────────────────────
  {
    const context = await browser.newContext(viewports.desktop)
    await withoutAdminChanges(context)
    await context.addInitScript(() => {
      sessionStorage.setItem('ag:intro-seen', '1')
      HTMLCanvasElement.prototype.getContext = new Proxy(HTMLCanvasElement.prototype.getContext, {
        apply: (target, self, args) => (String(args[0]).startsWith('webgl') ? null : Reflect.apply(target, self, args)),
      })
    })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto(base + '/', { waitUntil: 'networkidle' })
    await page.waitForTimeout(1500)
    const fallbackVisible = await page.locator('.hero-scene__fallback').isVisible()
    const canvases = await page.locator('.signal-canvas').count()
    const heading = await page.locator('h1').isVisible()
    record('no WebGL: static Signal Core fallback is shown', fallbackVisible && canvases === 0 && heading, `canvas×${canvases}`)
    record('no WebGL: no page errors', errors.length === 0, errors.join(' | '))
    await page.screenshot({ path: `${outDir}/home-no-webgl.png` })
    await context.close()
  }

  // ── 11. Links and content accuracy ─────────────────────────────────────
  {
    const { page, context } = await open('/')
    const internal = await page.$$eval('a[href^="/"]', (links) => [...new Set(links.map((link) => link.getAttribute('href')))])
    const known = new Set(['/', ...slugs.map((slug) => `/work/${slug}`)])
    const isFile = (href) => /\.[a-z0-9]+$/i.test(href.split('#')[0])
    const unknown = internal.filter((href) => !isFile(href) && !known.has(href.split('#')[0]) && !href.startsWith('/#'))
    record('every internal link points to a real route', unknown.length === 0, unknown.join(', '))
    for (const file of internal.filter(isFile)) {
      const response = await fetch(base + file)
      const type = response.headers.get('content-type') ?? ''
      // SPA fallbacks answer unknown paths with index.html, so check the type too.
      record(`linked file is served: ${file}`, response.ok && !type.includes('text/html'), `HTTP ${response.status}, ${type}`)
    }
    const deadAnchors = await page.$$eval('a', (links) =>
      links.filter((link) => !link.getAttribute('href') || link.getAttribute('href') === '#').map((link) => link.textContent?.trim()),
    )
    record('no dead-end links (empty or “#” href)', deadAnchors.length === 0, deadAnchors.join(', '))
    // Every contact/profile link on the page must be exactly what profile.ts configures.
    const profileSource = await readFile('src/data/profile.ts', 'utf8')
    const configured = new Set([
      ...[...profileSource.matchAll(/^\s*email: '([^']+)'/gm)].map((match) => `mailto:${match[1]}`),
      ...[...profileSource.matchAll(/href: '([^']+)'/g)].map((match) => match[1]),
    ])
    const contactLinks = await page.$$eval('a[href^="mailto:"], a[href*="linkedin"], a[href*="github.com"], a[href*="leetcode"]', (links) =>
      links.map((link) => link.getAttribute('href').split('?')[0]),
    )
    const unexpected = contactLinks.filter((href) => !configured.has(href))
    record('contact links match profile.ts exactly', unexpected.length === 0, unexpected.join(', ') || `${new Set(contactLinks).size} distinct links`)
    await context.close()

    const external = new Set()
    for (const slug of slugs) {
      const detail = await open(`/work/${slug}`)
      const links = await detail.page.$$eval('a[href^="http"]', (anchors) =>
        anchors.map((anchor) => ({ href: anchor.href, target: anchor.target, rel: anchor.rel })),
      )
      links.forEach((link) => external.add(link.href))
      const safe = links.every((link) => link.target === '_blank' && link.rel.includes('noopener'))
      record(`/work/${slug}: external links open safely in a new tab`, safe, `${links.length} external`)
      if (slug === 'datafusion') {
        const demo = links.some((link) => link.href.includes('datafusiondemo'))
        record('DataFusion: unverified demo link is not shown', !demo)
      }
      if (slug === 'formlaw') {
        const live = links.some((link) => link.href.includes('formlaw.vercel.app'))
        record('FormLaw: unverified live link is not shown', !live)
      }
      await detail.context.close()
    }
    for (const href of external) {
      try {
        const response = await fetch(href, { method: 'GET', redirect: 'follow' })
        // LinkedIn (999) and LeetCode (403) block automated requests; they can't be verified this way.
        const botBlocked = (response.status === 999 && href.includes('linkedin.com')) || (response.status === 403 && href.includes('leetcode.com'))
        record(
          `external link resolves: ${href}`,
          response.ok || botBlocked,
          botBlocked ? `HTTP ${response.status} — site blocks automated checks; verify by hand` : `HTTP ${response.status}`,
        )
      } catch (error) {
        record(`external link resolves: ${href}`, false, error.message)
      }
    }
  }

  // ── 12. Metadata ───────────────────────────────────────────────────────
  {
    const { page, context } = await open('/')
    const meta = await page.evaluate(() => ({
      description: document.querySelector('meta[name="description"]')?.content,
      ogTitle: document.querySelector('meta[property="og:title"]')?.content,
      ogImage: document.querySelector('meta[property="og:image"]')?.content,
      theme: document.querySelector('meta[name="theme-color"]')?.content,
      jsonLd: Boolean(document.querySelector('script[type="application/ld+json"]')),
      lang: document.documentElement.lang,
    }))
    record('home has description, Open Graph, theme colour, JSON-LD and lang', Object.values(meta).every(Boolean), JSON.stringify(meta))
    const robots = await fetch(`${base}/robots.txt`)
    record('robots.txt is served', robots.ok && (await robots.text()).includes('User-agent'))
    const og = await fetch(`${base}/og-image.jpg`)
    record('Open Graph image exists', og.ok && og.headers.get('content-type')?.includes('image'))
    await context.close()
  }
} finally {
  await browser.close()
  server?.kill()
}

const failed = results.filter((result) => !result.ok)
await writeFile(`${outDir}/results.json`, JSON.stringify({ base, date: new Date().toISOString(), results }, null, 2))
console.log(`\n${results.length - failed.length}/${results.length} checks passed. Screenshots and results in ${outDir}/`)
if (failed.length) process.exitCode = 1
