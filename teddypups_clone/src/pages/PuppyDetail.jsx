import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SectionDivider from '../components/SectionDivider';
import Button from '../components/Button';
import PuppyCard from '../components/PuppyCard';
import { puppies } from '../data/puppies';

export default function PuppyDetail() {
  const { slug } = useParams();

  const puppy = puppies.find(
    (p) =>
      p.slug === slug ||
      p.id === slug ||
      p.name.toLowerCase().replace(/\s+/g, '-') === slug
  );

  const [activeImage, setActiveImage] = useState(
    puppy?.gallery?.[0] || puppy?.image || '/assets/images/puppies/puppy-01.webp'
  );

  if (!puppy) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <h1 className="font-serif" style={{ marginBottom: '1rem' }}>Puppy Profile Not Found</h1>
        <p style={{ marginBottom: '2rem' }}>We couldn't find the puppy profile you were looking for.</p>
        <Button to="/puppies" variant="primary">
          View All Available Puppies
        </Button>
      </div>
    );
  }

  const isAdopted =
    puppy.status?.toLowerCase().includes('gone') ||
    puppy.status?.toLowerCase().includes('adopted');

  const galleryImages = puppy.gallery && puppy.gallery.length > 0
    ? puppy.gallery
    : [puppy.image || '/assets/images/puppies/puppy-01.webp'];

  const whatsappMessage = encodeURIComponent(
    `Hi TeddyPups! I'm interested in adopting ${puppy.name} (${puppy.breed}, ${puppy.gender}, ${puppy.age}). Can you share more details and current videos?`
  );
  const whatsappUrl = `https://wa.me/971541676733?text=${whatsappMessage}`;

  const otherPuppies = puppies
    .filter((p) => (p.slug !== puppy.slug && p.id !== puppy.id) && p.status === 'Available')
    .slice(0, 3);

  return (
    <div className="tp-page-puppy-detail">
      {/* Breadcrumb Navigation */}
      <div className="container tp-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/puppies">Available Puppies</Link>
        <span>/</span>
        <span className="current">{puppy.name}</span>
      </div>

      <section className="container tp-detail-section">
        <div className="tp-detail-grid">
          {/* Left Column: Gallery */}
          <div className="tp-detail-gallery">
            <div className="tp-detail-main-img-wrap">
              <img
                src={activeImage}
                alt={puppy.name}
                className="tp-detail-main-img"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/assets/images/puppies/puppy-01.webp';
                }}
              />
              <span
                className={`tp-sketch__sticker font-scrawl ${
                  isAdopted ? 'gone-home' : ''
                }`}
                style={{ top: '1.25rem', right: '1.25rem', fontSize: '1rem', padding: '0.35rem 1rem' }}
              >
                {isAdopted ? 'Gone Home' : 'Available'}
              </span>
            </div>

            {/* Thumbnail Strip */}
            {galleryImages.length > 1 && (
              <div className="tp-detail-thumbs">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`tp-detail-thumb ${activeImage === imgUrl ? 'active' : ''}`}
                    onClick={() => setActiveImage(imgUrl)}
                  >
                    <img
                      src={imgUrl}
                      alt={`${puppy.name} photo ${idx + 1}`}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/assets/images/puppies/puppy-01.webp';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Bio & Information */}
          <div className="tp-detail-info">
            <span className="tp-section-tag font-scrawl">{puppy.breed}</span>
            <h1 className="tp-detail-name font-serif">{puppy.name}</h1>

            <div className="tp-detail-specs-grid">
              <div className="tp-spec-card">
                <span className="tp-spec-label">Gender</span>
                <span className="tp-spec-val font-serif">{puppy.gender || 'Not specified'}</span>
              </div>
              <div className="tp-spec-card">
                <span className="tp-spec-label">Age</span>
                <span className="tp-spec-val font-serif">{puppy.age || 'Puppy'}</span>
              </div>
              <div className="tp-spec-card">
                <span className="tp-spec-label">Bloodline / Origin</span>
                <span className="tp-spec-val font-serif">{puppy.origin || 'South Korea'}</span>
              </div>
              <div className="tp-spec-card">
                <span className="tp-spec-label">Price</span>
                <span className="tp-spec-val font-serif">{puppy.price || 'Price on request'}</span>
              </div>
            </div>

            <p className="tp-detail-desc">
              {puppy.description ||
                `${puppy.name} is a healthy, playful, and affectionate puppy with exceptional Korean doll-face proportions. Raised with continuous human socialization and supervised nutritional care.`}
            </p>

            <div className="tp-detail-perks">
              <div className="tp-detail-perk">
                <span className="tp-perk-icon">✓</span>
                <span>Full international vaccination record &amp; deworming</span>
              </div>
              <div className="tp-detail-perk">
                <span className="tp-perk-icon">✓</span>
                <span>ISO standard microchip with global registry documentation</span>
              </div>
              <div className="tp-detail-perk">
                <span className="tp-perk-icon">✓</span>
                <span>1-year comprehensive genetic health warranty</span>
              </div>
              <div className="tp-detail-perk">
                <span className="tp-perk-icon">✓</span>
                <span>Worldwide in-cabin flight nanny chaperone delivery available</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="tp-detail-actions">
              {!isAdopted ? (
                <>
                  <Button href={whatsappUrl} variant="whatsapp" style={{ flex: 1, justifyContent: 'center' }}>
                    Inquire About {puppy.name} on WhatsApp
                  </Button>
                  <Button to="/contact" variant="secondary">
                    Book Dubai Showroom Visit
                  </Button>
                </>
              ) : (
                <div className="tp-adopted-notice">
                  <p className="font-hand" style={{ fontSize: '1.2rem', color: 'var(--color-toffee-deep)' }}>
                    💕 {puppy.name} has already found a forever home!
                  </p>
                  <Button to="/puppies" variant="primary">
                    Browse Other Available Puppies
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Other Available Puppies Preview */}
      {otherPuppies.length > 0 && (
        <>
          <SectionDivider variant="quilt" />
          <section className="tp-scene tp-related-section">
            <div className="container">
              <div className="tp-section-head">
                <span className="tp-section-tag font-scrawl">More Companions</span>
                <h2 className="tp-section-title">Other Little Friends Waiting for Homes</h2>
              </div>
              <div className="tp-puppy-grid">
                {otherPuppies.map((pup, idx) => (
                  <PuppyCard key={pup.id || idx} puppy={pup} index={idx} />
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
