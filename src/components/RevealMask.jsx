import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, reduced, EASE } from '../lib/gsap.js';

/**
 * A frame that opens as the reader scrolls: a `clip-path` inset that starts
 * closed on all four sides and arrives at the full image.
 *
 * Ported from a framer-motion reference (`useScroll` -> `useSpring` ->
 * `useTransform` -> a style object). Re-authored as a single scrubbed
 * ScrollTrigger because this project runs one animation system, and re-shaped
 * in two ways that matter:
 *
 *  - The tween drives two REGISTERED custom properties (see the @property rules
 *    in globals.css) rather than a string built in JS every frame. Registering
 *    them gives the browser typed interpolation, so the clip-path animates on
 *    the compositor instead of being re-parsed 60 times a second.
 *
 *  - The reference's default shape is a circle. A circular crop on carved or
 *    machined work throws away exactly the thing being shown, so this ships the
 *    rounded-inset variant only, and the corner radius relaxes to square as the
 *    frame opens — the shape resolves into the photograph rather than staying a
 *    decorated cut-out.
 *
 * Under reduced motion the element renders fully open and no trigger is created
 * at all: the section is complete and static, not merely un-animated.
 */
export default function RevealMask({ children, className = '', caption }) {
  const box = useRef(null);

  useGSAP(
    () => {
      if (reduced()) return;
      gsap.to(box.current, {
        '--reveal': '0%',
        '--reveal-radius': '0px',
        ease: EASE,
        scrollTrigger: {
          trigger: box.current,
          // Opens across the approach and closes the tween well before the
          // element leaves, so it is fully open while it is being LOOKED at.
          start: 'top 85%',
          end: 'top 30%',
          scrub: 1,
        },
      });
    },
    { scope: box }
  );

  return (
    <figure className={className}>
      <div ref={box} className="reveal-mask overflow-hidden">
        {children}
      </div>
      {caption ? <figcaption className="caption mt-md text-ink-muted">{caption}</figcaption> : null}
    </figure>
  );
}
