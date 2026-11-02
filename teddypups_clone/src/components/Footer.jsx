import { Link } from 'react-router-dom';
import InteractiveTeddy from './InteractiveTeddy';

export default function Footer() {
  const whatsappUrl =
    'https://wa.me/971541676733?text=Hi%20TeddyPups!%20I%27d%20love%20to%20know%20more%20about%20your%20puppies.';

  const stars = [
    { left: '6%', top: '18%', width: '12.6px', delay: '0.00s' },
    { left: '14%', top: '42%', width: '8.4px', delay: '0.40s' },
    { left: '23%', top: '12%', width: '9.8px', delay: '0.80s' },
    { left: '31%', top: '30%', width: '7px', delay: '1.20s' },
    { left: '44%', top: '9%', width: '11.2px', delay: '1.60s' },
    { left: '52%', top: '36%', width: '7.7px', delay: '2.00s' },
    { left: '63%', top: '15%', width: '10.5px', delay: '2.40s' },
    { left: '71%', top: '40%', width: '7px', delay: '2.80s' },
    { left: '92%', top: '33%', width: '8.4px', delay: '3.20s' },
  ];

  return (
    <footer className="tp-footer">
      {/* Organic Hill/Wave Top Divider */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="tp-footer__hill"
      >
        <path d="M0 80V44c120-30 240-44 360-30s240 46 360 34 240-58 360-46 240 40 360 26v52z" />
      </svg>

      {/* Sky with moon & stars */}
      <div aria-hidden="true" className="tp-footer__sky">
        <div aria-hidden="true" className="tp-footer__stars">
          {stars.map((s, i) => (
            <svg
              key={i}
              viewBox="0 0 40 40"
              className="tp-twinkle tp-footer__star"
              style={{
                left: s.left,
                top: s.top,
                width: s.width,
                animationDelay: s.delay,
              }}
              aria-hidden="true"
            >
              <path
                d="M20 3c1.6 9.4 7.6 15.4 17 17-9.4 1.6-15.4 7.6-17 17-1.6-9.4-7.6-15.4-17-17 9.4-1.6 15.4-7.6 17-17z"
                fill="currentColor"
              />
            </svg>
          ))}
        </div>
        <span className="tp-moon"></span>
      </div>

      <div className="gutter tp-footer__grid">
        {/* Brand & Mission Statement */}
        <div className="tp-footer__brand">
          <p className="font-plush text-big tp-footer__title">Home, at last.</p>
          <p className="tp-footer__desc">
            TeddyPups U.A.E. is a Dubai-based brand specializing in miniature puppies,
            offering premium services and worldwide shipping.
          </p>
        </div>

        {/* Mascot Teddy sitting snug in woven basket */}
        <div className="tp-footer__basket-wrap">
          <div className="tp-basket">
            <svg
              aria-hidden="true"
              viewBox="0 0 300 240"
              className="tp-basket__back"
            >
              <ellipse
                cx="212"
                cy="145"
                rx="96"
                ry="12"
                className="tp-basket__hollow"
              />
              <path
                d="M116 145 A96 12 0 0 1 308 145"
                className="tp-basket__rim-line"
              />
              <path
                d="M116 145 A96 12 0 0 1 308 145"
                className="tp-basket__rim"
              />
            </svg>

            <div
              data-pup-stop="true"
              data-pose="snug"
              data-facing="right"
              data-act="basket"
              data-behind="true"
              data-lane="true"
              className="pup-stop tp-basket__pup"
            >
              <InteractiveTeddy
                pose="snug"
                facing="right"
                label="Teddy, sitting snug in his basket"
                enableEyeTracking={true}
                interactive={true}
              />
            </div>

            <svg
              aria-hidden="true"
              viewBox="0 0 300 240"
              className="tp-basket__front"
            >
              <path
                d="M116 145 C118 180 126 214 138 232 L286 232 C298 214 306 180 308 145 A96 12 0 0 1 116 145 Z"
                className="tp-basket__body"
              />
              <path
                d="M121 178 Q212 197 303 178 M127 206 Q212 223 297 206"
                className="tp-basket__weave"
              />
              <path
                d="M150 164 L158 230 M182 168 L185 232 M212 169 V232 M242 168 L239 232 M274 164 L266 230"
                className="tp-basket__weave tp-basket__weave--stakes"
              />
              <path
                d="M116 145 A96 12 0 0 0 308 145"
                className="tp-basket__rim-line"
              />
              <path
                d="M116 145 A96 12 0 0 0 308 145"
                className="tp-basket__rim"
              />
            </svg>
          </div>
        </div>

        {/* Explore Links */}
        <nav aria-label="Footer" className="tp-footer__explore">
          <h2 className="font-scrawl tp-footer__col-heading">Explore</h2>
          <ul className="tp-footer__list">
            <li>
              <Link className="tp-footer__link" to="/puppies">
                Available puppies
              </Link>
            </li>
            <li>
              <Link className="tp-footer__link" to="/gone-home">
                Gone home
              </Link>
            </li>
            <li>
              <Link className="tp-footer__link" to="/happy-families">
                Happy families
              </Link>
            </li>
            <li>
              <Link className="tp-footer__link" to="/how-it-works">
                How it works
              </Link>
            </li>
            <li>
              <Link className="tp-footer__link" to="/how-it-works#delivery">
                Delivery &amp; collection
              </Link>
            </li>
            <li>
              <Link className="tp-footer__link" to="/faq">
                FAQ
              </Link>
            </li>
            <li>
              <Link className="tp-footer__link" to="/contact">
                Visit &amp; contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Say Hello & Social */}
        <div className="tp-footer__hello">
          <h2 className="font-scrawl tp-footer__col-heading">Say hello</h2>
          <ul className="tp-footer__list tp-footer__hello-list">
            <li>
              <a
                className="tp-footer__hello-wa"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp +971 54 167 6733
              </a>
            </li>
            <li>
              <a
                className="tp-footer__hello-email"
                href="mailto:teddypupsadmin@gmail.com"
              >
                teddypupsadmin@gmail.com
              </a>
            </li>
            <li>Downtown Dubai, United Arab Emirates</li>
          </ul>
          <ul className="tp-footer__socials" aria-label="Social media">
            <li>
              <a
                href="https://www.instagram.com/teddypups.worldwide/"
                target="_blank"
                rel="noopener noreferrer"
                className="tp-footer__social-btn"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://www.tiktok.com/@teddypupsuae"
                target="_blank"
                rel="noopener noreferrer"
                className="tp-footer__social-btn"
              >
                TikTok
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/profile.php?id=61567496944539"
                target="_blank"
                rel="noopener noreferrer"
                className="tp-footer__social-btn"
              >
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="gutter tp-footer__bottom">
        <span className="tp-footer__copy">
          <img
            alt=""
            loading="lazy"
            width="36"
            height="36"
            className="tp-footer__logo"
            src="/assets/logo.png"
          />
          © 2026 TeddyPups U.A.E.
        </span>
        <span className="font-scrawl tp-footer__tagline">
          every puppy is family
        </span>
      </div>
    </footer>
  );
}
