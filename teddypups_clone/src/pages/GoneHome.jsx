import { Link } from 'react-router-dom';
import MascotTeddy from '../components/MascotTeddy';
import { goneTickets } from '../data/goneTickets';

export default function GoneHome() {
  return (
    <div data-page="gone" className="tp-page">
      <div className="gutter mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
        {/* Booth Header with Mascot */}
        <header className="tp-boothhead">
          <div className="max-w-3xl">
            <h1 className="font-plush text-giant">
              Gone home
              <svg
                viewBox="0 0 48 44"
                style={{
                  width: '0.45em',
                  height: '0.45em',
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  marginLeft: '0.5rem',
                  color: 'var(--color-toffee)',
                }}
                aria-hidden="true"
              >
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
            <p className="text-lede mt-6 text-cocoa-soft">
              Every puppy here has already joined a loving family. Looking for one just like them? Tell us — we'll help you find your match.
            </p>
            <Link className="btn btn-primary mt-8" to="/puppies" style={{ marginTop: '2rem' }}>
              See available puppies
            </Link>
          </div>

          <div aria-hidden="true" className="tp-booth">
            <div className="pup-buddy tp-booth__teddy" data-facing="right">
              <MascotTeddy facing="right" />
            </div>
            <div className="tp-booth__counter">
              <span className="font-plush">tickets home</span>
            </div>
          </div>
        </header>

        {/* Vintage Ticket Grid */}
        <ul className="tp-tickets" aria-label="Puppies who have gone home" style={{ marginTop: '3.5rem' }}>
          {goneTickets.map((t, idx) => {
            const tiltMatch = t.style ? t.style.match(/--tilt:([^;]+)/) : null;
            const tilt = tiltMatch ? tiltMatch[1] : `${((idx % 5) - 2) * 0.8}deg`;

            return (
              <li key={t.id || idx} className="tp-ticket" style={{ '--tilt': tilt, '--i': idx }}>
                <Link className="tp-ticket__link" to={t.href || '/puppies'}>
                  <span className="tp-ticket__main">
                    <span className="tp-ticket__photo">
                      <img
                        alt={`${t.name}, ${t.meta} puppy`}
                        loading="lazy"
                        src={t.image}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/assets/images/puppies/puppy-01.webp';
                        }}
                      />
                    </span>
                    <span className="tp-ticket__body">
                      <span className="font-scrawl tp-ticket__kicker">one ticket home</span>
                      <span className="font-plush tp-ticket__name">{t.name}</span>
                      <span className="tp-ticket__meta">{t.meta}</span>
                      <span className="tp-ticket__route">
                        <span>TeddyPups</span>
                        <svg viewBox="0 0 60 12" aria-hidden="true">
                          <path d="M2 6h46"></path>
                          <path d="M44 2l6 4-6 4"></path>
                        </svg>
                        <span>home ♥</span>
                      </span>
                    </span>
                  </span>
                  <span aria-hidden="true" className="tp-ticket__stub">
                    <span className="font-plush">admit one</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
