import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, reduced } from '../lib/gsap.js';
import { material } from '../content/brand.js';
import AmbientVideo from '../components/AmbientVideo.jsx';

/**
 * Texture at 1:1 — a full-bleed macro of real craftsmanship.
 *
 * No analogue exists in either reference corpus, because none of those brands
 * sells a physical object. This is the most on-brief, least-seen section
 * available.
 *
 * The clip is the first 2.5s of the "craftsmanship" file — gilt carving on blue
 * velvet, nailhead studs, a light sweep across tufted emerald. An earlier pass
 * recorded that file as glassware and discarded it; that description came from
 * sampling it at 5s. Its still is a 1122px crop from a photograph rather than a
 * frame grabbed from 720p video, which is what made the previous version of
 * this section look soft.
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
        ease: 'power2.out',
        stagger: 0.12,
        scrollTrigger: { trigger: root.current, start: 'top 65%' },
      });

      // Slow drift. Under 8% displacement; more looks broken.
      gsap.to('.macro-inner', {
        yPercent: -7,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="on-deep relative bg-deep text-on-deep">
      <div className="grid grid-cols-12 items-stretch">
        <div className="relative col-span-12 h-[54svh] overflow-hidden lg:col-span-7 lg:h-auto lg:min-h-[88svh]">
          <AmbientVideo
            name="craft-detail"
            poster="material-goldleaf"
            alt="Gilt carving, nailhead trim and tufted velvet on a bespoke frame"
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="macro-inner absolute inset-0 h-[114%] w-full"
            mediaClassName="h-full w-full object-cover"
          />
        </div>

        <div className="col-span-12 flex items-center px-[var(--gutter)] py-2xl lg:col-span-5 lg:pl-2xl">
          <div>
            <p className="caption eyebrow text-gold">{material.eyebrow}</p>
            <h2 className="display mt-md text-display-lg">{material.headline}</h2>
            <p className="lede mt-lg text-muted-deep">{material.lede}</p>

            <dl className="mt-xl border-t border-line-deep">
              {material.specs.map((s) => (
                <div key={s.k} className="spec flex justify-between gap-md border-b border-line-deep py-md">
                  <dt className="caption text-muted-deep">{s.k}</dt>
                  <dd className="caption text-on-deep">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
