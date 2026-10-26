// Captures real screenshots of live project websites for the case studies.
// Uses an installed Microsoft Edge (or Chrome) through playwright-core.
// Usage: npm run screenshots            (BROWSER_CHANNEL=chrome to use Chrome)
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright-core'
import sharp from 'sharp'

const channel = process.env.BROWSER_CHANNEL ?? 'msedge'
const out = 'public/images/projects'

// The VKT shop page is intentionally excluded: it currently lists placeholder test products.
const shots = [
  { file: 'rizan-home', url: 'https://rizanjewellerysingapore.com/', device: 'desktop' },
  { file: 'rizan-shop', url: 'https://rizanjewellerysingapore.com/shop?metal=gold', device: 'desktop' },
  { file: 'rizan-mobile', url: 'https://rizanjewellerysingapore.com/', device: 'mobile' },
  { file: 'vkt-home', url: 'https://www.vktshoppingcentre.com/', device: 'desktop' },
  { file: 'vkt-mobile', url: 'https://www.vktshoppingcentre.com/', device: 'mobile' },
]

const devices = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
}

await mkdir(out, { recursive: true })
const browser = await chromium.launch({ channel, headless: true })

for (const shot of shots) {
  const context = await browser.newContext({ ...devices[shot.device], reducedMotion: 'reduce' })
  const page = await context.newPage()
  try {
    await page.goto(shot.url, { waitUntil: 'load', timeout: 45_000 })
    await page.waitForTimeout(5000) // let loaders, images and live prices settle
    const png = await page.screenshot({ type: 'png' })
    const image = sharp(png)
    const resized = shot.device === 'mobile' ? image.resize({ width: 640 }) : image.resize({ width: 1440 })
    const info = await resized.webp({ quality: 80 }).toFile(`${out}/${shot.file}.webp`)
    console.log(`✓ ${shot.file}.webp  ${info.width}×${info.height}`)
  } catch (error) {
    console.warn(`✗ ${shot.file}: ${error.message}`)
  } finally {
    await context.close()
  }
}

await browser.close()
