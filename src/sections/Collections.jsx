import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, reduced } from '../lib/gsap.js';
import { collections } from '../content/brand.js';
import Picture from '../components/Picture.jsx';

/**
 * Four tiles on an asymmetric grid — deliberately not a 4-up row, because the
 * corpus almost never centres a block in a 12-col grid and the even row is the
 * marketplace pattern the brief warns against.
 *
 * Image adjacency is constrained: several supplied photographs share an
 * identical generated background (the same painting, palm and sconce recur
 * across three files), so no two of those may sit side by side. Only `living`
 * carries that background among these four.
 */
const LAYOUT = [
  'col-span-12 md:col-span-7 lg:col-span-6',
  'col-span-12 md:col-span-5 lg:col-start-8 lg:col-span-5 md:mt-2xl',
  'col-span-12 md:col-span-5 md:col-start-2 lg:col-start-2 lg:col-span-5',
  'col-span-12 md:col-span-6 md:col-start-7 lg:col-start-8 lg:col-span-5 md:mt-xl',
  'col-span-12 md:col-span-8 md:col-start-3 lg:col-start-4 lg:col-span-6',
];
const RATIO = ['aspect-[4/5]', 'aspect-[3/4]', 'aspect-[3/4]', 'aspect-[4/3]', 'aspect-[16/10]'];

export default function Collections() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (reduced()) return;
      // Entrance only — the scroll-linked work on this page is rationed to the
      // manifesto fill, the Bespoke pin, and the hero parallax.
      gsap.from('.tile', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        stagger: 0.12,
        scrollTrigger: { trigger: root.current, start: 'top 72%' },
      });
    },
    { scope: root }
  );

  return (
    <section id="collections" ref={root} className="section bg-base">
      <div className="shell">
        <header className="max-w-[46ch]">
          <p className="caption eyebrow text-ink-muted">{collections.eyebrow}</p>
          <h2 className="display mt-md text-display-lg">{collections.headline}</h2>
        </header>

        <div className="mt-2xl grid grid-cols-12 gap-x-[clamp(1rem,2vw,2rem)] gap-y-xl">
          {collections.items.map((item, i) => (
            <article key={item.name} className={`tile group ${LAYOUT[i]}`}>
              <a href="#cta" className="block">
                <div className={`overflow-hidden border border-line ${RATIO[i]}`}>
                  <Picture
                    name={item.image}
                    alt={`${item.name} furniture by Heaven Furniture Mart — ${item.scope}`}
                    sizes="(min-width: 1024px) 42vw, (min-width: 768px) 48vw, 92vw"
                    className="block h-full w-full"
                    imgClassName="h-full w-full object-cover transition-transform
                                  duration-[800ms] ease-[cubic-bezier(.445,.05,.55,.95)]
                                  group-hover:scale-[1.03] motion-reduce:transition-none"
                  />
                </div>
                <div className="mt-md flex items-baseline gap-md">
                  <span className="caption text-gold-deep">{item.n}</span>
                  <div>
                    <h3 className="display text-display-md">{item.name}</h3>
                    <p className="mt-xs text-ink-muted">{item.scope}</p>
                  </div>
                </div>
              </a>
            </article>
          ))}
        </div>

        <p className="caption mt-2xl border-t border-line pt-lg text-ink-muted">
          {collections.footnote}
        </p>
      </div>

      {/* One full room, after five categories. The widest frame in the set
          (3168x1344) at the one place a 2.36:1 image belongs. Kept well away
          from the showroom tour so the two wide bands don't echo. */}
      <div className="mt-3xl aspect-[21/9] w-full overflow-hidden sm:aspect-[2.6/1]">
        <Picture
          name="showroom-wide"
          alt="A carved and upholstered living-room suite by Heaven Furniture Mart"
          sizes="100vw"
          className="block h-full w-full"
          imgClassName="h-full w-full object-cover"
        />
      </div>
    </section>
  );
}
