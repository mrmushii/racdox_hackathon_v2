import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '../lib/gsap.js';
import { nav, brand } from '../content/brand.js';
import Wordmark from './Wordmark.jsx';
import CTAButton from './CTAButton.jsx';
import Picture from './Picture.jsx';
import { useMediaQuery } from '../lib/use-media-query.js';

/**
 * Hides on scroll-down, returns on scroll-up, and swaps a transparent bar for a
 * deep-teal pill once off the top.
 *
 * Duration 0.2s — nav motion is the one place on this page that must NOT be
 * slow. At 0.6s a returning nav reads as broken.
 */
export default function Nav() {
  const bar = useRef(null);
  const panel = useRef(null);
  const [floating, setFloating] = useState(false);
  // A hover preview is dead weight on a touch device, and there is no hover to
  // trigger it with. Gate on a fine pointer, not on width.
  const canHover = useMediaQuery('(hover: hover) and (pointer: fine) and (min-width: 1024px)');
  const [active, setActive] = useState(null);

  useGSAP(
    () => {
      let last = 0;
      const st = ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const y = self.scroll();
          const atTop = y < 24;
          setFloating(!atTop);
          const hide = !atTop && y > last && y - last > 2;
          gsap.to(bar.current, {
            yPercent: hide ? -140 : 0,
            duration: 0.2,
            ease: 'power2.out',
            overwrite: true,
          });
          last = y;
        },
      });
      return () => st.kill();
    },
    { scope: bar }
  );

  useGSAP(
    () => {
      if (!panel.current) return;
      const open = active !== null;
      gsap.to(panel.current, {
        autoAlpha: open ? 1 : 0,
        y: open ? 0 : -8,
        duration: open ? 0.45 : 0.25,
        ease: 'power2.out',
        overwrite: true,
      });
    },
    { dependencies: [active], scope: bar }
  );

  const item = canHover ? nav.find((n) => n.label === active) : null;

  return (
    <header
      ref={bar}
      className="fixed inset-x-0 top-0 z-50 px-[var(--gutter)] pt-[clamp(0.75rem,1.5vw,1.25rem)]"
    >
      <div
        className={`on-deep flex items-center justify-between gap-md
                    px-[clamp(1rem,2vw,1.75rem)] py-[clamp(0.6rem,1vw,0.9rem)]
                    transition-[background-color,color] duration-[600ms]
                    ease-[cubic-bezier(.445,.05,.55,.95)]
                    ${floating ? 'bg-deep text-on-deep' : 'bg-transparent text-ink'}`}
      >
        <a
          href="#top"
          aria-label={`${brand.name} — home`}
          className="flex min-h-[2.75rem] shrink-0 items-center"
        >
          <Wordmark size="sm" />
        </a>

        <nav
          aria-label="Primary"
          className="hidden md:block"
          onMouseLeave={() => setActive(null)}
        >
          <ul className="flex items-center gap-[clamp(1.25rem,2.5vw,2.5rem)]">
            {nav.map((item) => (
              <li key={item.href} onMouseEnter={() => setActive(item.label)}>
                <a href={item.href} className="caption group relative inline-flex min-h-[2.75rem] items-center">
                  {item.label}
                  {/* Hover underline cut at the mark's own apex angle. */}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0
                               bg-current transition-transform duration-[600ms]
                               ease-[cubic-bezier(.445,.05,.55,.95)] group-hover:scale-x-100"
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <CTAButton className="shrink-0" />
      </div>

      {/* Desktop hover preview. One panel, repositioned by content rather than
          one panel per item, so only a single element ever animates. */}
      {canHover && (
        <div
          ref={panel}
          aria-hidden="true"
          className="pointer-events-none invisible mx-auto mt-2 max-w-[34rem] opacity-0"
          onMouseEnter={() => setActive(active)}
        >
          {item?.preview && (
            <div className="on-deep flex items-center gap-md bg-deep p-sm text-on-deep">
              <div className="h-24 w-32 shrink-0 overflow-hidden">
                <Picture
                  name={item.preview.image}
                  alt=""
                  sizes="128px"
                  className="block h-full w-full"
                  imgClassName="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="caption text-gold">{item.label}</p>
                <p className="mt-xs text-[0.8125rem] leading-snug text-muted-deep">
                  {item.preview.blurb}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
