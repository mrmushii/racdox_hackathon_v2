import { useRef, useState, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from '../lib/gsap.js';
import { bespoke } from '../content/brand.js';
import AmbientVideo from '../components/AmbientVideo.jsx';
import Picture from '../components/Picture.jsx';
import CTAButton from '../components/CTAButton.jsx';

/**
 * THE BESPOKE PROCESS — Step-by-Step Presentation
 *
 * Appears step-by-step as you scroll:
 * - Uses native CSS sticky pinning (sticky top-0 h-[100svh]) inside a 360vh track.
 * - Discrete step advances: 01 Consult → 02 Design → 03 Craft → 04 Install.
 * - Each step appears one at a time with a crisp, decisive transition.
 * - Zero GSAP pin overlay bugs or layout conflicts.
 * - Step tabs are also directly clickable to jump to any step.
 */
export default function Bespoke() {
  const root = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  const goToStep = useCallback((index) => {
    setActiveStep(index);
    if (!root.current) return;
    const rect = root.current.getBoundingClientRect();
    const currentScroll = window.scrollY;
    const sectionTop = currentScroll + rect.top;
    const totalScrollable = rect.height - window.innerHeight;
    const targetScroll = sectionTop + (index / bespoke.steps.length) * totalScrollable + 10;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  }, []);

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0 && activeStep < bespoke.steps.length - 1) {
        goToStep(activeStep + 1);
      } else if (deltaX > 0 && activeStep > 0) {
        goToStep(activeStep - 1);
      }
    }
  };

  useGSAP(
    () => {
      if (!root.current) return;

      const trigger = ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const stepIndex = Math.min(
            bespoke.steps.length - 1,
            Math.max(0, Math.floor(self.progress * bespoke.steps.length))
          );
          setActiveStep(stepIndex);
        },
      });

      return () => trigger.kill();
    },
    { scope: root }
  );

  return (
    <section
      id="bespoke"
      ref={root}
      className="relative on-deep bg-deep text-on-deep h-[280vh] lg:h-[360vh]"
    >
      {/* Sticky Stage — locks in place while scrolling through the steps */}
      <div
        className="sticky top-0 h-[100svh] w-full flex flex-col justify-center overflow-hidden py-4 sm:py-6 lg:py-12"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="shell grid grid-cols-12 items-center gap-x-[clamp(1rem,2vw,2rem)] gap-y-md lg:gap-y-lg">
          
          {/* Left Column: Step Media Frame */}
          <div className="col-span-12 sm:col-span-8 sm:col-start-3 lg:col-span-5 lg:col-start-1">
            <div className="relative mx-auto aspect-[16/10] sm:aspect-[4/5] w-full max-h-[30svh] sm:max-h-[48svh] lg:max-h-[62svh] overflow-hidden border border-line-deep bg-deep/90 shadow-2xl">
              {bespoke.steps.map((s, i) => (
                <div
                  key={s.n}
                  className={`absolute inset-0 transition-opacity duration-300 ease-out ${
                    activeStep === i ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  {s.media.kind === 'video' ? (
                    <AmbientVideo
                      name={s.media.name}
                      alt={s.alt}
                      sizes="(min-width: 1024px) 36vw, 85vw"
                      className="h-full w-full"
                      mediaClassName="h-full w-full object-cover"
                    />
                  ) : (
                    <Picture
                      name={s.media.name}
                      alt={s.alt}
                      sizes="(min-width: 1024px) 36vw, 85vw"
                      className="block h-full w-full"
                      imgClassName="h-full w-full object-cover"
                    />
                  )}
                </div>
              ))}

              {/* Step indicator badge on media */}
              <div className="absolute top-3.5 left-3.5 z-20">
                <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-gold bg-deep/80 backdrop-blur-md border border-gold/30 rounded-full shadow-sm">
                  Step {bespoke.steps[activeStep].n} / 04
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Step-by-Step Details */}
          <div className="col-span-12 lg:col-span-7 lg:col-start-6 lg:pl-4">
            <p className="caption eyebrow text-gold">{bespoke.eyebrow}</p>
            <h2 className="display mt-xs sm:mt-sm text-display-md lg:text-display-lg">
              {bespoke.headline}
            </h2>

            {/* Step Segments / Interactive Tabs */}
            <div className="mt-md sm:mt-lg flex gap-2 sm:gap-4 border-b border-line-deep pb-3">
              {bespoke.steps.map((s, i) => {
                const isActive = activeStep === i;
                const isPast = activeStep > i;
                return (
                  <button
                    key={s.n}
                    type="button"
                    onClick={() => goToStep(i)}
                    className="group flex-1 text-left pb-1 transition-colors cursor-pointer"
                    aria-label={`Step ${s.n}: ${s.name}`}
                  >
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span
                        className={`text-xs font-mono transition-colors duration-200 ${
                          isActive ? 'text-gold font-bold' : isPast ? 'text-on-deep/80' : 'text-muted-deep/40'
                        }`}
                      >
                        {s.n}
                      </span>
                      <span
                        className={`text-xs font-sans tracking-wide uppercase transition-colors duration-200 hidden sm:inline ${
                          isActive ? 'text-on-deep font-semibold' : 'text-muted-deep/60'
                        }`}
                      >
                        {s.name}
                      </span>
                    </div>

                    {/* Active Step Progress Indicator */}
                    <div className="mt-2 h-[2px] w-full bg-line-deep overflow-hidden rounded-full">
                      <div
                        className="h-full bg-gold transition-all duration-300 ease-out origin-left"
                        style={{
                          transform: isActive || isPast ? 'scaleX(1)' : 'scaleX(0)',
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Discrete Step Content Stage (Single Step at a Time) */}
            <div className="relative mt-md sm:mt-xl min-h-[160px] sm:min-h-[190px] flex flex-col justify-center">
              {bespoke.steps.map((s, i) => {
                const isCurrent = activeStep === i;
                return (
                  <article
                    key={s.n}
                    className={`transition-all duration-300 ease-out ${
                      isCurrent
                        ? 'opacity-100 translate-y-0 relative z-10'
                        : 'opacity-0 -translate-y-3 absolute inset-0 pointer-events-none z-0'
                    }`}
                  >
                    <div className="flex items-baseline gap-3 sm:gap-4">
                      <span className="display text-3xl sm:text-4xl lg:text-5xl text-gold font-serif">
                        {s.n}
                      </span>
                      <h3 className="display text-2xl sm:text-4xl lg:text-5xl text-on-deep tracking-tight">
                        {s.name}
                      </h3>
                    </div>

                    <p className="lede mt-sm sm:mt-md max-w-[48ch] text-muted-deep text-sm sm:text-base lg:text-lg leading-relaxed">
                      {s.body}
                    </p>

                    {/* CTA button on the final step (04 Install) */}
                    {i === bespoke.steps.length - 1 && (
                      <div className="mt-md sm:mt-lg">
                        <CTAButton />
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
