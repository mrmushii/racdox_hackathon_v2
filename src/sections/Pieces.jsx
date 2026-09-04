import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, reduced } from '../lib/gsap.js';
import { pieces } from '../content/brand.js';
import Picture from '../components/Picture.jsx';

/**
 * A seamless marquee of single pieces.
 *
 * The naive version has a visible seam at the wrap. This uses the corpus's fix:
 * `modifiers` wraps x with a modulo, so the track loops without a jump and
 * without doubling the DOM. The list is rendered twice, and the wrap distance is
 * exactly one copy.
 *
 * `ease: 'none'` — a marquee that accelerates reads as broken. It is also the
 * one continuous motion on a page whose other movement is all scroll-linked,
 * which is what keeps it from feeling like decoration.
 */
export default function Pieces() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (reduced()) return;
      const tween = gsap.to('.marquee-track', {
        xPercent: -50,
        duration: 42, // slow. Furniture is heavy.
        ease: 'none',
        repeat: -1,
        modifiers: { xPercent: gsap.utils.unitize((x) => parseFloat(x) % 50) },
      });
      // Slow to a near-stop on hover so a piece can actually be looked at.
      const el = root.current;
      const slow = () => gsap.to(tween, { timeScale: 0.15, duration: 0.6, ease: 'power2.out' });
      const go = () => gsap.to(tween, { timeScale: 1, duration: 0.6, ease: 'power2.out' });
      el.addEventListener('pointerenter', slow);
      el.addEventListener('pointerleave', go);
      return () => {
        el.removeEventListener('pointerenter', slow);
        el.removeEventListener('pointerleave', go);
      };
    },
    { scope: root }
  );

  const track = [...pieces.items, ...pieces.items];

  return (
    <section ref={root} className="bg-base py-2xl">
      <p className="shell caption eyebrow text-ink-muted">{pieces.eyebrow}</p>

      <div className="mt-lg overflow-hidden">
        <ul className="marquee-track flex w-max gap-[clamp(0.75rem,1.5vw,1.5rem)]">
          {track.map((item, i) => (
            <li key={`${item.image}-${i}`} className="w-[clamp(13rem,22vw,20rem)] shrink-0">
              <div className="aspect-[4/5] overflow-hidden border border-line">
                <Picture
                  name={item.image}
                  alt={`${item.label} by Heaven Furniture Mart`}
                  sizes="clamp(13rem, 22vw, 20rem)"
                  className="block h-full w-full"
                  imgClassName="h-full w-full object-cover"
                />
              </div>
              <p className="caption mt-sm text-ink-muted">{item.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
