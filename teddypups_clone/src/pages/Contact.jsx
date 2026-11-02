import { useState } from 'react';
import InteractiveTeddy from '../components/InteractiveTeddy';
import { puppies } from '../data/puppies';

function formatPuppyOption(pup) {
  const g = (pup.gender || '').toLowerCase();
  const genderLabel =
    g === 'male'
      ? 'boy'
      : g === 'female'
      ? 'girl'
      : g.includes('male') && g.includes('female')
      ? 'boy & girl'
      : g;
  if (pup.name && pup.breed && pup.name !== pup.breed) {
    return `${pup.name} (${pup.breed}, ${genderLabel})`;
  }
  return `${pup.name || pup.breed} (${genderLabel})`;
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    area: '',
    puppyId: '',
    message: '',
  });

  // Phases: 'writing' | 'sealing' | 'posting' | 'sent'
  const [phase, setPhase] = useState('writing');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const availablePuppies = puppies.filter((p) => p.status === 'Available');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting || phase !== 'writing') return;

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setErrorMessage('Please enter your name (at least 2 characters).');
      return;
    }

    if (!formData.phone.trim() || formData.phone.trim().length < 6) {
      setErrorMessage('Please enter your phone or WhatsApp number.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    // Initial submission delay (600ms), then start folding animation
    setTimeout(() => {
      // Step 1: Sealing phase (duration 750ms) - letter folds away, envelope appears and flap closes
      setPhase('sealing');

      setTimeout(() => {
        // Step 2: Posting phase (duration 1000ms) - mailbox rises, envelope drops in, flag flips up
        setPhase('posting');

        setTimeout(() => {
          // Step 3: Sent phase - "Message received!" panel appears
          setPhase('sent');
          setIsSubmitting(false);
        }, 1000);
      }, 750);
    }, 600);
  };

  return (
    <div data-page="contact" className="tp-page">
      <section
        data-pup-scene="true"
        data-tone="light"
        className="tp-scene"
        style={{ '--sky-top': '#fff9ee', '--sky-bottom': '#f9dca4' }}
        aria-labelledby="contact-title"
      >
        <div className="gutter tp-contact__inner">
          {/* Header */}
          <header className="tp-contact__header">
            <h1
              id="contact-title"
              className="font-plush text-giant tp-contact__title"
            >
              Get in touch with us
            </h1>
            <p className="text-lede tp-contact__lede">
              Have questions about our puppies or adoption process? Fill out the
              form, and our team will get back to you promptly. Whether ready to
              adopt or just seeking info, we&apos;d love to hear from you!
            </p>
          </header>

          <div className="tp-contact-grid">
            {/* Right Column on Desktop (First on Mobile): Fill-in-the-blank Letterform + Teddy */}
            <div className="tp-contact__form-col">
              <div
                className="tp-post"
                data-phase={phase}
              >
                {phase === 'sent' ? (
                  <div tabIndex="-1" role="status" className="tp-post__sent">
                    <svg
                      viewBox="0 0 200 150"
                      aria-hidden="true"
                      className="tp-post__box tp-post__box--sent"
                    >
                      <rect x="86" y="96" width="28" height="52" fill="#5a3a28" stroke="#2a170e" strokeWidth="4" />
                      <path d="M30 50a70 44 0 0 1 140 0v52H30z" fill="#c2622b" stroke="#2a170e" strokeWidth="5" strokeLinejoin="round" />
                      <rect x="58" y="58" width="84" height="12" rx="6" fill="#2a170e" />
                      <path d="M170 92V22" stroke="#2a170e" strokeWidth="5" strokeLinecap="round" />
                      <path d="M170 22h22v16h-22" fill="#f2be6b" stroke="#2a170e" strokeWidth="4" strokeLinejoin="round" />
                    </svg>
                    <p className="font-plush mt-4 text-[2rem] tp-post__sent-title">Message received!</p>
                    <p className="mx-auto mt-2 max-w-[40ch] text-cocoa-soft tp-post__sent-desc">
                      Thank you — our team will get back to you promptly. For the quickest reply, message us on WhatsApp.
                    </p>
                    <a
                      href="https://wa.me/971541676733?text=Hi%20TeddyPups!%20I'd%20love%20to%20know%20more%20about%20your%20puppies."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp mt-6"
                    >
                      WhatsApp us
                    </a>
                  </div>
                ) : (
                  <>
                    <form
                      noValidate
                      onSubmit={handleSubmit}
                      className="tp-letterform"
                    >
                      <span aria-hidden="true" className="tp-letter__stamp">
                        <svg
                          viewBox="0 0 64 64"
                          aria-hidden="true"
                          fill="currentColor"
                        >
                          <path d="M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z" />
                        </svg>
                      </span>

                      <p className="font-scrawl tp-letterform__greeting">
                        Dear TeddyPups,
                      </p>

                      <p className="tp-letterform__line">
                        my name is{' '}
                        <span
                          className="tp-blank"
                          style={{ '--size': '16ch' }}
                        >
                          <input
                            aria-label="Your name (required)"
                            autoComplete="name"
                            required
                            minLength="2"
                            maxLength="80"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={isSubmitting}
                          />
                        </span>
                        , and you can reach me on{' '}
                        <span
                          className="tp-blank"
                          style={{ '--size': '15ch' }}
                        >
                          <input
                            aria-label="Phone or WhatsApp number with country code (required)"
                            type="tel"
                            inputMode="tel"
                            autoComplete="tel"
                            required
                            placeholder="+971 50 123 4567"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={isSubmitting}
                          />
                        </span>{' '}
                        or by email at{' '}
                        <span
                          className="tp-blank"
                          style={{ '--size': '20ch' }}
                        >
                          <input
                            aria-label="Email (optional)"
                            type="email"
                            autoComplete="email"
                            placeholder="optional"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isSubmitting}
                          />
                        </span>
                        .
                      </p>

                      <p className="tp-letterform__line">
                        I live in{' '}
                        <span
                          className="tp-blank"
                          style={{ '--size': '13ch' }}
                        >
                          <input
                            aria-label="Your area (optional)"
                            autoComplete="address-level2"
                            maxLength="80"
                            placeholder="e.g. Dubai Marina"
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                            disabled={isSubmitting}
                          />
                        </span>
                        , and I&apos;m curious about{' '}
                        <span className="tp-blank tp-blank--select">
                          <label htmlFor="contact-puppy" className="sr-only">
                            Puppy you&apos;re interested in (optional)
                          </label>
                          <select
                            id="contact-puppy"
                            name="puppyId"
                            value={formData.puppyId}
                            onChange={handleChange}
                            disabled={isSubmitting}
                          >
                            <option value="">any puppy (not sure yet)</option>
                            {availablePuppies.map((p) => (
                              <option key={p.id} value={p.id}>
                                {formatPuppyOption(p)}
                              </option>
                            ))}
                          </select>
                        </span>
                        .
                      </p>

                      <label htmlFor="contact-note" className="sr-only">
                        Your message (optional)
                      </label>
                      <textarea
                        id="contact-note"
                        name="message"
                        rows="4"
                        maxLength="2000"
                        placeholder="Anything else you'd like to tell us…"
                        className="tp-letterform__note"
                        value={formData.message}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      ></textarea>

                      {errorMessage && (
                        <div className="tp-letterform__alert">
                          <p style={{ color: '#b3261e', fontWeight: 600 }}>{errorMessage}</p>
                        </div>
                      )}

                      <div className="tp-letterform__sign">
                        <p className="font-scrawl">
                          with love, a future puppy parent
                        </p>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={isSubmitting}
                          style={isSubmitting ? { opacity: 0.7, cursor: 'not-allowed' } : undefined}
                        >
                          {isSubmitting ? 'Posting…' : 'Post my letter'}
                        </button>
                      </div>
                    </form>

                    {(phase === 'sealing' || phase === 'posting') && (
                      <div aria-hidden="true" className="tp-post__scene">
                        <svg viewBox="0 0 160 112" className="tp-post__envelope">
                          <rect x="4" y="18" width="152" height="90" rx="6" fill="#fffdf8" stroke="#2a170e" strokeWidth="4" />
                          <path d="M6 104 64 62M154 104 96 62" fill="none" stroke="#2a170e" strokeWidth="3" strokeLinecap="round" />
                          <path className="tp-post__flap" d="M6 22 80 74 154 22" fill="#fbe3b4" stroke="#2a170e" strokeWidth="4" strokeLinejoin="round" />
                          <circle cx="80" cy="72" r="11" fill="#a24a1a" stroke="#2a170e" strokeWidth="3" />
                        </svg>
                        <svg viewBox="0 0 200 260" className="tp-post__box">
                          <rect x="86" y="170" width="28" height="86" fill="#5a3a28" stroke="#2a170e" strokeWidth="4" />
                          <path d="M30 70a70 54 0 0 1 140 0v104H30z" fill="#c2622b" stroke="#2a170e" strokeWidth="5" strokeLinejoin="round" />
                          <rect x="58" y="86" width="84" height="14" rx="7" fill="#2a170e" />
                          <path d="M44 128h112" stroke="#2a170e" strokeWidth="3" strokeLinecap="round" opacity=".35" />
                          <g className="tp-post__flag">
                            <path d="M170 120V64" stroke="#2a170e" strokeWidth="5" strokeLinecap="round" />
                            <path d="M170 64h22v16h-22" fill="#f2be6b" stroke="#2a170e" strokeWidth="4" strokeLinejoin="round" />
                          </g>
                        </svg>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Illustrated puppy positioned toward the right side beneath the form */}
              <InteractiveTeddy
                pose="sit"
                facing="left"
                className="tp-contact__pup"
                label="Teddy, waiting for your letter"
                enableEyeTracking={true}
                interactive={true}
                autoWag={true}
                happyEyes={phase === 'sent'}
              />
            </div>

            {/* Left Column on Desktop: Direct Contact & Downtown Dubai Showroom Card */}
            <div className="tp-contact__info-col">
              <a
                href="https://wa.me/971541676733?text=Hi%20TeddyPups!%20I'd%20love%20to%20know%20more%20about%20your%20puppies."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp tp-contact__wa"
              >
                WhatsApp +971 54 167 6733
              </a>

              <dl className="tp-contact__details">
                <div>
                  <dt className="font-scrawl tp-contact__dt">call us</dt>
                  <dd className="tp-contact__dd">
                    <a className="link-ink" href="tel:+971541676733">
                      +971 54 167 6733
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-scrawl tp-contact__dt">email</dt>
                  <dd className="tp-contact__dd tp-contact__dd--break">
                    <a
                      className="link-ink"
                      href="mailto:teddypupsadmin@gmail.com"
                    >
                      teddypupsadmin@gmail.com
                    </a>
                  </dd>
                </div>
              </dl>

              {/* Downtown Dubai Illustrated Location Card */}
              <section aria-labelledby="visit-title" className="tp-shopfront">
                <svg
                  viewBox="0 0 300 120"
                  className="tp-shopfront__skyline"
                  aria-hidden="true"
                >
                  <path
                    d="M4 116h292M20 116V78h16v38M44 116V60h18v56M70 116V84h12v32M150 116V36l4-6v-14l3-4 3 4v14l4 6v80M118 116V70l12-8v54M174 116V64l14 8v44M200 116V82h18v34M226 116V56h14v60M248 116V88h22v28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <div className="tp-visit">
                  <div>
                    <h2 id="visit-title" className="font-plush tp-visit__title">
                      Visit us in Downtown Dubai
                    </h2>
                    <p className="tp-visit__desc">
                      Step into our Downtown Dubai showroom and experience the
                      joy of choosing your puppy face-to-face.
                    </p>
                    <p className="tp-visit__addr">
                      <svg
                        viewBox="0 0 64 64"
                        className="tp-visit__pin"
                        aria-hidden="true"
                        fill="currentColor"
                      >
                        <path d="M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z" />
                      </svg>
                      Downtown Dubai, United Arab Emirates
                    </p>
                    <a
                      href="https://maps.app.goo.gl/ZdJvwHBSQWWZT54s7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost tp-visit__cta"
                    >
                      Open in Google Maps
                    </a>
                  </div>

                  <figure className="tp-visit__photo">
                    <img
                      alt="The apricot teddy bear puppy from our showroom, held up to say hello"
                      loading="lazy"
                      src="/assets/images/puppies/showroom-puppy-04.jpg"
                    />
                  </figure>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
