import { cta, contact } from '../content/brand.js';
import CTAButton from '../components/CTAButton.jsx';

/**
 * One action. Phone and address sit beneath in caption style as secondary, not
 * competing — nothing else on the page is styled as a primary button.
 */
export default function CTA() {
  return (
    <section id="cta" className="on-deep bg-deep py-2xl text-on-deep">
      <div className="shell">
        <div className="max-w-[18ch]">
          <h2 className="display text-display-lg">{cta.headline}</h2>
        </div>
        <p className="lede mt-lg text-muted-deep">{cta.lede}</p>

        <div className="mt-xl">
          <CTAButton size="lg" />
        </div>

        <div className="mt-2xl flex flex-wrap gap-x-2xl gap-y-md border-t border-line-deep pt-lg">
          <a
            href={contact.phoneHref}
            className="caption inline-flex min-h-[2.75rem] items-center text-muted-deep transition-colors duration-[600ms] hover:text-gold"
          >
            {contact.phoneDisplay}
          </a>
          <p className="caption flex min-h-[2.75rem] items-center text-muted-deep">
            {contact.addressLine}, {contact.addressCity}
          </p>
        </div>
      </div>
    </section>
  );
}
