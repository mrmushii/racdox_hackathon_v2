/**
 * Heaven Furniture Mart — build-time asset pipeline.
 *
 * Source assets (../image, ../video) are ~42 MB against a <4 MB budget, and
 * "clean and fast" is a scored judging criterion. This script is the only thing
 * that writes public/media/. Run once; commit the output.
 *
 *   node scripts/process-assets.mjs
 *
 * Encoder settings are measured, not guessed. AVIF q50/effort6/4:2:0 was compared
 * against the source at 100% on a detail crop (marble veining, nailhead studs,
 * brass reflection) and is visually indistinguishable at ~112 KB for 1600px;
 * effort 9 saved 0 bytes over effort 6, so effort 6 is used.
 *
 * Two format decisions worth recording, both measured here:
 *
 *   No WebM. VP9 came out LARGER than H.264 on this footage (2.50 MB vs 1.28 MB
 *   on the workshop clip), so the second encode cost weight and bought nothing.
 *   Every browser in the support matrix plays H.264.
 *
 *   WebP at one width only, not a full ladder. It exists solely for Safari
 *   16.0-16.3, which predates AVIF; AVIF-capable browsers never fetch it, so
 *   paying for four widths of a fallback is disk weight nobody downloads.
 */
import sharp from 'sharp';
import ffmpegPath from 'ffmpeg-static';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, rm, writeFile, readdir, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const run = promisify(execFile);
const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const SRC_IMG = resolve(ROOT, '../image');
const SRC_VID = resolve(ROOT, '../video');
const OUT = resolve(ROOT, 'public/media');
const MANIFEST = resolve(ROOT, 'src/content/media.js');

const WIDTHS = [640, 1024, 1600, 2400];
// The WebP fallback exists only for Safari 16.0-16.3, which predates AVIF. No
// AVIF-capable browser ever fetches it, so it is deliberately cheap: one width,
// and a quality that would be too low for a primary format.
// Warming matrix. sharp's .tint() cannot be used for this: it tints luminance
// and throws the existing chroma away, which turns a room render sepia. This
// lifts red, holds green and pulls blue down, so the image warms and keeps its
// colour. Applied to the office set, which measures S=3-10% cool grey against
// S=21-59% warm everywhere else; it brings them to ~S=35%.
const WARM = [
  [1.10, 0.03, 0.00],
  [0.02, 1.02, 0.00],
  [0.00, 0.02, 0.88],
];

const WEBP_AT = 900;
const AVIF = { quality: 50, effort: 6, chromaSubsampling: '4:2:0' };
const WEBP = { quality: 62, effort: 6 };

/* --------------------------------------------------------------------------
 * Images.
 *
 * Dropped and why:
 *   5 x Gemini office interiors — #aeaaa9 at S=3% against S=21-59% warm
 *                                 everywhere else. Cool, generic, and they
 *                                 puncture the top-ranked luxury criterion.
 *                                 The brief's own category list is
 *                                 "Living, Bedroom, Dining, Bespoke".
 *   Minimalist Bed Set copy     — smaller duplicate of the 1696x2528 original.
 *   Classic Sofa set copy       — near-duplicate framing of the 3168px wide.
 *
 * `max` caps the ladder per slot: a collection tile never needs 2400px, and
 * every byte is charged against the performance criterion. The ladder is also
 * clamped to the source width, so nothing is ever upscaled.
 * ------------------------------------------------------------------------ */
const IMAGES = [
  { slug: 'hero-bed',      max: 1600, file: 'Minimalist Bed Set by Heaven Furniture Mart.jpeg',
    role: 'Hero still + mobile fallback. Same room as the hero video.' },
  { slug: 'showroom-wide', max: 2400, file: 'Classic Furniture Sofa set by Heaven Furniture Mart.jpeg',
    role: 'Intro full-bleed band. Widest frame in the set (3168x1344).' },
  { slug: 'living',        max: 1024, file: 'Emroiydery Sofa Set Heaven Furniture Mart.jpeg',
    role: 'Collections - Living. Gilt frame, grey velvet, embroidery.' },
  { slug: 'bedroom',       max: 1024, file: 'Luxury Bed by Heaven Furniture Mart.png',
    role: 'Collections - Bedroom. The only image carrying the brand teal.' },
  { slug: 'dining',        max: 1024, file: 'Luxury Dining Set By Heaven Furniture Mart.jpeg',
    role: 'Collections - Dining. Most credible photograph in the set.' },
  { slug: 'bespoke',       max: 1600, file: 'Gemini_Generated_Image_e7fjmge7fjmge7fj (4).jpeg',
    role: 'Collections - Bespoke. Carved chairs on a seamless backdrop.' },
  { slug: 'showroom-hall', max: 1024, file: 'Luxury Dining Table Set.png',
    role: 'Proof - showroom. Ivory and gold suite under a chandelier.' },
  { slug: 'showcase',      max: 1024, file: 'Luxury Showcase By Heaven Furniture Mart.jpeg',
    role: 'Detail - glazed display cabinet.' },
  { slug: 'sofa-blue',     max: 1024, file: 'Luxury Embroidery Sofa Set By Heaven Furniture Mart.jpeg',
    role: 'Secondary living - blue and gold embroidered sofa.' },
  { slug: 'cabinet-black', max: 1024, file: 'Minimal Shoe Box by Heaven Furniture Mart.jpeg',
    role: 'Bespoke secondary - black cabinet, brass handles.' },

  // Office & Study is a real category in the brief, and the supplied office
  // renders measured #aeaaa9 at S=3% against S=21-59% warm everywhere else -
  // cool grey that fights every other image on the page. Rather than drop the
  // category, the warmest of the six (black leather, timber arms) is graded to
  // S=22%, inside the range of the rest of the set. The brief explicitly allows
  // this: "You can touch them up ... adjust lighting, crop."
  { slug: 'office', max: 1024, file: 'Gemini_Generated_Image_e7fjmge7fjmge7fj (3).jpeg',
    grade: { saturation: 1.3 },
    role: 'Collections - Office & Study. Warm-graded from S=3% to S=22%.' },

  // The rest of the office set, same grade, for the Interiors section. Four
  // office tiles inside Collections would have swamped the four furniture ones,
  // so the category gets its own band instead of five slots in the grid.
  { slug: 'office-desk', max: 640, file: 'Gemini_Generated_Image_e7fjmge7fjmge7fj (1).jpeg',
    grade: { saturation: 1.3 }, role: 'Interiors - executive desk.' },
  { slug: 'office-boardroom', max: 640, file: 'Gemini_Generated_Image_e7fjmge7fjmge7fj (2).jpeg',
    grade: { saturation: 1.3 }, role: 'Interiors - boardroom table.' },
  { slug: 'office-meeting', max: 640, file: 'Gemini_Generated_Image_e7fjmge7fjmge7fj (5).jpeg',
    grade: { saturation: 1.3 }, role: 'Interiors - meeting table.' },
  { slug: 'office-workstation', max: 640, file: 'Gemini_Generated_Image_e7fjmge7fjmge7fj.jpeg',
    grade: { saturation: 1.3 }, role: 'Interiors - workstations.' },

  // Neither of these is the duplicate the audit recorded. Compared at 32x32
  // greyscale they differ from their supposed originals by a mean of ~51/255:
  // one is a tighter shot of the emerald bed, the other a different living room
  // entirely - dark carved wood on marble, not the gilt suite.
  { slug: 'bed-close', max: 1024, file: 'Minimalist Bed Set by Heaven Furniture Mart copy.jpeg',
    role: 'Proof gallery - closer frame of the emerald bed.' },
  { slug: 'living-classic', max: 1024, file: 'Classic Furniture Sofa set by Heaven Furniture Mart copy.jpeg',
    role: 'Proof gallery - carved dark-wood suite on marble.' },
];

/* 1:1 macro crops taken from the high-resolution stills. The Material section
 * previously used a frame lifted from 720p footage, which was visibly soft
 * beside real photography; a crop from a 1122px still carries far more detail
 * at the same on-screen size. */
const CROPS = [
  { slug: 'material-goldleaf', max: 1024, file: 'Luxury Bed by Heaven Furniture Mart.png',
    extract: { left: 0, top: 280, width: 1122, height: 1122 },
    role: 'Material macro. Carved gilt ornament on a mahogany bed frame.' },
];

/* No stills are lifted from footage any more. The Material section used a frame
 * pulled from 720p video, which read as visibly soft beside real photography.
 * It is replaced by `material-goldleaf` (a 1122px crop from a still) as the
 * poster, and by the `craft-detail` clip for the motion. */
const FRAMES = [];

/* --------------------------------------------------------------------------
 * Video — one clip. Everything else in video/ is unusable.
 *
 *   YTDown ... cozy-kitchen     — a modern American kitchen. Not furniture,
 *                                 not the brand, not the category.
 *
 *   Video_Concept_Craftsmanship — audited as "glassware"; actually a six-shot
 *                                 montage cutting every ~1.5s that ENDS ON AN
 *                                 AI-GENERATED FAKE E-COMMERCE PAGE with
 *                                 garbled text and "GET PRICE" buttons. No shot
 *                                 runs long enough to loop, and its subjects
 *                                 (dining room, showcase, black cabinet) are
 *                                 each already covered by a still.
 *
 *   Here_is_a_complete_cinematic — audited as a "slow push on the bed". It is
 *                                 not footage at all: it is a continuous AI
 *                                 MORPH reel in which furniture materialises
 *                                 into an empty room (which is why scene
 *                                 detection finds no cuts - there are none, it
 *                                 dissolves). Frame-by-frame, the clean bed
 *                                 window is 5.0-5.9s, under one second; the
 *                                 last three seconds are a fake storefront with
 *                                 burned-in "LET'S BRING YOUR DREAM HOME TO
 *                                 LIFE" ad copy, and it carries the sparkle
 *                                 watermark besides. Shipping it would read as
 *                                 AI-generated within three seconds, against
 *                                 the top-ranked judging criterion. The hero
 *                                 panel uses the emerald-bed STILL instead -
 *                                 same room, 1696x2528, no morph, no watermark.
 *
 * What survives is the workshop clip, which is real footage and the most
 * valuable asset in the set: verified clean across 1.5-9.5s, no watermark and
 * no overlay. It cuts once, at 11.7s - hands applying studs, then a macro of
 * the result, which is lifted as a still in FRAMES above.
 *
 * The page therefore carries exactly one moving image, and it is the only real
 * footage available. That is a stronger position than three AI reels.
 * ------------------------------------------------------------------------ */
const VIDEOS = [
  {
    slug: 'craft-process',
    file: 'YTDown.com_Shorts_Handcrafted-Luxury-Sofa-Process-Bespoke-_Media_lxhZF9s7fhY_001_720p.mp4',
    filter: 'scale=540:960',
    start: 1.5, duration: 7.0, crf: 33,
    palindrome: false,  // directional action - reversed hammering reads wrong
    role: 'Bespoke Highlight, 9:16 panel. Real workshop footage.',
  },
  {
    // The morph reel, used for what it actually shows rather than discarded for
    // what it ends on. 0.6-5.9s is an empty ivory room that furnishes itself:
    // exactly the brand's proposition, "your room, your measurements". The
    // 8.4s+ fake storefront and the burned-in ad copy are never reached, and
    // cropping to 1100px wide removes the sparkle watermark geometrically.
    slug: 'room-reveal',
    file: 'Here_is_a_complete_cinematic.mp4',
    // Cropped to 1100 wide (the watermark starts at ~1130) and NOT downscaled:
    // it plays in a full-width band, so anything smaller is upscaled on screen
    // and goes soft. Native crop is the sharpest this source can be.
    filter: 'crop=1100:619:0:60',
    start: 0.6, duration: 5.3, crf: 32,
    palindrome: false,
    role: 'Intro. An empty room furnishing itself.',
  },
  {
    // Re-audited: the first 2.5s of this clip is NOT the glassware the earlier
    // pass recorded. It is ornate macro craft - a gilt carved scroll on blue
    // velvet with nailhead studs, and a light sweep across tufted emerald.
    // Only 5s+ is glassware and cabinets, and only 8.4s+ is the fake page.
    slug: 'craft-detail',
    file: 'Video_Concept_Craftsmanship.mp4',
    // 900x720 rather than 16:9, because this plays in a near-square panel and a
    // wide clip cover-fitted there was upscaling 1.65x. Native crop, no scale.
    // 0.1-1.3s is the strongest window: gold-and-pink floral embroidery on navy
    // velvet, then a gilt carved scroll with nailhead studs. The emerald light
    // sweep at 1.7s and the quilted bed at 2.0s are weaker and are left out.
    filter: 'crop=900:720:0:0',
    start: 0.1, duration: 1.2, crf: 30,
    palindrome: true,   // no directional action; loops seamlessly
    role: 'Material. Macro of embroidery, gilt carving and nailhead trim.',
  },
  {
    // The kitchen walkthrough. Real handheld footage rather than AI, but of a
    // US house, and cool modern where everything else is warm ornate. Used for
    // the one thing in it that IS a Heaven category - fitted joinery: pantry
    // shelving, cabinetry, built-ins. 4-10s is that stretch; the mudroom and
    // the open-plan living at either end are not. Warm-graded to match the set,
    // which the brief explicitly permits.
    slug: 'interiors-joinery',
    file: 'YTDown.com_Shorts_Entrance-from-garage-cozy-kitchen-dreamh_Media_ybx69tQ2uDY_001_480p.mp4',
    filter: 'scale=540:960,colortemperature=temperature=4600,eq=saturation=1.18',
    start: 4.0, duration: 5.0, crf: 32,
    palindrome: false,
    role: 'Interiors. Fitted joinery - shelving, cabinetry, built-ins.',
  },
];

const kb = (n) => (n / 1024).toFixed(1) + ' KB';
const ffmpeg = (args) => run(ffmpegPath, ['-y', '-v', 'error', ...args]);
const sizeOf = async (p) => (await stat(p)).size;

/** Emit the AVIF ladder + one WebP fallback + an inline LQIP for one image. */
async function emit(input, { slug, max, role, extract, grade }, label) {
  if (extract || grade) {
    let pipe = sharp(input);
    if (extract) pipe = pipe.extract(extract);
    if (grade) pipe = pipe.recomb(WARM).modulate({ saturation: grade.saturation });
    input = await pipe.png().toBuffer();
  }
  const meta = await sharp(input).metadata();
  const cap = Math.min(max, meta.width);
  const widths = [...new Set([...WIDTHS.filter((w) => w < cap), cap])].sort((a, b) => a - b);

  let bytes = 0;
  for (const w of widths) {
    const buf = await sharp(input).resize({ width: w, withoutEnlargement: true }).avif(AVIF).toBuffer();
    await writeFile(resolve(OUT, `${slug}-${w}.avif`), buf);
    bytes += buf.length;
  }
  const fbW = Math.min(WEBP_AT, cap);
  const fb = await sharp(input).resize({ width: fbW, withoutEnlargement: true }).webp(WEBP).toBuffer();
  await writeFile(resolve(OUT, `${slug}-${fbW}.webp`), fb);
  bytes += fb.length;

  // Low-quality placeholder, inlined in the manifest: holds the frame's colour
  // while the real image decodes, so there is no white flash on a warm page.
  const lq = await sharp(input).resize({ width: 24 }).blur(1.2).webp({ quality: 40 }).toBuffer();

  console.log(
    `  ${slug.padEnd(15)} ${String(meta.width).padStart(4)}x${String(meta.height).padEnd(4)}` +
    ` -> ${widths.join('/')}${label}  ${kb(bytes).padStart(9)}`
  );

  return {
    slug, width: meta.width, height: meta.height,
    aspect: +(meta.width / meta.height).toFixed(4),
    widths, fallback: fbW,
    lqip: `data:image/webp;base64,${lq.toString('base64')}`,
    role,
  };
}

async function processVideo(entry) {
  const src = resolve(SRC_VID, entry.file);
  const mp4 = resolve(OUT, `${entry.slug}.mp4`);
  const still = resolve(OUT, `${entry.slug}-frame.png`);

  // Trim first, then filter, so a palindrome concat operates on the segment.
  const trim = ['-ss', String(entry.start), '-t', String(entry.duration), '-i', src];
  const vf = entry.palindrome
    ? ['-filter_complex', `[0:v]${entry.filter},split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1[v]`, '-map', '[v]']
    : ['-vf', entry.filter];

  await ffmpeg([...trim, ...vf, '-an', '-c:v', 'libx264', '-crf', String(entry.crf),
                '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4]);

  // Poster from the same trimmed segment, so it matches frame one exactly.
  await ffmpeg(['-ss', String(entry.start), '-i', src, '-frames:v', '1', '-vf', entry.filter, still]);
  const poster = await emit(still, { slug: `${entry.slug}-poster`, max: 640, role: `Poster for ${entry.slug}` }, ' [poster]');
  await rm(still);

  const size = await sizeOf(mp4);
  const shown = entry.duration * (entry.palindrome ? 2 : 1);
  console.log(
    `  ${entry.slug.padEnd(15)} ${shown}s${entry.palindrome ? ' palindrome' : '           '}` +
    ` mp4 ${kb(size)}`
  );

  return {
    video: {
      slug: entry.slug, poster: poster.slug,
      width: poster.width, height: poster.height, aspect: poster.aspect,
      duration: shown, lqip: poster.lqip, role: entry.role,
    },
    // The poster is a real image slot: it is what mobile is served in place of
    // the video, so it must reach the images map or <Picture> cannot find it.
    poster,
  };
}

async function main() {
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });
  await mkdir(dirname(MANIFEST), { recursive: true });

  console.log('\nImages');
  const images = [];
  for (const e of IMAGES) images.push(await emit(resolve(SRC_IMG, e.file), e, ''));

  console.log('\nCrops');
  for (const c of CROPS) images.push(await emit(resolve(SRC_IMG, c.file), c, ''));

  console.log('\nStills from footage');
  for (const f of FRAMES) {
    const tmp = resolve(OUT, `${f.slug}-frame.png`);
    await ffmpeg(['-ss', String(f.time), '-i', resolve(SRC_VID, f.file), '-frames:v', '1', tmp]);
    images.push(await emit(tmp, f, ''));
    await rm(tmp);
  }

  console.log('\nVideo');
  const videos = [];
  for (const e of VIDEOS) {
    const { video, poster } = await processVideo(e);
    videos.push(video);
    images.push(poster);
  }

  const files = await readdir(OUT);
  let total = 0;
  for (const f of files) total += await sizeOf(resolve(OUT, f));

  // Page payload = what one visitor actually downloads: AVIF at a single width
  // per image plus the MP4s. The WebP fallbacks and the unused ladder rungs sit
  // on disk but are never fetched by a browser that supports AVIF.
  let payload = 0;
  for (const i of images) payload += await sizeOf(resolve(OUT, `${i.slug}-${i.widths.at(-1)}.avif`));
  for (const v of VIDEOS) payload += await sizeOf(resolve(OUT, `${v.slug}.mp4`));

  const idx = (arr) => JSON.stringify(Object.fromEntries(arr.map((x) => [x.slug, x])), null, 2);
  await writeFile(MANIFEST,
    '// GENERATED by scripts/process-assets.mjs - do not edit by hand.\n' +
    '// Every entry carries intrinsic width/height so <Picture> can reserve the\n' +
    '// box before load and hold CLS at zero.\n\n' +
    `export const images = ${idx(images)};\n\n` +
    `export const videos = ${idx(videos)};\n`);

  const mb = (n) => (n / 1024 / 1024).toFixed(2);
  console.log(`\n${files.length} files on disk   ${mb(total)} MB   budget 4.00 MB  ${total / 1048576 < 4 ? 'PASS' : 'FAIL'}`);
  console.log(`worst-case page payload  ${mb(payload)} MB  (largest AVIF per image + both MP4s)`);
  console.log(`manifest: src/content/media.js\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
