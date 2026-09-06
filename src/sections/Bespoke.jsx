import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, reduced } from '../lib/gsap.js';
import { bespoke } from '../content/brand.js';
import AmbientVideo from '../components/AmbientVideo.jsx';
import Picture from '../components/Picture.jsx';
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
 * THE FRAME CHANGES WITH THE STEP, and that is what turns a list into a
 * sequence: the showroom where it starts, the machine that cuts it, the hands
 * that finish it, the room it ends in. Two of the four are real footage. An
 * earlier version held one clip across all four steps, which meant the pinned
 * scrub was moving text past a static picture — the visitor could see the
 * device working and had no reason to care that it was.
 *
 * The frame is 4:5 rather than the clips' native 9:16, because the sequence
 * mixes portrait video with photographs and a 9:16 well would have cropped a
 * room down to a slot. 4:5 crops ~28% from the top and bottom of each clip,
 * which on both of them is machine bed and ceiling.
 *
 * Pinning is registered inside matchMedia(min-width:1024px). Below that it
 * degrades to a stacked list with the video above, because pinning a scrubbed
 * section on a short viewport eats the entire screen.
 */
export default function Bespoke() {
  const root = useRef(null);
  const n = bespoke.steps.length;


  useGSAP(
    () => {
      const panels = gsap.utils.toArray('.step-panel', root.current);
      const frames = gsap.utils.toArray('.step-media', root.current);
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
        gsap.set(frames.slice(1), { opacity: 0 });
        gsap.set(ticks.slice(1), { scaleX: 0 });

        // EACH STEP HOLDS BEFORE IT HANDS OVER. The first version had none: a
        // step was fully legible at exactly one instant of the scrub and began
        // dissolving on the very next pixel, so "01 Consult" flew past before it
        // could be read at all. HOLD is the fraction of each step's unit spent
        // stationary; the remainder is the handover.
        const HOLD = 0.62;
        const PASS = 1 - HOLD;
        // Extra dwell before the FIRST handover only. Step 01 is the one the
        // reader arrives on, mid-scroll, still settling into the section - so an
        // even share of the scrub gives it the least effective reading time of
        // the four. The lead-in buys it back.
        const LEAD = 0.45;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            // One unit of scroll per step, INCLUDING the last - it needs its own
            // dwell or "04 Install" appears exactly as the section releases.
            // Shorter on a phone: the same four steps, less thumb travel.
            end: `+=${Math.round((n + LEAD) * 88 * scale)}%`,
            pin: '.pin-stage',
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Reserve the trailing dwell so step 04 is held, not glimpsed.
        tl.to({}, { duration: n + LEAD });

        panels.forEach((panel, i) => {
          if (i === 0) return;
          const at = (i - 1) + HOLD + LEAD;   // hand over at the END of the previous hold
          // The outgoing step clears before the incoming arrives. A 1:1
          // crossfade leaves both near 50% at the midpoint, which reads as
          // doubled text.
          tl.to(panels[i - 1], { opacity: 0, yPercent: -8, duration: PASS * 0.55, ease: 'power1.in' }, at)
            .to(panel, { opacity: 1, yPercent: 0, duration: PASS * 0.55, ease: 'power1.out' }, at + PASS * 0.45)
            // The frames DO cross-dissolve rather than clearing first: two
            // photographs briefly overlaid is a dissolve, which is what the eye
            // expects of a frame. Held to the handover window so the picture is
            // not a half-blended double exposure for most of the section.
            .to(frames[i - 1], { opacity: 0, duration: PASS, ease: 'none' }, at)
            .to(frames[i], { opacity: 1, duration: PASS, ease: 'none' }, at)
            .to(ticks[i], { scaleX: 1, duration: PASS, ease: 'power1.inOut' }, at);
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
                         sm:aspect-[4/5] sm:w-[min(100%,calc(34svh*4/5))]
                         lg:w-[min(100%,calc(60svh*4/5))]"
            >
              {/* Under reduced motion nothing crossfades, so four absolutely
                  stacked frames would resolve to whichever is last in the DOM.
                  Only the first is kept there; the four steps still read in
                  full as a static list beside it. */}
              {bespoke.steps.map((s, i) => (
                <div
                  key={s.n}
                  className={`step-media absolute inset-0 ${i ? 'motion-reduce:hidden' : ''}`}
                >
                  {s.media.kind === 'video' ? (
                    <AmbientVideo
                      name={s.media.name}
                      alt={s.alt}
                      sizes="(min-width: 1024px) 32vw, 60vw"
                      className="h-full w-full"
                      mediaClassName="h-full w-full object-cover"
                    />
                  ) : (
                    <Picture
                      name={s.media.name}
                      alt={s.alt}
                      sizes="(min-width: 1024px) 32vw, 60vw"
                      className="block h-full w-full"
                      imgClassName="h-full w-full object-cover"
                    />
                  )}
                </div>
              ))}
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

            {/* The well. Its fixed height exists so the crossfading panels, which
                the timeline makes absolute, cannot shift layout. Under reduced
                motion nothing is made absolute and nothing crossfades — the four
                steps flow as a list — so the height has to release, or all four
                collide inside a 17rem box and land on top of the CTA. */}
            <div className="relative mt-lg h-[clamp(10.5rem,23svh,17rem)]
                            motion-reduce:h-auto motion-reduce:space-y-xl">
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
