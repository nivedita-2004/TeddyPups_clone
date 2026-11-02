import { useState, useEffect, useRef, useCallback } from 'react';

const PEEK_REACTIONS = [
  { text: 'peekaboo!', tilt: 0, drop: true },
  { text: 'woof!', tilt: -6, drop: false },
  { text: 'hm?', tilt: -13, drop: false },
  { text: 'achoo!', tilt: 10, drop: false },
];

const SIT_REACTIONS = [
  { text: 'hm?', tilt: -14, drop: false },
  { text: 'woof!', tilt: -6, drop: false },
  { text: 'I like you!', tilt: 8, drop: false, happy: true },
  { text: 'achoo!', tilt: 10, drop: false },
];

const SNUG_REACTIONS = [
  { text: 'hm?', tilt: -14, drop: false },
  { text: 'I like you!', tilt: 7, drop: false, happy: true },
  { text: 'achoo!', tilt: 10, drop: false },
  { text: 'woof!', tilt: -6, drop: false },
];

/**
 * InteractiveTeddy
 * Faithful SVG recreation of Teddy with:
 * - Pointer-following pupils clamped inside eye sockets (aware of left/right facing)
 * - Natural autonomous blinking
 * - Independent sinusoidal tail wagging around pivot (84, 150) & subtle idle breathing
 * - Optional peekaboo entrance & click reactions with speech bubble
 * - Distinct poses: 'peek' (hero quilt), 'jump' (leap transition), 'sit', 'bow', 'snug' (footer basket)
 */
export default function InteractiveTeddy({
  pose = 'peek',
  facing = 'right',
  walkPhase = 0,
  stride = 0,
  width,
  height,
  className = '',
  style = {},
  label = 'Teddy, the TeddyPups mascot puppy',
  enableEyeTracking = true,
  interactive = false,
  peekabooIntro = false,
  autoWag = false,
  happyEyes = false,
  onSay,
}) {
  const containerRef = useRef(null);
  const isWalk = pose === 'walk' || pose === 'stand';
  const isPeek = pose === 'peek';
  const isJump = pose === 'jump';
  const isSit = pose === 'sit';
  const isBow = pose === 'bow';
  const isSnug = pose === 'snug';
  const bodyRef = useRef(null);
  const tailRef = useRef(null);
  const headRef = useRef(null);
  const eyesRef = useRef(null);
  const openEyesRef = useRef(null);
  const happyEyesRef = useRef(null);
  const blinkRef = useRef(null);
  const gazeOverrideRef = useRef(null);
  const wagTargetRef = useRef(0.6);
  const petTargetRef = useRef(happyEyes ? 1 : 0);
  const headAnimRef = useRef({ y: 0, rot: 0 });
  const lastReactionIdxRef = useRef(-1);
  const bubbleTimerRef = useRef(null);
  const reactionTimersRef = useRef([]);

  const [bubbleText, setBubbleText] = useState('');
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [headAnim, setHeadAnim] = useState(() => {
    if (
      peekabooIntro &&
      pose === 'peek' &&
      typeof window !== 'undefined' &&
      window.scrollY <= 50 &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return { y: 112, rot: 0, transition: false };
    }
    return { y: 0, rot: 0, transition: true };
  });

  useEffect(() => {
    headAnimRef.current = headAnim;
  }, [headAnim]);

  const clearReactionTimers = useCallback(() => {
    reactionTimersRef.current.forEach((t) => clearTimeout(t));
    reactionTimersRef.current = [];
  }, []);

  const say = useCallback(
    (text, durationMs = 1500) => {
      if (onSay) {
        onSay(text, durationMs);
        return;
      }
      if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
      setBubbleText(text);
      setBubbleVisible(true);
      bubbleTimerRef.current = setTimeout(() => {
        setBubbleVisible(false);
      }, durationMs);
    },
    [onSay]
  );

  // 1. Optional peekaboo pop-up greeting on initial Home load
  useEffect(() => {
    if (!peekabooIntro || pose !== 'peek') return;
    const isReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (isReduced || window.scrollY > 50) return;

    const t1 = setTimeout(() => {
      setHeadAnim({ y: -5, rot: -3, transition: true });
      say('peekaboo!', 1600);
    }, 580);
    const t2 = setTimeout(() => {
      setHeadAnim({ y: 0, rot: 0, transition: true });
    }, 880);
    const t3 = setTimeout(() => {
      gazeOverrideRef.current = { x: -3.2, y: 0.6 };
    }, 1350);
    const t4 = setTimeout(() => {
      gazeOverrideRef.current = { x: 3.2, y: 0.6 };
    }, 2100);
    const t5 = setTimeout(() => {
      gazeOverrideRef.current = null;
    }, 2850);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      gazeOverrideRef.current = null;
    };
  }, [peekabooIntro, pose, say]);

  // Reset transient head offset when pose changes
  useEffect(() => {
    if (pose !== 'peek') {
      clearReactionTimers();
      gazeOverrideRef.current = null;
      const rafId = requestAnimationFrame(() => {
        setHeadAnim((prev) =>
          prev.y !== 0 || prev.rot !== 0
            ? { y: 0, rot: 0, transition: false }
            : prev
        );
      });
      return () => cancelAnimationFrame(rafId);
    }
  }, [pose, clearReactionTimers]);

  // 2. Pointer-following eye tracking (accounts for horizontal flip when facing="left")
  useEffect(() => {
    if (!enableEyeTracking) return;
    const isReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (isReduced) return;

    const isLeft = facing === 'left';
    let rafId = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e) => {
      if (e.pointerType === 'touch') return;
      if (!containerRef.current || !eyesRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const eyeRatioX = isLeft ? (300 - 212) / 300 : 212 / 300;
      const eyeCenterX = rect.left + rect.width * eyeRatioX;
      const eyeCenterY = rect.top + rect.height * (98 / 240);

      const dx = (e.clientX - eyeCenterX) * (isLeft ? -1 : 1);
      const dy = e.clientY - eyeCenterY;
      const dist = Math.hypot(dx, dy);

      if (dist === 0) {
        targetX = 0;
        targetY = 0;
      } else {
        const maxRadius = 3.4;
        const radius = Math.min(maxRadius, dist / 45);
        targetX = (dx / dist) * radius;
        targetY = (dy / dist) * (radius * 0.76);
      }
    };

    const handleMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const updatePupils = () => {
      const override = gazeOverrideRef.current;
      const tx = override ? override.x : targetX;
      const ty = override ? override.y : targetY;
      currentX += (tx - currentX) * 0.18;
      currentY += (ty - currentY) * 0.18;

      if (eyesRef.current) {
        eyesRef.current.setAttribute(
          'transform',
          `translate(${currentX.toFixed(2)} ${currentY.toFixed(2)})`
        );
      }
      rafId = requestAnimationFrame(updatePupils);
    };

    window.addEventListener('pointermove', handleMouseMove, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    rafId = requestAnimationFrame(updatePupils);

    return () => {
      window.removeEventListener('pointermove', handleMouseMove);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [enableEyeTracking, facing]);

  // 3. Autonomous blinking (single SVG coordinate origin at y=98)
  useEffect(() => {
    const isReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (isReduced) return;

    let blinkTimeout = null;
    let reopenTimeout = null;

    const scheduleBlink = () => {
      const delay = 3200 + Math.random() * 3000;
      blinkTimeout = setTimeout(() => {
        if (blinkRef.current) {
          blinkRef.current.setAttribute(
            'transform',
            'translate(0 98) scale(1 0.08) translate(0 -98)'
          );
          reopenTimeout = setTimeout(() => {
            if (blinkRef.current) {
              blinkRef.current.setAttribute('transform', 'translate(0 0)');
            }
            scheduleBlink();
          }, 135);
        } else {
          scheduleBlink();
        }
      }, delay);
    };

    scheduleBlink();
    return () => {
      clearTimeout(blinkTimeout);
      clearTimeout(reopenTimeout);
    };
  }, []);

  // 4. Independent tail wagging & subtle idle breathing (matching reference PupBuddy rig)
  useEffect(() => {
    const isReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (isReduced) return;

    const el = containerRef.current;
    if (!el) return;

    const baseTail =
      pose === 'jump' || pose === 'hop'
        ? -24
        : pose === 'sit'
        ? 34
        : pose === 'walk'
        ? -6
        : pose === 'stand'
        ? 0
        : pose === 'bow'
        ? -32
        : -20;
    const baseBodyY =
      pose === 'jump' ? -10 : pose === 'sit' ? -2 : pose === 'bow' ? 2 : 0;
    const baseBodyRot =
      pose === 'jump' ? -16 : pose === 'sit' ? -24 : pose === 'bow' ? 15 : 0;
    const baseHX =
      pose === 'jump' ? 4 : pose === 'sit' ? -10 : pose === 'bow' ? 14 : 0;
    const baseHY =
      pose === 'jump'
        ? -4
        : pose === 'sit'
        ? -6
        : pose === 'bow'
        ? 30
        : pose === 'snug'
        ? 9
        : 4;
    const baseHRot = pose === 'snug' ? 4 : 0;

    let rafId = null;
    let isVisible = true;
    let lastTime = performance.now() / 1000;
    let simTime = 0;
    let wag = 0.6;
    let pet = happyEyes ? 1 : 0;
    let idleSince = lastTime;

    const tick = () => {
      if (!isVisible) {
        rafId = null;
        return;
      }
      const now = performance.now() / 1000;
      const dt = Math.min(0.05, Math.max(0.001, now - lastTime));
      lastTime = now;
      simTime += dt;

      const kWag = 1 - Math.exp(-dt / 0.18);
      const kPet = 1 - Math.exp(-dt / 0.12);
      wag += (wagTargetRef.current - wag) * kWag;
      const targetPet = happyEyes ? 1 : petTargetRef.current;
      pet += (targetPet - pet) * kPet;

      // Exact reference tail wag equation around pivot (84, 150)
      const amp = 5 + 17 * wag;
      const freq = 1.2 + 2.6 * wag;
      const tailAngle = baseTail + Math.sin(simTime * freq * Math.PI * 2) * amp;
      if (tailRef.current) {
        tailRef.current.setAttribute(
          'transform',
          `rotate(${tailAngle.toFixed(2)} 84 150)`
        );
      }

      // Subtle idle breathing on body and head without rotating or shifting SVG bounds
      // ONLY applied when NOT in walking/standing kinematics mode so we don't clobber walk trot
      if (!isWalk && autoWag && pose !== 'peek' && pose !== 'snug') {
        const breathe = Math.sin(2.4 * simTime);
        if (bodyRef.current) {
          const by = baseBodyY + 0.6 * breathe;
          bodyRef.current.setAttribute(
            'transform',
            `translate(0 ${by.toFixed(2)}) rotate(${baseBodyRot} 196 206) translate(196 0) scale(1 1) translate(-196 0)`
          );
        }
        if (headRef.current) {
          const ha = headAnimRef.current;
          const hy = baseHY + ha.y + 0.9 * breathe;
          const hr = baseHRot + ha.rot;
          headRef.current.setAttribute(
            'transform',
            `translate(${baseHX} ${hy.toFixed(2)}) rotate(${hr.toFixed(2)} 212 100)`
          );
        }
      }

      // Smooth happy-eyes transition when petted
      if (openEyesRef.current && happyEyesRef.current) {
        const happyOp = Math.min(1, Math.max(0, pet));
        const openOp = Math.min(1, Math.max(0, 1 - happyOp));
        openEyesRef.current.setAttribute('opacity', openOp.toFixed(2));
        happyEyesRef.current.setAttribute('opacity', happyOp.toFixed(2));
      }

      // Periodic subtle wag burst when idle (~9s), matching reference PupBuddy
      if (now - idleSince > 9) {
        idleSince = now;
        wagTargetRef.current = 1;
        const tReset = setTimeout(() => {
          wagTargetRef.current = 0.6;
        }, 2200);
        reactionTimersRef.current.push(tReset);
      }

      rafId = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !rafId) {
        lastTime = performance.now() / 1000;
        rafId = requestAnimationFrame(tick);
      } else if (!isVisible && rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    });
    observer.observe(el);

    const handlePointerEnter = (e) => {
      if (e.pointerType === 'mouse') {
        wagTargetRef.current = 1;
        petTargetRef.current = 1;
      }
    };

    const handlePointerLeave = () => {
      wagTargetRef.current = 0.6;
      petTargetRef.current = happyEyes ? 1 : 0;
    };

    el.addEventListener('pointerenter', handlePointerEnter);
    el.addEventListener('pointerleave', handlePointerLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      observer.disconnect();
      el.removeEventListener('pointerenter', handlePointerEnter);
      el.removeEventListener('pointerleave', handlePointerLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [autoWag, isWalk, pose, happyEyes]);

  useEffect(() => {
    return () => {
      clearReactionTimers();
      if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    };
  }, [clearReactionTimers]);

  const handleClick = () => {
    if (!interactive) return;
    clearReactionTimers();
    const pool =
      pose === 'peek'
        ? PEEK_REACTIONS
        : pose === 'snug'
        ? SNUG_REACTIONS
        : SIT_REACTIONS;
    const candidates = pool
      .map((r, i) => ({ r, i }))
      .filter((item) => item.i !== lastReactionIdxRef.current);
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    lastReactionIdxRef.current = chosen.i;
    const { text, tilt, drop, happy } = chosen.r;

    if (drop && pose === 'peek') {
      setHeadAnim({ y: 95, rot: 0, transition: true });
      const t1 = setTimeout(() => {
        setHeadAnim({ y: -4, rot: -3, transition: true });
        say(text, 1500);
      }, 380);
      const t2 = setTimeout(() => {
        setHeadAnim({ y: 0, rot: 0, transition: true });
      }, 720);
      reactionTimersRef.current.push(t1, t2);
    } else {
      setHeadAnim({ y: -4, rot: tilt, transition: true });
      if (autoWag) {
        wagTargetRef.current = 1;
        if (happy) petTargetRef.current = 1;
      }
      say(text, 1500);
      const t1 = setTimeout(() => {
        setHeadAnim({ y: 0, rot: 0, transition: true });
        if (autoWag) {
          wagTargetRef.current = 0.6;
          if (happy) petTargetRef.current = 0;
        }
      }, 1100);
      reactionTimersRef.current.push(t1);
    }
  };

  // Facing calculation (supports 'left', 'right', 1, -1, or continuous numeric facing)
  let facingScale = 1;
  if (facing === 'left' || facing === -1) {
    facingScale = -1;
  } else if (typeof facing === 'number') {
    facingScale = Math.abs(facing) < 0.02 ? 0.02 * Math.sign(facing || 1) : facing;
  }
  const rootTransform =
    facingScale !== 1
      ? `translate(150 0) scale(${facingScale.toFixed(3)} 1) translate(-150 0)`
      : undefined;

  // Stride & walk trot cycle kinematics
  const hasStride = stride > 0.01;
  const u = hasStride ? 1 : 0;
  const p = 20 + 10 * Math.min(1, Math.max(0, stride));
  const d = Math.sin(walkPhase);
  const f = Math.sin(walkPhase + Math.PI);
  const gBob = (1 - Math.cos(2 * walkPhase)) / 2;
  const walkBodyY = isWalk ? -gBob * (2.5 + 4 * stride) * u : 0;
  const walkBodyRot = isWalk ? 1.6 * Math.sin(walkPhase) * u : 0;
  const walkHeadRot = isWalk ? 1.4 * Math.sin(walkPhase) * u : 0;
  const walkHeadY = isWalk ? -(1 - Math.cos(2 * walkPhase - 0.7)) / 2 * (2 + 3 * stride) * u : 0;
  const walkEarBounce = isWalk ? 4 * Math.sin(2 * walkPhase) * u : 0;

  const baseHeadX = isJump ? 4 : isSit ? -10 : isBow ? 14 : 0;
  const baseHeadY = isJump ? -4 : isSit ? -6 : isBow ? 30 : isSnug ? 9 : isWalk ? 0 : 4;
  const baseHeadRot = isSnug ? 4 : 0;
  const totalHeadY = baseHeadY + headAnim.y + walkHeadY;
  const headRot = baseHeadRot + headAnim.rot + walkHeadRot;

  const earLRot = (isJump ? -12 : isSit ? 0 : isSnug ? 3 : isWalk ? 0 : -6) + walkEarBounce;
  const earRRot = (isJump ? 14 : isSit ? 0 : isSnug ? -3 : isWalk ? 0 : 6) - walkEarBounce;

  // Leg rotations: in walk trot, diagonal leg pairs swing together
  const rotBf = isWalk ? d * p * u : isJump ? 32 : 0;
  const rotFf = isWalk ? f * p * u : isJump ? -28 : isSit ? 24 : isBow ? -67 : 0;
  const rotBn = isWalk ? f * p * u : isJump ? 26 : 0;
  const rotFn = isWalk ? d * p * u : isJump ? -22 : isSit ? 24 : isBow ? -67 : 0;

  // Tail wag angle matching reference kinematics
  const simNow = typeof performance !== 'undefined' ? performance.now() / 1000 : 0;
  const wag = 0.6;
  const amp = 5 + 17 * wag;
  const freq = 1.2 + 2.6 * wag;
  const curBaseTail =
    isJump || pose === 'hop'
      ? -24
      : isSit
      ? 34
      : pose === 'walk'
      ? -6
      : pose === 'stand'
      ? 0
      : pose === 'bow'
      ? -32
      : -20;
  const curTailAngle = curBaseTail + Math.sin(simNow * freq * Math.PI * 2) * amp;

  const wrapperStyle = {
    display: 'block',
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
    ...style,
  };

  return (
    <div
      ref={containerRef}
      className={`pup-buddy ${className}`.trim()}
      data-facing={facing}
      data-live={interactive || autoWag ? 'true' : undefined}
      style={wrapperStyle}
    >
      <svg
        viewBox="0 0 300 240"
        onClick={interactive ? handleClick : undefined}
        style={{
          width: '100%',
          height: 'auto',
          overflow: 'visible',
          display: 'block',
        }}
        role={label ? 'img' : undefined}
        aria-label={label || undefined}
        aria-hidden={!label || undefined}
        focusable="false"
      >
        <g
          data-p="root"
          transform={rootTransform}
        >
          {/* Floor Shadow */}
          <ellipse
            data-p="shadow"
            cx="150"
            cy="230"
            rx="92"
            ry="7"
            fill="#2a170e"
            opacity={isSit || isBow || isWalk || isJump ? '0.12' : '0'}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          />

          {/* Full Body (visible in walk, jump, sit & bow poses) */}
          <g
            ref={bodyRef}
            data-p="body"
            transform={
              isWalk
                ? `translate(0 ${walkBodyY.toFixed(2)}) rotate(${walkBodyRot.toFixed(2)} 196 206) scale(1 1)`
                : isJump
                ? 'translate(0 -10) rotate(-16 196 206) scale(1 1)'
                : isSit
                ? 'translate(0 -2) rotate(-24 196 206) translate(196 0) scale(1 1) translate(-196 0)'
                : isBow
                ? 'translate(0 2) rotate(15 196 206) translate(196 0) scale(1 1) translate(-196 0)'
                : 'translate(0 0) rotate(0 196 206) scale(1 1)'
            }
            opacity={isPeek || isSnug ? '0' : '1'}
            style={{ transition: 'opacity 0.25s ease' }}
          >
            {/* Back Far Leg */}
            <g
              data-p="bf"
              transform={`translate(94 192) rotate(${rotBf.toFixed(2)})`}
              opacity={isSit ? '0' : '1'}
            >
              <path
                d="M-14 -14 C-14 4 -12 18 -12 27 C-12 34 -7 36 0 36 C9 36 13 33 13 27 C13 18 14 4 14 -14Z"
                fill="#e4a352"
              />
              <path
                d="M-14 -14 C-14 4 -12 18 -12 27 C-12 34 -7 36 0 36 C9 36 13 33 13 27 C13 18 14 4 14 -14"
                stroke="#2a170e"
                strokeWidth="3.4"
                strokeLinejoin="round"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M-3.5 29 v5 M4.5 29 v5"
                stroke="#2a170e"
                strokeWidth="2.4"
                strokeLinejoin="round"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* Front Far Leg */}
            <g
              data-p="ff"
              transform={`translate(168 192) rotate(${rotFf.toFixed(2)})`}
            >
              <path
                d="M-11 -14 C-11 4 -12 18 -12 27 C-12 34 -7 36 0 36 C9 36 13 33 13 27 C13 18 11 4 11 -14Z"
                fill="#e4a352"
              />
              <path
                d="M-11 -14 C-11 4 -12 18 -12 27 C-12 34 -7 36 0 36 C9 36 13 33 13 27 C13 18 11 4 11 -14"
                stroke="#2a170e"
                strokeWidth="3.4"
                strokeLinejoin="round"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M-3.5 29 v5 M4.5 29 v5"
                stroke="#2a170e"
                strokeWidth="2.4"
                strokeLinejoin="round"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* Tail (pivots independently around 84, 150) */}
            <g
              ref={tailRef}
              data-p="tail"
              transform={`rotate(${curTailAngle.toFixed(2)} 84 150)`}
            >
              <path
                d="M86 152 C80 146 76 140 74 136"
                stroke="#2a170e"
                strokeWidth="9"
                strokeLinejoin="round"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M86 152 C80 146 76 140 74 136"
                stroke="#f2be6b"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M70.0 110.0Q78.1 105.0 80.9 113.7Q90.5 114.8 86.7 123.2Q93.4 129.9 84.7 134.0Q85.2 143.1 75.8 141.0Q70.0 148.3 64.2 141.0Q54.8 143.1 55.3 134.0Q46.6 129.9 53.3 123.2Q49.5 114.8 59.1 113.7Q61.9 105.0 70.0 110.0Z"
                fill="#f2be6b"
                stroke="#2a170e"
                strokeWidth="3.4"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </g>

            {/* Back Near Leg */}
            <g
              data-p="bn"
              transform={`translate(110 194) rotate(${rotBn.toFixed(2)})`}
              opacity={isSit ? '0' : '1'}
            >
              <path
                d="M-15 -14 C-15 4 -12 16 -12 25 C-12 32 -7 34 0 34 C9 34 13 31 13 25 C13 16 15 4 15 -14Z"
                fill="#f2be6b"
              />
              <path
                d="M-15 -14 C-15 4 -12 16 -12 25 C-12 32 -7 34 0 34 C9 34 13 31 13 25 C13 16 15 4 15 -14"
                stroke="#2a170e"
                strokeWidth="3.4"
                strokeLinejoin="round"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M-3.5 27 v5 M4.5 27 v5"
                stroke="#2a170e"
                strokeWidth="2.4"
                strokeLinejoin="round"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* Fluffy Body Silhouette */}
            <path
              d="M76.8 175.6Q69.0 167.9 78.2 160.7Q76.6 151.8 90.3 147.3Q95.2 138.9 110.9 137.9Q121.6 131.3 136.7 134.0Q151.1 130.5 162.9 136.4Q178.7 136.4 185.3 144.5Q199.7 148.2 199.7 157.1Q210.3 163.7 203.9 171.9Q208.7 180.4 197.0 186.3Q195.3 195.2 180.3 198.0Q172.3 205.7 156.6 204.8Q143.7 210.0 130.0 205.6Q114.5 207.4 105.1 200.2Q89.7 198.3 86.3 189.6Q73.6 184.3 76.8 175.6Z"
              fill="#f2be6b"
              stroke="#2a170e"
              strokeWidth="3.4"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              d="M182.7 196.4Q169.4 196.9 166.6 183.0Q156.1 174.1 162.3 161.5Q159.6 147.6 171.9 142.2Q178.2 129.7 191.0 134.0Q203.3 128.7 210.5 140.8Q223.1 145.2 221.3 159.3Q228.4 171.5 218.5 181.0Q216.6 195.1 203.2 195.7Q193.3 205.1 182.7 196.4Z"
              fill="#f2be6b"
              stroke="#2a170e"
              strokeWidth="3.4"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Front Near Leg */}
            <g
              data-p="fn"
              transform={`translate(186 194) rotate(${rotFn.toFixed(2)})`}
            >
              <path
                d="M-12 -14 C-12 4 -12 16 -12 25 C-12 32 -7 34 0 34 C9 34 13 31 13 25 C13 16 12 4 12 -14Z"
                fill="#f2be6b"
              />
              <path
                d="M-12 -14 C-12 4 -12 16 -12 25 C-12 32 -7 34 0 34 C9 34 13 31 13 25 C13 16 12 4 12 -14"
                stroke="#2a170e"
                strokeWidth="3.4"
                strokeLinejoin="round"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M-3.5 27 v5 M4.5 27 v5"
                stroke="#2a170e"
                strokeWidth="2.4"
                strokeLinejoin="round"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          </g>

          {/* Sitting Haunch (visible in sit and bow poses) */}
          <g
            data-p="haunch"
            opacity={isSit || isBow ? '1' : '0'}
            transform="translate(0 1.44)"
          >
            <path
              d="M80.0 204.0Q75.1 194.9 85.7 189.9Q88.4 180.2 100.7 181.2Q110.0 174.6 119.3 181.2Q131.6 180.2 134.3 189.9Q144.9 194.9 140.0 204.0Q144.9 213.1 134.3 218.1Q131.6 227.8 119.3 226.8Q110.0 233.4 100.7 226.8Q88.4 227.8 85.7 218.1Q75.1 213.1 80.0 204.0Z"
              fill="#f2be6b"
              stroke="#2a170e"
              strokeWidth="3.4"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              d="M112 214 C126 212 142 214 146 221 C148 226 144 229 136 229 L116 229 C108 229 104 224 106 219 Z"
              fill="#f2be6b"
              stroke="#2a170e"
              strokeWidth="3.4"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              d="M132 222v5M139 222v5"
              stroke="#2a170e"
              strokeWidth="2.4"
              strokeLinejoin="round"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* Head & Face */}
          <g
            ref={headRef}
            data-p="head"
            transform={`translate(${baseHeadX} ${totalHeadY}) rotate(${headRot} 212 100)`}
            style={
              !autoWag && headAnim.transition
                ? { transition: 'transform 0.38s var(--ease-pounce)' }
                : undefined
            }
          >
            {/* Red Collar & Gold Tag */}
            <path
              d="M178 146 Q212 162 246 146 L246 154 Q212 170 178 154 Z"
              fill="#a24a1a"
              stroke="#2a170e"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              d="M212 160 C212 156 206 155 206 159.4 C206 163 212 166.6 212 168.4 C212 166.6 218 163 218 159.4 C218 155 212 156 212 160 Z"
              fill="#fbe3b4"
              stroke="#2a170e"
              strokeWidth="2.4"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Fluffy Ears */}
            <path
              data-p="earL"
              d="M177.1 78.7Q186.9 70.8 186.6 87.4Q196.0 89.9 189.9 105.5Q195.2 117.3 185.5 126.0Q184.7 142.8 175.2 141.2Q168.7 156.5 162.9 145.3Q153.1 153.2 153.4 136.6Q144.0 134.1 150.1 118.5Q144.8 106.7 154.5 98.0Q155.3 81.2 164.8 82.8Q171.3 67.5 177.1 78.7Z"
              fill="#e4a352"
              stroke="#2a170e"
              strokeWidth="3.4"
              strokeLinejoin="round"
              strokeLinecap="round"
              transform={`rotate(${earLRot} 174 82)`}
            />
            <path
              data-p="earR"
              d="M246.9 78.7Q252.7 67.5 259.2 82.8Q268.7 81.2 269.5 98.0Q279.2 106.7 273.9 118.5Q280.0 134.1 270.6 136.6Q270.9 153.2 261.1 145.3Q255.3 156.5 248.8 141.2Q239.3 142.8 238.5 126.0Q228.8 117.3 234.1 105.5Q228.0 89.9 237.4 87.4Q237.1 70.8 246.9 78.7Z"
              fill="#e4a352"
              stroke="#2a170e"
              strokeWidth="3.4"
              strokeLinejoin="round"
              strokeLinecap="round"
              transform={`rotate(${earRRot} 250 82)`}
            />

            {/* Head Silhouette */}
            <path
              d="M212.0 54.0Q223.4 48.2 231.5 57.5Q244.5 56.1 248.1 67.5Q260.7 70.7 259.1 82.4Q269.4 89.7 263.0 100.0Q269.4 110.3 259.1 117.6Q260.7 129.3 248.1 132.5Q244.5 143.9 231.5 142.5Q223.4 151.8 212.0 146.0Q200.6 151.8 192.5 142.5Q179.5 143.9 175.9 132.5Q163.3 129.3 164.9 117.6Q154.6 110.3 161.0 100.0Q154.6 89.7 164.9 82.4Q163.3 70.7 175.9 67.5Q179.5 56.1 192.5 57.5Q200.6 48.2 212.0 54.0Z"
              fill="#f2be6b"
              stroke="#2a170e"
              strokeWidth="3.4"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Top Forehead Tufts */}
            <path
              d="M195.0 52.0Q190.7 45.8 200.0 43.5Q203.2 36.9 212.0 40.0Q220.8 36.9 224.0 43.5Q233.3 45.8 229.0 52.0Q233.3 58.2 224.0 60.5Q220.8 67.1 212.0 64.0Q203.2 67.1 200.0 60.5Q190.7 58.2 195.0 52.0Z"
              fill="#f2be6b"
              stroke="#2a170e"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Muzzle */}
            <path
              d="M188 120 C188 106 200 100 212 100 C224 100 236 106 236 120 C236 133 225 140 212 140 C199 140 188 133 188 120 Z"
              fill="#fbe3b4"
            />
            {/* Pink Cheeks */}
            <circle cx="181" cy="116" r="7" fill="#f9b9a6" opacity="0.85" />
            <circle cx="243" cy="116" r="7" fill="#f9b9a6" opacity="0.85" />

            {/* Interactive Eyes Group with Pointer Tracking */}
            <g data-p="eyes" ref={eyesRef} transform="translate(0 0)">
              <g data-p="open" ref={openEyesRef} opacity={happyEyes ? "0" : "1"}>
                <g data-p="blink" ref={blinkRef} transform="translate(0 0)">
                  {/* Left & Right Pupils */}
                  <ellipse cx="194" cy="98" rx="7.4" ry="8.6" fill="#2a170e" />
                  <ellipse cx="230" cy="98" rx="7.4" ry="8.6" fill="#2a170e" />
                  {/* Sparkle Highlights */}
                  <circle cx="196.6" cy="94.6" r="2.7" fill="#fff" />
                  <circle cx="232.6" cy="94.6" r="2.7" fill="#fff" />
                  <circle cx="192" cy="101.2" r="1.2" fill="#fff" />
                  <circle cx="228" cy="101.2" r="1.2" fill="#fff" />
                </g>
              </g>
            </g>

            {/* Happy / Petting Eyes & Shut Eyes */}
            <path
              ref={happyEyesRef}
              data-p="happy"
              d="M186.5 101 Q194 91.5 201.5 101 M222.5 101 Q230 91.5 237.5 101"
              stroke="#2a170e"
              strokeWidth="3.4"
              strokeLinejoin="round"
              strokeLinecap="round"
              fill="none"
              opacity={happyEyes ? "1" : "0"}
            />
            <path
              data-p="shut"
              d="M186.5 97 Q194 103.5 201.5 97 M222.5 97 Q230 103.5 237.5 97"
              stroke="#2a170e"
              strokeWidth="3.4"
              strokeLinejoin="round"
              strokeLinecap="round"
              fill="none"
              opacity="0"
            />

            {/* Nose */}
            <path
              d="M204.5 111.5 Q212 107.2 219.5 111.5 Q218.2 118.4 212 120 Q205.8 118.4 204.5 111.5 Z"
              fill="#2a170e"
            />
            {/* Mouth */}
            <path
              d="M212 120 V124.5 M212 124.5 Q207.2 129.6 202.8 125.2 M212 124.5 Q216.8 129.6 221.2 125.2"
              stroke="#2a170e"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
              fill="none"
            />
            {/* Tongue */}
            <path
              data-p="tongue"
              d="M207.6 127.4 Q212 136.6 216.4 127.4 Z"
              fill="#e98c8c"
              stroke="#2a170e"
              strokeWidth="2.2"
              strokeLinejoin="round"
              opacity={isSnug ? '0' : '1'}
            />
          </g>

          {/* Quilt / Basket Ledge Paws (visible in peek and snug poses) */}
          <g data-p="ledge" opacity={isPeek || isSnug ? '1' : '0'}>
            <path
              d="M175 159 C175 148 181 142 190 142 C199 142 205 148 205 159 Z M219 159 C219 148 225 142 234 142 C243 142 249 148 249 159 Z"
              fill="#f2be6b"
              stroke="#2a170e"
              strokeWidth="3.4"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              d="M186 153 v-4.5 M194 153 v-4.5 M230 153 v-4.5 M238 153 v-4.5"
              stroke="#2a170e"
              strokeWidth="2.4"
              strokeLinejoin="round"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        </g>
      </svg>

      {!onSay && (
        <span
          aria-hidden="true"
          className="pup-bubble"
          data-show={bubbleVisible ? 'true' : 'false'}
        >
          {bubbleText}
        </span>
      )}
    </div>
  );
}
