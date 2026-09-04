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

/* `preview` drives the desktop hover panel. An item without one degrades to a
   plain underline — a preview panel with a weak image looks worse than none. */
export const announcement = [
  'Free design consultation — at your home or our showroom',
  'Delivery and installation included',
  'Agrabad Access Road, Chattogram',
];

export const nav = [
  { label: 'Collections', href: '#collections', preview: { image: 'living',
    blurb: 'Living, bedroom, dining, office and bespoke — five rooms, all made to order.' } },
  { label: 'Bespoke', href: '#bespoke', preview: { image: 'bespoke',
    blurb: 'Consult, design, craft, install. Four steps, in-house in Agrabad.' } },
  { label: 'Interiors', href: '#interiors', preview: { image: 'office',
    blurb: 'Fitted joinery, desks and workstations — the room around the furniture.' } },
  { label: 'Showroom', href: '#showroom', preview: { image: 'showroom-hall',
    blurb: 'A large showroom on Agrabad Access Road, Chattogram. Open to visit.' } },
];

export const hero = {
  eyebrow: 'Chattogram · Since 2020',
  // The brief's own suggested line.
  headline: 'Furniture, Crafted Around You',
  lede:
    'Bespoke furniture and interior styling, designed and built in Agrabad, Chattogram. ' +
    'Every piece is made to your room, your measurements and your taste.',
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
  // Sits under the room-furnishing clip.
  roomCaption: 'An empty room, and then yours.',
};

/* The brief's five categories, all present. Office & Study nearly lost its
   tile: its supplied images measure S=3% cool grey against S=21-59% warm
   everywhere else. Rather than drop a real category, the warmest of them is
   warm-graded in the asset pipeline to S=22% — which the brief explicitly
   permits ("adjust lighting") — so the set now coheres. */
export const collections = {
  eyebrow: 'Collections',
  headline: 'Five rooms, one workshop',
  items: [
    { n: '01', name: 'Living', image: 'living',
      scope: 'Sofas, coffee tables, TV units, consoles.' },
    { n: '02', name: 'Bedroom', image: 'bedroom',
      scope: 'Beds, wardrobes, dressing tables, bedside tables.' },
    { n: '03', name: 'Dining', image: 'dining',
      scope: 'Dining tables, dining chairs, cabinets.' },
    { n: '04', name: 'Office & Study', image: 'office',
      scope: 'Executive tables, bookshelves, workstations.' },
    { n: '05', name: 'Bespoke', image: 'bespoke',
      scope: "Anything built to your own space, size and taste." },
  ],
  footnote: 'Every category is made to order. Nothing here is a fixed catalogue.',
};

/* THE SIGNATURE. The brief names bespoke the #1 differentiator, so it gets the
   one memorable move on the page. Four of the seven trust bullets are absorbed
   here, which keeps the Trust section from becoming a wall of text. */
export const bespoke = {
  eyebrow: 'The bespoke process',
  headline: 'Designed. Crafted. Customized.',
  steps: [
    { n: '01', name: 'Consult',
      body: 'A free design consultation, at your home or in our Agrabad showroom. We measure the room and listen to how you live in it.' },
    { n: '02', name: 'Design',
      body: 'Drawings and materials chosen for your space and your measurements. Nothing is pulled off a shelf.' },
    { n: '03', name: 'Craft',
      body: 'Built in-house in Agrabad. Premium wood and materials, worked by our own craftsmen.' },
    { n: '04', name: 'Install',
      body: 'Delivered and installed in your home. Easy payment options throughout.' },
  ],
};

/* Texture at 1:1 — a full-bleed macro of real craft. No analogue in either
   reference corpus, because none of those brands sells a physical object.
   Copy describes only what is visibly true in the footage. */
export const material = {
  eyebrow: 'Detail',
  headline: 'Carved, gilded, upholstered',
  lede:
    'Gilt carving on solid timber, nailhead trim set by hand, velvet pulled and ' +
    'tufted by eye. It is slower than a staple gun. It is also the difference you ' +
    'feel thirty years later.',
  specs: [
    { k: 'Carving', v: 'Hand-gilded relief' },
    { k: 'Trim', v: 'Hand-driven nailhead' },
    { k: 'Frame', v: 'Solid timber' },
    { k: 'Built', v: 'In-house, Agrabad' },
  ],
};

/* The brief's category is "Luxury / Bespoke Furniture & Interior Styling" — the
   second half of that has to appear somewhere, and it is also where the office
   and joinery footage belongs. Four office tiles inside Collections would have
   swamped the four furniture ones; the category gets its own band instead. */
export const interiors = {
  eyebrow: 'Interior styling',
  headline: 'And the room around it',
  lede:
    'Fitted joinery, built to the wall it stands against — wardrobes, shelving, ' +
    'cabinetry, and the desks and workstations that go with them.',
  grid: [
    { image: 'office-desk', label: 'Executive desks' },
    { image: 'office-boardroom', label: 'Boardroom tables' },
    { image: 'office-meeting', label: 'Meeting tables' },
    { image: 'office-workstation', label: 'Workstations' },
  ],
};

/* A slim moving strip of single pieces. Its job is to show the range without
   another grid, and it is the one place on the page where motion is continuous
   rather than scroll-linked. */
export const pieces = {
  eyebrow: 'Pieces',
  items: [
    { image: 'showcase', label: 'Glazed display cabinet' },
    { image: 'sofa-blue', label: 'Embroidered sofa' },
    { image: 'cabinet-black', label: 'Shoe cabinet, brass handles' },
    { image: 'living-classic', label: 'Carved living suite' },
    { image: 'bed-close', label: 'Upholstered bed' },
  ],
};

export const trust = {
  eyebrow: 'Why Heaven',
  headline: 'Trusted by hundreds of homeowners',
  items: [
    { k: 'Showroom', v: 'A large physical showroom on Agrabad Access Road, Chattogram.' },
    { k: 'Delivery', v: 'Delivery and installation included, to your door and into the room.' },
    { k: 'Payment', v: 'Easy payment options, arranged before work begins.' },
  ],
};

export const proof = {
  eyebrow: 'Since 2020',
  bandCaption: 'The showroom floor, Agrabad Access Road.',
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
};

export const cta = {
  headline: 'Tell us about your space.',
  lede: 'A free consultation, then drawings made for your room. Message us and we will start there.',
};

export const footer = {
  copyright: `© ${new Date().getFullYear()} Heaven Furniture Mart. All rights reserved.`,
  columns: [
    {
      title: 'Collections',
      links: [
        { label: 'Living', href: '#collections' },
        { label: 'Bedroom', href: '#collections' },
        { label: 'Dining', href: '#collections' },
        { label: 'Office & Study', href: '#interiors' },
        { label: 'Bespoke', href: '#bespoke' },
      ],
    },
    {
      title: 'Studio',
      links: [
        { label: 'The bespoke process', href: '#bespoke' },
        { label: 'Interior styling', href: '#interiors' },
        { label: 'Showroom', href: '#showroom' },
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
