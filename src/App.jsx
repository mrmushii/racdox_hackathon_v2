import { useEffect, useRef } from 'react';
import { initSmoothScroll } from './lib/smooth-scroll.js';
import { ScrollTrigger } from './lib/gsap.js';
import { initMarkDrop } from './lib/mark-drop.js';

import BrandIntro from './components/BrandIntro.jsx';
import Nav from './components/Nav.jsx';
import Hero from './sections/Hero.jsx';
import Intro from './sections/Intro.jsx';
import Work from './sections/Work.jsx';
import Bespoke from './sections/Bespoke.jsx';
import Material from './sections/Material.jsx';
import Proof from './sections/Proof.jsx';
import Visit from './sections/Visit.jsx';
import CTA from './sections/CTA.jsx';
import Footer from './sections/Footer.jsx';

export default function App() {
  const footerRef = useRef(null);

  useEffect(() => {
    const stop = initSmoothScroll();
    // Trigger positions are computed against document height. Images finishing
    // after first paint change that height, so recompute once everything lands.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const releaseMark = initMarkDrop(footerRef.current);
    return () => {
      window.removeEventListener('load', refresh);
      releaseMark();
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
        <Work />
        <Bespoke />
        <Material />
        <Proof />
        <Visit />
        <CTA />
      </main>
      <Footer innerRef={footerRef} />
    </>
  );
}
