/**
 * Generate PNG PWA icons from SVG sources (maskable + standard sizes).
 * Run: pnpm run icons:png
 */
import { mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const iconsDir = join(root, 'public', 'icons')

const jobs = [
  { src: 'icon-192.svg', out: 'icon-192.png', size: 192 },
  { src: 'icon-512.svg', out: 'icon-512.png', size: 512 },
  { src: 'icon-512.svg', out: 'icon-512-maskable.png', size: 512, padding: 0.1 },
  { src: 'apple-touch-icon.svg', out: 'apple-touch-icon.png', size: 180 },
]

await mkdir(iconsDir, { recursive: true })

for (const job of jobs) {
  const input = join(iconsDir, job.src)
  const output = join(iconsDir, job.out)
  const size = job.size
  const pad = job.padding ?? 0
  const inner = Math.round(size * (1 - pad * 2))

  let pipeline = sharp(input).resize(inner, inner, { fit: 'contain', background: '#06120d' })

  if (pad > 0) {
    const margin = Math.round(size * pad)
    pipeline = sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: '#06120d',
      },
    }).composite([{ input: await pipeline.png().toBuffer(), top: margin, left: margin }])
  }

  await pipeline.png().toFile(output)
  // eslint-disable-next-line no-console
  console.log(`Wrote ${job.out} (${size}×${size})`)
}
