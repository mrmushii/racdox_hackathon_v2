import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { gsap, reduced, EASE } from '../lib/gsap.js';
import { contact, visit } from '../content/brand.js';

/**
 * The showroom, as a card that opens.
 *
 * Ported from a reference component, with three deliberate departures:
 *
 *  1. THE MAP IS REAL. The reference drew an invented street grid — six SVG
 *     lines and some rectangles labelled as a city. Agrabad Access Road is a
 *     real address in a real city, and a made-up map of it is a lie a judge
 *     from Chattogram would spot immediately. This renders actual OpenStreetMap
 *     geometry, drawn to the brand's two colours at build time by
 *     scripts/build-map.mjs. OSM has no node for the business, so the marker
 *     marks the ROAD and the copy says so.
 *
 *  2. IT IS A BUTTON. The reference is a `div` with an `onClick`, which cannot
 *     be reached by keyboard at all. This is a real `<button>` with
 *     `aria-expanded`, and the "Get directions" link lives OUTSIDE it, because
 *     an anchor nested inside a button is not a thing a browser can resolve.
 *
 *  3. NO 3D TILT. The reference tilts on mousemove via a spring. That is a
 *     studio-site gesture; not one of the eight live luxury furniture houses
 *     audited ships anything like it, and it does not survive on touch. The
 *     motion here is the page's own: 0.7s, symmetric, once.
 *
 * The open/close tween drives height and a scale on the map itself, so opening
 * reads as zooming OUT from the road to the district rather than as a box
 * getting bigger.
 */

/* Collapsed geometry. The first version was a fixed 184px letterbox at 2.1x
 * zoom, and it failed the only job the closed state has: at that crop you saw a
 * blank field with one road across it, no marker, and no reason to click. The
 * closed card now has to be a legible map on its own, with the expansion adding
 * DISTRICT rather than adding the fact that a map exists.
 *
 * 3:2 of the column width (~420x280 at 1440) with a floor, and only a slight
 * zoom so the surrounding street network reads. */
const COLLAPSED_RATIO = 2 / 3;
const COLLAPSED_MIN = 240;
const COLLAPSED_SCALE = 1.25;

export default function LocationCard({ className = '' }) {
  const [open, setOpen] = useState(false);
  const frame = useRef(null);
  const map = useRef(null);
  const pin = useRef(null);

  const apply = useCallback((isOpen, animate) => {
    if (!frame.current || !map.current) return;
    const w = frame.current.offsetWidth;
    // Square when open: the map is a square drawing, so the frame matching it
    // is what stops the road being cropped at the moment it is finally legible.
    const to = {
      height: isOpen ? w : Math.max(COLLAPSED_MIN, Math.round(w * COLLAPSED_RATIO)),
      duration: animate ? 0.7 : 0,
      ease: EASE,
    };
    gsap.to(frame.current, to);
    gsap.to(map.current, { ...to, scale: isOpen ? 1 : COLLAPSED_SCALE });
    // The marker is visible in BOTH states — it is what makes the closed card
    // say "here", and hiding it until expansion meant the reveal's payload was
    // the pin rather than the neighbourhood. It only shifts slightly, because
    // the map barely moves under it.
    // The marker is present in BOTH states - it is what makes the closed card
    // say "here", and hiding it until expansion meant the reveal's payload was
    // the pin rather than the neighbourhood. It only grows slightly.
    gsap.to(pin.current, {
      scale: isOpen ? 1 : 0.88,
      duration: animate ? 0.5 : 0,
      ease: EASE,
    });
  }, []);

  // Set the closed state before first paint, and re-measure on resize so the
  // open height keeps matching the width it is meant to be square with.
  useLayoutEffect(() => {
    apply(open, false);
    const onResize = () => apply(open, false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [open, apply]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    apply(next, !reduced());
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="group block w-full cursor-pointer text-left"
      >
        <div
          ref={frame}
          className="relative overflow-hidden border border-line bg-base"
          style={{ height: COLLAPSED_MIN }}
        >
          <img
            ref={map}
            src="/media/showroom-map.svg"
            alt=""
            aria-hidden="true"
            width="1000"
            height="1000"
            className="h-full w-full object-cover"
            style={{ transform: `scale(${COLLAPSED_SCALE})` }}
          />

          {/* THE MARKER. A single 20px chevron was not enough: at map scale it
              read as a speck of ink, and the card looked like it was pointing at
              nothing. What makes a marker legible is redundancy - a point, a
              ring that draws the eye to the point, and a shape above it that
              says which way is down. The label removes the last doubt.

              Two nested spans on purpose: the outer one carries the positioning
              transform, the inner one is what GSAP scales. Both on one element
              would mean GSAP rewriting the transform that places it. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <span ref={pin} className="relative block h-0 w-0">
              {/* the ring, which is what the eye finds first */}
              <span className="absolute left-1/2 top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2
                               rounded-full border border-gold-deep/45 bg-base/35" />
              {/* the point itself, on the road */}
              <span className="absolute left-1/2 top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2
                               rounded-full bg-gold-deep" />
              {/* the logo's own A, standing above the point. Gold-deep is the
                  only gold permitted to touch ivory. */}
              <span
                className="absolute bottom-[7px] left-1/2 h-[18px] w-[18px] -translate-x-1/2 bg-gold-deep"
                style={{ clipPath: 'polygon(50% 0%, 100% 100%, 78% 100%, 50% 42%, 22% 100%, 0% 100%)' }}
              />
              {/* Ink, not gold: gold on ivory is 1.83:1 and is never text. */}
              <span className="caption absolute left-[30px] top-1/2 -translate-y-1/2 whitespace-nowrap text-ink">
                {visit.mapHere}
              </span>
            </span>
          </span>

          {/* Holds the ivory ground under the label so the roads never run into
              the type. Ink at low alpha, not a grey. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-base to-transparent" />

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-md p-md">
            <div>
              <p className="caption text-ink">{visit.mapLabel}</p>
              <p className="caption mt-1 text-ink-muted">{visit.mapSub}</p>
            </div>
            <span className="caption whitespace-nowrap text-ink-muted transition-opacity
                             duration-[600ms] group-hover:text-ink">
              {open ? visit.mapCollapse : visit.mapExpand}
            </span>
          </div>
        </div>
      </button>

      <div className="mt-md flex flex-wrap items-baseline justify-between gap-x-md gap-y-sm">
        <a
          href={contact.maps}
          target="_blank"
          rel="noopener noreferrer"
          className="caption inline-flex min-h-[2.75rem] items-center border-b border-line
                     pb-1 text-ink transition-colors duration-[600ms] hover:border-ink"
        >
          {visit.mapDirections} ↗
        </a>
        <p className="caption text-ink-muted">{visit.mapNote}</p>
      </div>
      <p className="caption mt-sm text-ink-muted opacity-70">{visit.mapAttribution}</p>
    </div>
  );
}
