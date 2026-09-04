/**
 * Renders the 1200x630 OG card with the actual brand fonts, by screenshotting a
 * purpose-built layout in Chromium. Hackathon submissions get shared as links.
 */
import { chromium } from 'playwright';
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const font = (f) => readFile(`public/fonts/${f}`).then((b) => b.toString('base64'));
const [serif, sans] = await Promise.all([
  font('instrument-serif-latin.woff2'),
  font('inter-tight-var-latin.woff2'),
]);
const bed = (await readFile('public/media/hero-bed-1024.avif')).toString('base64');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:S;src:url(data:font/woff2;base64,${serif}) format('woff2')}
@font-face{font-family:N;src:url(data:font/woff2;base64,${sans}) format('woff2-variations');font-weight:100 900}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;display:flex;background:#F4F1EA;color:#4A3B31;font-family:N}
.l{width:620px;padding:64px 56px;display:flex;flex-direction:column;justify-content:space-between}
.mark{font-family:S;font-size:92px;line-height:.9;letter-spacing:-.02em;text-transform:uppercase}
.sub{font-size:13px;letter-spacing:.18em;text-transform:uppercase;margin-top:10px}
.h{font-family:S;font-size:46px;line-height:1.04;letter-spacing:-.02em;margin-top:28px}
.m{font-size:16px;color:rgb(74 59 49/.78);margin-top:14px}
.f{font-size:12px;letter-spacing:.1em;text-transform:uppercase;display:flex;gap:14px;align-items:center}
.g{color:#A8792C}
.r{flex:1;position:relative;overflow:hidden}
.r img{width:100%;height:100%;object-fit:cover;object-position:50% 72%}
</style></head><body>
<div class="l">
  <div>
    <div class="mark">Heaven</div>
    <div class="sub">Furniture Mart</div>
    <div class="h">Furniture,<br>Crafted Around You</div>
    <div class="m">Bespoke furniture and interior styling. Agrabad, Chattogram — since 2020.</div>
  </div>
  <div class="f"><span class="g">Designed. Crafted. Customized.</span></div>
</div>
<div class="r"><img src="data:image/avif;base64,${bed}"></div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const png = await page.screenshot();
await browser.close();

// JPEG: OG scrapers handle it universally and it is a third the weight.
await sharp(png).jpeg({ quality: 82 }).toFile('public/og.jpg');
await writeFile('public/og-debug.png', png);
console.log('og.jpg written');
