import { useRef, useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, reduced, EASE_OUT } from '../lib/gsap.js';
import { showroomTour } from '../content/brand.js';

/**
 * Showroom Tour — cinematic letterbox video section.
 *
 * Instead of a full-screen video (which blurs at 720p), this uses a
 * contained cinematic frame: a wide letterbox (21:9) embedded on the dark
 * ground with generous breathing room. The letterbox crop makes 720p look
 * intentional and filmic rather than under-resolved. The section reads as
 * an editorial film strip, not a YouTube embed.
 *
 * The video is trimmed with #t=5 to skip the logo intro at the start.
 * It plays inline, muted, looping — same pattern as AmbientVideo but
 * hand-rolled here because this video lives outside the media pipeline.
 */
export default function ShowroomTour() {
  const root = useRef(null);
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Lazy-load the video on intersection
  useEffect(() => {
    if (!root.current) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setIsVisible(true); },
      { rootMargin: '600px' }
    );
    io.observe(root.current);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      if (reduced()) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });

      tl.from('.tour-eyebrow', { y: 20, opacity: 0, duration: 0.7, ease: EASE_OUT })
        .from('.tour-headline', { y: 20, opacity: 0, duration: 0.7, ease: EASE_OUT }, '-=0.5')
        .from('.tour-lede', { y: 20, opacity: 0, duration: 0.7, ease: EASE_OUT }, '-=0.5')
        .from('.tour-frame', { y: 40, opacity: 0, duration: 1, ease: EASE_OUT }, '-=0.4')
        .from('.tour-caption', { y: 10, opacity: 0, duration: 0.5, ease: EASE_OUT }, '-=0.4');
    },
    { scope: root }
  );

  return (
    <section id="showroom-tour" ref={root} className="on-deep bg-deep text-on-deep"
      style={{ paddingBlock: 'var(--section-y)' }}
    >
      <div className="shell">
        {/* Header: left-aligned to match the rest of the site's editorial tone */}
        <div className="grid grid-cols-12 items-end gap-x-[clamp(1rem,2vw,2rem)] gap-y-lg">
          <div className="col-span-12 lg:col-span-5">
            <p className="tour-eyebrow caption eyebrow text-gold">{showroomTour.eyebrow}</p>
            <h2 className="tour-headline display mt-md text-display-lg">{showroomTour.headline}</h2>
          </div>
          <p className="tour-lede lede col-span-12 text-muted-deep lg:col-span-5 lg:col-start-8">
            {showroomTour.lede}
          </p>
        </div>

        {/* Cinematic letterbox frame */}
        <div className="tour-frame mt-xl lg:mt-2xl">
          <div className="relative overflow-hidden border border-line-deep aspect-[16/9] md:aspect-[21/9] bg-deep/80">
            {/* Poster thumbnail preview */}
            <img
              src="/media/showroom-tour-poster.jpg"
              alt="Virtual Showroom Tour"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                isVisible ? 'opacity-0' : 'opacity-100'
              }`}
              loading="lazy"
            />

            {isVisible && (
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                defaultMuted
                loop
                playsInline
                preload="metadata"
                poster="/media/showroom-tour-poster.jpg"
              >
                {/* #t=5 trims the logo intro at the beginning */}
                <source src="/media/showroom-tour.mp4#t=5" type="video/mp4" />
              </video>
            )}
          </div>
          <p className="tour-caption caption mt-md text-muted-deep">{showroomTour.caption}</p>
        </div>
      </div>
    </section>
  );
}
