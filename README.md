# Heaven Furniture Mart — Landing Page

One conversion-focused landing page for **Heaven Furniture Mart**, a bespoke
furniture and interior-styling house on Agrabad Access Road, Chattogram,
founded 2020 by Managing Director Abul Kalam Bhuiyan. Built for the RACDOX
hackathon.

## The rationale, in three lines

**The product is ornate classical** — carved gilt frames, tufted velvet,
marble, chandeliers — so the reference is Boca do Lobo, not Minotti: every
residential photograph measures 60–95% hue-30 warm, and a Swiss-minimal page
wrapped around baroque sofas fights its own product. The page therefore runs
**ornate product, quiet frame** — the layout supplies the calm the photographs
don't. **The palette is sampled from the logo, not the brief** (the mark's gold
is `#E8A936` at S=79%, *brighter* than the brief's approximation; its discipline
is area — one letter in six — not saturation), and **the owned system is the
process**, `01 Consult · 02 Design · 03 Craft · 04 Install`, because Heaven names
no products and employs no named designers, so inventing either would fabricate
a brand fact.

## Stack

Vite 6 · React 19 · Tailwind v4 · GSAP 3 (`useGSAP`, ScrollTrigger, SplitText) ·
Lenis. No component library, no animation library beyond GSAP.

## Run

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # -> dist/
npm run preview
```

Processed media is committed, so the app runs without the pipeline. To rebuild
it from the raw assets in `../image` and `../video`:

```bash
npm run assets       # 42 MB of source -> 3.2 MB of AVIF/WebP/MP4
```

## Verification

```bash
npm run contrast     # every colour pair the page uses, against WCAG
npm run shoot        # screenshots + horizontal-overflow assertion at 5 widths
npm run og           # re-render the 1200x630 share card
```

`npm run shoot` and `npm run og` need `npm run preview` running.

## Deploy

`vercel.json` is configured (build command, output dir, cache headers). Deploying
needs an interactive login, so run it yourself — in Claude Code, prefix with `!`
so the output lands in the session:

```bash
npx vercel            # first run: log in, then link the project
npx vercel --prod     # subsequent deploys
```

Any static host works — the output is a plain `dist/`, verified to serve
correctly from a bare static server with no 404s and no JS errors.

## Assets — what is used

**All four supplied videos' usable footage and 12 of the 17 images are now on the
page.** An earlier pass dropped two clips on evidence that turned out to be
partly wrong; re-auditing them frame by frame recovered both.

| Clip | Window used | Where |
|---|---|---|
| Workshop (real footage) | 1.5–9.5s | Bespoke — hands setting nailhead trim |
| `Video_Concept_Craftsmanship` | 0.1–1.3s | Material — floral embroidery on navy velvet, gilt scroll |
| `Here_is_a_complete_cinematic` | 0.6–5.9s | Intro — an empty room furnishing itself |

The first pass recorded `Video_Concept_Craftsmanship` as "glassware in a display
cabinet" and discarded it. That description came from sampling it at 5s. **Its
first 1.3 seconds are the best macro footage in the entire set** — gold-and-pink
embroidery on navy, then a gilt carved scroll with nailhead studs. The glassware
is at 5s and the AI-generated fake storefront is at 8.4s; neither is reached.

`Here_is_a_complete_cinematic` is a continuous AI morph rather than footage, so
it was dropped as a hero. Used for *what it shows* instead — an empty ivory room
that furnishes itself — it states the brand's proposition better than a static
shot could. Its fake storefront and burned-in ad copy start at 8.4s and are
never reached; both clips' sparkle watermarks are removed by cropping, not
masking.

**Office & Study** nearly lost its tile: the supplied office renders measure
`#aeaaa9` at S=3% against S=21–59% warm everywhere else. Rather than drop a real
category from the brief, the warmest of them is warm-graded in the pipeline to
S=22%, which the brief explicitly permits ("adjust lighting"). All five brief
categories now have a tile.

Still unused, deliberately: four remaining office renders (generic corporate
interiors), two duplicate images, and the kitchen walkthrough — a modern American
kitchen that is not furniture and not the category.

## Motion

| | Effect |
|---|---|
| Brand moment | Teal veil + wordmark, lifts on a fixed 1.15s timeline. Waits on nothing, runs once per session. |
| Nav | Hides on scroll-down, returns on scroll-up, transparent → teal pill; desktop hover preview panels |
| Hero | Masked `SplitText` line reveal, gated on `document.fonts.ready`; panel parallax |
| Intro | Scroll-linked word-by-word fill, then a room furnishing itself |
| Collections | Staggered entrance, slow hover scale inside `overflow:hidden` |
| **Bespoke** | **The signature** — pinned four-step scrub, one step at a time |
| Material | Macro loop + drift |
| CTA | Fill wipe from the left edge |

Everything is 0.6–1.0s on `easeInOutSine` — roughly three times slower than the
studio corpus. Symmetric easing makes things *settle*; furniture is heavy.

There is **no preloader** in the blocking sense. A real one runs 2.5–3.5s and
spends a tenth of the brief's 30-second comprehension budget on a spinner; none
of the eight live luxury furniture sites ships one. The brand moment here waits
for no resource — the hero is fully painted underneath it from the first frame,
which is why LCP is unchanged at 0.57s.

## Budget

| | Measured | Budget |
|---|---|---|
| `public/media` on disk | **3.2 MB** | 4 MB |
| Worst-case page payload | **1.4 MB** | — |
| JS bundle | **~122 KB gzip** | 250 KB |
| Fonts | **76 KB** | 180 KB |

AVIF with a single WebP fallback, `srcset` at 640/1024/1600/2400, never
upscaled past the source. Not one of the eight live luxury furniture brands
audited serves AVIF.

## Docs

`../PLAN.md` is the executable spec. `../docs/01-brand.md` is the brand system;
`../docs/03-brief-verbatim.md` is the source of truth for every brand fact.
