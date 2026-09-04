import { brand, contact, footer } from '../content/brand.js';
import Wordmark from '../components/Wordmark.jsx';

/**
 * HEAVEN at display-xl — the single largest type on the page, and its only use.
 * Body is 15px, so this lands at ~12.8x contrast: the scale contrast target,
 * spent exactly once rather than five times.
 */
export default function Footer() {
  return (
    <footer className="on-deep bg-deep pb-xl text-on-deep">
      <div className="shell">
        <div className="grid grid-cols-12 gap-x-[clamp(1rem,2vw,2rem)] gap-y-xl border-t border-line-deep py-2xl">
          <div className="col-span-12 sm:col-span-6 lg:col-span-4">
            <p className="caption text-muted-deep">Showroom</p>
            <address className="mt-md not-italic">
              {contact.addressLine}
              <br />
              {contact.addressCity}
            </address>
          </div>

          <div className="col-span-12 sm:col-span-6 lg:col-span-4">
            <p className="caption text-muted-deep">Contact</p>
            <ul className="mt-sm">
              <li>
                <a
                  href={contact.phoneHref}
                  className="inline-flex min-h-[2.75rem] items-center transition-colors duration-[600ms] hover:text-gold"
                >
                  {contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex min-h-[2.75rem] items-center transition-colors duration-[600ms] hover:text-gold"
                >
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <p className="caption text-muted-deep">Follow</p>
            <ul className="mt-md flex gap-lg">
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
          </div>
        </div>

        {/* The mark, echoed. Its second and final appearance at this scale. */}
        <div className="pt-lg" aria-hidden="true">
          <Wordmark size="xl" className="w-full" />
        </div>

        <div className="mt-2xl flex flex-wrap items-center justify-between gap-md border-t border-line-deep pt-lg">
          <p className="caption text-muted-deep">{footer.copyright}</p>
          <p className="caption text-muted-deep">{brand.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
