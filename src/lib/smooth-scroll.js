/**
 * Lenis, driven by GSAP's ticker so smooth scroll and ScrollTrigger share one
 * clock. Two clocks is the usual source of scrub jitter.
 *
 * Disabled entirely under prefers-reduced-motion: the page then uses native
 * scrolling and every trigger renders its end state.
 */
import Lenis from 'lenis';
import { gsap, ScrollTrigger, reduced } from './gsap.js';

export function initSmoothScroll() {
  if (reduced()) return () => {};

  const lenis = new Lenis({
    duration: 1.1,
    // Matches --ease in spirit: slow settle, no overshoot.
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    // Native momentum on touch is better than anything we can emulate, and
    // fighting it is the most common cause of janky mobile scrolling.
    syncTouch: false,
  });

  lenis.on('scroll', ScrollTrigger.update);

  const raf = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(raf);
    lenis.destroy();
  };
}
