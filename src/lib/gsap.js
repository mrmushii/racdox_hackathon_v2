/**
 * One place to register plugins, so no component can forget to.
 * SplitText and ScrollTrigger ship free in GSAP 3.13+.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

/** easeInOutSine. Symmetric easing makes things settle; furniture is heavy. */
export const EASE = 'sine.inOut';
export const EASE_OUT = 'power2.out';

/** True when the visitor has asked for less motion, checked at call time. */
export const reduced = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export { gsap, ScrollTrigger, SplitText };
