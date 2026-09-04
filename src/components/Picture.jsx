import { images } from '../content/media.js';

/**
 * <picture> with an AVIF srcset and a single WebP fallback.
 *
 * The fallback exists only for Safari 16.0-16.3, which predates AVIF; browsers
 * that support AVIF never fetch it. Intrinsic width/height are always emitted
 * so the box is reserved before load — that, plus the inlined LQIP as the
 * background, is what holds CLS at zero on a warm ground with no white flash.
 */
export default function Picture({
  name,
  alt,
  sizes = '100vw',
  className = '',
  imgClassName = '',
  priority = false,
  style,
}) {
  const m = images[name];
  if (!m) throw new Error(`Picture: unknown media "${name}"`);

  const avif = m.widths.map((w) => `/media/${name}-${w}.avif ${w}w`).join(', ');

  return (
    <picture className={className} style={style}>
      <source type="image/avif" srcSet={avif} sizes={sizes} />
      <source type="image/webp" srcSet={`/media/${name}-${m.fallback}.webp`} />
      <img
        src={`/media/${name}-${m.widths.at(-1)}.avif`}
        alt={alt}
        width={m.width}
        height={m.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={imgClassName}
        style={{
          backgroundImage: `url(${m.lqip})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    </picture>
  );
}
