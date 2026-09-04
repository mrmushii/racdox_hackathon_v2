import { proof } from '../content/brand.js';
import Picture from '../components/Picture.jsx';

/**
 * The credibility section. The brief frames the timeline as an optional
 * "touch" — it is not: BFIOA nationwide recognition is the strongest single
 * credential available, and the MD quote is the only first-party voice.
 *
 * Quote and milestones are transcribed verbatim; neither is ours to reword.
 */
export default function Proof() {
  return (
    <section id="showroom" className="bg-surface pb-[var(--section-y)]">
      {/* The widest frame in the set (3168x1344), used at the one place a
          2.36:1 image belongs: full bleed, as the section's own header. */}
      <figure className="relative">
        <div className="aspect-[21/9] w-full overflow-hidden sm:aspect-[2.36/1]">
          <Picture
            name="showroom-wide"
            alt="The Heaven Furniture Mart showroom floor on Agrabad Access Road, Chattogram"
            sizes="100vw"
            className="block h-full w-full"
            imgClassName="h-full w-full object-cover"
          />
        </div>
        <figcaption className="shell caption mt-md text-ink-muted">{proof.bandCaption}</figcaption>
      </figure>

      <div className="pt-[var(--section-y)]" />
      <div className="shell grid grid-cols-12 items-start gap-x-[clamp(1rem,2vw,2rem)] gap-y-2xl">
        <div className="col-span-12 lg:col-span-6">
          <p className="caption eyebrow text-ink-muted">{proof.eyebrow}</p>

          <blockquote className="mt-lg">
            <p className="display text-display-md !leading-[1.25]">&ldquo;{proof.quote}&rdquo;</p>
            <footer className="caption mt-lg flex items-center gap-3 text-ink-muted">
              <span className="h-px w-8 bg-line" aria-hidden="true" />
              <span>
                {proof.attribution}, {proof.attributionRole}
              </span>
            </footer>
          </blockquote>

          <div className="mt-2xl aspect-[4/3] overflow-hidden border border-line">
            <Picture
              name="showroom-hall"
              alt="Inside the Heaven Furniture Mart showroom on Agrabad Access Road, Chattogram"
              sizes="(min-width: 1024px) 46vw, 92vw"
              className="block h-full w-full"
              imgClassName="h-full w-full object-cover"
            />
          </div>
        </div>

        <ol className="col-span-12 lg:col-span-5 lg:col-start-8">
          {proof.milestones.map((m) => (
            <li key={m.year} className="grid grid-cols-12 gap-md border-t border-line py-md">
              <span className="caption col-span-4 text-gold-deep sm:col-span-3">{m.year}</span>
              <span className="col-span-8 text-ink-muted sm:col-span-9">{m.event}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
