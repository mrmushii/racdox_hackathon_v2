/** Capture each section in the viewport at a given width. */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const W = +(process.argv[2] || 1440);
const H = +(process.argv[3] || 900);
const OUT = process.argv[4] || 'shots-sections';
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1.5 });
await page.goto('http://localhost:4173', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(600);

const total = await page.evaluate(() => document.body.scrollHeight);
const steps = Math.ceil(total / H);
for (let i = 0; i < steps; i++) {
  await page.evaluate((y) => window.scrollTo(0, y), i * H);
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/${String(i).padStart(2, '0')}.png` });
}
console.log(`${steps} frames at ${W}x${H}`);
await browser.close();
