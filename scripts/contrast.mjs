/**
 * Contrast audit for every colour pair the page actually uses.
 * The palette's hard rules are contrast rules, so they are checked, not trusted.
 */
const hex = (h) => {
  const n = parseInt(h.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const over = (fg, a, bg) => fg.map((c, i) => Math.round(a * c + (1 - a) * bg[i]));
const lum = (rgb) => {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

const T = {
  base: hex('#F4F1EA'), surface: hex('#EAE5DA'), ink: hex('#4A3B31'),
  deep: hex('#152220'), deepSurf: hex('#34514F'), gold: hex('#E8A936'),
  goldDeep: hex('#A8792C'), tan: hex('#C9A882'), onDeep: hex('#F4F1EA'),
};

const pairs = [
  ['ink on base',                 T.ink, T.base, 4.5],
  ['ink-muted .62 (REJECTED, MUST FAIL)', over(T.ink, 0.62, T.base), T.base, 4.5],
  ['ink-muted .78 on base',       over(T.ink, 0.78, T.base), T.base, 4.5],
  ['ink on surface',              T.ink, T.surface, 4.5],
  ['ink-muted .78 on surface',    over(T.ink, 0.78, T.surface), T.surface, 4.5],
  ['on-deep on deep',             T.onDeep, T.deep, 4.5],
    ['muted-deep .72 on deep',      over(T.onDeep, 0.72, T.deep), T.deep, 4.5],
  ['gold on deep',                T.gold, T.deep, 4.5],
  ['deep on gold  (THE CTA)',     T.deep, T.gold, 4.5],
  ['gold on base  (MUST FAIL)',   T.gold, T.base, 4.5],
  ['white on gold (MUST FAIL)',   [255,255,255], T.gold, 4.5],
  ['gold-deep on base',           T.goldDeep, T.base, 3.0],
  ['gold on deep-surf',           T.gold, T.deepSurf, 3.0],
  ['on-deep on deep-surf',        T.onDeep, T.deepSurf, 4.5],
  ['tan on base  (MUST FAIL, not UI)', T.tan, T.base, 4.5],
];

let fails = 0;
for (const [name, fg, bg, need] of pairs) {
  const r = ratio(fg, bg);
  const must = name.includes('MUST FAIL');
  const ok = must ? r < need : r >= need;
  if (!ok) fails++;
  console.log(
    `${ok ? 'ok  ' : 'FAIL'}  ${name.padEnd(30)} ${r.toFixed(2).padStart(6)}:1  (need ${must ? '<' : '>='}${need})`
  );
}
console.log(fails ? `\n${fails} unexpected result(s).` : '\nAll pairs as expected.');
