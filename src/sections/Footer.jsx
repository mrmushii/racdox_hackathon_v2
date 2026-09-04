import { brand, contact, footer } from '../content/brand.js';
import Wordmark from '../components/Wordmark.jsx';

/**
 * Column footer over the mark, composed against Cancan Furnishings — the one of
 * the eight live houses whose footer we measured frame-by-frame.
 *
 * The move being copied is the VOID, not the furniture. Cancan runs three link
 * columns hard-left across ~36% of the width, leaves the entire right side of
 * that band empty, and drops an oversized wordmark into the bottom-right. The
 * emptiness between the small links and the huge mark is the whole effect; fill
 * it and you are back to a retail sitemap. Our previous version filled all
 * twelve columns with six blocks, which is exactly the density this replaces.
 *
 * Deliberately NOT copied: Cancan's muted grey is #696969 on #141414, ~3.3:1,
 * which fails AA for the legal line it carries. --color-muted-deep is 8.3:1.
 *
 * HEAVEN sits at display-xl, the single largest type on the page and its only
 * use. Body is 15px, so it lands at ~17x contrast: the scale-contrast target,
 * spent once rather than five times.
 */
export default function Footer() {
  return (
    <footer className="on-deep bg-deep pb-lg text-on-deep">
      <div className="shell">
        <p className="max-w-[30ch] pt-2xl text-muted-deep">
          {brand.positioning}
        </p>

        {/* Three columns, hard left. Columns 8-12 stay empty on purpose. */}
        <div className="grid grid-cols-12 gap-x-[clamp(1rem,2vw,2rem)] gap-y-2xl pb-2xl pt-xl">
          {footer.columns.map((col) => (
            <nav key={col.title} className="col-span-6 lg:col-span-2" aria-label={col.title}>
              <p className="caption text-muted-deep">{col.title}</p>
              <ul className="mt-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="flex min-h-[2.75rem] items-center transition-colors duration-[600ms] hover:text-gold"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Showroom and contact merged into the third column. Cancan links these
              out to sub-pages; a one-page site has nowhere to link, so the details
              sit here — the only place on the page they exist. */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-2">
            <p className="caption text-muted-deep">Visit</p>
            <address className="mt-sm not-italic">
              {contact.addressLine}
              <br />
              {contact.addressCity}
            </address>
            <ul className="mt-sm">
              <li>
                <a
                  href={contact.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="caption inline-flex min-h-[2.75rem] items-center text-gold"
                >
                  Get directions →
                </a>
              </li>
              <li>
                <a
                  href={contact.phoneHref}
                  className="inline-flex min-h-[2.75rem] items-center transition-colors duration-[600ms] hover:text-gold"
                >
                  {contact.phoneDisplay}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* The mark, hard right against the gutter — the other end of the void.
            It HOLDS near the bottom of the viewport while the columns scroll past
            it, then releases into flow. Measured off Cancan frame-by-frame: the
            mark moved 3px while the footer moved 291px (ratio ~0), then tracked
            1:1 once it reached the end of its travel. That is position:sticky —
            no ScrollTrigger, no scroll listener, nothing to clean up, and it
            costs nothing on the perf budget. */}
        {/* A sticky element cannot leave its containing block, so this wrapper —
            which starts BELOW the columns — is what stops the mark ploughing up
            through them. Cancan gets away without one because its mark is 47vw
            and travels through the empty right half; ours is 18vw of a 6-glyph
            word, so it spans the full shell and needs the bound. Wrapper height
            minus mark height is the hold distance. */}
        <div
          className="lg:sticky lg:bottom-[clamp(3rem,8vh,6rem)] flex justify-end"
          aria-hidden="true"
        >
          <Wordmark size="xl" />
        </div>

        <div className="mt-xl flex flex-wrap items-center justify-between gap-md border-t border-line-deep pt-lg">
          <ul className="flex flex-wrap items-center gap-x-md gap-y-0">
            <li className="caption text-muted-deep">Follow us</li>
            {contact.social.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="caption inline-flex min-h-[2.75rem] items-center transition-colors duration-[600ms] hover:text-gold"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="caption text-muted-deep">{footer.copyright}</p>
          <a
            href={`mailto:${contact.email}`}
            className="caption inline-flex min-h-[2.75rem] items-center text-muted-deep transition-colors duration-[600ms] hover:text-gold"
          >
            {contact.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
