import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, reduced, EASE_OUT } from '../lib/gsap.js';
import { material } from '../content/brand.js';
import AmbientVideo from '../components/AmbientVideo.jsx';
import RevealMask from '../components/RevealMask.jsx';

/**
 * Craft at 1:1, revealed by the reader's own scroll.
 *
 * The clip is a V-bit chamfering a panel — the machine half of the answer, and
 * the half a bespoke claim usually dodges. Everything else on this page argues
 * that the work is done by hand; this argues that "custom" does not therefore
 * mean approximate. Both halves are true and the section says so in one line.
 *
 * It sits on ivory rather than on the deep ground, for two reasons. The clip's
 * own palette is already the brand's — pale board, warm sawdust, brown shadow —
 * so it needs no grade and no dark surround to sit right. And the section
 * before it is deep teal: two dark sections back to back would push the page
 * past the ~20% teal the palette is built around.
 *
 * The mask is the second of the three ported interactions. Opening a frame is
 * the right gesture here specifically because the subject is a cut being made:
 * the frame opens as the groove does.
 */
export default function Material() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (reduced()) return;
      gsap.from('.spec', {
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: EASE_OUT,
        stagger: 0.12,
        scrollTrigger: { trigger: '.spec-list', start: 'top 80%' },
      });
    },
    { scope: root }
  );

  return (
    <section id="material" ref={root} className="section bg-base">
      <div className="shell grid grid-cols-12 items-center gap-x-[clamp(1rem,2vw,2rem)] gap-y-2xl">
        <div className="col-span-12 lg:col-span-5">
          <p className="caption eyebrow text-ink-muted">{material.eyebrow}</p>
          {/* display-md, not lg. This is the one two-sentence headline on the
              page, and at display-lg it ran to three cramped lines in a
              five-column box. The smaller step also keeps the page's single
              largest-type moment where it belongs — the footer mark. */}
          <h2 className="display mt-md text-display-md">{material.headline}</h2>
          <p className="lede mt-lg text-ink-muted">{material.lede}</p>

          <dl className="spec-list mt-xl border-t border-line">
            {material.specs.map((s) => (
              <div key={s.k} className="spec flex justify-between gap-md border-b border-line py-md">
                <dt className="caption text-ink-muted">{s.k}</dt>
                <dd className="caption text-ink">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <RevealMask
          className="col-span-12 lg:col-span-6 lg:col-start-7"
          caption={material.caption}
        >
          <div className="aspect-square w-full">
            <AmbientVideo
              name="cnc-score"
              alt="A V-bit router tracing a chamfered groove into a timber panel"
              sizes="(min-width: 1024px) 46vw, 92vw"
              className="h-full w-full"
              mediaClassName="h-full w-full object-cover"
            />
          </div>
        </RevealMask>
      </div>
    </section>
  );
}
