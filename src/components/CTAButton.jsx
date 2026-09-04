import { contact } from '../content/brand.js';

/**
 * The only element on the page styled as a primary button. One action, one
 * wording, four placements.
 *
 * Gold fill carries DEEP-TEAL text at 7.93:1. White on gold is 2.07:1 and gold
 * text on ivory is 1.83:1 — neither is ever used. See docs/01-brand.md.
 */
export default function CTAButton({ className = '', size = 'md' }) {
  const pad =
    size === 'lg'
      ? 'px-[clamp(1.75rem,3vw,2.75rem)] py-[clamp(1rem,1.4vw,1.35rem)]'
      : 'px-[clamp(1.25rem,2vw,1.75rem)] py-[clamp(0.75rem,1vw,0.95rem)]';

  return (
    <a
      href={contact.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className={`caption group relative inline-flex min-h-[2.75rem] items-center gap-3
                  overflow-hidden bg-gold text-deep ${pad} ${className}`}
    >
      {/* Slow wipe on hover: 0.6s, symmetric. Furniture is heavy. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-left scale-x-0 bg-deep transition-transform
                   duration-[600ms] ease-[cubic-bezier(.445,.05,.55,.95)]
                   group-hover:scale-x-100 motion-reduce:transition-none"
      />
      <span className="relative transition-colors duration-[600ms] group-hover:text-gold">
        {contact.cta}
      </span>
      <span
        aria-hidden="true"
        className="relative transition-colors duration-[600ms] group-hover:text-gold"
      >
        →
      </span>
    </a>
  );
}
