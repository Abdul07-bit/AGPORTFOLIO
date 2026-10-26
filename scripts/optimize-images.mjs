// Generates responsive portrait files and favicon PNGs.
// Usage: npm run images
import { mkdir, readFile } from 'node:fs/promises'
import sharp from 'sharp'

const portraitSource = 'assets-src/portrait.png'
const portraitOut = 'public/images/portrait/abdul-gaffar'
const widths = [480, 768, 1024]

await mkdir('public/images/portrait', { recursive: true })

for (const width of widths) {
  await sharp(portraitSource).resize({ width }).webp({ quality: 82 }).toFile(`${portraitOut}-${width}.webp`)
}
// JPEG fallback (also used for structured data).
await sharp(portraitSource).resize({ width: 768 }).jpeg({ quality: 82, mozjpeg: true }).toFile(`${portraitOut}-768.jpg`)

// Background-removed cutout shown on the site (create it with: python scripts/cutout-portrait.py).
const cutoutSource = 'assets-src/portrait-cutout.png'
for (const width of widths) {
  await sharp(cutoutSource).resize({ width }).webp({ quality: 84, alphaQuality: 90 }).toFile(`${portraitOut}-cutout-${width}.webp`)
}
await sharp(cutoutSource).resize({ width: 768 }).png({ compressionLevel: 9, palette: true, quality: 92 }).toFile(`${portraitOut}-cutout-768.png`)

const favicon = await readFile('public/favicon.svg')
for (const [size, file] of [
  [32, 'favicon-32.png'],
  [180, 'apple-touch-icon.png'],
  [192, 'icon-192.png'],
  [512, 'icon-512.png'],
]) {
  await sharp(favicon, { density: 384 }).resize(size, size).png().toFile(`public/${file}`)
}

console.log('Images written to public/')
