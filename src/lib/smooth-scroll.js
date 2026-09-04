/**
 * Lenis, driven by GSAP's ticker so smooth scroll and ScrollTrigger share one
 * clock. Two clocks is the usual source of scrub jitter.
 *
 * Disabled entirely under prefers-reduced-motion: the page then uses native
 * scrolling and every trigger renders its end state.
 */
import Lenis from 'lenis';
import { gsap, ScrollTrigger, reduced } from './gsap.js';

let instance = null;

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
  instance = lenis;

  lenis.on('scroll', ScrollTrigger.update);

  const raf = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(raf);
    lenis.destroy();
    instance = null;
  };
}

/**
 * Freeze the page behind a full-screen overlay.
 *
 * Both halves are needed: Lenis owns the wheel when it is running, and the
 * document owns it when Lenis is off (reduced motion, or touch, where
 * syncTouch is false). Stopping only one leaves the page scrolling underneath
 * the menu on some inputs and not others.
 */
export function lockScroll(locked) {
  if (instance) locked ? instance.stop() : instance.start();
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}
