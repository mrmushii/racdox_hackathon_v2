import { useRef, useEffect, useState, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, reduced, EASE_OUT } from '../lib/gsap.js';

/**
 * Showroom Reels — "See it come alive"
 *
 * Real showroom footage. Minimal, restrained, luxury presentation.
 * Each cell shows an instant high-resolution preview thumbnail.
 * On hover, the video runs silently; on leave, it resets.
 */

/* Nine of the ten showroom clips. Ordered so no two cells of the same FURNITURE
   TYPE sit side by side on the three-column desktop grid — five of the nine are
   dining, so perfect deconfliction is impossible, but the two nearest matches
   (the marble and the oval marble dining suites) are kept a full row apart, and
   so are the two gilt vitrines.

   Aspect alternates 4/5 and 9/16 to give the grid its masonry rhythm; both are
   crops of the same native 9:16 source, so nothing is upscaled.

   The tenth clip (a white-and-grey modern bedroom with a dressing table) is
   left out on the same grounds the Gemini office renders were: it is cool and
   contemporary against a set that is uniformly warm and ornate. */
const REELS = [
  {
    src: '/media/product-vid-4.mp4',
    poster: '/media/product-vid-4-poster.jpg',
    label: 'Marble dining suite',
    aspect: '4/5',
  },
  {
    src: '/media/product-vid-9.mp4',
    poster: '/media/product-vid-9-poster.jpg',
    label: 'Velvet bedroom suite',
    aspect: '9/16',
  },
  {
    src: '/media/product-vid-13.mp4',
    poster: '/media/product-vid-13-poster.jpg',
    label: 'Gilt display cabinet',
    aspect: '9/16',
  },
  {
    src: '/media/product-vid-6.mp4',
    poster: '/media/product-vid-6-poster.jpg',
    label: 'Living collection',
    aspect: '4/5',
  },
  {
    src: '/media/product-vid-10.mp4',
    poster: '/media/product-vid-10-poster.jpg',
    label: 'Oval dining table',
    aspect: '9/16',
  },
  {
    src: '/media/product-vid-7.mp4',
    poster: '/media/product-vid-7-poster.jpg',
    label: 'Vanity suite',
    aspect: '4/5',
  },
  {
    src: '/media/product-vid-14.mp4',
    poster: '/media/product-vid-14-poster.jpg',
    label: 'Carved vitrine, gilt trim',
    aspect: '9/16',
  },
  {
    src: '/media/product-vid-5.mp4',
    poster: '/media/product-vid-5-poster.jpg',
    label: 'Granite dining suite',
    aspect: '4/5',
  },
  {
    src: '/media/product-vid-8.mp4',
    poster: '/media/product-vid-8-poster.jpg',
    label: 'Carved dining suite',
    aspect: '9/16',
  },
];

function ReelCell({ src, poster, label, aspect }) {
  const videoRef = useRef(null);
  const cellRef = useRef(null);
  const playPromiseRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Ensure completely muted with no sound
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.volume = 0;
    }
  }, []);

  // Auto-play on mobile when in view
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 1023px)').matches;
    if (!isMobile || !cellRef.current) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        const vid = videoRef.current;
        if (!vid) return;
        if (entry.isIntersecting) {
          vid.muted = true;
          vid.volume = 0;
          const p = vid.play();
          playPromiseRef.current = p;
          if (p !== undefined) {
            p.then(() => setIsPlaying(true)).catch(() => {});
          }
        } else {
          if (playPromiseRef.current) {
            playPromiseRef.current
              .then(() => {
                vid.pause();
                setIsPlaying(false);
              })
              .catch(() => {
                vid.pause();
                setIsPlaying(false);
              });
          } else {
            vid.pause();
            setIsPlaying(false);
          }
        }
      },
      { threshold: 0.5 }
    );
    io.observe(cellRef.current);
    return () => io.disconnect();
  }, []);

  const handleMouseEnter = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = true;
    vid.volume = 0;
    const p = vid.play();
    playPromiseRef.current = p;
    if (p !== undefined) {
      p.then(() => setIsPlaying(true)).catch(() => {});
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (playPromiseRef.current) {
      playPromiseRef.current
        .then(() => {
          vid.pause();
          vid.currentTime = 0;
          setIsPlaying(false);
        })
        .catch(() => {
          vid.pause();
          vid.currentTime = 0;
          setIsPlaying(false);
        });
    } else {
      vid.pause();
      vid.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  const handleClick = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      handleMouseEnter();
    } else {
      handleMouseLeave();
    }
  }, [handleMouseEnter, handleMouseLeave]);

  return (
    <figure
      ref={cellRef}
      className="reel-cell group relative cursor-pointer overflow-hidden border border-line-deep bg-deep/80 select-none"
      style={{ aspectRatio: aspect }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* 1. High-res preview thumbnail (instant load, no blank state) */}
      <img
        src={poster}
        width={aspect === '4/5' ? 720 : 720}
        height={aspect === '4/5' ? 900 : 1280}
        alt={label}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
          isPlaying ? 'opacity-0' : 'opacity-100'
        }`}
        loading="lazy"
      />

      {/* 2. Video element — runs on hover */}
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
          isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        muted
        defaultMuted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        src={src}
        onPlaying={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* 3. Minimal play mark (fades on hover) */}
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
          isPlaying ? 'opacity-0' : 'opacity-70 group-hover:opacity-0'
        }`}
      >
        <div className="w-11 h-11 rounded-full border border-on-deep/40 flex items-center justify-center backdrop-blur-sm bg-deep/30">
          <svg width="14" height="16" viewBox="0 0 14 16" fill="none" className="ml-0.5">
            <path d="M13 8L1 15V1L13 8Z" fill="currentColor" className="text-on-deep/80" />
          </svg>
        </div>
      </div>

      {/* 4. Minimal caption */}
      <figcaption className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-deep/80 to-transparent pointer-events-none">
        <span className="caption text-on-deep/80">{label}</span>
      </figcaption>
    </figure>
  );
}

export default function Reels() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (reduced()) return;
      gsap.utils.toArray('.reel-cell', root.current).forEach((cell) => {
        gsap.from(cell, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: EASE_OUT,
          scrollTrigger: { trigger: cell, start: 'top 88%' },
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      id="reels"
      ref={root}
      className="on-deep bg-deep text-on-deep"
      style={{ paddingBlock: 'var(--section-y)' }}
    >
      <div className="shell">
        <div className="grid grid-cols-12 items-end gap-x-[clamp(1rem,2vw,2rem)] gap-y-lg">
          <div className="col-span-12 lg:col-span-5">
            <p className="caption eyebrow text-gold">Showroom</p>
            <h2 className="display mt-md text-display-lg">See it come alive</h2>
          </div>
          <p className="lede col-span-12 text-muted-deep lg:col-span-5 lg:col-start-8">
            Real furniture from our Agrabad showroom.
          </p>
        </div>

        {/* Masonry-style grid: 2 cols mobile, 3 cols desktop */}
        <div className="mt-2xl grid grid-cols-2 lg:grid-cols-3 gap-md items-start">
          {REELS.map((reel, i) => (
            <ReelCell key={i} {...reel} />
          ))}
        </div>
      </div>
    </section>
  );
}
