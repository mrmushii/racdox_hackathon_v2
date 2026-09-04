/** Measures LCP, CLS and transferred bytes on a cold, throttled load. */
import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

let bytes = 0;
const byType = {};
page.on('response', async (r) => {
  try {
    const b = (await r.body()).length;
    bytes += b;
    const t = (r.url().split('.').pop() || '').split('?')[0].slice(0, 5);
    byType[t] = (byType[t] || 0) + b;
  } catch {}
});

// Fast 3G-ish, to approximate conference wifi.
const cdp = await ctx.newCDPSession(page);
await cdp.send('Network.emulateNetworkConditions', {
  offline: false, latency: 40, downloadThroughput: (5 * 1024 * 1024) / 8, uploadThroughput: (1024 * 1024) / 8,
});

await page.goto('http://localhost:4173', { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(2500);

const m = await page.evaluate(
  () =>
    new Promise((res) => {
      let lcp = 0, cls = 0;
      new PerformanceObserver((l) => { for (const e of l.getEntries()) lcp = e.startTime; })
        .observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value; })
        .observe({ type: 'layout-shift', buffered: true });
      setTimeout(() => {
        const nav = performance.getEntriesByType('navigation')[0];
        res({ lcp, cls, dcl: nav.domContentLoadedEventEnd, load: nav.loadEventEnd });
      }, 600);
    })
);

console.log(`LCP   ${(m.lcp / 1000).toFixed(2)}s   ${m.lcp < 2500 ? 'PASS' : 'FAIL'} (<2.5s)`);
console.log(`CLS   ${m.cls.toFixed(4)}    ${m.cls < 0.05 ? 'PASS' : 'FAIL'} (<0.05)`);
console.log(`DCL   ${(m.dcl / 1000).toFixed(2)}s`);
console.log(`load  ${(m.load / 1000).toFixed(2)}s`);
console.log(`\ntransferred on first view: ${(bytes / 1024 / 1024).toFixed(2)} MB`);
console.log(Object.entries(byType).sort((a,b)=>b[1]-a[1]).slice(0,6)
  .map(([k, v]) => `  ${k.padEnd(6)} ${(v / 1024).toFixed(0)} KB`).join('\n'));
await browser.close();
