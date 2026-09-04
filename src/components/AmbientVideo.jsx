import { useEffect, useRef, useState } from 'react';
import { videos } from '../content/media.js';
import { useMediaQuery } from '../lib/use-media-query.js';
import Picture from './Picture.jsx';

/**
 * A looping clip that behaves itself.
 *
 * Three things every video on this page needs, so they live here once:
 *
 *  - It is not fetched until it is near the viewport. An autoplaying <video> is
 *    fetched eagerly by the browser, which would put ~1 MB of below-the-fold
 *    media on the critical path.
 *  - Under reduced motion it is replaced by its poster still, so the page
 *    renders complete and static.
 *
 * It plays on phones too. An earlier version withheld video below `md` on
 * battery and bandwidth grounds, which meant a phone saw four still images
 * where the design has motion — the saving was real but it read as broken, and
 * the clips are 225-426 KB and only fetched once scrolled to. iOS autoplay
 * needs `muted` + `playsInline`, both set below; where the OS still refuses
 * (Low Power Mode), the poster is what shows, which is the old behaviour.
 *
 * `poster` may name a different image than the clip's generated poster frame —
 * the Material section uses a high-resolution crop from a still, because a
 * frame lifted from 720p footage reads soft beside real photography.
 */
export default function AmbientVideo({
  name,
  poster,
  alt,
  sizes = '100vw',
  className = '',
  mediaClassName = '',
  eager = false,
}) {
  const v = videos[name];
  if (!v) throw new Error(`AmbientVideo: unknown clip "${name}"`);

  const still = poster || v.poster;
  const box = useRef(null);
  const motionOK = useMediaQuery('(prefers-reduced-motion: no-preference)');
  const [nearby, setNearby] = useState(eager);

  useEffect(() => {
    if (!box.current || nearby) return;
    // Generous margin: a full-bleed band should have its clip decoded before
    // it reaches the viewport, so the poster is a safety net rather than a state
    // the visitor actually sees.
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNearby(true), {
      rootMargin: '900px',
    });
    io.observe(box.current);
    return () => io.disconnect();
  }, [nearby]);

  return (
    <div ref={box} className={className}>
      {motionOK && nearby ? (
        <video
          className={mediaClassName}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={`/media/${still}-640.avif`}
          aria-label={alt}
        >
          <source src={`/media/${name}.mp4`} type="video/mp4" />
        </video>
      ) : (
        <Picture
          name={still}
          alt={alt}
          sizes={sizes}
          className="block h-full w-full"
          imgClassName={mediaClassName}
        />
      )}
    </div>
  );
}
