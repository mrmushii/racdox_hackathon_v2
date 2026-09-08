import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, SplitText, reduced, EASE_OUT } from '../lib/gsap.js';
import { hero, contact } from '../content/brand.js';
import Picture from '../components/Picture.jsx';
import AmbientVideo from '../components/AmbientVideo.jsx';
import CTAButton from '../components/CTAButton.jsx';

/**
 * Framed panel on ivory that opens on scroll.
 *
 * AT REST it executes "ornate product, quiet frame" literally: the page supplies
 * the calm, the photograph supplies the richness. Above the fold a stranger gets
 * WHAT (bespoke furniture + interior styling), WHERE (Agrabad, Chattogram) and
 * ONE action — criterion #2, satisfied without scrolling.
 *
 * WHAT IS IN THE FRAME, and why it changed. The panel used to play the gold-leaf
 * clip full-size, and that was a scale error: 720x900 of macro footage shown at
 * ~660px is a hand and a fold of foil, so nobody could tell what object was
 * being gilded, and the hero never said "furniture" at all. The clip is now an
 * INSET at ~40% width, which is the size a macro is actually sharp at, and the
 * frame holds the dining suite — the sharpest, most obviously ornate photograph
 * in the set. Furniture reads in a second; the craft proof is still on screen.
 *
 * The inset also replaced a decorative `bg-tan/35` offset block. It does the
 * same depth job and carries content instead.
 *
 * THE EXPANSION is adapted from a supplied scroll-expand component, and it is
 * the mechanism that was taken, not the code. That component drives itself by
 * calling preventDefault() on wheel and touchmove and forcing
 * window.scrollTo(0, 0) until it finishes — which would fight Lenis for the same
 * events, and which (with no keyboard handler anywhere in it) leaves a keyboard
 * user unable to get past the hero at all. A pinned, scrubbed ScrollTrigger
 * produces the same picture while the scroll position stays the browser's:
 * Space and PgDn keep working, and Lenis keeps driving.
 *
 * It expands to 92vw, NOT edge to edge. `dining` is 1087px wide, so full-bleed
 * would upscale it, and the ivory margin is 70% of the palette — losing it at
 * the top of the page loses the thing that makes the page look like this brand.
 */
export default function Hero() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (reduced()) return;

      // SplitText measures glyph boxes. Splitting before the webfont lands
      // produces wrong line breaks, so this is gated, not optional.
      //
      // But work started in a promise outlives the effect that scheduled it, and
      // useGSAP's context only collects animations created SYNCHRONOUSLY. Under
      // StrictMode React mounts twice, so without this guard two timelines race
      // on the same nodes and .hero-panel is left stranded near opacity 0 — the
      // hero image vanishes in dev while production, which never double-mounts,
      // looks fine. `cancelled` retires the stale pass; the live one is reverted
      // explicitly on unmount.
      let cancelled = false;
      let split;
      let intro;
      let mm;

      document.fonts.ready.then(() => {
        if (cancelled) return;

        split = SplitText.create('.hero-title', { type: 'lines', mask: 'lines' });

        intro = gsap
          .timeline({ defaults: { ease: EASE_OUT } })
          .from(split.lines, { yPercent: 110, duration: 1, stagger: 0.08 })
          .from('.hero-fade', { y: 16, opacity: 0, duration: 0.8, stagger: 0.12 }, '-=0.6')
          // Deliberately NOT .hero-panel. GSAP writes the whole transform for an
          // element from one cache, so an entrance animating yPercent on the
          // panel re-wrote translate(0,0) as it settled and wiped the x the
          // expansion had set - the panel snapped left-aligned on first paint
          // and only corrected once the reader scrolled and came back. The
          // entrance owns the inner wrapper; the expansion owns the panel.
          .from('.hero-panel-rise', { yPercent: 6, opacity: 0, duration: 1 }, '-=1');

        // The expansion has to be built in here too, because it animates the
        // split lines that only exist once the font has landed.
        mm = gsap.matchMedia();

        // Two-column desktop with room to spare, and nothing else.
        //
        // WIDTH. Below lg the copy and the panel stack and the panel already
        // fills the whole track, so there is nothing for it to expand INTO: at
        // 768px the track is ~691px and the open panel ~706px, which spends a
        // full screen of scroll on fifteen pixels. It used to run there anyway.
        // On a phone it never ran, and shouldn't - that screen belongs to the
        // proposition, not to an effect.
        //
        // HEIGHT. The pinned stage has to FIT, or `start: top top` parks a
        // too-tall hero and clips its own caption. A square panel in a
        // six-column track plus the section's top padding needs ~700px, which a
        // laptop has and a landscape tablet at 1024x600 does not. Both queries
        // are live: rotate the device and matchMedia reverts or builds the pin
        // for the new size on its own.
        mm.add('(min-width: 1024px) and (min-height: 700px)', () => {
          const panel = root.current.querySelector('.hero-panel');
          const inner = root.current.querySelector('.hero-panel-inner');

          // `ml-auto` right-aligns the panel in its grid track, and that is the
          // correct static layout - it is what a no-JS, reduced-motion or phone
          // visitor gets. It is also incompatible with growing the panel past
          // the track: an auto margin resolves to 0 the moment the item is wider
          // than its container, so the untransformed left edge JUMPS 159px
          // outward mid-tween, and any translate calculated from the rest
          // position is wrong from that instant on. That was the bug that put
          // the expanded panel 116px off the left of the viewport.
          //
          // Neutralising the margin here makes the untransformed left edge the
          // track's left edge at every width, so every x below is measured from
          // one fixed origin. gsap.matchMedia reverts this set when the query
          // stops matching.
          // Captured, never measured on demand: reading the panel back during a
          // pin returns whatever the tween last wrote.
          let track = 0;
          let trackLeft = 0;
          let rest = 0;
          let restH = 0;
          const capture = () => {
            const w = panel.style.width;
            const h = inner.style.height;
            panel.style.width = '100%';
            track = panel.offsetWidth;
            // Where the track's left edge sits in the VIEWPORT, with the x the
            // tween has already written subtracted back out. Everything else
            // here is width-relative; centring the open panel is the one thing
            // that needs a viewport coordinate.
            trackLeft =
              panel.getBoundingClientRect().left - (Number(gsap.getProperty(panel, 'x')) || 0);
            panel.style.width = '';
            inner.style.height = '';
            rest = panel.offsetWidth;
            // Measured, not derived from an assumed ratio: the frame is 4:5 on a
            // phone and square from lg up, so `rest * 1.25` was wrong at exactly
            // the widths the pin runs at.
            restH = inner.offsetHeight;
            panel.style.width = w;
            inner.style.height = h;
          };
          capture();
          ScrollTrigger.addEventListener('refreshInit', capture);

          // Applied here rather than left to the timeline's from-state. A
          // scrubbed fromTo did not write its start transform on the first
          // paint - the panel sat at translate(0,0), i.e. left-aligned in its
          // track - and only snapped right once the reader had scrolled and
          // come back. Setting it explicitly makes the rest position true from
          // the first frame; matchMedia reverts both on exit.
          gsap.set(panel, { marginLeft: 0, x: track - rest });

          // 92vw, but never past the shell's own max width. `dining` is 1087px
          // wide, so on a 2560px monitor an uncapped 92vw would upscale it to
          // 2355 - a soft, obviously stretched photograph as the FIRST thing a
          // visitor on a large display sees. The cap also keeps the open frame
          // inside the same measure every other section on the page obeys, so
          // the hero still reads as belonging to the page at 2560 as it does at
          // 1280, where the cap never binds.
          const openW = () => Math.round(Math.min(window.innerWidth * 0.92, 1680));
          const openH = () => Math.round(Math.min(window.innerHeight * 0.78, openW() * 0.52));
          // The open panel is centred on the VIEWPORT, not right-aligned on the
          // track. `.shell` stops growing at its max width, so on a wide monitor
          // the track's right edge is well inside the viewport - holding the
          // panel's right edge there and growing it to 92vw pushed its left edge
          // hundreds of pixels off the left of the screen. Centring keeps the
          // ivory margin even on both sides at every width; below the shell's
          // max width it lands within a pixel of where it always did.
          const openX = () => Math.round((window.innerWidth - openW()) / 2 - trackLeft);

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              // Long enough that the growth reads as weight rather than as a
              // snap - furniture is heavy - and short enough that the hero is
              // not a toll gate. 80% was too quick to register as a move.
              end: '+=110%',
              pin: '.hero-stage',
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          // The lines are inside SplitText's `mask: lines` wrappers, which clip
          // horizontally. So opacity leads and travel follows: the text is gone
          // by 45% of the scrub, before the clip edge starts eating letters off
          // a line that is still fully opaque - which read as a bug, not a move.
          tl.to(split.lines[0], { xPercent: -18, ease: 'none', duration: 1 }, 0)
            .to(split.lines[1] ?? split.lines[0], { xPercent: 18, ease: 'none', duration: 1 }, 0)
            .to(split.lines, { opacity: 0, ease: 'none', duration: 0.45 }, 0)
            .to('.hero-fade', { y: -20, opacity: 0, ease: 'none', duration: 0.5, stagger: 0.04 }, 0)
            .to('.hero-copy', { opacity: 0, ease: 'none', duration: 0.5 }, 0.15)
            // Width and height rather than scale: scaling would drag the
            // hairline border and the inset's mount out of true with every other
            // rule on the page. Height is animated instead of aspect-ratio
            // because `aspect-ratio` is a string GSAP cannot interpolate; an
            // explicit height simply overrides the 4:5 the CSS supplies at rest.
            .fromTo(panel,
              { width: () => rest, x: () => track - rest },
              { width: openW, x: openX, ease: 'none' }, 0)
            .fromTo(inner,
              { height: () => restH },
              { height: openH, ease: 'none' }, 0)
            // The inset shrinks as the frame grows, so it stays a detail rather
            // than becoming a second picture.
            .fromTo('.hero-inset',
              { width: () => Math.round(rest * 0.42) },
              { width: () => Math.round(openW() * 0.14), ease: 'none' }, 0);

          return () => {
            ScrollTrigger.removeEventListener('refreshInit', capture);
            tl.scrollTrigger?.kill();
          };
        });

        ScrollTrigger.refresh();
      });

      return () => {
        cancelled = true;
        mm?.revert();
        intro?.revert();   // restores the pre-animation state, unlike kill()
        split?.revert();
      };
    },
    { scope: root }
  );

  return (
    <section
      id="top"
      ref={root}
      className="relative bg-base pt-[clamp(7rem,11vw,10rem)] pb-[clamp(3rem,8vw,7rem)]"
    >
      <div className="hero-stage">
        <div className="shell grid grid-cols-12 items-center gap-y-xl gap-x-[clamp(1rem,2vw,2rem)]">
          {/* Copy sits in columns 1-6. Asymmetric: the corpus almost never centres. */}
          <div className="hero-copy col-span-12 lg:col-span-6 xl:col-span-5">
            <p className="caption eyebrow hero-fade text-ink-muted">{hero.eyebrow}</p>

            <h1 className="hero-title display mt-md text-display-lg">{hero.headline}</h1>

            <p className="lede hero-fade mt-lg text-ink-muted">{hero.lede}</p>

            <div className="hero-fade mt-xl flex flex-wrap items-center gap-md">
              <CTAButton size="lg" />
              <a
                href={contact.phoneHref}
                className="caption group inline-flex min-h-[2.75rem] items-center gap-2 text-ink-muted"
              >
                <span className="border-b border-line pb-1 transition-colors duration-[600ms] group-hover:border-ink group-hover:text-ink">
                  {contact.phoneDisplay}
                </span>
              </a>
            </div>
          </div>

          {/* The panel. Hairline frame, no drop shadow anywhere on this page —
              depth comes from the photograph's own light, from a hairline
              border, and from the inset overlapping the frame's edge.

              It FILLS its six-column track. An earlier version capped the width
              off the viewport height to keep a 4:5 frame above the fold, and the
              cost was a 298px hole between the copy and the panel — two things
              pushed apart rather than a composition. The frame goes square from
              lg instead: full track width, and 634 + caption + the section's top
              padding still lands inside a 900px viewport. Portrait 4:5 stays
              below lg, where a phone has the height for it. */}
          <div className="hero-panel col-span-12 lg:col-span-6 xl:col-start-7 xl:col-span-6">
            <div className="hero-panel-rise relative">
              {/* w-full is load-bearing: `aspect-ratio` derives width from height when
                  width is auto, so once the timeline set an explicit height the frame
                  grew sideways too and each refresh compounded it. */}
              <div className="hero-panel-inner relative aspect-[4/5] w-full overflow-hidden border border-line lg:aspect-square">
                <Picture
                  name="dining"
                  alt="A bespoke dining suite by Heaven Furniture Mart: marble top, carved and nailhead-trimmed chairs"
                  priority
                  sizes="(min-width: 1024px) 46vw, 92vw"
                  className="hero-lcp block h-full w-full"
                  imgClassName="h-full w-full object-cover object-[50%_42%]"
                />
              </div>

              {/* The inset, overlapping the frame's lower-left corner and hanging
                  outside it. The ivory mount is what separates it from the
                  photograph beneath — a border alone disappears against a warm
                  image, and this page has no shadows to fall back on. A mount is
                  also the right idiom for a brand that frames things. */}
              <figure
                className="hero-inset absolute bottom-0 left-0 w-[42%]
                           -translate-x-[clamp(0.5rem,1.4vw,1.5rem)]
                           translate-y-[clamp(0.5rem,1.4vw,1.5rem)]
                           bg-base p-[clamp(0.3rem,0.6vw,0.6rem)]"
              >
                <div className="aspect-[4/5] overflow-hidden border border-line">
                  <AmbientVideo
                    name="gold-leaf"
                    alt="A craftsman laying gold leaf onto a carved timber frame in the Heaven Furniture Mart workshop"
                    eager
                    sizes="(min-width: 1024px) 18vw, 38vw"
                    className="h-full w-full"
                    mediaClassName="h-full w-full object-cover"
                  />
                </div>
              </figure>
            </div>

            <p className="caption mt-md text-right text-ink-muted">{hero.panelCaption}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
