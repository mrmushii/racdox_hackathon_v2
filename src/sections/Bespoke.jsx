import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, reduced } from '../lib/gsap.js';
import { bespoke } from '../content/brand.js';
import { videos } from '../content/media.js';
import AmbientVideo from '../components/AmbientVideo.jsx';
import CTAButton from '../components/CTAButton.jsx';

/**
 * THE SIGNATURE INTERACTION — the one move a visitor will remember.
 *
 * The brief names bespoke the #1 differentiator, so it gets the single
 * memorable interaction on the page: the workshop footage holds while 01-04
 * advance on scrub. It is simultaneously the memorable move, the stated
 * differentiator, and what makes the page read as a studio rather than a shop.
 *
 * One step is shown at a time, crossfading in a fixed-height well. Showing all
 * four at once made the pinned stage taller than the viewport, which clipped
 * both the video and the last step — and it left the scrub with nothing real
 * to do. One-at-a-time is both the fix and the better design.
 *
 * Pinning is registered inside matchMedia(min-width:1024px). Below that it
 * degrades to a stacked list with the video above, because pinning a scrubbed
 * section on a short viewport eats the entire screen.
 */
export default function Bespoke() {
  const root = useRef(null);
  const v = videos['craft-process'];
  const n = bespoke.steps.length;


  useGSAP(
    () => {
      const panels = gsap.utils.toArray('.step-panel', root.current);
      const ticks = gsap.utils.toArray('.tick-fill', root.current);

      if (reduced()) return; // static stacked list is the markup default

      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px)', () => {
        // Stack the panels so only the active one occupies the well.
        gsap.set(panels, { position: 'absolute', inset: 0 });
        gsap.set(panels.slice(1), { opacity: 0, yPercent: 8 });
        gsap.set(ticks.slice(1), { scaleX: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: `+=${(n - 1) * 90}%`,
            pin: '.pin-stage',
            scrub: 1,
            anticipatePin: 1,
          },
        });

        // power1.inOut for scrubbed motion: the user is driving, so it must be
        // gentle. Sharp easing under scrub reads as lag.
        // The outgoing step clears before the incoming arrives. A 1:1 crossfade
        // leaves both at ~50% at the midpoint, which reads as doubled text.
        panels.forEach((panel, i) => {
          if (i === 0) return;
          const at = i - 1;
          tl.to(panels[i - 1], { opacity: 0, yPercent: -8, duration: 0.45, ease: 'power1.in' }, at)
            .to(panel, { opacity: 1, yPercent: 0, duration: 0.55, ease: 'power1.out' }, at + 0.45)
            .to(ticks[i], { scaleX: 1, duration: 1, ease: 'power1.inOut' }, at);
        });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section id="bespoke" ref={root} className="on-deep bg-deep text-on-deep">
      <div className="pin-stage flex min-h-svh flex-col justify-center overflow-hidden py-[clamp(3.5rem,7vw,5.5rem)]">
        <div className="shell grid grid-cols-12 items-center gap-x-[clamp(1rem,2vw,2rem)] gap-y-xl">
          {/* 9:16 — the native shape of the footage and of a phone. Capped
              against viewport height so the pinned stage never overflows. */}
          <div className="col-span-12 sm:col-span-7 sm:col-start-3 lg:col-span-4 lg:col-start-1">
            <div
              className="relative mx-auto overflow-hidden border border-line-deep"
              style={{ aspectRatio: `${v.width} / ${v.height}`, maxHeight: '64svh' }}
            >
              <AmbientVideo
                name="craft-process"
                alt="Workshop footage: nailhead trim being set by hand along a timber frame"
                sizes="(min-width: 1024px) 32vw, 60vw"
                className="h-full w-full"
                mediaClassName="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <p className="caption eyebrow text-gold">{bespoke.eyebrow}</p>
            <h2 className="display mt-md text-display-md">{bespoke.headline}</h2>

            {/* Progress: four segments, one per step. */}
            <ol className="mt-xl flex gap-sm" aria-hidden="true">
              {bespoke.steps.map((s) => (
                <li key={s.n} className="h-px flex-1 bg-line-deep">
                  <span className="tick-fill block h-full origin-left bg-gold" />
                </li>
              ))}
            </ol>

            {/* The well. Fixed height on desktop so crossfading panels cannot
                shift layout; a plain stacked list below lg. */}
            <div className="relative mt-lg lg:h-[clamp(15rem,26svh,17rem)]">
              {bespoke.steps.map((s) => (
                <article key={s.n} className="step-panel mb-xl lg:mb-0">
                  <div className="flex items-baseline gap-md">
                    <span className="caption text-gold">{s.n}</span>
                    <h3 className="display text-display-lg">{s.name}</h3>
                  </div>
                  <p className="lede mt-md max-w-[46ch] text-muted-deep">{s.body}</p>
                </article>
              ))}
            </div>

            <div className="mt-xl">
              <CTAButton />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
