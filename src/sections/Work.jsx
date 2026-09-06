import { wall } from '../content/brand.js';
import ShowroomWall from '../components/ShowroomWall.jsx';

/**
 * Selected work, as a wall rather than a grid.
 *
 * This replaces two sections at once: a four-tile Collections grid and a
 * separate horizontal Pieces marquee, which were two ways of saying "here is
 * the range" and between them spent about a screen and a half saying it twice.
 *
 * A grid of category tiles is what every furniture site ships, and it forces a
 * decision the brand does not want the visitor to make — pick a room — when the
 * actual proposition is that any of it is made to order. The wall makes the
 * opposite argument: volume and consistency, one held frame at a time.
 *
 * The categories still have to be legible in words, so they are in the lede
 * rather than as tile headings. Office & Study lives there too: it is a real
 * category in the brief, and the images supplied for it were AI-generated cool
 * grey that punctured every warm photograph beside them.
 */
export default function Work() {
  return (
    <section id="work" className="section bg-surface">
      <div className="shell">
        <div className="grid grid-cols-12 items-end gap-x-[clamp(1rem,2vw,2rem)] gap-y-lg">
          <div className="col-span-12 lg:col-span-5">
            <p className="caption eyebrow text-ink-muted">{wall.eyebrow}</p>
            <h2 className="display mt-md text-display-lg">{wall.headline}</h2>
          </div>
          <p className="lede col-span-12 text-ink-muted lg:col-span-5 lg:col-start-8">{wall.lede}</p>
        </div>

        <div className="mt-2xl">
          <ShowroomWall left={wall.left} centre={wall.centre} right={wall.right} />
        </div>

        <p className="caption mt-xl text-ink-muted">{wall.footnote}</p>
      </div>
    </section>
  );
}
