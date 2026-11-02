import { useState, useEffect, useRef } from 'react';

/**
 * PawCursorTrail - Whimsical paw prints trailing the cursor
 * Renders lightweight fading paw prints following user movement.
 * Automatically disabled on touch screens and when prefers-reduced-motion is active.
 */
export default function PawCursorTrail() {
  const [paws, setPaws] = useState([]);
  const lastPosRef = useRef(null);
  const sideRef = useRef(1);
  const idRef = useRef(0);

  useEffect(() => {
    // Check if pointer is fine and not reduced motion
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || isReducedMotion) return;

    const handleMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;
      if (!lastPosRef.current) {
        lastPosRef.current = { x, y };
        return;
      }

      const dx = x - lastPosRef.current.x;
      const dy = y - lastPosRef.current.y;
      const dist = Math.hypot(dx, dy);

      // Distance threshold: spawn paw print every 32px
      if (dist >= 32) {
        const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        const side = sideRef.current;
        sideRef.current = -side;

        // Perpendicular offset for alternate foot steps
        const nx = -dy / dist;
        const ny = dx / dist;
        const offsetDist = 9 * side;
        const pawX = x + nx * offsetDist;
        const pawY = y + ny * offsetDist;
        const pawRot = angle + side * 7;

        const pawId = ++idRef.current;
        const newPaw = { id: pawId, x: pawX, y: pawY, rot: pawRot };

        setPaws((prev) => {
          const updated = prev.length > 20 ? prev.slice(prev.length - 20) : prev;
          return [...updated, newPaw];
        });

        lastPosRef.current = { x, y };

        // Clean up paw after animation completes (750ms)
        setTimeout(() => {
          setPaws((prev) => prev.filter((p) => p.id !== pawId));
        }, 750);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (paws.length === 0) return null;

  return (
    <div className="tp-cursor-trail" aria-hidden="true">
      {paws.map((paw) => (
        <span
          key={paw.id}
          className="tp-paw-print"
          style={{
            left: `${paw.x}px`,
            top: `${paw.y}px`,
            '--rot': `${paw.rot}deg`,
          }}
        >
          <svg
            viewBox="0 0 64 64"
            width="17"
            height="17"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z" />
          </svg>
        </span>
      ))}
    </div>
  );
}

