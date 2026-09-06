import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, reduced, EASE_OUT } from '../lib/gsap.js';
import Picture from './Picture.jsx';

/**
 * Three columns. The outer two scroll; the middle one holds for a screen and
 * lets them travel past it.
 *
 * Ported from a reference component that shipped this as `bg-slate-950` with
 * `rounded-md` thumbnails. The MECHANISM is the good part and it is pure CSS —
 * `position: sticky` on the centre column — so it costs no JavaScript, needs no
 * ScrollTrigger, and works with Lenis untouched. Everything else was replaced:
 * ivory ground, hairline borders at the ink colour, and a caption under every
 * frame, because a wall of unlabelled photographs is a mood board and a wall of
 * labelled ones is a catalogue. This page is selling the second thing.
 *
 * All three columns hold three frames. What makes the hold work is not the
 * count but the HEIGHT: the outer columns run ~1700px of 4:5 tiles against the
 * centre's single 100vh, so the middle is still held long after the outer ones
 * have started leaving. An earlier 4/3/3 split left the right column ending
 * 580px short of the left, which read as a missing tile rather than as rhythm.
 *
 * Below `lg` the sticky column is dropped entirely: a 100vh pinned pane on a
 * 390px phone eats the whole screen, which is the opposite of the effect. It
 * does NOT collapse straight to one column, though — ten 4:5 tiles stacked
 * single-file made the 768px page 20,660px tall, so md gets two columns and
 * only the phone gets one.
 */

const SIZES = '(min-width: 1024px) 31vw, 92vw';

/* `fill` is a lg-and-up behaviour only. Below lg the centre column is an
   ordinary stacked column with no height of its own, so a flex child asked to
   fill it would collapse to nothing. Every fill class is therefore prefixed. */
function Frame({ image, label, fill = false }) {
  return (
    <figure className={`wall-cell group ${fill ? 'lg:flex lg:min-h-0 lg:flex-col' : ''}`}>
      <div className={`overflow-hidden border border-line bg-surface ${fill ? 'lg:min-h-0 lg:flex-1' : ''}`}>
        <Picture
          name={image}
          alt={label}
          sizes={SIZES}
          className="block h-full w-full"
          imgClassName={`aspect-[4/5] w-full object-cover transition-transform duration-[900ms]
                         ease-[cubic-bezier(.445,.05,.55,.95)] group-hover:scale-[1.03]
                         motion-reduce:transition-none ${fill ? 'lg:aspect-auto lg:h-full' : ''}`}
        />
      </div>
      <figcaption className="caption mt-sm text-ink-muted">{label}</figcaption>
    </figure>
  );
}

export default function ShowroomWall({ left, centre, right }) {
  const root = useRef(null);

  useGSAP(
    () => {
      if (reduced()) return;
      // A trigger per frame rather than one for the section: on a three-column
      // wall the frames enter at genuinely different times, so a single
      // staggered timeline would fire the bottom of a column while it is still
      // two screens away.
      gsap.utils.toArray('.wall-cell', root.current).forEach((cell) => {
        gsap.from(cell, {
          y: 28,
          opacity: 0,
          duration: 0.9,
          ease: EASE_OUT,
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: cell, start: 'top 90%', once: true },
        });
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="grid grid-cols-1 gap-md md:grid-cols-2 lg:grid-cols-3 lg:items-start">
      <div className="grid h-fit gap-md">
        {left.map((f) => <Frame key={f.image} {...f} />)}
      </div>

      {/* The held column. Sticky and screen-height only from lg up. */}
      <div className="grid h-fit gap-md lg:sticky lg:top-0 lg:h-screen lg:grid-rows-3 lg:py-md">
        {centre.map((f) => <Frame key={f.image} {...f} fill />)}
      </div>

      <div className="grid h-fit gap-md">
        {right.map((f) => <Frame key={f.image} {...f} />)}
      </div>
    </div>
  );
}
