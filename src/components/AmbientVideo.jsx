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
 *  - Below `md` it is replaced by its poster still. Autoplay video on a phone
 *    costs battery and bandwidth for no gain — swap the media, don't scale it.
 *  - Under reduced motion it is replaced by its poster still as well, so the
 *    page renders complete and static.
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
  const motionOK = useMediaQuery('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
  const [nearby, setNearby] = useState(eager);

  useEffect(() => {
    if (!box.current || nearby) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNearby(true), {
      rootMargin: '400px',
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
