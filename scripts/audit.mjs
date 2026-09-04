/**
 * Acceptance audit. Checks the things the brief actually scores, plus the
 * a11y and integrity items that decide a close call.
 */
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

// Pass a URL to audit the dev server too: StrictMode double-mounts only in dev,
// so bugs in async animation setup are invisible against a production build.
const BASE = process.argv[2] || process.env.BASE || 'http://localhost:4173';
const brand = readFileSync('src/content/brand.js', 'utf8');
let fails = 0;
const check = (ok, label, detail = '') => {
  if (!ok) fails++;
  console.log(`${ok ? 'ok  ' : 'FAIL'}  ${label}${detail ? '  — ' + detail : ''}`);
};

const browser = await chromium.launch();

/* ---- structure, alt text, CTA spine, tap targets ---- */
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(800);

const r = await page.evaluate(() => {
  const q = (s) => [...document.querySelectorAll(s)];
  const heads = q('h1,h2,h3,h4').map((h) => +h.tagName[1]);
  let order = true;
  for (let i = 1; i < heads.length; i++) if (heads[i] - heads[i - 1] > 1) order = false;

  // Every element a finger must hit, at mobile width.
  const small = q('a,button')
    .filter((e) => e.offsetParent !== null)
    .map((e) => ({ t: (e.innerText || e.getAttribute('aria-label') || '').trim().slice(0, 28), ...e.getBoundingClientRect().toJSON() }))
    .filter((b) => b.width > 1 && b.height > 1 && (b.height < 44 || b.width < 44));

  return {
    h1: q('h1').length,
    headOrder: order,
    heads,
    imgs: q('img').length,
    noAlt: q('img').filter((i) => !i.getAttribute('alt')).length,
    noDims: q('img').filter((i) => !i.getAttribute('width') || !i.getAttribute('height')).length,
    lazyHero: q('img')[0]?.getAttribute('loading'),
    wa: q('a[href*="wa.me"]').length,
    waText: [...new Set(q('a[href*="wa.me"]').map((a) => a.innerText.replace(/\s+/g, ' ').trim()))],
    landmarks: ['nav', 'main', 'footer', 'header'].filter((t) => document.querySelector(t)),
    small,
    title: document.title,
    desc: document.querySelector('meta[name=description]')?.content?.length,
  };
});

console.log('\n— structure —');
check(r.h1 === 1, 'exactly one <h1>', `found ${r.h1}`);
check(r.headOrder, 'heading levels never skip', r.heads.join(','));
check(r.landmarks.length === 4, 'nav/main/footer/header present', r.landmarks.join(','));
check(r.title.includes('Heaven'), 'title set to the brand', r.title.slice(0, 58) + '…');
check(r.desc > 60 && r.desc <= 165, 'meta description length', `${r.desc} chars`);

console.log('\n— media —');
check(r.noAlt === 0, 'every image has alt text', `${r.imgs} images, ${r.noAlt} missing`);
check(r.noDims === 0, 'every image has width+height (CLS)', `${r.noDims} missing`);
check(r.lazyHero === 'eager', 'hero image is eager, not lazy', String(r.lazyHero));

console.log('\n— the CTA spine —');
check(r.wa >= 3 && r.wa <= 5, 'CTA appears 3-5 times', `${r.wa} placements`);
check(r.waText.length === 1, 'identical wording every time', r.waText.join(' | '));

console.log('\n— nothing stranded mid-animation —');
// Regression proof: the hero entrance timeline is created inside
// document.fonts.ready.then(), which escapes useGSAP's context. Under
// StrictMode's double mount two timelines raced and left .hero-panel near
// opacity 0 — the hero image vanished in dev while production looked fine.
const stranded = await page.evaluate(() => {
  const sel = ['.hero-panel', '.hero-panel-inner', '.hero-fade', '.hero-title', '.tile'];
  return [...document.querySelectorAll(sel.join(','))]
    .map((e) => ({ c: e.className.toString().split(' ')[0], o: +getComputedStyle(e).opacity }))
    .filter((x) => x.o > 0 && x.o < 0.95);
});
check(stranded.length === 0, 'hero + tiles fully opaque after settle',
  stranded.map((s) => `.${s.c} @${s.o}`).join(', '));

console.log('\n— mobile (390px) —');
check(r.small.length === 0, 'all tap targets >= 44px',
  r.small.map((s) => `"${s.t}" ${Math.round(s.width)}x${Math.round(s.height)}`).join('; ') || '');
check(errors.length === 0, 'no console errors', errors.join(' | '));

/* ---- content integrity: facts must match the brief ---- */
console.log('\n— content integrity —');
const facts = [
  ['+880 1960-481983', 'phone'],
  ['heavenfurnituremart@gmail.com', 'email'],
  ['Agrabad Access Road', 'address'],
  ['8801960481983', 'whatsapp number'],
  ['Abul Kalam Bhuiyan', 'managing director'],
  ['nationwide BFIOA recognition', 'BFIOA milestone'],
  ['International Furniture Fair', 'fair milestone'],
  ['Chamber of Commerce', 'chamber milestone'],
  ['reflection of lifestyle, taste, and comfort', 'MD quote (verbatim)'],
];
for (const [needle, label] of facts) check(brand.includes(needle), `brand.js contains ${label}`);

/* ---- reduced motion must render a complete, static page ---- */
console.log('\n— reduced motion —');
const rm = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const rmErr = [];
rm.on('pageerror', (e) => rmErr.push(e.message));
await rm.goto(BASE, { waitUntil: 'networkidle' });
await rm.evaluate(() => document.fonts.ready);
await rm.waitForTimeout(700);
const rmr = await rm.evaluate(() => {
  const faded = [...document.querySelectorAll('.step-panel, .manifesto .word, .tile')]
    .filter((e) => +getComputedStyle(e).opacity < 0.9).length;
  return { faded, h: document.body.scrollHeight, hidden: [...document.querySelectorAll('h1,h2')].filter(e=>!e.offsetParent && getComputedStyle(e).display==='none').length };
});
check(rmr.faded === 0, 'nothing left mid-animation', `${rmr.faded} faded elements`);
check(rmr.h > 3000, 'full page renders', `${rmr.h}px`);
check(rmErr.length === 0, 'no errors under reduced motion', rmErr.join(' | '));

await browser.close();
console.log(fails ? `\n${fails} CHECK(S) FAILED\n` : '\nAll checks passed.\n');
process.exit(fails ? 1 : 0);
