import { useState, useMemo, useEffect, useRef, useId } from 'react';
import InteractiveTeddy from '../components/InteractiveTeddy';
import { faqs } from '../data/faqs';

const TILTS = [-1.6, 1.2, -0.8, 1.8, -1.2, 0.7, -1.9, 1.4];
const PINS = [
  'var(--color-toffee)',
  'var(--color-sky-deep)',
  '#d9a13c',
  '#c45a6a',
];
const ASK_HREF =
  'https://wa.me/971541676733?text=Hi%20TeddyPups!%20I%20have%20a%20question%3A';

function Highlight({ text, query }) {
  const trimmed = query.trim();
  if (!trimmed) return text;
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return parts.map((part, idx) =>
    idx % 2 === 1 ? <mark key={idx}>{part}</mark> : part
  );
}

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openId, setOpenId] = useState(null);
  const searchInputId = useId();
  const boardRef = useRef(null);

  const normQuery = searchQuery.trim().toLowerCase();

  const filteredFaqs = useMemo(
    () =>
      normQuery
        ? faqs.filter((f) =>
            `${f.question} ${f.answer}`.toLowerCase().includes(normQuery)
          )
        : faqs,
    [normQuery]
  );

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    const isReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isReduced) {
      board
        .querySelectorAll('[data-reveal]:not([data-revealed])')
        .forEach((el) => {
          el.dataset.revealed = 'true';
        });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.dataset.revealed = 'true';
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.08 }
    );

    board
      .querySelectorAll('[data-reveal]:not([data-revealed])')
      .forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.dataset.revealed = 'true';
          return;
        }
        el.dataset.armed = 'true';
        observer.observe(el);
      });

    return () => observer.disconnect();
  }, [filteredFaqs]);

  const toggleQuestion = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const hasOpenOrQuery = Boolean(openId || normQuery);

  return (
    <div data-page="faq" className="tp-page">
      <section
        data-pup-scene="true"
        data-tone="dark"
        className="tp-scene tp-faqroom"
        style={{
          '--sky-top': '#a95e32',
          '--sky-bottom': '#331c11',
        }}
        aria-labelledby="faq-title"
      >
        <div className="gutter tp-faqroom__inner">
          {/* Header */}
          <header className="tp-faqroom__header">
            <h1 id="faq-title" className="font-plush text-giant">
              Questions &amp; answers
            </h1>
            <p className="text-lede tp-faqroom__lede">
              Can&apos;t find what you&apos;re looking for? Message us on WhatsApp — our team is available 24/7.
            </p>
          </header>

          {/* Main notes container */}
          <div className="tp-faqroom__notes-wrap">
            <div
              className="tp-notes"
              data-open={hasOpenOrQuery ? '' : undefined}
            >
              {/* Sidebar with search and Mascot */}
              <aside className="tp-notes__side" aria-label="Find a question">
                <label
                  htmlFor={searchInputId}
                  className="font-scrawl tp-notes__label"
                >
                  sniff out a question
                </label>
                <div className="tp-notes__search">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="tp-notes__lens"
                  >
                    <circle cx="10.5" cy="10.5" r="6.5"></circle>
                    <path d="m15.5 15.5 5 5"></path>
                  </svg>
                  <input
                    id={searchInputId}
                    type="search"
                    placeholder="delivery, Korea, vaccinated…"
                    autoComplete="off"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <p className="tp-notes__count" aria-live="polite">
                  {searchQuery.trim()
                    ? `${filteredFaqs.length} ${
                        filteredFaqs.length === 1 ? 'note' : 'notes'
                      } found`
                    : `${faqs.length} notes on the board`}
                </p>

                <div className="tp-notes__teddy">
                  <span
                    aria-hidden="true"
                    className="tp-notes__bubble font-plush"
                  >
                    <span className="tp-notes__q">?</span>
                    <span className="tp-notes__a">!</span>
                  </span>
                  <InteractiveTeddy
                    pose="sit"
                    facing="right"
                    label="Teddy, reading the notes"
                    enableEyeTracking={true}
                    interactive={true}
                    autoWag={true}
                  />
                </div>

                <a
                  href={ASK_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp tp-notes__ask"
                >
                  Ask your own question
                </a>
              </aside>

              {/* Corkboard */}
              <div ref={boardRef} className="tp-notes__board">
                <ul className="tp-notes__list">
                  {filteredFaqs.map((faq, idx) => {
                    const tilt = `${TILTS[idx % TILTS.length]}deg`;
                    const pin = PINS[idx % PINS.length];
                    const isOpen =
                      openId === faq.id ||
                      (Boolean(normQuery) &&
                        faq.answer.toLowerCase().includes(normQuery));

                    return (
                      <li
                        key={faq.id}
                        className="tp-note"
                        data-reveal="true"
                        data-unfolded={isOpen ? 'true' : undefined}
                        style={{
                          '--tilt': tilt,
                          '--pin': pin,
                          '--i': idx,
                        }}
                      >
                        <span
                          aria-hidden="true"
                          className="tp-note__pin"
                        ></span>
                        <h2 className="tp-note__q">
                          <button
                            type="button"
                            id={`q-${faq.id}`}
                            aria-expanded={isOpen}
                            aria-controls={`a-${faq.id}`}
                            onClick={() => toggleQuestion(faq.id)}
                          >
                            <span className="font-plush-text">
                              <Highlight
                                text={faq.question}
                                query={searchQuery}
                              />
                            </span>
                            <span
                              aria-hidden="true"
                              className="tp-note__chevron"
                            ></span>
                          </button>
                        </h2>
                        <div
                          id={`a-${faq.id}`}
                          role="region"
                          aria-labelledby={`q-${faq.id}`}
                          className="tp-note__answer"
                          inert={!isOpen}
                        >
                          <div className="tp-note__flap">
                            <p>
                              <Highlight
                                text={faq.answer}
                                query={searchQuery}
                              />
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                {!filteredFaqs.length && (
                  <div className="tp-note tp-note--empty">
                    <span aria-hidden="true" className="tp-note__pin"></span>
                    <p className="font-plush-text tp-note__empty-title">
                      No note about “{searchQuery.trim()}” yet.
                    </p>
                    <p className="tp-note__empty-sub">
                      <a
                        href={ASK_HREF}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-ink"
                      >
                        Ask us on WhatsApp
                      </a>{' '}
                      and we&apos;ll answer.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
