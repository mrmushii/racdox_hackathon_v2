import { brand } from '../content/brand.js';

/**
 * The lockup, matching the supplied mark: HEAVEN in a geometric sans with the
 * distinctive crossbar-less gold "A", and FURNITURE MART small, uppercase and
 * widely tracked beneath.
 *
 * Set live rather than placed as an image. Both supplied logo files trim to
 * 218x61 of actual ink, which is too little resolution for display use — but
 * the mark's geometry is simple enough to redraw, so the identity survives at
 * any size instead of going soft.
 *
 * The face is the SANS, not the display serif: the logo is a geometric sans and
 * the brand doc is explicit that it stays the mark and is never extended into
 * headlines. The tracking on "FURNITURE MART" is doing real work — it reframes
 * "Mart" as a legal-entity descriptor rather than a shop type, and "Mart" is the
 * single biggest threat to the brief's "not marketplace-y" instruction.
 */
export default function Wordmark({ size = 'sm', className = '', gold = true }) {
  const scale = { sm: 'text-[1.15rem]', lg: 'text-[clamp(2.5rem,7.5vw,6.5rem)]', xl: 'text-display-xl' }[size];
  const sub = {
    sm: 'text-[0.5rem] tracking-[0.18em] mt-[0.4em]',
    lg: 'text-[0.7rem] tracking-[0.32em] mt-[0.7em] pl-[0.1em]',
    xl: 'text-caption tracking-[0.18em] mt-[0.4em]',
  }[size];

  return (
    <span className={`inline-flex flex-col ${className}`}>
      <span
        className={`inline-flex items-center font-sans font-extrabold uppercase leading-none ${scale}`}
        style={{ letterSpacing: '0.01em' }}
      >
        HE
        {/* The mark's only distinctive shape: an apex with no crossbar and an
            angled cut. Sized to cap height, so it sits in the word, not beside it. */}
        <svg
          viewBox="0 0 100 100"
          aria-hidden="true"
          className="mx-[0.04em] inline-block"
          style={{ height: '0.72em', width: '0.66em' }}
        >
          <path
            d="M50 4 L96 96 L74 96 L50 47 L26 96 L4 96 Z"
            fill={gold ? 'var(--color-gold)' : 'currentColor'}
          />
        </svg>
        VEN
      </span>
      <span className={`font-sans font-medium uppercase ${sub}`}>{brand.markSub}</span>
    </span>
  );
}
