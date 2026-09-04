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

      // The pin runs at EVERY width. It was gated to >=1024px on the grounds
      // that pinning a scrubbed section on a short viewport eats the screen —
      // true of the old layout, which showed all four steps at once and did not
      // fit. Showing one step at a time made the stage compact enough for a
      // phone, and gating it meant the page's signature interaction was absent
      // on exactly the devices most people would see it on.
      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px)', () => buildPin(1.0));
      mm.add('(max-width: 1023px)', () => buildPin(0.7));

      function buildPin(scale) {
        gsap.set(panels, { position: 'absolute', inset: 0 });
        gsap.set(panels.slice(1), { opacity: 0, yPercent: 8 });
        gsap.set(ticks.slice(1), { scaleX: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            // Shorter scrub distance on a phone: the same four steps, but less
            // thumb travel to get through them.
            end: `+=${Math.round((n - 1) * 90 * scale)}%`,
            pin: '.pin-stage',
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // The outgoing step clears before the incoming arrives. A 1:1 crossfade
        // leaves both at ~50% at the midpoint, which reads as doubled text.
        panels.forEach((panel, i) => {
          if (i === 0) return;
          const at = i - 1;
          tl.to(panels[i - 1], { opacity: 0, yPercent: -8, duration: 0.45, ease: 'power1.in' }, at)
            .to(panel, { opacity: 1, yPercent: 0, duration: 0.55, ease: 'power1.out' }, at + 0.45)
            .to(ticks[i], { scaleX: 1, duration: 1, ease: 'power1.inOut' }, at);
        });

        return () => tl.scrollTrigger?.kill();
      }

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section id="bespoke" ref={root} className="on-deep bg-deep text-on-deep">
      <div className="pin-stage flex min-h-svh flex-col justify-center overflow-hidden py-[clamp(2rem,7vw,5.5rem)]">
        <div className="shell grid grid-cols-12 items-center gap-x-[clamp(1rem,2vw,2rem)] gap-y-md lg:gap-y-xl">
          {/* 9:16 — the native shape of the footage and of a phone. Capped
              against viewport height so the pinned stage never overflows. */}
          <div className="col-span-12 sm:col-span-7 sm:col-start-3 lg:col-span-4 lg:col-start-1">
            {/* 16:9 band on a phone so the pinned stage fits the viewport;
                the clip's native 9:16 from sm up. object-cover crops to centre,
                which is where the hands and the frame are. */}
            <div
              className="relative mx-auto aspect-[16/9] w-full overflow-hidden border border-line-deep
                         sm:aspect-[9/16] sm:w-[min(100%,calc(34svh*9/16))]
                         lg:w-[min(100%,calc(60svh*9/16))]"
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
            <h2 className="display mt-sm text-display-md lg:mt-md">{bespoke.headline}</h2>

            {/* Progress: four segments, one per step. */}
            <ol className="mt-md flex gap-sm lg:mt-xl" aria-hidden="true">
              {bespoke.steps.map((s) => (
                <li key={s.n} className="h-px flex-1 bg-line-deep">
                  <span className="tick-fill block h-full origin-left bg-gold" />
                </li>
              ))}
            </ol>

            {/* The well. Fixed height on desktop so crossfading panels cannot
                shift layout; a plain stacked list below lg. */}
            <div className="relative mt-lg h-[clamp(10.5rem,23svh,17rem)]">
              {bespoke.steps.map((s) => (
                <article key={s.n} className="step-panel">
                  <div className="flex items-baseline gap-md">
                    <span className="caption text-gold">{s.n}</span>
                    <h3 className="display text-display-lg">{s.name}</h3>
                  </div>
                  <p className="lede mt-md max-w-[46ch] text-muted-deep">{s.body}</p>
                </article>
              ))}
            </div>

            <div className="mt-md lg:mt-xl">
              <CTAButton />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
