/**
 * The footer wordmark builds itself one glyph at a time.
 *
 * Each letter falls from above its slot into place, clipped by the row's own
 * overflow (see Wordmark.jsx), so it reads as dropping INTO the word rather
 * than sliding over the page.
 *
 * Scroll drives it — the letters come down as the visitor scrolls, not on a
 * clock of their own — but only ever FORWARD. `maxProgress` ratchets: scroll up
 * and the build holds exactly where it is rather than lifting the letters back
 * out; scroll down again and it carries on from there. A plain `scrub` rewinds
 * it, which turns the mark into something the visitor can drag halfway, and
 * `toggleActions` resets make it blink out. A lockup that has begun assembling
 * itself should never come apart.
 *
 * It does rewind, once — when the visitor scrolls back up past the trigger, far
 * enough that the mark is off-screen — so that returning to the footer plays
 * the build again rather than arriving at a word that is already finished.
 */
import { gsap, ScrollTrigger, reduced, EASE } from './gsap.js';

export function initMarkDrop(footer) {
  if (!footer || reduced()) return () => {};

  const letters = [...footer.querySelectorAll('[data-mark-letter]')];
  const sub = footer.querySelector('[data-mark-sub]');
  if (!letters.length) return () => {};

  const tl = gsap
    .timeline({ paused: true })
    .from(letters, {
      yPercent: -140,
      duration: 0.5,
      // 0.16 against a 0.5 letter duration overlaps them slightly: sequential
      // to read, continuous to watch.
      stagger: 0.16,
      ease: EASE,
    })
    .from(sub ? [sub] : [], { autoAlpha: 0, duration: 0.3, ease: 'none' }, '>-0.15');

  let maxProgress = 0;
  // Triggered on the footer rather than the mark: the mark is sticky, so its
  // own box moves under ScrollTrigger's feet. The window closes at 30% so the
  // finished lockup holds for a beat before the footer is fully in view.
  const st = ScrollTrigger.create({
    trigger: footer,
    start: 'top 80%',
    end: 'top 30%',
    onUpdate: (self) => {
      if (self.progress <= maxProgress) return;
      maxProgress = self.progress;
      tl.progress(maxProgress);
    },
  });

  // The rewind, on its own boundary: the footer's top edge dropping below the
  // viewport, which is the first moment the whole footer — sticky wordmark
  // included — is off the bottom of the screen. It cannot ride on the build's
  // own trigger, because the sticky mark is still visible at that start line
  // (measured: mark at y=648 in a 900px viewport while the footer's top is at
  // 860), and resetting there is exactly the blink-out the ratchet exists to
  // prevent. Off-screen, the reset is unseen, and returning to the footer plays
  // the build again from the first letter.
  const rewind = ScrollTrigger.create({
    trigger: footer,
    start: 'top bottom',
    onLeaveBack: () => {
      maxProgress = 0;
      tl.progress(0);
    },
  });

  return () => {
    rewind.kill();
    st.kill();
    tl.kill();
    gsap.set([...letters, sub].filter(Boolean), {
      clearProps: 'transform,opacity,visibility',
    });
  };
}
