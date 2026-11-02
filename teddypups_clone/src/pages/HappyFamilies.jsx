import { useState, useRef, useEffect } from 'react';
import InteractiveTeddy from '../components/InteractiveTeddy';
import { families } from '../data/families';

const tilts = ['-2.2deg', '1.6deg', '-0.9deg', '2.4deg', '-1.5deg', '0.8deg', '-2.6deg', '1.2deg', '-1.8deg', '2.1deg', '-2.5deg', '1.9deg'];
const tapes = ['#f6d79a', '#f9cdbf', '#cfe5f6', '#e9dcc4'];

export default function HappyFamilies() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const wallRef = useRef(null);

  useEffect(() => {
    const wall = wallRef.current;
    if (!wall) return;

    const isReduced = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = wall.querySelectorAll('.tp-wall__item');

    if (isReduced) {
      items.forEach((item) => {
        item.dataset.revealed = 'true';
      });
      return;
    }

    // Arm all items with data-armed="true"
    items.forEach((item) => {
      if (!item.dataset.revealed) {
        item.dataset.armed = 'true';
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            el.dataset.revealed = 'true';
            observer.unobserve(el);
          }
        });
      },
      {
        rootMargin: '0px 0px -4% 0px',
        threshold: 0.05,
      }
    );

    items.forEach((item) => {
      if (!item.dataset.revealed) {
        observer.observe(item);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div data-page="families" className="tp-page">
      <section aria-labelledby="families-title" className="tp-memories">
        <div className="tp-memories__container gutter mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
          {/* Header */}
          <div className="tp-memories__head">
            <div>
              <p className="font-scrawl text-lg text-toffee-ink">
                our wall of happy endings
              </p>
              <h1 id="families-title" className="font-plush text-giant tp-memories__title">
                Happy families
                <svg viewBox="0 0 48 44" className="tp-memories__heart" aria-hidden="true">
                  <path
                    d="M24 40C10 30 4 22 4 14.5 4 8.7 8.6 4 14.3 4c4.1 0 7.6 2.4 9.7 6 2.1-3.6 5.6-6 9.7-6C39.4 4 44 8.7 44 14.5 44 22 38 30 24 40z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </h1>
              <p className="text-lede mt-6 max-w-[50ch] text-cocoa-soft">
                Nothing makes us happier than seeing our puppies in loving homes! Here are some beautiful moments shared by our amazing clients after welcoming their furry friends.
              </p>
              <p className="font-scrawl mt-5 text-lg text-toffee-ink">
                {families.length} moments and counting
              </p>
            </div>

            {/* Sticky note testimonial */}
            <figure className="tp-memories__note">
              <span aria-hidden="true" className="tp-tape tp-tape--center" style={{ '--tape': '#cfe5f6' }}></span>
              <blockquote className="font-plush-text">
                “TeddyPups truly made our dream a reality. They supported us at every step of the import journey. Our Maltipoo arrived healthy, cheerful, and absolutely perfect. Having 24/7 support throughout the process gave us complete peace of mind.”
              </blockquote>
              <figcaption className="font-scrawl">Sarah M., Dubai, UAE</figcaption>
            </figure>
          </div>

          {/* Polaroid Photo Wall */}
          <div className="mt-16 md:mt-20">
            <ul ref={wallRef} className="tp-wall" aria-label="Photos from TeddyPups families">
              {families.map((fam, idx) => (
                <li
                  key={fam.id || idx}
                  className="tp-wall__item"
                  data-reveal="true"
                  style={{ '--d': `${(idx % 4) * 60}ms` }}
                >
                  <button
                    type="button"
                    className="tp-wall__print"
                    aria-label={`Open photo ${idx + 1} of ${families.length}`}
                    onClick={() => setSelectedPhoto(fam)}
                  >
                    <span
                      className="tp-polaroid"
                      style={{
                        '--tilt': tilts[idx % tilts.length],
                        '--tape': tapes[idx % tapes.length],
                        '--i': idx,
                      }}
                    >
                      <span aria-hidden="true" className="tp-tape tp-tape--center"></span>
                      <span className="tp-polaroid__photo">
                        <img
                          src={fam.image}
                          alt={fam.caption || `A happy TeddyPups family with their new puppy`}
                          loading={idx < 8 ? 'eager' : 'lazy'}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/assets/families/family-gallery-01.jpg';
                          }}
                        />
                      </span>
                    </span>
                    <svg viewBox="0 0 64 64" className="tp-wall__paw" aria-hidden="true" fill="currentColor">
                      <path d="M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer mascot & tagline */}
          <div className="tp-memories__foot">
            <div className="pup-buddy w-36 md:w-44" data-facing="left">
              <InteractiveTeddy
                pose="sit"
                facing="left"
                autoWag={true}
                enableEyeTracking={true}
                happyEyes={false}
                label="Teddy, admiring the wall"
              />
            </div>
            <p className="font-scrawl text-lg text-cocoa-soft">
              every one of them was a Teddy Pup once
            </p>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(42, 23, 14, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              background: '#fffdf8',
              padding: '1.2rem',
              borderRadius: '12px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              aria-label="Close photo"
              style={{
                position: 'absolute',
                top: '-14px',
                right: '-14px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--color-cocoa)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '1.1rem',
              }}
            >
              ✕
            </button>
            <img
              src={selectedPhoto.image}
              alt={selectedPhoto.caption || 'Happy family photo'}
              style={{
                maxWidth: '80vw',
                maxHeight: '75vh',
                objectFit: 'contain',
                borderRadius: '6px',
              }}
            />
            {selectedPhoto.caption && (
              <p className="font-scrawl text-center mt-3 text-cocoa" style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                {selectedPhoto.caption} · {selectedPhoto.location}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
