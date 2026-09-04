import { trust } from '../content/brand.js';

/**
 * Deliberately quiet. Four of the seven trust bullets are already absorbed into
 * the Bespoke process section, which is what keeps this from becoming the wall
 * of text the brief warns against.
 */
export default function Trust() {
  return (
    <section className="section bg-base">
      <div className="shell grid grid-cols-12 gap-x-[clamp(1rem,2vw,2rem)] gap-y-xl">
        <header className="col-span-12 lg:col-span-4">
          <p className="caption eyebrow text-ink-muted">{trust.eyebrow}</p>
          <h2 className="display mt-md text-display-md">{trust.headline}</h2>
        </header>

        <dl className="col-span-12 lg:col-span-7 lg:col-start-6">
          {trust.items.map((item) => (
            <div key={item.k} className="grid grid-cols-12 gap-md border-t border-line py-md">
              <dt className="caption col-span-12 text-gold-deep sm:col-span-3">{item.k}</dt>
              <dd className="col-span-12 text-ink-muted sm:col-span-9">{item.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
