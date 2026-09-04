import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, SplitText, reduced } from '../lib/gsap.js';
import { intro } from '../content/brand.js';
import AmbientVideo from '../components/AmbientVideo.jsx';

/**
 * The manifesto — where the identity actually lands.
 *
 * Word-by-word fill bound to scroll pace (Spylt's MessageSection technique):
 * the brand's statement is revealed by the visitor's own action rather than
 * declared at them. Closes on the brand's own tagline so it reads as a brand
 * line, not a strapline bolted on.
 */
export default function Intro() {
  const root = useRef(null);

  useGSAP(
    () => {
      const words = root.current.querySelectorAll('.manifesto .word');

      if (reduced()) {
        gsap.set(words, { opacity: 1 });
        return;
      }

      // Same async escape as Hero: a promise outlives the effect, so StrictMode's
      // double mount would split the manifesto twice and nest the word spans.
      let cancelled = false;
      let split;
      let fill;

      document.fonts.ready.then(() => {
        if (cancelled) return;

        split = SplitText.create('.manifesto', { type: 'words', wordsClass: 'word' });
        gsap.set(split.words, { opacity: 0.12 });

        fill = gsap.to(split.words, {
          opacity: 1,
          ease: 'none',
          stagger: 1, // distributed across the scroll distance, not seconds
          scrollTrigger: {
            trigger: root.current,
            start: 'top 68%',
            end: 'bottom 72%',
            scrub: true,
          },
        });
      });

      return () => {
        cancelled = true;
        fill?.scrollTrigger?.kill();
        fill?.revert();
        split?.revert();
      };
    },
    { scope: root }
  );

  return (
    <section ref={root} className="section relative bg-base">
      <div className="shell grid grid-cols-12">
        <div className="col-span-12 lg:col-start-3 lg:col-span-9 xl:col-start-4 xl:col-span-8">
          <p className="caption eyebrow text-ink-muted">{intro.eyebrow}</p>

          <p className="manifesto display mt-lg text-display-md !leading-[1.25]">
            {intro.manifesto}
          </p>

          <p className="display mt-lg text-display-md text-gold-deep">{intro.signoff}</p>

        </div>
      </div>

      {/* The manifesto says every piece begins with your room; the clip then
          shows an empty room furnishing itself. This is the morph reel used for
          what it actually shows — its fake-storefront ending is never reached,
          and the watermark is cropped out geometrically. */}
      <figure className="mt-3xl">
        <div className="relative aspect-[16/9] w-full overflow-hidden sm:aspect-[21/9]">
          <AmbientVideo
            name="room-reveal"
            alt="An empty room in which bespoke furniture appears, piece by piece"
            sizes="100vw"
            className="h-full w-full"
            mediaClassName="h-full w-full object-cover"
          />
        </div>
        <figcaption className="shell caption mt-md text-ink-muted">{intro.roomCaption}</figcaption>
      </figure>
    </section>
  );
}
