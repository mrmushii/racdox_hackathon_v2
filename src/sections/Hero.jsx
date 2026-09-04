import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, SplitText, reduced } from '../lib/gsap.js';
import { hero, contact } from '../content/brand.js';
import Picture from '../components/Picture.jsx';
import CTAButton from '../components/CTAButton.jsx';

/**
 * Framed panel on ivory — NOT the full-bleed cinematic hero every generic
 * furniture site ships.
 *
 * This executes "ornate product, quiet frame" literally: the page supplies the
 * calm, the photograph supplies the richness. Above the fold a stranger gets
 * WHAT (bespoke furniture + interior styling), WHERE (Agrabad, Chattogram) and
 * ONE action — criterion #2, satisfied without scrolling.
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

      document.fonts.ready.then(() => {
        if (cancelled) return;

        split = SplitText.create('.hero-title', { type: 'lines', mask: 'lines' });

        intro = gsap
          .timeline({ defaults: { ease: 'power2.out' } })
          .from(split.lines, { yPercent: 110, duration: 1, stagger: 0.08 })
          .from('.hero-fade', { y: 16, opacity: 0, duration: 0.8, stagger: 0.12 }, '-=0.6')
          .from('.hero-panel', { yPercent: 6, opacity: 0, duration: 1 }, '-=1');

        ScrollTrigger.refresh();
      });

      // Parallax. Displacement stays under 8% and scrub lags 1.5s — that lag is
      // what reads as depth rather than as a moving picture.
      gsap.to('.hero-panel-inner', {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      });

      return () => {
        cancelled = true;
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
      className="relative bg-base pt-[clamp(7rem,14vw,11rem)] pb-[clamp(3rem,8vw,7rem)]"
    >
      <div className="shell grid grid-cols-12 items-center gap-y-xl gap-x-[clamp(1rem,2vw,2rem)]">
        {/* Copy sits in columns 1-6. Asymmetric: the corpus almost never centres. */}
        <div className="col-span-12 lg:col-span-6 xl:col-span-5">
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

        {/* The panel: 4:5 portrait, hairline frame, tan block offset behind it.
            No drop shadow anywhere on this page — depth comes from the
            photograph's own light and from a hairline border. */}
        <div className="hero-panel relative col-span-12 lg:col-span-6 xl:col-start-7 xl:col-span-6">
          <div
            aria-hidden="true"
            className="absolute -bottom-[clamp(0.75rem,1.5vw,1.5rem)] -right-[clamp(0.75rem,1.5vw,1.5rem)]
                       hidden h-full w-full bg-tan/35 sm:block"
          />
          <div className="hero-panel-inner relative aspect-[4/5] overflow-hidden border border-line">
            <Picture
              name="hero-bed"
              alt="A bespoke emerald velvet bed with a walnut frame, made by Heaven Furniture Mart"
              priority
              sizes="(min-width: 1024px) 46vw, 92vw"
              className="block h-full w-full"
              imgClassName="h-full w-full object-cover object-[50%_72%]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
