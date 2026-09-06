import { useCallback, useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, reduced } from '../lib/gsap.js';
import { lockScroll } from '../lib/smooth-scroll.js';
import { nav, brand, contact } from '../content/brand.js';
import Wordmark from './Wordmark.jsx';
import CTAButton from './CTAButton.jsx';
import Picture from './Picture.jsx';
import { useMediaQuery } from '../lib/use-media-query.js';

/**
 * A slim bar and a full-screen menu.
 *
 * The retail three-tier header this replaces was the most shop-like thing on
 * the page, which works against the brief's first instruction — a luxury
 * interior studio, not an online furniture shop. A single bar plus an overlay
 * gives the hero its full height back and reads as a studio.
 *
 * The CTA stays in the bar and is repeated inside the menu, so the one action
 * is never the thing hidden behind a click. That is the whole risk of an
 * overlay nav and the only part of it worth defending against.
 *
 * The menu is a real dialog: Escape closes it, focus moves in on open and
 * returns to the trigger on close, Tab is trapped inside it, and the page
 * behind it is frozen through Lenis AND the document, because which one owns
 * the wheel depends on input and reduced-motion state.
 */
export default function Nav() {
  const bar = useRef(null);
  const sheet = useRef(null);
  const trigger = useRef(null);
  const closeBtn = useRef(null);
  const wasOpen = useRef(false);

  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [hovered, setHovered] = useState(0);
  const canHover = useMediaQuery('(hover: hover) and (pointer: fine) and (min-width: 1024px)');

  const close = useCallback(() => setOpen(false), []);

  const handleNavClick = useCallback((e, href) => {
    e.preventDefault();
    close();
    setTimeout(() => {
      scrollToTarget(href);
    }, 350);
  }, [close]);

  /* --- bar: solid past the hero, hides on scroll-down --------------------- */
  useGSAP(
    () => {
      let last = 0;
      let hidden = false;
      const st = ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const y = self.scroll();
          setSolid(y > window.innerHeight * 0.55);

          // Direction, not position. The bar only changes state on a deliberate
          // move of more than 2px: Lenis keeps firing onUpdate as it eases to a
          // stop, and treating those sub-pixel settle deltas as "not scrolling
          // down" used to drop the bar back in every time the visitor paused.
          // Under the threshold, `last` is left alone too, so a slow scroll
          // still accumulates into a real direction instead of being swallowed.
          const dy = y - last;
          if (Math.abs(dy) <= 2) return;
          last = y;

          const next = y > 120 && dy > 0;
          if (next === hidden) return;
          hidden = next;

          gsap.to(bar.current, {
            yPercent: hidden ? -140 : 0,
            duration: 0.2,
            ease: 'power2.out',
            overwrite: true,
          });
        },
      });
      return () => st.kill();
    },
    { scope: bar }
  );

  /* --- menu open / close -------------------------------------------------- */
  useGSAP(
    () => {
      const el = sheet.current;
      if (!el) return;

      if (reduced()) {
        gsap.set(el, { autoAlpha: open ? 1 : 0, yPercent: 0 });
        gsap.set('.sheet-row', { autoAlpha: 1, y: 0 });
        return;
      }

      if (open) {
        gsap
          .timeline()
          .set(el, { visibility: 'visible' })
          .fromTo(el, { yPercent: -100 }, { yPercent: 0, duration: 0.6, ease: 'power3.inOut' })
          .fromTo(
            '.sheet-row',
            { y: 40, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.06, ease: 'power2.out' },
            '-=0.25'
          )
          .fromTo('.sheet-aside', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, '<');
      } else {
        gsap.to(el, {
          yPercent: -100,
          duration: 0.45,
          ease: 'power3.inOut',
          onComplete: () => gsap.set(el, { visibility: 'hidden' }),
        });
      }
    },
    // Scope is the SHEET, not the bar: '.sheet-row' and '.sheet-aside' live in
    // the sheet, which is a sibling of the header. Scoped to the bar they match
    // nothing, both fromTo tweens no-op, and the panel slides down with every
    // child fully visible — dragging the footer CTA across the whole viewport.
    { dependencies: [open], scope: sheet }
  );

  /* --- dialog behaviour: scroll lock, Escape, focus ----------------------- */
  useEffect(() => {
    lockScroll(open);
    if (open) {
      wasOpen.current = true;
      // The timeline's visibility:visible lands when the tween plays, which is
      // a tick after this effect. Focusing a still-hidden element fails
      // silently, so make it focusable here rather than relying on the tween.
      gsap.set(sheet.current, { visibility: 'visible' });
      closeBtn.current?.focus();
    } else if (wasOpen.current) {
      // Only when returning FROM the menu. This effect also runs on mount with
      // open=false, and focusing the trigger there put a focus ring on the menu
      // button on every page load.
      wasOpen.current = false;
      trigger.current?.focus({ preventScroll: true });
    }

    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') return close();
      if (e.key !== 'Tab') return;
      const focusable = sheet.current?.querySelectorAll('a[href], button');
      if (!focusable?.length) return;
      const first = focusable[0];
      const lastEl = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  useEffect(() => () => lockScroll(false), []);

  const preview = nav[hovered]?.preview;

  return (
    <>
      <header
        ref={bar}
        className="fixed inset-x-0 top-0 z-50 px-[var(--gutter)] pt-[clamp(0.75rem,1.5vw,1.25rem)]"
      >
        <div
          className={`on-deep flex items-center justify-between gap-md px-[clamp(0.75rem,1.5vw,1.5rem)]
                      py-[clamp(0.5rem,0.9vw,0.8rem)] transition-colors duration-[400ms]
                      ease-[cubic-bezier(.445,.05,.55,.95)]
                      ${solid ? 'bg-deep text-on-deep' : 'bg-transparent text-ink'}`}
        >
          <a
            href="#top"
            aria-label={`${brand.name} — home`}
            className="flex min-h-[2.75rem] shrink-0 items-center"
          >
            <Wordmark size="sm" />
          </a>

          <div className="flex items-center gap-[clamp(0.75rem,1.5vw,1.5rem)]">
            {/* Hidden below sm: at 390px the wordmark, the pill and Menu came to
                more than the viewport, and body{overflow-x:hidden} was quietly
                clipping "Menu" rather than the layout being right. Nothing is
                lost — the hero CTA is above the fold on a phone, and the menu
                sheet carries its own. */}
            <CTAButton className="hidden sm:inline-flex" />
            <button
              ref={trigger}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="menu-sheet"
              className="caption group inline-flex min-h-[2.75rem] min-w-[2.75rem] items-center gap-2"
            >
              Menu
              <span aria-hidden="true" className="flex flex-col gap-[3px]">
                <span className="block h-px w-4 bg-current transition-transform duration-[400ms] group-hover:translate-x-0.5" />
                <span className="block h-px w-4 bg-current transition-transform duration-[400ms] group-hover:-translate-x-0.5" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* --- the sheet --------------------------------------------------- */}
      <div
        id="menu-sheet"
        ref={sheet}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="on-deep invisible fixed inset-0 z-[60] flex flex-col overflow-y-auto
                   overscroll-contain bg-deep text-on-deep"
      >
        <div className="shell flex items-center justify-between gap-md pt-[clamp(0.9rem,2.2vh,1.9rem)]">
          <Wordmark size="sm" />
          <button
            ref={closeBtn}
            type="button"
            onClick={close}
            className="caption inline-flex min-h-[2.75rem] min-w-[2.75rem] items-center gap-2"
          >
            Close
            <span aria-hidden="true" className="relative block h-3 w-3">
              <span className="absolute left-0 top-1/2 block h-px w-3 rotate-45 bg-current" />
              <span className="absolute left-0 top-1/2 block h-px w-3 -rotate-45 bg-current" />
            </span>
          </button>
        </div>

        <div className="shell grid flex-1 grid-cols-12 items-center gap-x-[clamp(1rem,2vw,2rem)]
                        gap-y-[clamp(1.25rem,3vh,3.75rem)] py-[clamp(1rem,3vh,3.75rem)]">
          <nav aria-label="Primary" className="col-span-12 lg:col-span-7">
            <ul>
              {nav.map((item, i) => (
                <li key={item.href} className="sheet-row border-b border-line-deep">
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    onMouseEnter={() => setHovered(i)}
                    onFocus={() => setHovered(i)}
                    className="group flex items-baseline gap-md py-[clamp(0.3rem,1.15vh,1.1rem)]"
                  >
                    <span className="caption w-8 shrink-0 text-gold">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="display text-[clamp(2rem,min(6vw,7.2vh),5.5rem)] transition-transform duration-[600ms] ease-[cubic-bezier(.445,.05,.55,.95)] group-hover:translate-x-2">
                      {item.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {canHover && (
            <div className="sheet-aside col-span-12 lg:col-span-4 lg:col-start-9">
              <div className="aspect-[4/5] max-h-[46vh] overflow-hidden border border-line-deep">
                {preview && (
                  <Picture
                    key={preview.image}
                    name={preview.image}
                    alt=""
                    sizes="30vw"
                    className="block h-full w-full"
                    imgClassName="h-full w-full object-cover"
                  />
                )}
              </div>
              <p className="mt-md max-w-[34ch] text-muted-deep">{preview?.blurb}</p>
            </div>
          )}
        </div>

        <div className="shell sheet-row flex flex-wrap items-center justify-between gap-md
                        border-t border-line-deep py-[clamp(0.9rem,2.4vh,3.75rem)]">
          <div className="flex flex-wrap items-center gap-x-2xl gap-y-sm">
            <a
              href={contact.phoneHref}
              className="caption inline-flex min-h-[2.75rem] items-center text-muted-deep transition-colors duration-[600ms] hover:text-gold"
            >
              {contact.phoneDisplay}
            </a>
            <a
              href={contact.maps}
              target="_blank"
              rel="noopener noreferrer"
              className="caption inline-flex min-h-[2.75rem] items-center text-muted-deep transition-colors duration-[600ms] hover:text-gold"
            >
              {contact.addressLine}, {contact.addressCity}
            </a>
          </div>
          <CTAButton />
        </div>
      </div>
    </>
  );
}
