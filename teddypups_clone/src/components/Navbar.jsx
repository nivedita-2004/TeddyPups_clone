import { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';

const PAW_PATH =
  'M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Puppies', path: '/puppies' },
  { name: 'Happy families', path: '/happy-families' },
  { name: 'How it works', path: '/how-it-works' },
  { name: 'FAQ', path: '/faq' },
  { name: 'Visit & contact', path: '/contact' },
];

const WHATSAPP_URL =
  "https://wa.me/971541676733?text=Hi%20TeddyPups!%20I'd%20love%20to%20know%20more%20about%20your%20puppies.";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(
    () => typeof window !== 'undefined' && window.scrollY > 8
  );
  const [isHidden, setIsHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollYRef = useRef(0);
  const dialogRef = useRef(null);
  const closeTimerRef = useRef(null);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const isActivePath = (path) => {
    if (path === '/') return location.pathname === '/';
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const forceCloseDialog = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.removeAttribute('data-closing');
      if (dialog.open) dialog.close();
    }
    setMenuOpen(false);
  }, []);

  const openMenu = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    dialog.removeAttribute('data-closing');
    dialog.showModal();
    setMenuOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || !dialog.open) return;
    const isReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (isReduced) {
      forceCloseDialog();
      return;
    }
    if (dialog.hasAttribute('data-closing')) return;
    dialog.setAttribute('data-closing', 'true');
    closeTimerRef.current = setTimeout(() => {
      forceCloseDialog();
    }, 420);
  }, [forceCloseDialog]);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 8);
      if (Math.abs(y - lastScrollYRef.current) > 6) {
        setIsHidden(y > lastScrollYRef.current && y > 220);
        lastScrollYRef.current = y;
      }
    };
    const handleResize = () => {
      if (window.innerWidth >= 1024 && dialogRef.current?.open) {
        forceCloseDialog();
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [forceCloseDialog]);

  // Reset hidden state and close mobile dialog on route changes
  useEffect(() => {
    lastScrollYRef.current = window.scrollY;
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.removeAttribute('data-closing');
      if (dialog.open) dialog.close();
    }
    const rafId = requestAnimationFrame(() => {
      setIsScrolled(window.scrollY > 8);
      setIsHidden(false);
      setMenuOpen(false);
    });
    return () => cancelAnimationFrame(rafId);
  }, [location.pathname]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  return (
    <>
      <header
        id="site-header"
        className="tp-header"
        data-scrolled={isScrolled ? 'true' : 'false'}
        data-hidden={isHidden ? 'true' : 'false'}
        data-home={isHome ? 'true' : undefined}
        onFocus={() => setIsHidden(false)}
      >
        <div className="tp-header__bar gutter">
          {/* Brand Logo & Name */}
          <Link
            to="/"
            className="tp-header__brand"
            aria-label="TeddyPups U.A.E. — home"
          >
            <img
              src="/assets/logo.png"
              alt=""
              className="tp-header__logo"
              width="56"
              height="56"
            />
            <span className="font-plush tp-header__name">TeddyPups</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav aria-label="Main" className="tp-header__nav">
            <ul>
              {NAV_LINKS.map((link) => {
                const active = isActivePath(link.path);
                return (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      end={link.path === '/'}
                      data-active={active ? 'true' : 'false'}
                      className="tp-nav-link"
                    >
                      <span>{link.name}</span>
                      <svg
                        viewBox="0 0 64 64"
                        className="tp-nav-link__paw"
                        aria-hidden="true"
                        fill="currentColor"
                      >
                        <path d={PAW_PATH} />
                      </svg>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* End Action & Mobile Menu Pill */}
          <div className="tp-header__end">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp tp-header__wa"
            >
              WhatsApp us
            </a>

            <button
              type="button"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              className="tp-menu-btn"
              onClick={openMenu}
            >
              <svg viewBox="0 0 64 64" aria-hidden="true" fill="currentColor">
                <path d={PAW_PATH} />
              </svg>
              Menu
            </button>
          </div>
        </div>

        {/* Authentic Scalloped hem decoration along bottom of navbar */}
        <svg
          aria-hidden="true"
          className="tp-header__hem"
          width="100%"
          height="14"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="tp-hem"
              width="44"
              height="14"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 0H44V2A22 11 0 0 1 0 2Z"
                className="tp-header__hem-fill"
              />
              <path
                d="M0 2A22 11 0 0 0 44 2"
                className="tp-header__hem-line"
              />
            </pattern>
          </defs>
          <rect width="100%" height="14" fill="url(#tp-hem)" />
        </svg>
      </header>

      {/* Full-Screen Honey Mobile/Tablet Menu Dialog */}
      <dialog
        ref={dialogRef}
        aria-label="Site menu"
        className="tp-menu"
        onCancel={(e) => {
          e.preventDefault();
          closeMenu();
        }}
        onClick={(e) => {
          if (e.target === dialogRef.current) closeMenu();
        }}
      >
        <div className="tp-menu__inner gutter">
          <div className="tp-menu__top">
            <span className="font-scrawl tp-menu__kicker">
              where to, friend?
            </span>
            <button
              type="button"
              className="tp-menu__close"
              onClick={closeMenu}
            >
              Close
            </button>
          </div>

          <nav aria-label="Mobile" className="tp-menu__nav">
            <ul className="tp-menu__list">
              {NAV_LINKS.map((link) => {
                const active = isActivePath(link.path);
                return (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      end={link.path === '/'}
                      data-active={active ? 'true' : 'false'}
                      className="tp-menu-link font-plush"
                      onClick={closeMenu}
                    >
                      <span>{link.name}</span>
                      <svg
                        viewBox="0 0 64 64"
                        className="tp-nav-link__paw"
                        aria-hidden="true"
                        fill="currentColor"
                      >
                        <path d={PAW_PATH} />
                      </svg>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="tp-menu__foot">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp tp-menu__wa"
            >
              WhatsApp us
            </a>
            <p className="tp-menu__phone">+971 54 167 6733</p>
          </div>
        </div>
      </dialog>

      {/* Fixed Mobile Bottom Action Bar (< 768px) */}
      <div data-whatsapp-bar="true" className="tp-wa-bar">
        <div className="tp-wa-bar__inner">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp tp-wa-bar__wa"
          >
            WhatsApp us
          </a>
          <a href="tel:+971541676733" className="btn btn-ghost tp-wa-bar__call">
            Call
          </a>
        </div>
      </div>
    </>
  );
}
