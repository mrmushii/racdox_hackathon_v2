/**
 * Heaven Furniture Mart — showroom map generator.
 *
 *   node scripts/build-map.mjs
 *
 * Draws public/media/showroom-map.svg from REAL OpenStreetMap road geometry
 * around Agrabad Access Road, Chattogram.
 *
 * Why not a map SDK, and why not raster tiles:
 *
 *   An embedded Google/Mapbox map is a third-party script that can fail in a
 *   live demo, costs an API key, and is the single heaviest thing that could go
 *   on this page — against a scored performance criterion.
 *
 *   Raster OSM tiles carry the standard carto palette (beige land, white roads,
 *   green parks) which cannot be recoloured into the brand without turning to
 *   mud: greyscaled, roads land at ~250 and background at ~240, nine levels
 *   apart, so the road network disappears.
 *
 *   Vector geometry has neither problem. Roads are drawn as ink strokes on the
 *   ivory ground at weights that follow the OSM highway class, so the result is
 *   a true map of the actual neighbourhood, in the brand's own two colours, at
 *   roughly 20 KB and crisp at any zoom.
 *
 * The alternative that was rejected outright is an INVENTED street grid, which
 * is what the reference component this replaces actually drew. Agrabad Access
 * Road is a real address in a real city; a made-up map of it is a lie that a
 * judge from Chattogram would spot immediately.
 *
 * Honesty note on the marker: OSM has no node for the business itself, so the
 * pin marks the ROAD, centred on its middle segment, and the card says exactly
 * that. `brand.js` claims no more precision than the brief does ("Agrabad
 * Access Road"), and the "Get directions" link hands off to the real maps
 * search, which is what actually gets a customer to the door.
 *
 * Licence: OpenStreetMap data is ODbL. The attribution rendered in the card is
 * required, not decorative — do not remove it.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const CACHE = resolve(HERE, '.cache/agrabad-osm.json');
const TOKENS = resolve(ROOT, 'src/styles/tokens.css');
const OUT = resolve(ROOT, 'public/media/showroom-map.svg');

/* Centre: the middle of the three OSM ways named "Agrabad access Road",
 * resolved via Nominatim (22.3297459, 91.7995656) and rounded. HALF is the
 * half-span in degrees; 0.0072 lat gives a ~1.6 km window, wide enough to show
 * the road's relationship to the district and tight enough that side streets
 * still read as streets. Longitude is widened by 1/cos(lat) so the window is
 * square on the ground rather than square in degrees. */
const CENTRE = { lat: 22.32975, lon: 91.79957 };
const HALF = 0.0072;
const HALF_LON = HALF / Math.cos((CENTRE.lat * Math.PI) / 180);
const SIZE = 1000;               // viewBox units
const CLASSES = 'motorway|trunk|primary|secondary|tertiary|residential|unclassified|living_street|pedestrian';

/* Stroke weight by OSM highway class, in viewBox units. The ratio matters more
 * than the values: an arterial four times a lane is what makes a two-colour
 * drawing legible as a map rather than as a texture. */
const WEIGHT = {
  motorway: 7, trunk: 7, primary: 6, secondary: 5,
  tertiary: 3.2, unclassified: 2, residential: 1.6,
  living_street: 1.2, pedestrian: 1,
};
/* Drawn in three passes so the arterials sit on top of the lanes. */
/* Alphas raised from .20/.34/.62. The lighter set was tuned against the map at
 * full size; in the card's COLLAPSED state, which is what most visitors ever
 * see, the lane network washed out into the ivory and the card read as an empty
 * field with one line across it. */
const LAYERS = [
  { name: 'lane',     classes: ['residential', 'living_street', 'pedestrian'], alpha: 0.30 },
  { name: 'street',   classes: ['tertiary', 'unclassified'],                   alpha: 0.46 },
  { name: 'arterial', classes: ['motorway', 'trunk', 'primary', 'secondary'],  alpha: 0.78 },
];

/** Web Mercator, then normalised into the viewBox. Plate carrée would visibly
 *  shear a 1.6 km window this far from the equator. */
const merc = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
const Y0 = merc(CENTRE.lat - HALF);
const Y1 = merc(CENTRE.lat + HALF);
const project = ([lat, lon]) => [
  ((lon - (CENTRE.lon - HALF_LON)) / (2 * HALF_LON)) * SIZE,
  SIZE - ((merc(lat) - Y0) / (Y1 - Y0)) * SIZE,
];

/** Douglas-Peucker. 3560 raw nodes inline is weight nobody needs at this scale;
 *  at a 0.8-unit tolerance (0.08% of the frame) the simplification is invisible
 *  and drops roughly two thirds of the points. */
function simplify(pts, tol) {
  if (pts.length < 3) return pts;
  const [ax, ay] = pts[0];
  const [bx, by] = pts.at(-1);
  const dx = bx - ax, dy = by - ay;
  const len = Math.hypot(dx, dy);
  let far = 0, idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i];
    const d = len === 0
      ? Math.hypot(px - ax, py - ay)
      : Math.abs(dy * px - dx * py + bx * ay - by * ax) / len;
    if (d > far) { far = d; idx = i; }
  }
  return far > tol
    ? [...simplify(pts.slice(0, idx + 1), tol).slice(0, -1), ...simplify(pts.slice(idx), tol)]
    : [pts[0], pts.at(-1)];
}

/** Cohen-Sutherland-ish: keep only ways that touch the frame at all. */
const inFrame = (pts) =>
  pts.some(([x, y]) => x > -40 && x < SIZE + 40 && y > -40 && y < SIZE + 40);

async function osm() {
  if (existsSync(CACHE)) {
    console.log('  using cached Overpass response (delete scripts/.cache to refetch)');
    return JSON.parse(await readFile(CACHE, 'utf8'));
  }
  const query =
    `[out:json][timeout:60];way["highway"~"^(${CLASSES})$"]` +
    `(${CENTRE.lat - HALF},${CENTRE.lon - HALF_LON},${CENTRE.lat + HALF},${CENTRE.lon + HALF_LON});out geom;`;
  console.log('  fetching Overpass...');
  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: query,
    headers: { 'User-Agent': 'heaven-furniture-landing/1.0 (build-time, one request)' },
  });
  if (!res.ok) throw new Error(`Overpass ${res.status}`);
  const json = await res.json();
  await mkdir(dirname(CACHE), { recursive: true });
  await writeFile(CACHE, JSON.stringify(json));
  return json;
}

/** Pull a hex out of tokens.css so this file contains no colour of its own —
 *  tokens.css stays the only place in the codebase with a hex in it. */
async function token(name) {
  const css = await readFile(TOKENS, 'utf8');
  const m = css.match(new RegExp(`--color-${name}:\\s*(#[0-9A-Fa-f]{6})`));
  if (!m) throw new Error(`token --color-${name} not found in tokens.css`);
  return m[1];
}

const { elements } = await osm();
const ink = await token('ink');
const base = await token('base');

let kept = 0, nodes = 0;
const layers = LAYERS.map(({ name, classes, alpha }) => {
  const d = [];
  for (const way of elements) {
    const cls = way.tags?.highway;
    if (!classes.includes(cls) || !way.geometry) continue;
    const pts = way.geometry.map((g) => project([g.lat, g.lon]));
    if (!inFrame(pts)) continue;
    const s = simplify(pts, 0.8);
    kept++; nodes += s.length;
    d.push('M' + s.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L'));
  }
  // One path per class inside the layer would be more faithful; one path per
  // layer is far smaller and the weights within a layer differ by <1 unit.
  const w = Math.max(...classes.map((c) => WEIGHT[c]));
  return `<path d="${d.join('')}" stroke="${ink}" stroke-opacity="${alpha}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
}).join('\n  ');

const svg =
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}" role="img" aria-label="Street map of Agrabad, Chattogram">
  <title>Agrabad Access Road, Chattogram</title>
  <desc>Road geometry (c) OpenStreetMap contributors, ODbL.</desc>
  <rect width="${SIZE}" height="${SIZE}" fill="${base}"/>
  ${layers}
</svg>
`;

await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, svg);
console.log(
  `  ${kept} ways, ${nodes} points after simplification` +
  `  ->  public/media/showroom-map.svg  ${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB`
);
