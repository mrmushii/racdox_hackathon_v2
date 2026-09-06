import { useState, useEffect, useRef } from 'react';
import { useQuoteModal } from '../context/QuoteContext.jsx';
import { lockScroll } from '../lib/smooth-scroll.js';
import { contact } from '../content/brand.js';

const CATEGORIES = [
  'Living Room Suite',
  'Dining Table Set',
  'Master Bedroom',
  'Vanity & Curio',
  'Full Residence Bespoke',
];

export default function QuoteModal() {
  const { isOpen, initialCategory, closeQuoteModal } = useQuoteModal();
  const dialogRef = useRef(null);
  const nameInputRef = useRef(null);

  const [category, setCategory] = useState('Living Room Suite');
  const [consultType, setConsultType] = useState('showroom');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  // Sync initialCategory when opened
  useEffect(() => {
    if (isOpen) {
      if (initialCategory) {
        setCategory(initialCategory);
      }
      setSubmitted(false);
      setName('');
      setPhone('');
      setNotes('');
      // Focus first input after animation
      const timer = setTimeout(() => {
        nameInputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialCategory]);

  // Lock scroll & handle Escape key
  useEffect(() => {
    if (!isOpen) return;
    lockScroll(true);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeQuoteModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      lockScroll(false);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeQuoteModal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const consultLabel =
      consultType === 'showroom'
        ? 'Agrabad Showroom Visit'
        : 'Home / Site Measurement';

    const message =
      `Hello Heaven Furniture Mart,\n\n` +
      `I would like to request a consultation for a custom piece:\n` +
      `• Name: ${name.trim()}\n` +
      `• Contact: ${phone.trim()}\n` +
      `• Category: ${category}\n` +
      `• Preferred Consultation: ${consultLabel}\n` +
      (notes.trim() ? `• Project Details: ${notes.trim()}\n` : '') +
      `\nPlease let me know available consultation timings.`;

    const waUrl =
      'https://wa.me/8801960481983?text=' + encodeURIComponent(message);

    setWhatsappUrl(waUrl);
    setSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quote-modal-title"
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#152220]/85 backdrop-blur-md transition-opacity duration-300"
        onClick={closeQuoteModal}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        ref={dialogRef}
        style={{ width: '100%', maxWidth: '640px' }}
        className="relative z-10 w-full bg-deep border border-line-deep text-on-deep shadow-2xl p-6 sm:p-8 md:p-10 my-auto max-h-[92vh] overflow-y-auto"
      >
        {/* Top Gold Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />

        {/* Close Button */}
        <button
          type="button"
          onClick={closeQuoteModal}
          aria-label="Close quote modal"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 rounded-full border border-line-deep flex items-center justify-center text-muted-deep hover:text-gold hover:border-gold/40 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1L11 11M1 11L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {!submitted ? (
          <div>
            {/* Header */}
            <p className="caption eyebrow text-gold">Bespoke Consultation</p>
            <h2 id="quote-modal-title" className="display mt-sm text-2xl sm:text-3xl lg:text-4xl">
              Request a Custom Quote
            </h2>
            <p className="caption text-muted-deep mt-2 text-xs normal-case tracking-normal max-w-[48ch] leading-relaxed">
              Every piece is measured, designed, and built to order in our Agrabad workshop.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 space-y-5 sm:space-y-6">
              {/* Category Selector Chips */}
              <div>
                <label className="caption block text-muted-deep mb-2 text-[11px] tracking-wider uppercase">
                  Select Room / Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => {
                    const isSelected = category === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-1.5 text-xs font-mono tracking-wide rounded-full transition-all duration-200 border whitespace-nowrap cursor-pointer ${
                          isSelected
                            ? 'bg-gold text-deep font-semibold border-gold shadow-sm'
                            : 'bg-deep/50 text-muted-deep border-line-deep hover:border-gold/40 hover:text-on-deep'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="caption block text-muted-deep mb-1.5 text-[11px] tracking-wider uppercase">
                    Your Name *
                  </label>
                  <input
                    ref={nameInputRef}
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Syed Rahman"
                    className="w-full bg-[#101918] border border-line-deep px-3.5 py-2.5 text-sm text-on-deep placeholder:text-muted-deep/40 focus:outline-none focus:border-gold transition-colors font-sans"
                  />
                </div>

                <div>
                  <label className="caption block text-muted-deep mb-1.5 text-[11px] tracking-wider uppercase">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1812-345678"
                    className="w-full bg-[#101918] border border-line-deep px-3.5 py-2.5 text-sm text-on-deep placeholder:text-muted-deep/40 focus:outline-none focus:border-gold transition-colors font-sans"
                  />
                </div>
              </div>

              {/* Consultation Preference */}
              <div>
                <label className="caption block text-muted-deep mb-2 text-[11px] tracking-wider uppercase">
                  Consultation Preference
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setConsultType('showroom')}
                    className={`p-3 text-left border transition-all duration-200 cursor-pointer ${
                      consultType === 'showroom'
                        ? 'border-gold bg-deep/90 shadow-sm'
                        : 'border-line-deep bg-deep/30 hover:border-line-deep/80'
                    }`}
                  >
                    <span className="caption block text-gold text-[10px]">Option 01</span>
                    <span className="text-xs font-medium text-on-deep block mt-1">
                      Showroom Visit
                    </span>
                    <span className="caption text-[11px] text-muted-deep block mt-0.5 normal-case tracking-normal">
                      Agrabad Access Road
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsultType('site')}
                    className={`p-3 text-left border transition-all duration-200 cursor-pointer ${
                      consultType === 'site'
                        ? 'border-gold bg-deep/90 shadow-sm'
                        : 'border-line-deep bg-deep/30 hover:border-line-deep/80'
                    }`}
                  >
                    <span className="caption block text-gold text-[10px]">Option 02</span>
                    <span className="text-xs font-medium text-on-deep block mt-1">
                      Home Measurement
                    </span>
                    <span className="caption text-[11px] text-muted-deep block mt-0.5 normal-case tracking-normal">
                      Chattogram metropolitan area
                    </span>
                  </button>
                </div>
              </div>

              {/* Project Notes */}
              <div>
                <label className="caption block text-muted-deep mb-1.5 text-[11px] tracking-wider uppercase">
                  Dimensions or Material Preferences (Optional)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. 6-seater dining table with Italian marble top, or room measurements..."
                  className="w-full bg-[#101918] border border-line-deep px-3.5 py-2.5 text-sm text-on-deep placeholder:text-muted-deep/40 focus:outline-none focus:border-gold transition-colors font-sans resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="caption w-full min-h-[3rem] inline-flex items-center justify-center gap-3 bg-gold px-6 text-deep font-semibold tracking-wider uppercase transition-all duration-300 hover:bg-gold-deep cursor-pointer text-xs"
                >
                  Submit Quote Request
                  <span aria-hidden="true">→</span>
                </button>
              </div>

              {/* Direct WhatsApp Prompt */}
              <div className="text-center pt-2 border-t border-line-deep/60">
                <p className="caption text-[11px] text-muted-deep normal-case tracking-normal">
                  Prefer instant messaging?{' '}
                  <a
                    href={contact.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:underline font-medium ml-1"
                  >
                    Chat directly on WhatsApp →
                  </a>
                </p>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation State */
          <div className="py-6 text-center">
            <div className="w-14 h-14 rounded-full border border-gold/50 mx-auto flex items-center justify-center bg-deep/60 text-gold mb-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <p className="caption eyebrow text-gold justify-center">Request Received</p>
            <h2 className="display mt-sm text-2xl sm:text-3xl">
              Thank You, {name.trim().split(' ')[0]}
            </h2>
            <p className="mt-3 max-w-[44ch] mx-auto text-muted-deep text-sm leading-relaxed">
              We have received your bespoke request for <strong className="text-on-deep font-medium">{category}</strong>. Our design team will review your specifications and contact you at <span className="text-gold font-mono">{phone}</span>.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="caption min-h-[3rem] inline-flex items-center justify-center gap-2 bg-gold px-6 text-deep font-semibold tracking-wider uppercase transition-all duration-300 hover:bg-gold-deep text-xs"
              >
                Send Details via WhatsApp
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 13L13 1M13 1H3M13 1V11" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </a>

              <button
                type="button"
                onClick={closeQuoteModal}
                className="caption min-h-[3rem] inline-flex items-center justify-center border border-line-deep px-6 text-muted-deep hover:text-on-deep hover:border-gold transition-colors text-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
