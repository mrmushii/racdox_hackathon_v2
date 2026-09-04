import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, reduced } from '../lib/gsap.js';
import Wordmark from './Wordmark.jsx';

/**
 * A brand moment, not a preloader.
 *
 * The distinction matters: a real preloader blocks on resources and typically
 * runs 2.5-3.5s, which spends a tenth of the brief's 30-second comprehension
 * budget on a spinner and works directly against the "clean and fast" criterion.
 * None of the eight live luxury furniture sites ships one.
 *
 * So this waits for nothing. The hero is fully rendered underneath from the
 * first frame; this is only a teal veil over the top that lifts on a fixed
 * 1.15s timeline — inside the <=1.2s cap the project brief sets for a
 * non-blocking brand moment. It also runs once per session, so navigating back
 * never costs the visitor a second viewing.
 */
const SEEN = 'heaven:intro';

export default function BrandIntro() {
  const veil = useRef(null);
  const seen = typeof sessionStorage !== 'undefined' && sessionStorage.getItem(SEEN);
  const skip = reduced() || !!seen;

  useGSAP(
    () => {
      if (skip) return;
      try { sessionStorage.setItem(SEEN, '1'); } catch { /* private mode */ }

      gsap
        .timeline({
          defaults: { ease: 'power2.out' },
          onComplete: () => gsap.set(veil.current, { display: 'none' }),
        })
        .from('.intro-mark', { opacity: 0, scale: 0.94, duration: 0.45 })
        .to('.intro-mark', { opacity: 0, duration: 0.3 }, 0.6)
        // The veil lifts rather than fades: a fade reveals a half-lit page,
        // a wipe hands the whole hero over at once.
        .to(veil.current, { yPercent: -100, duration: 0.55, ease: 'power3.inOut' }, 0.6);
    },
    { scope: veil }
  );

  if (skip) return null;

  return (
    <div
      ref={veil}
      aria-hidden="true"
      className="on-deep pointer-events-none fixed inset-0 z-[80] flex items-center justify-center bg-deep"
    >
      <Wordmark size="lg" className="intro-mark text-on-deep" />
    </div>
  );
}
