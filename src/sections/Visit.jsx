import { visit, contact } from '../content/brand.js';
import LocationCard from '../components/LocationCard.jsx';

/**
 * Where the showroom is, and what happens when you get there.
 *
 * Furniture is the category where a physical showroom is the strongest thing a
 * brand owns, and the brief lists one — so this is a real answer to a question
 * a customer actually has, not a decorative map. The card is the third of the
 * three ported interactions; the address, the phone and the directions link are
 * all reachable without ever opening it, because the interaction is a bonus and
 * the information is not.
 *
 * There is deliberately NO primary button here. This section sits directly
 * above the closing CTA banner, and a sixth placement of the same gold pill two
 * screens apart stops reading as a spine and starts reading as pressure. The
 * phone number stays, as a secondary caption link.
 */
export default function Visit() {
  return (
    <section id="visit" className="section bg-base">
      <div className="shell grid grid-cols-12 items-start gap-x-[clamp(1rem,2vw,2rem)] gap-y-2xl">
        <div className="col-span-12 lg:col-span-5">
          <p className="caption eyebrow text-ink-muted">{visit.eyebrow}</p>
          <h2 className="display mt-md text-display-lg">{visit.headline}</h2>
          <p className="lede mt-lg text-ink-muted">{visit.lede}</p>

          <dl className="mt-xl border-t border-line">
            {visit.hours.map((h) => (
              <div key={h.k} className="flex justify-between gap-md border-b border-line py-md">
                <dt className="caption text-ink-muted">{h.k}</dt>
                <dd className="caption text-right text-ink">{h.v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-xl flex flex-wrap items-center gap-md">
            <a
              href={contact.phoneHref}
              className="caption group inline-flex min-h-[2.75rem] items-center text-ink-muted"
            >
              <span className="border-b border-line pb-1 transition-colors duration-[600ms] group-hover:border-ink group-hover:text-ink">
                {contact.phoneDisplay}
              </span>
            </a>
          </div>
        </div>

        {/* The card stands alone. A second, unrelated interior photograph used to
            sit under it as filler; it said nothing the wall had not already said
            twice, and it pushed the map — the one piece of information this
            section actually exists to give — up and out of the way. */}
        <div className="col-span-12 lg:col-span-6 lg:col-start-7">
          <LocationCard />
        </div>
      </div>
    </section>
  );
}
