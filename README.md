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

`vercel.json` sets three cache rules (JSON has no comments, and Vercel's schema
rejects unknown keys, so the reasoning lives here):

- `/assets/*` — one year, `immutable`. Vite content-hashes these filenames, so
  they can never go stale.
- `/media/*`, `/fonts/*` — one week. Stable, but *not* hashed: re-running the
  asset pipeline reuses the same filenames, so an immutable year would strand
  visitors on old media.
- everything — `nosniff` and a referrer policy.

## Assets — everything supplied is used

**All 4 videos and all 17 images are on the page.** Three earlier judgements
turned out to be wrong, and re-auditing each recovered the asset:

| Recorded as | Actually | Now used as |
|---|---|---|
| `Video_Concept_Craftsmanship` — "glassware in a cabinet" | Its first 1.3s is the best macro in the set: gold-and-pink embroidery on navy velvet, then a gilt scroll with nailhead studs. Glassware is at 5s. | Material |
| `Here_is_a_complete_cinematic` — "slow push on the bed" | A continuous AI morph: an empty room furnishing itself. Ends on a fake storefront at 8.4s. | Intro band |
| Two files — "duplicates" | Not duplicates. Compared at 32×32 greyscale they differ from their supposed originals by ~51/255: a tighter emerald-bed frame, and a different living room entirely. | Pieces marquee |
| Kitchen walkthrough — "not the category" | Real handheld footage, and the one thing in it that *is* a Heaven category is fitted joinery — pantry shelving, cabinetry, built-ins. | Interiors |
| 5 office renders — "puncture the luxury register" | Genuinely cool (S=3–10% against S=21–59% warm) — but gradeable, which the brief permits ("adjust lighting"). | Collections tile + Interiors |

Both AI clips' sparkle watermarks are removed by cropping, not masking, and
neither fake-storefront ending is reached.

**The showroom tour is the most credible asset on the page** and heads the
credibility section for that reason. Its segment was chosen by measurement: all
125s were scored every 2s for sharpness (stdev of a Laplacian convolution),
because the footage is handheld and much of it is motion-blurred. The tour
averages ~60; 12.8–22.6s is the longest shot with no scene cut and holds 64–73
throughout, so the clip is taken from inside it. The 0–4s title card and the
120s+ end card both carry burned-in text and are avoided.

**One supplied video is deliberately NOT used.** The second showroom file is
labelled *kazipara, mirpur, 280 no metro pillar* — that is Dhaka, and its
signage reads "HEAVEN Furniture", not "Heaven Furniture Mart". The brief fixes
the location as Agrabad Access Road, Chattogram, and brand facts are not ours to
change. If it is a second branch, say so and it goes in; captioning Dhaka
footage as the Agrabad showroom would assert something the brief does not.

**The office grade is a channel recombination, not a tint.** sharp's `.tint()`
tints *luminance* and discards the existing chroma, which turned the office
renders sepia — colour gone, not warmed. `WARM` in the pipeline lifts red, holds
green and pulls blue down, bringing them to ~S=35% with their colour intact.

## Motion

| | Effect |
|---|---|
| Brand moment | Teal veil + wordmark, lifts on a fixed 1.15s timeline. Waits on nothing, runs once per session. |
| Nav | Slim bar + full-screen menu sheet. Sheet wipes down, links stagger, preview image swaps per item. Real dialog: Escape, focus trap, focus restored, scroll frozen. |
| Hero | Masked `SplitText` line reveal, gated on `document.fonts.ready`; panel parallax |
| Intro | Scroll-linked word-by-word fill, then a room furnishing itself |
| Collections | Staggered entrance, slow hover scale inside `overflow:hidden` |
| **Bespoke** | **The signature** — pinned four-step scrub, one step at a time. Runs at every width, including phones. |
| Material | Macro loop + drift |
| CTA | Fill wipe from the left edge |

Everything is 0.6–1.0s on `easeInOutSine` — roughly three times slower than the
studio corpus. Symmetric easing makes things *settle*; furniture is heavy.

**All of it runs on mobile**, video included. Two earlier decisions were wrong
about that and both read as "it's broken on my phone": video was withheld below
`md` on battery grounds, so a phone saw four still images where the design has
motion; and the Bespoke pin was gated to `>=1024px`, so the page's signature
interaction — the thing it is meant to be remembered for — was absent on the
devices most people use. The pin now runs at every width with a shorter scrub
distance and a 16:9 video band, verified to fit the viewport at ten sizes from
360x740 to 1920x1080. Only `prefers-reduced-motion` still takes the static path.

The **footer** follows the standard furniture-retail arrangement — index
columns, contact, then the mark oversized across the base. Cancan, one of the
eight brands in the live audit, is the reference for that arrangement; the
content, palette, type and code are Heaven's own.

The **nav** deliberately does not. A three-tier retail header was built and
then replaced: it was the most shop-like element on the page, working against
the brief's first instruction — a luxury interior studio, *not* an online
furniture shop — and it cost 158px of every viewport. A slim bar plus a
full-screen sheet gives the hero its height back and reads as a studio.

The one risk of an overlay nav is burying the call to action behind a click, so
the CTA sits in the bar *and* is repeated inside the sheet. The sheet is a real
dialog, not a styled div: `aria-modal`, Escape to close, focus moved in on open
and returned to the trigger on close, Tab trapped inside, and the page behind it
frozen through **both** Lenis and the document — which one owns the wheel
depends on input device and reduced-motion state, so stopping only one leaves
the page scrolling under the menu on some inputs.

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
