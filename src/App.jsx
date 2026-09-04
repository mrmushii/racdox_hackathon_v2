import { useEffect } from 'react';
import { initSmoothScroll } from './lib/smooth-scroll.js';
import { ScrollTrigger } from './lib/gsap.js';

import BrandIntro from './components/BrandIntro.jsx';
import Nav from './components/Nav.jsx';
import Hero from './sections/Hero.jsx';
import Intro from './sections/Intro.jsx';
import Collections from './sections/Collections.jsx';
import Bespoke from './sections/Bespoke.jsx';
import Material from './sections/Material.jsx';
import Interiors from './sections/Interiors.jsx';
import Pieces from './sections/Pieces.jsx';
import Trust from './sections/Trust.jsx';
import Proof from './sections/Proof.jsx';
import CTA from './sections/CTA.jsx';
import Footer from './sections/Footer.jsx';

export default function App() {
  useEffect(() => {
    const stop = initSmoothScroll();
    // Trigger positions are computed against document height. Images finishing
    // after first paint change that height, so recompute once everything lands.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    return () => {
      window.removeEventListener('load', refresh);
      stop();
    };
  }, []);

  return (
    <>
      <a
        href="#top"
        className="caption sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-deep focus:px-4 focus:py-3 focus:text-on-deep"
      >
        Skip to content
      </a>
      <BrandIntro />
      <Nav />
      <main>
        <Hero />
        <Intro />
        <Collections />
        <Bespoke />
        <Material />
        <Interiors />
        <Pieces />
        <Trust />
        <Proof />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
