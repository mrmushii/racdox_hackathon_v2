import { proof } from '../content/brand.js';
import { images } from '../content/media.js';
import Picture from '../components/Picture.jsx';

/**
 * The credibility section. The brief frames the timeline as an optional
 * "touch" — it is not: BFIOA nationwide recognition is the strongest single
 * credential available, and the MD quote is the only first-party voice.
 *
 * Quote and milestones are transcribed verbatim; neither is ours to reword.
 */
export default function Proof() {
  const hasPortrait = Boolean(images.founder);

  return (
    <section id="proof" className="bg-surface py-[var(--section-y)]">
      <div className="shell grid grid-cols-12 items-start gap-x-[clamp(1rem,2vw,2rem)] gap-y-2xl">
        <div className="col-span-12 lg:col-span-6">
          <p className="caption eyebrow text-ink-muted">{proof.eyebrow}</p>

          {/* Portrait with the quote card overlapping it. The overlap is the
              only thing worth taking from the card-carousel pattern: it binds
              the face to the words instead of stacking two unrelated blocks.
              Everything else that pattern ships — pill shadows, 3xl radii,
              social circles, sibling testimonials — is retail furniture, and
              there are no sibling testimonials to carry anyway. Heaven has one
              first-party voice and inventing more would fabricate brand facts.

              The portrait is the last asset supplied, so the card stands alone
              until it lands; `images.founder` is written by the pipeline. */}
          <figure className="mt-lg">
            {hasPortrait && (
              <div className="aspect-[4/5] w-[68%] overflow-hidden border border-line sm:w-[58%]">
                <Picture
                  name="founder"
                  alt={`${proof.attribution}, ${proof.attributionRole} of Heaven Furniture Mart`}
                  sizes="(min-width: 1024px) 28vw, 62vw"
                  className="block h-full w-full"
                  imgClassName="h-full w-full object-cover"
                />
              </div>
            )}

            <blockquote
              className={`border border-line bg-base p-lg ${
                hasPortrait ? 'relative z-10 -mt-2xl ml-[12%] sm:ml-[22%]' : ''
              }`}
            >
              <p className="display text-display-md !leading-[1.25]">
                &ldquo;{proof.quote}&rdquo;
              </p>
              <figcaption className="caption mt-lg flex items-center gap-3 text-ink-muted">
                <span className="h-px w-8 bg-line" aria-hidden="true" />
                <span>
                  {proof.attribution}, {proof.attributionRole}
                </span>
              </figcaption>
            </blockquote>
          </figure>

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
