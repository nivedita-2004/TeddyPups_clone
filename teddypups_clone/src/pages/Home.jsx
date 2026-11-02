import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import InteractiveTeddy from '../components/InteractiveTeddy';
import PupJourney, { cuePup } from '../components/PupJourney';
import { faqs } from '../data/faqs';

const meetDoorsData = [
  {
    name: 'Max',
    breed: 'Maltipoo',
    gender: 'boy',
    age: '3 months',
    video: true,
    doorColor: '#a24a1a',
    slug: 'maltipoo-max-male',
    image: '/assets/images/puppies/puppy-01.webp',
    status: 'Available',
  },
  {
    name: 'Korean Teacup Maltipoo',
    breed: 'Maltipoo',
    gender: 'girl',
    age: '2.5 months',
    video: true,
    doorColor: '#5a3a28',
    slug: 'korean-teacup-maltipoo-female',
    image: '/assets/images/puppies/puppy-02.jpg',
    status: 'Available',
  },
  {
    name: 'Korean Teacup Poodle',
    breed: 'Toy Poodle',
    gender: 'girl',
    age: '3 months',
    video: false,
    doorColor: '#d4893f',
    slug: 'korean-teacup-poodle-female',
    image: '/assets/images/puppies/puppy-03.jpg',
    status: 'Available',
  },
  {
    name: 'Maltipoo & Cavapoo',
    breed: 'Cavapoo',
    gender: 'boy',
    age: '2.5 months',
    video: false,
    doorColor: '#b8644a',
    slug: 'maltipoo-cavapoo-male',
    image: '/assets/images/puppies/puppy-04.jpg',
    status: 'Available',
  },
  {
    name: 'Toy Poodle',
    breed: 'Toy Poodle',
    gender: 'boy & girl',
    age: '3 months',
    video: false,
    doorColor: '#7a4a2e',
    slug: 'toy-poodle-male-female',
    image: '/assets/images/puppies/puppy-05.jpg',
    status: 'Available',
  },
  {
    name: 'Maltipoo',
    breed: 'Maltipoo',
    gender: 'girl',
    age: '2.5 months',
    video: false,
    doorColor: '#a24a1a',
    slug: 'maltipoo-female-2',
    image: '/assets/images/puppies/puppy-06.jpg',
    status: 'Available',
  },
  {
    name: 'Pomeranian',
    breed: 'Pomeranian',
    gender: 'girl',
    age: '3 months',
    video: false,
    doorColor: '#5a3a28',
    slug: 'pomeranian-female',
    image: '/assets/images/puppies/puppy-07.jpg',
    status: 'Available',
  },
  {
    name: 'Copper',
    breed: 'Cavapoo',
    gender: 'boy',
    age: '3 months',
    video: true,
    doorColor: '#d4893f',
    slug: 'copper-male',
    image: '/assets/images/puppies/puppy-08.jpg',
    status: 'Available',
  },
  {
    name: 'Shih Tzu',
    breed: 'Shih Tzu',
    gender: 'girl',
    age: '2.5 months',
    video: false,
    doorColor: '#b8644a',
    slug: 'shitzu-female',
    image: '/assets/images/puppies/puppy-09.jpeg',
    status: 'Available',
  },
  {
    name: 'Shih Tzu',
    breed: 'Shih Tzu',
    gender: 'boy',
    age: '2.5 months',
    video: false,
    doorColor: '#7a4a2e',
    slug: 'shitzu-male',
    image: '/assets/images/puppies/puppy-10.jpg',
    status: 'Available',
  },
  {
    name: 'Maltipoo',
    breed: 'Maltipoo',
    gender: 'girl',
    age: '3 months',
    video: false,
    doorColor: '#a24a1a',
    slug: 'maltipoo-female-1',
    image: '/assets/images/puppies/puppy-11.jpg',
    status: 'Available',
  },
  {
    name: 'Maltipoo',
    breed: 'Maltipoo',
    gender: 'girl',
    age: '2.5 months',
    video: false,
    doorColor: '#5a3a28',
    slug: 'maltipoo-female',
    image: '/assets/images/puppies/puppy-12.jpg',
    status: 'Available',
  },
  {
    name: 'Korean Teacup Pomeranian',
    breed: 'Pomeranian',
    gender: 'girl',
    age: '3 months',
    video: false,
    doorColor: '#d4893f',
    slug: 'korean-teacup-pomeranian-1',
    image: '/assets/images/puppies/puppy-13.jpg',
    status: 'Available',
  },
  {
    name: 'Korean Teacup Pomeranian',
    breed: 'Pomeranian',
    gender: 'girl',
    age: '2.5 months',
    video: false,
    doorColor: '#b8644a',
    slug: 'korean-teacup-pomeranian',
    image: '/assets/images/puppies/puppy-14.jpg',
    status: 'Available',
  },
  {
    name: 'Korean Teacup Pomeranian',
    breed: 'Pomeranian',
    gender: 'boy',
    age: '3 months',
    video: false,
    doorColor: '#7a4a2e',
    slug: 'korean-teacup-pomeranian-male',
    image: '/assets/images/puppies/puppy-15.jpg',
    status: 'Available',
  },
];

const HERO_SEAT_SLOTS = [
  { x: '9%', w: '8.6rem', peek: 0.62, tilt: '-5deg', i: 0 },
  { x: '22.5%', w: '10.4rem', peek: 0.8, tilt: '3deg', i: 1 },
  { x: '35%', w: '9.2rem', peek: 0.7, tilt: '-2deg', i: 2 },
  { x: '65%', w: '9.4rem', peek: 0.74, tilt: '3deg', i: 3 },
  { x: '77.5%', w: '10.6rem', peek: 0.82, tilt: '-3deg', i: 4 },
  { x: '91%', w: '8.4rem', peek: 0.6, tilt: '4deg', i: 5 },
];

const HERO_CYCLE_INTERVALS = [1900, 2500, 1700, 2300, 2000, 2800, 1800];

function getHeroPeekState(heroRect) {
  const l = heroRect.width / 300;
  const s = 1.12 * l;
  return {
    x: heroRect.left + 150 * (l - s),
    y: heroRect.top + 159 * (l - s),
    scale: s,
    pose: 'peek',
    front: false,
  };
}

const homeFeaturedFamilies = [
  {
    image: '/assets/families/family-gallery-01.jpg',
    caption: 'Lulu 🧸 with her new mummy ❤️',
    tilt: '-2.2deg',
    tape: '#f6d79a',
    tapeType: 'center',
    delay: '330ms',
  },
  {
    image: '/assets/families/family-gallery-02.jpg',
    caption: 'Adorable Maltipoo baby 🧸❤️',
    tilt: '1.6deg',
    tape: '#f9cdbf',
    tapeType: 'left',
    delay: '0ms',
  },
  {
    image: '/assets/families/family-gallery-03.jpg',
    caption: 'My new teddy puppy 🥰🧸',
    tilt: '-0.9deg',
    tape: '#cfe5f6',
    tapeType: 'right',
    delay: '550ms',
  },
  {
    image: '/assets/families/family-gallery-04.jpg',
    caption: 'Our new puppies 🧸🥰🤗',
    tilt: '2.4deg',
    tape: '#f6d79a',
    tapeType: 'corners',
    delay: '110ms',
  },
  {
    image: '/assets/families/family-gallery-05.jpg',
    caption: 'New puppy 🧸😍',
    tilt: '-1.5deg',
    tape: '#e9dcc4',
    tapeType: 'center',
    delay: '660ms',
  },
  {
    image: '/assets/families/family-gallery-06.jpg',
    caption: 'Gang of 3 😍🧸',
    tilt: '0.8deg',
    tape: '#f6d79a',
    tapeType: 'right',
    delay: '220ms',
  },
  {
    image: '/assets/families/family-gallery-07.jpg',
    caption: 'So happy 😍😍',
    tilt: '-2.6deg',
    tape: '#f9cdbf',
    tapeType: 'left',
    delay: '770ms',
  },
  {
    image: '/assets/families/family-gallery-08.jpg',
    caption: 'New pup 🤗💫',
    tilt: '1.2deg',
    tape: '#cfe5f6',
    tapeType: 'center',
    delay: '440ms',
  },
];

export default function Home() {
  const [activeSeats, setActiveSeats] = useState(() =>
    HERO_SEAT_SLOTS.map((slot, idx) => ({
      ...slot,
      name: meetDoorsData[idx].name,
      breed: meetDoorsData[idx].breed,
      image: meetDoorsData[idx].image,
      slug: meetDoorsData[idx].slug,
      state: 'idle',
    }))
  );
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [focusedSeat, setFocusedSeat] = useState(null);
  const [poppedSeat, setPoppedSeat] = useState(null);

  const hoveredSeatRef = useRef(null);
  const focusedSeatRef = useRef(null);
  const lastScrollAtRef = useRef(0);
  const lastSwappedSeatRef = useRef(-1);
  const stepIdxRef = useRef(0);
  const queueRef = useRef(null);

  const previewFaqs = faqs.slice(0, 3);

  // Initialize shuffled off-stage queue & preload all 15 real available puppies
  useEffect(() => {
    const rest = meetDoorsData.slice(HERO_SEAT_SLOTS.length).map((p) => ({
      name: p.name,
      breed: p.breed,
      image: p.image,
      slug: p.slug,
    }));
    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rest[i], rest[j]] = [rest[j], rest[i]];
    }
    queueRef.current = rest;

    meetDoorsData.forEach((p) => {
      const img = new Image();
      img.src = p.image;
    });
  }, []);

  // Track recent scroll activity so lineup pauses while actively scrolling
  useEffect(() => {
    const markScroll = () => {
      lastScrollAtRef.current = Date.now();
    };
    window.addEventListener('scroll', markScroll, { passive: true });
    return () => window.removeEventListener('scroll', markScroll);
  }, []);

  // Authentic staggered hero puppy peek-a-boo cycling
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const timers = new Set();
    let cancelled = false;

    const addTimer = (fn, ms) => {
      const id = setTimeout(() => {
        timers.delete(id);
        if (!cancelled) fn();
      }, ms);
      timers.add(id);
      return id;
    };

    const scheduleNext = (delayMs) => {
      addTimer(() => {
        const nextInterval =
          HERO_CYCLE_INTERVALS[stepIdxRef.current % HERO_CYCLE_INTERVALS.length];
        stepIdxRef.current += 1;

        const isBusy =
          hoveredSeatRef.current !== null ||
          focusedSeatRef.current !== null ||
          Date.now() - lastScrollAtRef.current < 1000 ||
          window.scrollY > window.innerHeight ||
          !queueRef.current ||
          queueRef.current.length === 0;

        if (isBusy) {
          scheduleNext(nextInterval);
          return;
        }

        const candidates = [0, 1, 2, 3, 4, 5].filter(
          (idx) => idx !== lastSwappedSeatRef.current
        );
        const targetIdx =
          candidates[Math.floor(Math.random() * candidates.length)];
        lastSwappedSeatRef.current = targetIdx;

        // 1. Duck behind quilt
        setActiveSeats((prev) =>
          prev.map((s, idx) =>
            idx === targetIdx ? { ...s, state: 'duck' } : s
          )
        );

        // 2. Swap puppy after 360ms while tucked behind quilt, then pop up & show name tag
        addTimer(() => {
          setActiveSeats((prev) => {
            const q = queueRef.current || [];
            if (q.length === 0) return prev;
            const nextPup = q.shift();
            const outgoing = prev[targetIdx];
            q.push({
              name: outgoing.name,
              breed: outgoing.breed,
              image: outgoing.image,
              slug: outgoing.slug,
            });
            return prev.map((s, idx) =>
              idx === targetIdx
                ? {
                    ...s,
                    name: nextPup.name,
                    breed: nextPup.breed,
                    image: nextPup.image,
                    slug: nextPup.slug,
                    state: 'pop',
                  }
                : s
            );
          });

          setPoppedSeat(targetIdx);

          addTimer(() => {
            setPoppedSeat((curr) => (curr === targetIdx ? null : curr));
          }, 1800);

          addTimer(() => {
            setActiveSeats((prev) =>
              prev.map((s, idx) =>
                idx === targetIdx ? { ...s, state: 'idle' } : s
              )
            );
          }, 700);
        }, 360);

        scheduleNext(nextInterval);
      }, delayMs);
    };

    // Wait for initial tp-peek entrance animation before cycling
    scheduleNext(1400 + HERO_CYCLE_INTERVALS[0]);

    return () => {
      cancelled = true;
      timers.forEach((id) => clearTimeout(id));
      timers.clear();
    };
  }, []);

  const handleSeatEnter = (idx) => {
    hoveredSeatRef.current = idx;
    setHoveredSeat(idx);
  };

  const handleSeatLeave = (idx) => {
    if (hoveredSeatRef.current === idx) hoveredSeatRef.current = null;
    setHoveredSeat((curr) => (curr === idx ? null : curr));
  };

  const handleSeatFocus = (idx) => {
    focusedSeatRef.current = idx;
    setFocusedSeat(idx);
  };

  const handleSeatBlur = (idx) => {
    if (focusedSeatRef.current === idx) focusedSeatRef.current = null;
    setFocusedSeat((curr) => (curr === idx ? null : curr));
  };

  const whatsappUrl =
    "https://wa.me/971541676733?text=Hi%20TeddyPups!%20I'd%20love%20to%20know%20more%20about%20your%20puppies.";

  // Section & Stop Refs
  const heroSectionRef = useRef(null);
  const heroTeddyRef = useRef(null);

  const meetSectionRef = useRef(null);
  const meetTeddyRef = useRef(null);
  const pinRangeRef = useRef(null);
  const hallRef = useRef(null);
  const trackRef = useRef(null);

  const pathsTeddyRef = useRef(null);
  const flightRef = useRef(null);
  const flightPathRef = useRef(null);
  const planeRef = useRef(null);

  const chatTeddyRef = useRef(null);
  const passportTeddyRef = useRef(null);
  const duskTeddyRef = useRef(null);
  const nightTeddyRef = useRef(null);

  const homeSectionRef = useRef(null);
  const homeTeddyRef = useRef(null);

  const [isPinned, setIsPinned] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024);
  const [pinHeight, setPinHeight] = useState(2400);
  const [trackTranslateX, setTrackTranslateX] = useState(0);
  const [openDoors, setOpenDoors] = useState(new Set());
  const [finalDoorOpen, setFinalDoorOpen] = useState(false);

  // Section 4 Phone Mockup step synchronization
  const [activeChatStep, setActiveChatStep] = useState(0);
  const [isPhoneTyping, setIsPhoneTyping] = useState(false);
  const chatStepsRef = useRef(null);
  const prevChatStepRef = useRef(-1);

  useEffect(() => {
    if (!chatStepsRef.current) return;
    const items = Array.from(chatStepsRef.current.children);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = items.indexOf(entry.target);
            if (idx !== -1) {
              setActiveChatStep(idx);
            }
          }
        }
      },
      { rootMargin: '-28% 0px -62% 0px' }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (activeChatStep === prevChatStepRef.current) return;
    const isAdvancing = activeChatStep > prevChatStepRef.current;
    prevChatStepRef.current = activeChatStep;
    if (!isAdvancing || activeChatStep <= 0) return;

    setIsPhoneTyping(true);
    const timer = setTimeout(() => {
      setIsPhoneTyping(false);
      if (activeChatStep === 1) {
        cuePup({ say: 'ooh, photos!', secs: 1.5 });
      } else if (activeChatStep === 2) {
        cuePup({ say: 'home soon!', secs: 1.5 });
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [activeChatStep]);

  // Handle desktop pinning setup and responsive door width calculation
  useLayoutEffect(() => {
    const updateDimensions = () => {
      const isDesktop = window.innerWidth >= 1024;
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const pinned = isDesktop && !isReduced;
      setIsPinned(pinned);

      if (pinned && trackRef.current && hallRef.current) {
        const trackEl = trackRef.current;
        const hallEl = hallRef.current;
        const stageEl = hallEl.parentElement;
        const headEl = stageEl?.querySelector('.tp-meet__head');
        const doorPlates = [...trackEl.querySelectorAll('.tp-door__plate')];
        const n = Math.max(64, ...(doorPlates.length ? doorPlates.map(e => e.offsetHeight) : [64]));
        const floorEl = hallEl.querySelector('.tp-meet__floor');
        const l = floorEl?.offsetHeight ?? 0;
        const headBottom = headEl ? headEl.offsetTop + headEl.offsetHeight : 0;
        const r = Math.max(
          128,
          Math.min(
            256,
            0.15 * window.innerWidth,
            (stageEl.clientHeight - headBottom - l - n - 40) / 1.3
          )
        );
        hallEl.style.setProperty('--door-w', `${r.toFixed(0)}px`);

        const trackW = trackEl.scrollWidth;
        const scrollDistance = Math.max(0, trackW - window.innerWidth + 200);
        const calculatedH = Math.round(window.innerHeight + 0.8 * scrollDistance);
        setPinHeight(calculatedH);
      } else {
        hallRef.current?.style.removeProperty('--door-w');
      }
    };

    updateDimensions();
    const ro = new ResizeObserver(updateDimensions);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener('resize', updateDimensions);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Coordinated scroll handler for Mascot Orchestration, Horizontal Treadmill, Airplane Flight, and Final Doorway
  useLayoutEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const isDesktop = window.innerWidth >= 1024;
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // 1. Horizontal door treadmill progression in Meet section
      if (isDesktop && !isReduced && pinRangeRef.current && trackRef.current) {
        const rangeRect = pinRangeRef.current.getBoundingClientRect();
        const rangeTop = window.scrollY + rangeRect.top;
        const rangeHeight = pinRangeRef.current.offsetHeight;
        const scrollDistance = Math.max(0, trackRef.current.scrollWidth - window.innerWidth + 200);

        const pinProgress = Math.max(0, Math.min(1, (scrollY - rangeTop) / (rangeHeight - window.innerHeight)));
        const transX = pinProgress * scrollDistance;
        setTrackTranslateX(transX);

        if (hallRef.current) {
          hallRef.current.style.setProperty('--floor-x', `-${transX.toFixed(1)}px`);
        }

        // Check which doors are open
        const threshold = 0.38 * window.innerWidth;
        const newlyOpen = new Set();
        const doorNodes = trackRef.current.children;
        for (let i = 0; i < doorNodes.length - 1; i++) {
          const door = doorNodes[i];
          const doorLeft = door.offsetLeft - transX;
          if (doorLeft < threshold + 120) {
            newlyOpen.add(i);
          }
        }
        setOpenDoors(newlyOpen);
      }

      // 2. Airplane flight animation in Section 2 (Two ways to meet your puppy)
      if (flightRef.current && flightPathRef.current && planeRef.current) {
        if (isReduced) {
          const totalLength = flightPathRef.current.getTotalLength();
          const pt = flightPathRef.current.getPointAtLength(0.62 * totalLength);
          const ahead = flightPathRef.current.getPointAtLength(0.63 * totalLength);
          const behind = flightPathRef.current.getPointAtLength(0.61 * totalLength);
          const angle = (180 * Math.atan2(ahead.y - behind.y, ahead.x - behind.x)) / Math.PI;
          planeRef.current.setAttribute(
            'transform',
            `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)}) rotate(${angle.toFixed(1)})`
          );
          planeRef.current.style.opacity = '1';
        } else {
          const rect = flightRef.current.getBoundingClientRect();
          const raw = (window.innerHeight * 0.95 - rect.top) / (window.innerHeight * 0.70 + rect.height);
          const progress = Math.max(0, Math.min(1, raw));
          const totalLength = flightPathRef.current.getTotalLength();
          const currentLen = Math.min(totalLength, Math.max(0, progress * totalLength));
          const pt = flightPathRef.current.getPointAtLength(currentLen);
          const ahead = flightPathRef.current.getPointAtLength(Math.min(totalLength, currentLen + 1));
          const behind = flightPathRef.current.getPointAtLength(Math.max(0, currentLen - 1));
          const angle = (180 * Math.atan2(ahead.y - behind.y, ahead.x - behind.x)) / Math.PI;

          planeRef.current.setAttribute(
            'transform',
            `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)}) rotate(${angle.toFixed(1)})`
          );
          planeRef.current.style.opacity = String(Math.min(1, Math.max(0, (progress - 0.08) / 0.1)));
        }
      }

      // 3. Final doorway opening condition in Section 7 (tp-home)
      if (homeSectionRef.current) {
        const rect = homeSectionRef.current.getBoundingClientRect();
        // Opens on scroll down into view; closes when scrolled back up above the section
        const shouldOpen = rect.top < window.innerHeight * 0.68 && rect.bottom > 80;
        setFinalDoorOpen(shouldOpen);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isPinned]);

  return (
    <div data-page="home" className="tp-page">
      {/* 1. Hero Section */}
      <section
        ref={heroSectionRef}
        data-pup-scene="true"
        data-tone="light"
        className="tp-scene tp-hero"
        style={{
          '--sky-top': '#fffdf8',
          '--sky-bottom': '#fff1d8',
          '--quilt': '#fff1d8',
        }}
        aria-labelledby="hero-title"
      >
        <span aria-hidden="true" className="tp-hero__sun"></span>

        <div className="tp-hero__copy gutter">
          <p className="tp-hero__note font-scrawl">
            every puppy is family
            <svg
              viewBox="0 0 220 24"
              preserveAspectRatio="none"
              className="absolute -bottom-2 left-0 h-3 w-full text-toffee"
              aria-hidden="true"
              style={{
                position: 'absolute',
                bottom: '-0.5rem',
                left: 0,
                height: '0.75rem',
                width: '100%',
                color: 'var(--color-toffee)',
              }}
            >
              <path
                d="M4 14c18-10 30 8 48-1s28-9 46 0 30 8 48-1 30-9 48 0 18 2 22 0"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </p>

          <h1 id="hero-title" className="tp-hero__title font-plush">
            <span className="tp-hero__line">Premium teacup</span>
            <span className="tp-hero__line tp-hero__line--2">puppies in Dubai</span>
          </h1>

          <p className="tp-hero__lede">
            Meet your new best friend in our Dubai showroom, or order a rare miniature breed from trusted breeders worldwide.
          </p>

          <div className="tp-hero__actions">
            <Link className="btn btn-primary" to="/puppies">
              View available puppies
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              Enquire on WhatsApp
            </a>
          </div>
        </div>

        {/* Hero Stage with Puppy Peep-holes & Mascot peeking over quilt */}
        <div className="tp-hero__stage">
          <ul className="tp-lineup" aria-label="Some of the puppies in our showroom">
            {activeSeats.map((seat, idx) => (
              <li
                key={idx}
                className="tp-lineup__seat"
                style={{
                  '--x': seat.x,
                  '--w': seat.w,
                  '--peek': seat.peek,
                  '--tilt': seat.tilt,
                  '--i': seat.i,
                }}
              >
                <Link
                  className="tp-lineup__pup"
                  data-pup-friend="true"
                  data-state={seat.state}
                  aria-label={`Meet ${seat.name}, ${seat.breed}`}
                  to={seat.slug ? `/puppies/${seat.slug}` : '/puppies'}
                  onPointerEnter={() => handleSeatEnter(idx)}
                  onPointerLeave={() => handleSeatLeave(idx)}
                  onFocus={() => handleSeatFocus(idx)}
                  onBlur={() => handleSeatBlur(idx)}
                >
                  <span className="tp-lineup__photo">
                    <img
                      alt={seat.name}
                      loading="eager"
                      src={seat.image}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/assets/images/puppies/puppy-01.webp';
                      }}
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Teddy Mascot peeking over quilt in center with eye tracking */}
          <div
            ref={heroTeddyRef}
            data-pup-stop="true"
            data-pose="peek"
            data-facing="right"
            data-act="peekaboo"
            data-behind="true"
            data-lane="true"
            className="pup-stop tp-hero__teddy"
          >
            <InteractiveTeddy
              pose="peek"
              facing="right"
              enableEyeTracking={true}
              interactive={true}
              peekabooIntro={true}
            />
          </div>

          {/* Quilt scallop border */}
          <div aria-hidden="true" className="tp-quilt">
            <svg className="tp-quilt__edge" width="100%" height="40" preserveAspectRatio="none">
              <defs>
                <pattern id="tp-scallop" width="76" height="40" patternUnits="userSpaceOnUse">
                  <path d="M0 40V27A38 25 0 0 1 76 27V40Z" style={{ fill: 'var(--quilt)' }}></path>
                  <path d="M0 27A38 25 0 0 1 76 27" fill="none" stroke="#2a170e" strokeWidth="3"></path>
                  <path
                    d="M11 33A27 19 0 0 1 65 33"
                    fill="none"
                    stroke="#2a170e"
                    strokeWidth="1.6"
                    strokeDasharray="3.5 5.5"
                    strokeLinecap="round"
                    opacity=".42"
                  ></path>
                </pattern>
              </defs>
              <rect width="100%" height="40" fill="url(#tp-scallop)"></rect>
            </svg>
          </div>

          {/* Floating handwritten name tags above quilt (z-index: 31) */}
          <ul aria-hidden="true" className="tp-lineup tp-lineup--tags">
            {activeSeats.map((seat, idx) => {
              const showTag =
                hoveredSeat === idx || focusedSeat === idx || poppedSeat === idx;
              return (
                <li
                  key={idx}
                  className="tp-lineup__seat"
                  style={{
                    '--x': seat.x,
                    '--w': seat.w,
                    '--peek': seat.peek,
                    '--tilt': seat.tilt,
                    '--i': seat.i,
                  }}
                >
                  <span
                    className="tp-lineup__ghost"
                    data-state={seat.state}
                    data-tag={showTag ? 'show' : undefined}
                  >
                    <span className="tp-lineup__name font-scrawl">{seat.name}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Single Continuous Puppy Journey */}
      <PupJourney />

      {/* 2. Meet the Pups Section */}
      <section
        ref={meetSectionRef}
        data-pup-scene="true"
        data-tone="light"
        className="tp-scene tp-meet"
        data-pinned={isPinned ? 'true' : undefined}
        style={{
          '--sky-top': '#fff1d8',
          '--sky-bottom': '#fbe3b4',
          height: isPinned ? `${pinHeight}px` : undefined,
        }}
        aria-labelledby="meet-title"
      >
        <div
          ref={pinRangeRef}
          data-pin-range="true"
          style={{
            height: isPinned ? `${pinHeight}px` : undefined,
            '--pinned': isPinned ? 1 : 0,
          }}
        >
          <div className="tp-meet__stage">
            <header className="tp-meet__head gutter">
              <div>
                <h2 id="meet-title" className="font-plush text-huge">
                  Meet the pups
                </h2>
                <p className="text-lede mt-3 max-w-[44ch] text-[var(--ink-soft)]">
                  Real puppies, real photos, looking for their families right now.
                </p>
              </div>
              <Link className="btn btn-primary shrink-0" to="/puppies">
                See all available puppies
              </Link>
            </header>

            <div className="tp-meet__hall" ref={hallRef}>
              <ol
                className="tp-meet__track"
                data-treadmill="true"
                ref={trackRef}
                style={
                  isPinned
                    ? { transform: `translate3d(-${trackTranslateX.toFixed(1)}px, 0, 0)` }
                    : undefined
                }
                aria-label="Puppies looking for a family"
              >
                {meetDoorsData.map((pup, idx) => {
                  const isOpen = !isPinned || openDoors.has(idx);
                  const hasIndividualName =
                    pup.name &&
                    pup.breed &&
                    !pup.name.toLowerCase().includes(pup.breed.toLowerCase()) &&
                    !pup.breed.toLowerCase().includes(pup.name.toLowerCase());
                  return (
                    <li
                      key={pup.slug || idx}
                      className="tp-door"
                      data-open={isOpen ? 'true' : 'false'}
                    >
                      <Link
                        to={`/puppies/${pup.slug}`}
                        className="tp-door__link"
                        style={{ '--door': pup.doorColor }}
                      >
                        <span className="tp-door__plate">
                          <span className="font-plush tp-door__name">
                            {pup.name}
                          </span>
                          <span className="tp-door__meta">
                            {hasIndividualName ? `${pup.breed}, ` : ''}
                            {pup.gender}
                            {pup.age ? `, ${pup.age}` : ''}
                            {pup.video ? ', with video' : ''}
                          </span>
                        </span>
                        <span className="tp-door__frame">
                          <span className="tp-door__room">
                            <img
                              alt={`${pup.name}, ${pup.gender} ${pup.breed} puppy`}
                              loading="lazy"
                              src={pup.image}
                              style={{
                                position: 'absolute',
                                height: '100%',
                                width: '100%',
                                left: 0,
                                top: 0,
                                objectFit: 'cover',
                              }}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = '/assets/images/puppies/puppy-01.webp';
                              }}
                            />
                          </span>
                          <span aria-hidden="true" className="tp-door__way">
                            <span className="tp-door__leaf">
                              <svg
                                viewBox="0 0 64 64"
                                className="tp-door__peephole"
                                aria-hidden="true"
                                fill="currentColor"
                              >
                                <path d="M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z"></path>
                              </svg>
                              <span className="tp-door__knob"></span>
                            </span>
                          </span>
                          <span className="tp-door__tag font-scrawl">
                            {pup.status || 'Available'}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}

                {/* 16th Door: Meet Them All */}
                <li className="tp-door tp-door--all" data-open="true">
                  <Link to="/puppies" className="tp-door__link">
                    <span className="tp-door__frame tp-door__frame--all">
                      <span className="font-plush tp-door__all">Meet them all</span>
                    </span>
                  </Link>
                </li>
              </ol>

              {/* Wooden Floor */}
              <div
                aria-hidden="true"
                className="tp-meet__floor"
                style={{ '--floor-x': `-${trackTranslateX.toFixed(1)}px` }}
              ></div>

              {/* Teddy stop anchor on wooden floor */}
              <div
                ref={meetTeddyRef}
                data-pup-stop="true"
                data-pose="stand"
                data-facing="right"
                data-act="treadmill"
                className="pup-stop tp-meet__teddy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Two Ways to Meet Your Puppy */}
      <section
        data-pup-scene="true"
        data-tone="light"
        className="tp-scene tp-paths"
        style={{ '--sky-top': '#fbe3b4', '--sky-bottom': '#f7d18d' }}
        aria-labelledby="paths-title"
      >
        <div className="gutter mx-auto max-w-[110rem]">
          <h2 id="paths-title" className="tp-paths__title font-plush text-huge">
            Two ways to meet your puppy
          </h2>

          <div className="tp-fork">
            <div aria-hidden="true" className="tp-fork__post"></div>

            {/* Path 1: Local Dubai Showroom */}
            <article className="tp-way tp-way--left" aria-labelledby="way-local">
              <h3 id="way-local" className="tp-sign tp-sign--left font-plush">
                Puppies in Dubai
              </h3>
              <div className="tp-way__scene">
                <svg viewBox="0 0 300 120" className="tp-way__skyline" aria-hidden="true">
                  <path
                    d="M4 116h292M20 116V78h16v38M44 116V60h18v56M70 116V84h12v32M150 116V36l4-6v-14l3-4 3 4v14l4 6v80M118 116V70l12-8v54M174 116V64l14 8v44M200 116V82h18v34M226 116V56h14v60M248 116V88h22v28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
                <figure className="tp-window">
                  <span className="tp-window__glass">
                    <img
                      src="/assets/images/puppies/puppy-01.webp"
                      alt="Puppy held in TeddyPups showroom"
                      loading="lazy"
                    />
                  </span>
                  <figcaption className="font-scrawl">In our showroom</figcaption>
                </figure>
              </div>
              <p className="tp-way__text">
                See them, love them, take them home. Come meet our locally available puppies before you decide.
              </p>
              <Link className="btn btn-primary" to="/puppies">
                Meet local puppies
              </Link>
            </article>

            {/* Path 2: Imported with Animated Airplane Flight */}
            <article className="tp-way tp-way--right" aria-labelledby="way-imported">
              <h3 id="way-imported" className="tp-sign tp-sign--right font-plush">
                Imported for you
              </h3>
              <div className="tp-way__scene">
                <div ref={flightRef} className="tp-flight">
                  <svg viewBox="0 0 660 300" role="img" aria-label="Flight bringing puppy from Korea to Dubai">
                    <defs>
                      <clipPath id="tp-flight-clip">
                        <circle r="25"></circle>
                      </clipPath>
                    </defs>
                    <path
                      ref={flightPathRef}
                      d="M40 250 C 170 40, 470 20, 620 168"
                      className="tp-flight__route"
                    ></path>
                    <circle cx="40" cy="250" r="7" className="tp-flight__dot"></circle>
                    <circle cx="620" cy="168" r="7" className="tp-flight__dot"></circle>
                    <text x="40" y="284" textAnchor="middle" className="tp-flight__label">Korea</text>
                    <text x="620" y="202" textAnchor="middle" className="tp-flight__label">Dubai</text>
                    <g ref={planeRef} transform="translate(410 70)">
                      <g transform="translate(-126 -78)">
                        <path d="M28 60 L8 26 L34 26 L60 54 Z" className="tp-flight__wing"></path>
                        <path d="M108 112 L142 156 L172 156 L158 112 Z" className="tp-flight__wing tp-flight__wing--far"></path>
                        <path d="M20 80 C20 52 52 44 80 44 L168 44 C200 44 224 60 232 80 C224 100 200 112 168 112 L80 112 C52 112 20 104 20 80 Z" className="tp-flight__body"></path>
                        <path d="M104 44 L138 2 L168 2 L154 44 Z" className="tp-flight__wing"></path>
                        <path d="M206 64 C215 67 221 73 224 80" className="tp-flight__line"></path>
                      </g>
                      <g transform="translate(10 2)">
                        <image
                          href="/assets/images/puppies/puppy-02.jpg"
                          x="-25"
                          y="-25"
                          width="50"
                          height="50"
                          clipPath="url(#tp-flight-clip)"
                          preserveAspectRatio="xMidYMid slice"
                        />
                        <circle r="25" className="tp-flight__porthole"></circle>
                      </g>
                    </g>
                  </svg>
                </div>
              </div>
              <p className="tp-way__text">
                Exclusive Korean teacup puppies, delivered. Order from the world's most reputable breeders and let us handle the import.
              </p>
              <Link className="btn btn-primary" to="/how-it-works">
                See imported puppies
              </Link>
            </article>

            {/* Mascot stop anchor in center fork */}
            <div
              ref={pathsTeddyRef}
              data-pup-stop="true"
              data-pose="sit"
              data-facing="right"
              className="pup-stop tp-fork__teddy"
            />
          </div>
        </div>
      </section>

      {/* 4. Your Puppy Journey */}
      <section
        data-pup-scene="true"
        data-tone="light"
        className="tp-scene tp-chat"
        style={{
          '--sky-top': '#f7d18d',
          '--sky-bottom': '#f0b866',
        }}
        aria-labelledby="journey-title"
      >
        <div className="tp-chat__grid gutter">
          <div className="tp-chat__story">
            <h2 id="journey-title" className="font-plush text-huge">
              Your puppy journey
            </h2>
            <p className="text-lede mt-5 max-w-[42ch] text-[var(--ink-soft)]">
              A premium, step-by-step concierge experience. We make adoption simple, secure, and purely joyful.
            </p>

            <ol ref={chatStepsRef} className="tp-chat__steps">
              <li
                className="tp-chat__step"
                data-active={activeChatStep === 0 ? 'true' : undefined}
                data-done={activeChatStep > 0 ? 'true' : undefined}
              >
                <span className="tp-chat__num font-plush" aria-hidden="true">1</span>
                <div>
                  <h3 className="font-plush tp-chat__title">Choose your breed</h3>
                  <p className="tp-chat__text">
                    Select your preferred breed or tell us what you're looking for. We'll guide you based on availability and your lifestyle.
                  </p>
                </div>
              </li>

              <li
                className="tp-chat__step"
                data-active={activeChatStep === 1 ? 'true' : undefined}
                data-done={activeChatStep > 1 ? 'true' : undefined}
              >
                <span className="tp-chat__num font-plush" aria-hidden="true">2</span>
                <div>
                  <h3 className="font-plush tp-chat__title">Get photos &amp; details</h3>
                  <p className="tp-chat__text">
                    Our team will share real photos, health details, and all necessary information directly on WhatsApp.
                  </p>
                </div>
              </li>

              <li
                className="tp-chat__step"
                data-active={activeChatStep === 2 ? 'true' : undefined}
                data-done={activeChatStep > 2 ? 'true' : undefined}
              >
                <span className="tp-chat__num font-plush" aria-hidden="true">3</span>
                <div>
                  <h3 className="font-plush tp-chat__title">Secure &amp; safe delivery</h3>
                  <p className="tp-chat__text">
                    Once confirmed, we handle everything professionally and ensure your puppy reaches you safely and stress-free.
                  </p>
                </div>
              </li>
            </ol>

            <Link className="btn btn-ghost tp-chat__cta" to="/how-it-works">
              How it works
            </Link>
          </div>

          {/* Interactive WhatsApp phone preview */}
          <div className="tp-chat__side">
            <div className="tp-phone" aria-label="A WhatsApp conversation with TeddyPups U.A.E." role="group">
              <div className="tp-phone__bar">
                <img
                  src="/assets/logo.png"
                  alt=""
                  width="40"
                  height="40"
                  className="tp-phone__avatar"
                />
                <div>
                  <span className="tp-phone__name">TeddyPups U.A.E.</span>
                  <span className="tp-phone__status">{isPhoneTyping ? 'typing…' : 'online'}</span>
                </div>
              </div>

              <div className="tp-phone__screen">
                <p className="tp-msg tp-msg--me">
                  Hi TeddyPups! I'd love to know more about your puppies.
                </p>

                <div
                  className="tp-msg-group"
                  data-step="0"
                  data-show={activeChatStep >= 0 ? 'true' : 'false'}
                >
                  <div className="tp-msg tp-msg--them">
                    <p>Select your preferred breed or tell us what you're looking for. We'll guide you based on availability and your lifestyle.</p>
                    <ul className="tp-chips" aria-label="Breeds we have now">
                      <li><Link to="/puppies?breed=maltipoo">Maltipoo</Link></li>
                      <li><Link to="/puppies?breed=pomeranian">Pomeranian</Link></li>
                      <li><Link to="/puppies?breed=poodle">Poodle</Link></li>
                      <li><Link to="/puppies?breed=cavapoo">Cavapoo</Link></li>
                      <li><Link to="/puppies?breed=shih-tzu">Shih Tzu</Link></li>
                    </ul>
                  </div>
                </div>

                <div
                  className="tp-msg-group"
                  data-step="1"
                  data-show={activeChatStep >= 1 && (!isPhoneTyping || activeChatStep > 1) ? 'true' : 'false'}
                >
                  <div className="tp-msg tp-msg--them tp-msg--media">
                    <div className="tp-snaps">
                      <span className="tp-snaps__one">
                        <img src="/assets/images/puppies/puppy-01.webp" alt="Puppy preview" />
                      </span>
                      <span className="tp-snaps__one">
                        <img src="/assets/images/puppies/puppy-02.jpg" alt="Puppy preview" />
                      </span>
                    </div>
                  </div>
                  <p className="tp-msg tp-msg--them">
                    Our team will share real photos, health details, and all necessary information directly on WhatsApp.
                  </p>
                </div>

                <div
                  className="tp-msg-group"
                  data-step="2"
                  data-show={activeChatStep >= 2 && !isPhoneTyping ? 'true' : 'false'}
                >
                  <div className="tp-msg tp-msg--them">
                    <p>Once confirmed, we handle everything professionally and ensure your puppy reaches you safely and stress-free.</p>
                    <svg viewBox="0 0 220 70" className="tp-route" aria-hidden="true">
                      <path d="M14 52 C 60 6, 120 70, 170 28" className="tp-route__line"></path>
                      <circle cx="14" cy="52" r="5" className="tp-route__dot"></circle>
                      <path d="M164 32 l12 -12 l12 12 v14 h-24 z" className="tp-route__home"></path>
                      <path d="M176 42 c-2-3-7-2-6 2c1 3 6 5 6 5s5-2 6-5c1-4-4-5-6-2z" className="tp-route__heart"></path>
                      <path d="M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5z" transform="translate(70 22) scale(.3) rotate(70 32 32)" className="tp-route__paw"></path>
                      <path d="M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5z" transform="translate(104 38) scale(.3) rotate(100 32 32)" className="tp-route__paw"></path>
                    </svg>
                  </div>
                </div>

                <p className="tp-typing" data-show={isPhoneTyping ? 'true' : 'false'} aria-hidden="true">
                  <span></span>
                  <span></span>
                  <span></span>
                </p>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="tp-phone__compose"
              >
                <span>Say hello on WhatsApp</span>
                <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="currentColor">
                  <path d="M3 20l18-8L3 4v6l12 2-12 2z"></path>
                </svg>
              </a>
            </div>

            <div
              ref={chatTeddyRef}
              data-pup-stop="true"
              data-pose="sit"
              data-facing="right"
              className="pup-stop tp-chat__teddy"
            />
          </div>
        </div>
      </section>

      {/* 5. Why Families Trust TeddyPups */}
      <section
        data-pup-scene="true"
        data-tone="light"
        className="tp-scene tp-passport"
        style={{ '--sky-top': '#f0b866', '--sky-bottom': '#a65a30' }}
        aria-labelledby="trust-title"
      >
        <div className="gutter mx-auto max-w-[96rem]">
          <div className="tp-book">
            <div className="tp-book__page tp-book__page--left">
              <p aria-hidden="true" className="tp-book__kicker font-scrawl">puppy passport</p>
              <h2 id="trust-title" className="font-plush tp-book__title">
                Why families trust TeddyPups
              </h2>
              <div
                ref={passportTeddyRef}
                data-pup-stop="true"
                data-pose="sit"
                data-facing="right"
                className="pup-stop tp-book__teddy"
              />
            </div>

            <ul className="tp-book__page tp-book__page--right">
              <li className="tp-entry" style={{ '--ink-stamp': '#a24a1a', '--tilt': '-8deg', '--i': 0 }}>
                <span className="tp-stamp tp-stamp--round">
                  <svg viewBox="0 0 64 64" className="tp-stamp__icon" aria-hidden="true">
                    <path d="M32 54C16 43 8 34 8 24c0-7 5.4-12 12-12 5 0 9 3 12 7 3-4 7-7 12-7 6.6 0 12 5 12 12 0 10-8 19-24 30z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M22 30h7l3-7 4 13 3-6h7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  <span className="tp-stamp__title font-plush">Vet-checked &amp; healthy</span>
                </span>
                <p className="tp-entry__text">
                  Every puppy comes vaccinated, dewormed, and with a verified health certificate.
                </p>
              </li>

              <li className="tp-entry" style={{ '--ink-stamp': '#1f6b45', '--tilt': '5deg', '--i': 1 }}>
                <span className="tp-stamp tp-stamp--ticket">
                  <svg viewBox="0 0 64 64" className="tp-stamp__icon" aria-hidden="true">
                    <path d="M6 36l22-3 12-17h6l-6 17 12-1 6-7h3l-2 10 2 10h-3l-6-7-12-1 6 17h-6L28 37 6 36z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M8 50c10 4 20 4 30 0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 7"></path>
                  </svg>
                  <span className="tp-stamp__title font-plush">Korea to Dubai, safely</span>
                </span>
                <p className="tp-entry__text">
                  Trusted breeders, safe travel, and premium care from start to finish.
                </p>
              </li>

              <li className="tp-entry" style={{ '--ink-stamp': '#5a3a28', '--tilt': '-4deg', '--i': 2 }}>
                <span className="tp-stamp tp-stamp--oval">
                  <svg viewBox="0 0 64 64" className="tp-stamp__icon" aria-hidden="true">
                    <path d="M10 14h44v28H30l-12 10v-10h-8z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  <span className="tp-stamp__title font-plush">Support 24/7</span>
                </span>
                <p className="tp-entry__text">
                  Always here to help, from choosing your puppy to post-delivery support.
                </p>
              </li>

              <li className="tp-entry" style={{ '--ink-stamp': '#c2622b', '--tilt': '7deg', '--i': 3 }}>
                <span className="tp-stamp tp-stamp--scallop">
                  <svg viewBox="0 0 64 64" className="tp-stamp__icon" aria-hidden="true">
                    <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></circle>
                    <path d="M10 32h44M32 10c-8 8-8 36 0 44M32 10c8 8 8 36 0 44" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  <span className="tp-stamp__title font-plush">Trusted by families worldwide</span>
                </span>
                <p className="tp-entry__text">
                  Puppies delivered to loving homes all around the world.
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Sunset city skyline transition into dusk */}
        <div aria-hidden="true" className="tp-horizon">
          <span className="tp-horizon__sun"></span>
          <svg viewBox="0 0 1440 160" preserveAspectRatio="none" className="tp-horizon__city">
            <path d="M0 160V118h34v-14h22v-22h30v34h18V96h26v30h22v-18h16v-30h34v40h20V70h28v56h24V98h18v-26h30v54h20v-38h26v-40l14-6 14 6v40h22v46h18V84h26v-30h22v50h24V76h36v50h20V96h18v-58h30v44h14V96h22v-30h16v22h26v-52l6-8v-24l4-6v-30l3-18 3 18v30l4 6v24l6 8v52h26v30h22V82h30v-20h24v48h20V90h28v-36h26v56h18V74h30v36h22V94h26v-24h30v62h20V102h26v20h34v38z"></path>
          </svg>
        </div>
      </section>

      {/* 6. Happy Families & Puppies */}
      <section
        data-pup-scene="true"
        data-tone="dark"
        className="tp-scene tp-dusk"
        style={{ '--sky-top': '#a65a30', '--sky-bottom': '#4d2b19' }}
        aria-labelledby="dusk-title"
      >
        <div className="tp-dusk__sky gutter">
          <div className="tp-dusk__head">
            <h2 id="dusk-title" className="font-plush text-huge">
              Happy families &amp; puppies
            </h2>
            <p className="text-lede mt-5 max-w-[50ch] text-[var(--ink-soft)]">
              We are truly honored to see our puppies become cherished members of loving families. These heartwarming moments have been shared by our valued clients who welcomed a Teddy Pup into their homes and hearts.
            </p>
          </div>
          <figure className="tp-dusk__note">
            <blockquote className="font-plush-text">
              “TeddyPups truly made our dream a reality. They supported us at every step of the import journey. Our Maltipoo arrived healthy, cheerful, and absolutely perfect. Having 24/7 support throughout the process gave us complete peace of mind.”
            </blockquote>
            <figcaption className="font-scrawl">Sarah M., Dubai, UAE</figcaption>
          </figure>
        </div>

        <div className="tp-photowall">
          <div className="tp-photowall__wall">
            <ul className="tp-photowall__prints" aria-label="Photos from TeddyPups families">
              {homeFeaturedFamilies.map((fam, idx) => (
                <li key={idx} data-reveal="true" style={{ '--d': fam.delay }}>
                  <Link
                    to="/happy-families"
                    className="tp-photowall__print"
                    aria-label={`Open photo ${idx + 1} of 64: ${fam.caption}`}
                  >
                    <span
                      className="tp-polaroid"
                      style={{
                        '--tilt': fam.tilt,
                        '--tape': fam.tape,
                        '--i': idx,
                      }}
                    >
                      {fam.tapeType === 'corners' ? (
                        <>
                          <span aria-hidden="true" className="tp-tape tp-tape--tl" />
                          <span aria-hidden="true" className="tp-tape tp-tape--tr" />
                        </>
                      ) : (
                        <span aria-hidden="true" className={`tp-tape tp-tape--${fam.tapeType}`} />
                      )}
                      <span className="tp-polaroid__photo">
                        <img
                          src={fam.image}
                          alt={fam.caption}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/assets/images/puppies/puppy-01.webp';
                          }}
                        />
                      </span>
                      <span className="tp-polaroid__caption font-scrawl">
                        {fam.caption}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="tp-facade__ground">
              <span aria-hidden="true" className="tp-facade__door"></span>
              <span aria-hidden="true" className="tp-lamp">
                <span className="tp-lamp__light"></span>
              </span>
              <Link className="btn btn-primary tp-facade__cta" to="/happy-families">
                See every happy family
              </Link>
              <div
                ref={duskTeddyRef}
                data-pup-stop="true"
                data-pose="sit"
                data-facing="right"
                className="pup-stop tp-dusk__teddy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Questions, answered */}
      <section
        data-pup-scene="true"
        data-tone="dark"
        className="tp-scene tp-night"
        style={{
          '--sky-top': '#4d2b19',
          '--sky-bottom': '#2f1a10',
        }}
        aria-labelledby="questions-title"
      >
        <div aria-hidden="true" className="pointer-events-none tp-night__stars">
          {[
            { left: '8%', top: '12%', width: '16.2px', delay: '0.00s' },
            { left: '22%', top: '30%', width: '9px', delay: '0.40s' },
            { left: '41%', top: '8%', width: '12.6px', delay: '0.80s' },
            { left: '57%', top: '22%', width: '8.1px', delay: '1.20s' },
            { left: '72%', top: '6%', width: '14.4px', delay: '1.60s' },
            { left: '88%', top: '18%', width: '10.8px', delay: '2.00s' },
            { left: '95%', top: '42%', width: '9px', delay: '2.40s' },
            { left: '4%', top: '58%', width: '10.8px', delay: '2.80s' },
            { left: '34%', top: '70%', width: '7.2px', delay: '3.20s' },
            { left: '63%', top: '84%', width: '9.9px', delay: '3.60s' },
            { left: '83%', top: '66%', width: '12.6px', delay: '4.00s' },
          ].map((s, i) => (
            <svg
              key={i}
              viewBox="0 0 40 40"
              className="tp-twinkle absolute text-honey"
              style={{ left: s.left, top: s.top, width: s.width, animationDelay: s.delay }}
              aria-hidden="true"
            >
              <path d="M20 3c1.6 9.4 7.6 15.4 17 17-9.4 1.6-15.4 7.6-17 17-1.6-9.4-7.6-15.4-17-17 9.4-1.6 15.4-7.6 17-17z" fill="currentColor"></path>
            </svg>
          ))}
        </div>

        <div className="tp-night__grid gutter">
          <div className="tp-night__intro">
            <h2 id="questions-title" className="font-plush text-huge">
              Questions, answered
            </h2>
            <Link className="btn btn-ghost tp-night__cta" to="/faq">
              Read all questions
            </Link>
            <div className="tp-night__pup">
              <span aria-hidden="true" className="tp-night__wonder font-plush">?</span>
              <div
                ref={nightTeddyRef}
                data-pup-stop="true"
                data-pose="sit"
                data-facing="right"
                data-act="tilt"
                className="pup-stop tp-night__teddy"
              />
            </div>
          </div>

          <dl className="tp-night__list">
            {previewFaqs.map((faq, idx) => (
              <div key={faq.id || idx} className="tp-qa">
                <dt className="font-plush tp-qa__q">
                  <svg viewBox="0 0 40 40" className="tp-qa__star" aria-hidden="true">
                    <path d="M20 3c1.6 9.4 7.6 15.4 17 17-9.4 1.6-15.4 7.6-17 17-1.6-9.4-7.6-15.4-17-17 9.4-1.6 15.4-7.6 17-17z" fill="currentColor"></path>
                  </svg>
                  {faq.question}
                </dt>
                <dd className="tp-qa__a">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 8. Ready to meet your new best friend? */}
      <section
        ref={homeSectionRef}
        data-pup-scene="true"
        data-tone="dark"
        className="tp-scene tp-home"
        data-open={finalDoorOpen ? 'true' : 'false'}
        data-visited={finalDoorOpen ? 'true' : undefined}
        style={{ '--sky-top': '#2f1a10', '--sky-bottom': '#24130b' }}
        aria-labelledby="cta-title"
      >
        <div className="tp-home__copy gutter">
          <h2 id="cta-title" className="font-plush text-huge">
            Ready to meet your new best friend?
          </h2>
          <p className="tp-home__lede">
            Bring home a healthy, happy teacup or designer puppy with expert guidance every step of the way. We help you find the right match and ensure a smooth, safe delivery across the UAE.
          </p>
        </div>

        <div className="tp-house">
          <span aria-hidden="true" className="tp-house__plant tp-house__plant--left"></span>
          <span aria-hidden="true" className="tp-house__lamp"></span>
          <div className="tp-house__doorway">
            <span className="tp-house__inside">
              <img
                src="/assets/images/puppies/puppy-01.webp"
                alt="Max, waiting inside"
                style={{ position: 'absolute', height: '100%', width: '100%', objectFit: 'cover' }}
              />
            </span>
            <span aria-hidden="true" className="tp-house__door">
              <span className="tp-house__peep"></span>
              <span className="tp-house__knob"></span>
            </span>
          </div>
          <span aria-hidden="true" className="tp-house__plant tp-house__plant--right"></span>
          <span aria-hidden="true" className="tp-house__mat font-scrawl">welcome home</span>
          <div
            ref={homeTeddyRef}
            data-pup-stop="true"
            data-pose="bow"
            data-facing="right"
            className="pup-stop tp-house__teddy"
          />
        </div>

        <div className="tp-home__actions gutter">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
          >
            Enquire on WhatsApp
          </a>
          <Link to="/contact" className="btn btn-ghost tp-home__ghost">
            Visit &amp; contact
          </Link>
        </div>
      </section>
    </div>
  );
}
