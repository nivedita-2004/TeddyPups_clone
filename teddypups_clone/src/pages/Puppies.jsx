import { useState } from 'react';
import { Link } from 'react-router-dom';
import PuppyCard from '../components/PuppyCard';
import InteractiveTeddy from '../components/InteractiveTeddy';
import { puppies } from '../data/puppies';

export default function Puppies() {
  const [whereFilter, setWhereFilter] = useState('Everywhere');
  const [breedFilter, setBreedFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');

  // Filter available puppies
  const availablePuppies = puppies.filter((p) => p.status === 'Available');

  // Selected gone home puppies matching reference
  const gonePuppies = [
    puppies.find((p) => p.id === 'pomeranian-ace-boy'),
    puppies.find((p) => p.id === 'poodle-leo-male'),
    { ...puppies.find((p) => p.id === 'maltipoo-mia-girl'), status: 'Gone Home' },
    puppies.find((p) => p.id === 'maltipoo-sadie-girl'),
    { ...puppies.find((p) => p.id === 'blue-marle-pomeranian'), status: 'Gone Home' },
  ].filter(Boolean);

  const filteredPuppies = availablePuppies.filter((p) => {
    // 1. Where filter
    if (whereFilter === 'Imported' && p.origin?.toLowerCase().includes('local')) {
      return false;
    }
    if (whereFilter === 'Korean Teacup' && !p.breed?.toLowerCase().includes('teacup') && !p.origin?.toLowerCase().includes('korea')) {
      return false;
    }

    // 2. Breed filter
    if (breedFilter !== 'All' && !p.breed?.toLowerCase().includes(breedFilter.toLowerCase())) {
      return false;
    }

    // 3. Gender filter
    if (genderFilter === 'Boys' && p.gender?.toLowerCase() !== 'male') {
      return false;
    }
    if (genderFilter === 'Girls' && p.gender?.toLowerCase() !== 'female') {
      return false;
    }

    return true;
  });

  const breeds = ['Maltipoo', 'Pomeranian', 'Poodle', 'Cavapoo', 'Shih Tzu'];

  return (
    <div className="tp-page tp-page-puppies">
      <section aria-labelledby="pups-title" className="tp-sketchbook">
        <div className="tp-sketchbook__container gutter mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
          <div className="tp-sketchbook__intro">
            {/* Header with Title and Cartoon Mascot */}
            <div className="tp-sketchbook__head">
              <div className="tp-sketchbook__words">
                <p className="font-scrawl text-lg text-toffee-ink tp-sketchbook__kicker">
                  from Teddy's sketchbook
                </p>
                <h1 id="pups-title" className="font-plush tp-sketchbook__title">
                  Available puppies
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 400 24"
                    preserveAspectRatio="none"
                    className="tp-sketchbook__underline"
                  >
                    <path d="M4 15c40-9 70 5 112-2s70-9 112 0 74 8 116-1 38-4 52 1" pathLength="1" />
                  </svg>
                </h1>
                <p className="tp-sketchbook__lede text-lede mt-6 max-w-[46ch] text-cocoa-soft">
                  Every listing shows real photos of the actual puppy. Open a profile to see them all, then ask us about them on WhatsApp.
                </p>
              </div>

              {/* Self-portrait framed puppy illustration */}
              <div className="tp-sketchbook__self">
                <InteractiveTeddy
                  pose="sit"
                  facing="left"
                  autoWag={true}
                  enableEyeTracking={true}
                  interactive={true}
                  width="100%"
                  height="100%"
                  label="Teddy's self portrait"
                />
                <span className="tp-sketchbook__caption font-scrawl">self-portrait</span>
              </div>
            </div>

            {/* Authentic Compact Filter Card with Washi Tape */}
            <div role="group" aria-label="Filter puppies" className="tp-sketchpad">
              {/* Row 1: Where */}
              <div className="tp-sketchpad__row">
                <span className="tp-sketchpad__label font-scrawl">where</span>
                {['Everywhere', 'Imported', 'Korean Teacup'].map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    aria-pressed={whereFilter === loc}
                    className="tp-sticker-chip"
                    onClick={() => setWhereFilter(loc)}
                  >
                    {loc}
                  </button>
                ))}
              </div>

              {/* Row 2: Breed */}
              <div className="tp-sketchpad__row">
                <span className="tp-sketchpad__label font-scrawl">breed</span>
                {breeds.map((b) => (
                  <button
                    key={b}
                    type="button"
                    aria-pressed={breedFilter === b}
                    className="tp-sticker-chip"
                    onClick={() => setBreedFilter(breedFilter === b ? 'All' : b)}
                  >
                    {b}
                  </button>
                ))}
              </div>

              {/* Row 3: Boy or Girl */}
              <div className="tp-sketchpad__row">
                <span className="tp-sketchpad__label font-scrawl">boy or girl</span>
                <button
                  type="button"
                  aria-pressed={genderFilter === 'Boys'}
                  className="tp-sticker-chip"
                  onClick={() => setGenderFilter(genderFilter === 'Boys' ? 'All' : 'Boys')}
                >
                  Boys
                </button>
                <button
                  type="button"
                  aria-pressed={genderFilter === 'Girls'}
                  className="tp-sticker-chip"
                  onClick={() => setGenderFilter(genderFilter === 'Girls' ? 'All' : 'Girls')}
                >
                  Girls
                </button>
              </div>
            </div>

            {/* Results Count */}
            <p className="tp-sketches-count" aria-live="polite">
              {filteredPuppies.length} {filteredPuppies.length === 1 ? 'puppy' : 'puppies'} looking for a home
            </p>
          </div>

          {/* Authentic Sketchbook Listing Grid */}
          {filteredPuppies.length > 0 ? (
            <div className="tp-sketches-container">
              <ul className="tp-sketches">
                {filteredPuppies.map((pup, idx) => (
                  <li key={pup.id || idx}>
                    <PuppyCard puppy={pup} index={idx} />
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="tp-empty-state">
              <p className="font-hand text-xl" style={{ color: 'var(--color-cocoa-soft)' }}>
                No puppies match your selected filter criteria.
              </p>
              <button
                type="button"
                className="btn btn-secondary mt-4"
                onClick={() => {
                  setWhereFilter('Everywhere');
                  setBreedFilter('All');
                  setGenderFilter('All');
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Already Gone Home Section */}
      <section aria-labelledby="gone-title" className="tp-gone-strip">
        <div className="container tp-gone-strip__content">
          <div className="tp-gone-strip__info" data-reveal="true">
            <h2 id="gone-title" className="tp-gone-strip__title font-plush">
              Already gone home
            </h2>
            <p className="tp-gone-strip__text">
              These puppies have found their families.
            </p>
            <Link to="/gone-home" className="btn btn-primary tp-gone-strip__btn">
              See the puppies who&apos;ve gone home
            </Link>
          </div>

          <ul className="tp-gone-strip__row" aria-label="Some puppies who have gone home">
            {gonePuppies.map((pup, idx) => (
              <li key={pup.id || idx}>
                <PuppyCard puppy={pup} small={true} index={idx} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
