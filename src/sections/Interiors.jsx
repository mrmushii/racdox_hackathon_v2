import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, reduced } from '../lib/gsap.js';
import { interiors } from '../content/brand.js';
import Picture from '../components/Picture.jsx';
import AmbientVideo from '../components/AmbientVideo.jsx';

/**
 * The second half of the brief's own category line — "Bespoke Furniture &
 * Interior Styling" — and the home for the office and joinery material.
 *
 * The clip is the one piece of genuinely real, non-AI footage besides the
 * workshop: a walkthrough of fitted joinery. It is warm-graded in the pipeline
 * because it was shot cool and modern, against a set that is uniformly warm.
 */
export default function Interiors() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (reduced()) return;
      gsap.from('.int-cell', {
        y: 32,
        opacity: 0,
        duration: 0.9,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      });
    },
    { scope: root }
  );

  return (
    <section id="interiors" ref={root} className="section bg-surface">
      <div className="shell grid grid-cols-12 items-start gap-x-[clamp(1rem,2vw,2rem)] gap-y-xl">
        <div className="col-span-12 lg:col-span-4">
          <p className="caption eyebrow text-ink-muted">{interiors.eyebrow}</p>
          <h2 className="display mt-md text-display-lg">{interiors.headline}</h2>
          <p className="lede mt-lg text-ink-muted">{interiors.lede}</p>

          <div className="mt-xl overflow-hidden border border-line">
            <AmbientVideo
              name="interiors-joinery"
              alt="Fitted joinery: shelving, cabinetry and built-in storage"
              sizes="(min-width: 1024px) 30vw, 92vw"
              className="aspect-[9/13] w-full"
              mediaClassName="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="col-span-12 grid grid-cols-2 gap-[clamp(0.75rem,1.5vw,1.25rem)] lg:col-span-7 lg:col-start-6">
          {interiors.grid.map((g) => (
            <figure key={g.image} className="int-cell">
              <div className="aspect-[4/3] overflow-hidden border border-line">
                <Picture
                  name={g.image}
                  alt={`${g.label} by Heaven Furniture Mart`}
                  sizes="(min-width: 1024px) 28vw, 45vw"
                  className="block h-full w-full"
                  imgClassName="h-full w-full object-cover"
                />
              </div>
              <figcaption className="caption mt-sm text-ink-muted">{g.label}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
