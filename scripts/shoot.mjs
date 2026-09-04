/**
 * Screenshot harness. Boots the built page and captures it at the breakpoints
 * the plan requires (390 / 768 / 1024 / 1440 / 1920), plus a horizontal-overflow
 * assertion at each — `scrollWidth > innerWidth` is the check the plan names.
 *
 *   node scripts/shoot.mjs [outDir] [--full]
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const OUT = process.argv[2] || 'shots';
const FULL = process.argv.includes('--full');
const BASE = process.env.BASE || 'http://localhost:4173';
const SIZES = [
  { w: 390, h: 844, name: '390' },
  { w: 768, h: 1024, name: '768' },
  { w: 1024, h: 768, name: '1024' },
  { w: 1440, h: 900, name: '1440' },
  { w: 1920, h: 1080, name: '1920' },
];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const errors = [];
let bad = 0;

for (const s of SIZES) {
  const page = await browser.newPage({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: 2 });
  page.on('console', (m) => m.type() === 'error' && errors.push(`[${s.name}] ${m.text()}`));
  page.on('pageerror', (e) => errors.push(`[${s.name}] ${e.message}`));

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(900);

  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
    height: document.body.scrollHeight,
  }));
  const over = overflow.scrollWidth > overflow.innerWidth;
  if (over) bad++;
  console.log(
    `${s.name.padStart(4)}px  page ${String(overflow.height).padStart(6)}px  ` +
    `overflow ${over ? `FAIL (${overflow.scrollWidth} > ${overflow.innerWidth})` : 'ok'}`
  );

  await page.screenshot({ path: `${OUT}/${s.name}.png`, fullPage: FULL });
  await page.close();
}

await browser.close();
if (errors.length) {
  console.log('\nConsole errors:');
  for (const e of errors) console.log('  ' + e);
} else {
  console.log('\nNo console errors.');
}
console.log(bad ? `\n${bad} viewport(s) overflow horizontally.` : '\nNo horizontal overflow at any width.');
