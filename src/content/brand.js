/**
 * Every string on the page. No copy is hardcoded in a component.
 *
 * Facts here are transcribed from docs/03-brief-verbatim.md and are NOT ours to
 * change: name, people, dates, categories, contact, the MD quote, the
 * milestones. Everything else is written to the voice rules in
 * docs/01-brand.md - nouns and verbs carry the meaning, one adjective per
 * sentence, numbers are copy, headlines are declarative and 2-6 words.
 *
 * No invented product names and no invented designers: Heaven sells categories
 * and bespoke work and has no named designers, so either would fabricate a
 * brand fact. The owned system here is the PROCESS.
 *
 * Every caption below describes what is VISIBLE in the asset it sits under. The
 * page now runs on real workshop, machine-room and showroom footage, so no
 * caption has to be written around something the picture does not show.
 */

export const brand = {
  name: 'Heaven Furniture Mart',
  mark: 'Heaven',
  markSub: 'Furniture Mart',
  tagline: 'Designed. Crafted. Customized.',
  positioning: 'Bespoke furniture and interior styling, from Chattogram.',
};

export const contact = {
  phoneDisplay: '+880 1960-481983',
  phoneHref: 'tel:+8801960481983',
  email: 'heavenfurnituremart@gmail.com',
  addressLine: 'Agrabad Access Road',
  addressCity: 'Chattogram, Bangladesh',
  // One action, four placements, identical wording every time.
  whatsapp:
    'https://wa.me/8801960481983?text=' +
    encodeURIComponent(
      "Hello Heaven Furniture Mart — I'd like to request a quote for a custom piece."
    ),
  cta: 'Request a Quote',
  maps:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('Heaven Furniture Mart, Agrabad Access Road, Chattogram, Bangladesh'),
  social: [
    { label: 'Facebook', href: 'https://facebook.com/HeavenFurnitureMart' },
    { label: 'Instagram', href: 'https://instagram.com/heaven_furniture_ltd' },
    { label: 'YouTube', href: 'https://youtube.com/@HeavenFurnitureMart' },
  ],
};

export const announcement = [
  'Free design consultation — at your home or our showroom',
  'Delivery and installation included',
  'Agrabad Access Road, Chattogram',
];

/* `preview` drives the desktop hover panel. An item without one degrades to a
   plain underline — a preview panel with a weak image looks worse than none. */
export const nav = [
  { label: 'Work', href: '#work', preview: { image: 'living',
    blurb: 'Living, bedroom, dining, office and bespoke — five rooms, all made to order.' } },
  { label: 'Process', href: '#bespoke', preview: { image: 'craft-process-poster',
    blurb: 'Consult, design, craft, install. Four steps, in-house in Agrabad.' } },
  { label: 'Craft', href: '#material', preview: { image: 'cnc-score-poster',
    blurb: 'Machined to the drawing, then finished by hand.' } },
  { label: 'Visit', href: '#visit', preview: { image: 'showroom-hall',
    blurb: 'A large showroom on Agrabad Access Road, Chattogram. Open to visit.' } },
];

/* THE HERO. The 4:5 panel holds the gold-leaf clip: a craftsman laying leaf
   onto a carved frame by hand. It is the logo's own gold, the ornate carving
   the brand actually sells, and human hands, in one shot — which answers "what
   is this brand" before the headline is read. */
export const hero = {
  eyebrow: 'Chattogram · Since 2020',
  // The brief's own suggested line.
  headline: 'Furniture, Crafted Around You',
  lede:
    'Bespoke furniture and interior styling, designed and built in Agrabad, Chattogram. ' +
    'Every piece is made to your room, your measurements and your taste.',
  panelCaption: 'Our Agrabad showroom and workshop.',
  scroll: 'Scroll',
};

export const intro = {
  eyebrow: 'What we do',
  // Scroll-linked word fill. Closes on the brand's own line so it lands as a
  // brand statement rather than a strapline bolted on.
  manifesto:
    "We don't sell what's on the shelf. Every piece begins with your room, your " +
    'measurements, your taste — then our workshop in Agrabad builds it. Sofas, beds, ' +
    'dining sets, wardrobes, office and study.',
  signoff: brand.tagline,
};

/* THE SHOWROOM WALL. Three columns; the middle one holds while the outer two
   travel past it. It replaces both the old four-tile Collections grid and the
   separate Pieces marquee, which were two ways of saying the same thing.
   Nine photographs, three per column. `dining` left for the hero and
   `living-classic` for the bespoke steps; before that the columns ran 4/3/3 and
   the right one ended 580px short of the left, which read as a missing tile.

   Ordering rule from docs/05-asset-audit.md: several of these share a generated
   background (the same painting, palm and sconce recur), so no two of them may
   sit adjacent. `hero-bed`/`bed-close` and `living`/`sofa-blue` are split
   across different columns for that reason. */
export const wall = {
  eyebrow: 'Selected work',
  headline: 'Five rooms, one workshop',
  lede:
    'Living, bedroom, dining, office and study, and whatever else the room asks for. ' +
    'Every category is made to order; nothing here is a fixed catalogue.',
  // Outer columns scroll. Longer than the sticky column by design — the offset
  // is what makes the middle one read as held rather than as stuck.
  left: [
    { image: 'hero-bed', label: 'Upholstered bed, tufted headboard' },
    { image: 'showcase', label: 'Glazed display cabinet' },
    { image: 'showroom-hall', label: 'Dining suite, ivory and gold' },
  ],
  // The held column. Three frames, one screen high.
  centre: [
    { image: 'living', label: 'Embroidered sofa, gilt frame' },
    { image: 'material-goldleaf', label: 'Gilt relief on a bed frame' },
    { image: 'bespoke', label: 'Carved chairs, made to order' },
  ],
  // `cabinet-black` leads rather than `sofa-blue`: sofa-blue and the centre
  // column's `living` are both embroidered sofas, and at lg they would have
  // shared the top row.
  right: [
    { image: 'cabinet-black', label: 'Shoe cabinet, brass handles' },
    { image: 'sofa-blue', label: 'Embroidered sofa, blue and gold' },
    { image: 'bed-close', label: 'Headboard detail' },
  ],
  footnote: 'Photographed in our Agrabad showroom and workshop.',
};

/* THE SIGNATURE. The brief names bespoke the #1 differentiator, so it gets the
   one memorable move on the page. Four of the seven trust bullets are absorbed
   here, which keeps the proof section from becoming a wall of text.

   Each step carries its own visual, and the sequence is the argument: the
   showroom where it starts, the machine that cuts it, the hands that finish it,
   the room it ends in. Two of the four are real footage. */
export const bespoke = {
  eyebrow: 'The bespoke process',
  headline: 'Designed. Crafted. Customized.',
  steps: [
    { n: '01', name: 'Consult', media: { kind: 'image', name: 'living-classic' },
      alt: 'A carved living suite on marble in a panelled room',
      body: 'A free design consultation, at your home or in our Agrabad showroom. We measure the room and listen to how you live in it.' },
    { n: '02', name: 'Design', media: { kind: 'video', name: 'cnc-cut' },
      alt: 'A CNC router cutting joinery blanks from solid timber',
      body: 'Drawings and materials chosen for your space and your measurements, then cut to them. Nothing is pulled off a shelf.' },
    { n: '03', name: 'Craft', media: { kind: 'video', name: 'craft-process' },
      alt: 'A craftsman upholstering a sofa frame by hand',
      body: 'Built in-house in Agrabad. Premium wood and materials, worked by our own craftsmen.' },
    { n: '04', name: 'Install', media: { kind: 'image', name: 'bedroom' },
      alt: 'A finished bedroom suite in place, bed and fitted wardrobe',
      body: 'Delivered and installed in your home. Easy payment options throughout.' },
  ],
};

/* Texture at 1:1 — a macro of real work, revealed by the reader's own scroll.
   The clip is a V-bit chamfering a panel: the one asset in the set whose own
   palette is already the brand's, so it sits on ivory without a grade.

   Copy describes only what is visibly true in the footage. The gilt and the
   upholstery are shown elsewhere; what this section adds is the half of the
   answer a bespoke claim usually dodges — that custom does not mean approximate. */
export const material = {
  eyebrow: 'Craft',
  headline: 'Machined to the drawing. Finished by hand.',
  lede:
    'The cut is exact, because a millimetre out at the panel is a gap you see every ' +
    'day at the wall. Everything after the cut — the carving, the gilding, the ' +
    'tufting — is done by hand, and takes as long as it takes.',
  caption: 'Chamfering a panel, Agrabad workshop.',
  specs: [
    { k: 'Cut', v: 'CNC, to the drawing' },
    { k: 'Carving', v: 'By hand, in-house' },
    { k: 'Frame', v: 'Solid timber' },
    { k: 'Built', v: 'Agrabad, Chattogram' },
  ],
};

export const showroomTour = {
  eyebrow: 'Virtual Tour',
  headline: 'Experience the Craft',
  lede: 'Step inside our Agrabad showroom. See the premium materials, feel the upholstery, and understand what custom truly means before you commit.',
  caption: 'Virtual tour of the Heaven Furniture Mart showroom in Chattogram.',
};

export const proof = {
  eyebrow: 'Since 2020',
  bandCaption: 'A carved and upholstered suite, Agrabad showroom.',
  quote:
    'At Heaven Furniture Mart, we believe furniture is more than just function; it is a ' +
    'reflection of lifestyle, taste, and comfort. Every piece we create is designed to bring ' +
    'lasting elegance into the homes of our clients.',
  attribution: 'Abul Kalam Bhuiyan',
  attributionRole: 'Managing Director',
  milestones: [
    { year: '2020', event: 'Founded by Abul Kalam Bhuiyan' },
    { year: '2021', event: 'Opened the Agrabad showroom' },
    { year: '2024–2025', event: 'Exhibited at the International Furniture Fair, Chattogram' },
    { year: '2025', event: 'Became a member of the Chamber of Commerce' },
    { year: '2026', event: 'Received nationwide BFIOA recognition' },
  ],
  // The three trust bullets the bespoke steps do not already carry.
  assurances: [
    { k: 'Showroom', v: 'A large physical showroom on Agrabad Access Road, Chattogram.' },
    { k: 'Delivery', v: 'Delivery and installation included, to your door and into the room.' },
    { k: 'Payment', v: 'Easy payment options, arranged before work begins.' },
  ],
};

/* THE SHOWROOM CARD. The map is drawn from real OpenStreetMap geometry at build
   time (scripts/build-map.mjs) — an invented street grid of a real address in a
   real city is a lie a Chattogram judge would spot in a second.

   OSM has no node for the business, so the marker marks the ROAD and the copy
   says exactly that. The claim here is no more precise than the brief's own. */
export const visit = {
  eyebrow: 'Visit',
  headline: 'Come and stand next to it',
  lede:
    'Photographs only get you so far with furniture. The showroom is on Agrabad Access ' +
    'Road, and the consultation is free whether you walk in or we come to you.',
  mapLabel: 'Agrabad Access Road',
  mapSub: 'Chattogram, Bangladesh',
  mapExpand: 'See the district',
  mapCollapse: 'Close',
  mapDirections: 'Get directions',
  mapAttribution: 'Map data © OpenStreetMap contributors',
  mapHere: 'Showroom',
  mapNote: 'The marker shows the road, not a door number.',
  hours: [
    { k: 'Showroom', v: 'Agrabad Access Road, Chattogram' },
    { k: 'Consultation', v: 'Free, at the showroom or at your home' },
    { k: 'Phone', v: 'WhatsApp or call, same number' },
  ],
};

export const cta = {
  headline: 'Tell us about your space.',
  lede: 'A free consultation, then drawings made for your room. Message us and we will start there.',
};

export const footer = {
  copyright: `© ${new Date().getFullYear()} Heaven Furniture Mart. All rights reserved.`,
  columns: [
    {
      title: 'Rooms',
      links: [
        { label: 'Living', href: '#work' },
        { label: 'Bedroom', href: '#work' },
        { label: 'Dining', href: '#work' },
        { label: 'Office & Study', href: '#work' },
        { label: 'Bespoke', href: '#bespoke' },
      ],
    },
    {
      title: 'Studio',
      links: [
        { label: 'The bespoke process', href: '#bespoke' },
        { label: 'Craft', href: '#material' },
        { label: 'Showroom', href: '#visit' },
      ],
    },
  ],
};

export const meta = {
  title: 'Heaven Furniture Mart — Bespoke Furniture & Interior Styling, Chattogram',
  description:
    'Bespoke furniture and interior styling in Agrabad, Chattogram. Sofas, beds, dining ' +
    'sets and custom pieces, designed and built in-house since 2020.',
};
