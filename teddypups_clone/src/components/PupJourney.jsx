import { useEffect, useRef, useState, useCallback } from 'react';
import InteractiveTeddy from './InteractiveTeddy';

const PIVOT = { x: 150, y: 228 };
const DEFAULT_BOX = [48, 30, 288, 236];
const POSE_BOXES = {
  sit: [50, 26, 284, 234],
  peek: [148, 34, 280, 163],
  snug: [148, 40, 280, 163],
  bow: [58, 56, 292, 236],
};
const getBox = (pose) => POSE_BOXES[pose] || DEFAULT_BOX;

const M_SPAN = [0.6, 0.86];
const E_SPAN = [0.42, 0.78];

function clamp01(v) {
  return Math.min(1, Math.max(0, v));
}

function smoothstep(v) {
  return v * v * (3 - 2 * v);
}

function smootherstep(v) {
  return v * v * v * (v * (6 * v - 15) + 10);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function uStep(e, t, a) {
  return t === e ? +(a >= t) : smoothstep(clamp01((a - e) / (t - e)));
}

function lerpBox(b1, b2, t) {
  return [
    lerp(b1[0], b2[0], t),
    lerp(b1[1], b2[1], t),
    lerp(b1[2], b2[2], t),
    lerp(b1[3], b2[3], t),
  ];
}

function bezierPoint(p0, c1, c2, p1, t) {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const t2 = t * t;
  return {
    x: mt2 * mt * p0.x + 3 * mt2 * t * c1.x + 3 * mt * t2 * c2.x + t2 * t * p1.x,
    y: mt2 * mt * p0.y + 3 * mt2 * t * c1.y + 3 * mt * t2 * c2.y + t2 * t * p1.y,
  };
}

function getCubicControls(p0, p1, safe) {
  const dx = p1.x - p0.x;
  const n = safe.right - safe.left;
  const l = Math.max(0.45 * Math.abs(dx), 0);
  const r = dx >= 0 ? 1 : -1;
  let c1 = { x: p0.x + r * l, y: p0.y };
  let c2 = { x: p1.x - r * l, y: p1.y };
  const d = 0.14 * n;
  if (Math.abs(dx) < d) {
    const push =
      ((p0.x + p1.x) / 2 < (safe.left + safe.right) / 2 ? 1 : -1) *
      (d - Math.abs(dx)) *
      0.9;
    c1 = { x: c1.x + push, y: lerp(p0.y, p1.y, 0.2) };
    c2 = { x: c2.x + push, y: lerp(p0.y, p1.y, 0.8) };
  }
  const clampPt = (pt) => ({
    x: Math.min(safe.right, Math.max(safe.left, pt.x)),
    y: Math.min(safe.bottom, Math.max(safe.top, pt.y)),
  });
  return { p0, c1: clampPt(c1), c2: clampPt(c2), p1 };
}

const softMax = (e, t, a = 8) => {
  const s = (e - t) / a;
  return s > 20 ? e : t + a * Math.log1p(Math.exp(s));
};
const softMin = (e, t, a = 8) => -softMax(-e, -t, a);

function clampActorSafe(cx, cy, scale, box, safe, l = 8) {
  const r = (PIVOT.x - box[0]) * scale;
  const i = (box[2] - PIVOT.x) * scale;
  const o = (PIVOT.y - box[1]) * scale;
  const c = (box[3] - PIVOT.y) * scale;

  let x = cx;
  if (safe.right - safe.left > r + i) {
    x = softMin(softMax(cx, safe.left + r, l), safe.right - i, l);
  } else {
    x = (safe.left + safe.right) / 2 - (i - r) / 2;
  }

  let y = cy;
  if (safe.bottom - safe.top > o + c) {
    y = softMin(softMax(cy, safe.top + o, l), safe.bottom - c, l);
  } else {
    y = safe.bottom - c;
  }

  return { x, y };
}

function getScreenAnchor(stop, scrollY) {
  const tr = stop.track;
  let trackScreenY;
  if (tr.kind === 'page') {
    trackScreenY = tr.top - scrollY;
  } else if (tr.kind === 'screen') {
    trackScreenY = tr.top;
  } else {
    // kind === 'pin'
    if (scrollY < tr.from) {
      trackScreenY = tr.top - (scrollY - tr.from);
    } else if (scrollY > tr.to) {
      trackScreenY = tr.top - (scrollY - tr.to);
    } else {
      trackScreenY = tr.top;
    }
  }
  let anchorX = stop.x + PIVOT.x * stop.s;
  if (stop.isMeet && tr.kind === 'pin' && tr.to > tr.from) {
    const meetProg = clamp01((scrollY - tr.from) / (tr.to - tr.from));
    anchorX = lerp(stop.startX, stop.endX, meetProg);
  }

  return {
    x: anchorX,
    y: trackScreenY + PIVOT.y * stop.s,
  };
}

function findHold(holds, scrollY) {
  if (!holds.length || scrollY <= holds[0][1]) return { k: 0, t: 0 };
  for (let a = 0; a < holds.length - 1; a++) {
    const s = holds[a][1];
    const n = holds[a + 1][0];
    if (scrollY < n) return { k: a, t: clamp01((scrollY - s) / Math.max(1, n - s)) };
    if (scrollY <= holds[a + 1][1]) return { k: a + 1, t: 0 };
  }
  return { k: holds.length - 1, t: 0 };
}

function finalizeHolds(holds, stops, maxScroll, isMobile) {
  const s = (idx) => {
    const cur = stops[idx];
    const nxt = stops[idx + 1];
    if (!nxt) return 0;
    const l = (E_SPAN[1] - E_SPAN[0]) * window.innerHeight;
    const r = (isMobile ? 0.32 : 0.5) * window.innerHeight;
    return Math.min(
      1.4 * window.innerHeight,
      Math.max(r, 1.15 * Math.hypot(Math.abs(nxt.x + PIVOT.x * nxt.s - (cur.x + PIVOT.x * cur.s)), l))
    );
  };

  const n = holds.map((h) => (h[0] <= h[1] ? [h[0], h[1]] : [(h[0] + h[1]) / 2, (h[0] + h[1]) / 2]));
  if (!n.length) return n;

  n[0][0] = -Infinity;
  const last = n[n.length - 1];
  last[1] = Infinity;
  last[0] = Math.min(last[0], maxScroll - 1);

  for (let i = 0; i < n.length - 1; i++) {
    const cur = n[i];
    const nxt = n[i + 1];
    if (nxt[0] < cur[1]) {
      const mid = (cur[1] + nxt[0]) / 2;
      cur[1] = Math.max(cur[0], mid);
      nxt[0] = Math.min(nxt[1], mid);
      if (nxt[0] < cur[1]) nxt[0] = cur[1];
    }
    const needed = s(i) - (nxt[0] - cur[1]);
    if (needed > 0) {
      let shrinkCur = Math.min(needed / 2, cur[1] - cur[0]);
      let shrinkNxt = Math.min(needed / 2, nxt[1] - nxt[0]);
      cur[1] -= shrinkCur;
      nxt[0] += shrinkNxt;
      let rem = needed - (shrinkCur + shrinkNxt);
      let addNxt = Math.min(rem, nxt[1] - nxt[0]);
      nxt[0] += addNxt;
      rem -= addNxt;
      if (rem > 0) {
        cur[1] -= Math.min(rem, cur[1] - cur[0]);
      }
    }
  }

  for (const h of n) {
    if (h[1] < h[0]) h[1] = h[0];
  }

  return n;
}

function evalActorState(B, scrollY) {
  const { stops, holds, safe, blend } = B;
  const { k: P, t: B_t } = findHold(holds, scrollY);

  if (B_t <= 0 || P >= stops.length - 1) {
    const stop = stops[P];
    const rawPos = getScreenAnchor(stop, scrollY);
    const clamped = clampActorSafe(rawPos.x, rawPos.y, stop.s, stop.box, safe);
    return {
      x: clamped.x,
      y: clamped.y,
      s: stop.s,
      front: !stop.behind,
      airborne: false,
      k: P,
      t: 0,
    };
  }

  const stopA = stops[P];
  const stopB = stops[P + 1];
  const holdEndA = holds[P][1];
  const holdStartB = holds[P + 1][0];
  const span = Math.max(1, holdStartB - holdEndA);
  const v = clamp01((scrollY - holdEndA) / span);

  const anchorA = getScreenAnchor(stopA, holdEndA);
  const anchorB = getScreenAnchor(stopB, holdStartB);

  const p0 = { x: anchorA.x, y: anchorA.y - stopA.sink * stopA.s };
  const p1 = { x: anchorB.x, y: anchorB.y - stopB.sink * stopB.s };

  const curve = getCubicControls(p0, p1, safe);
  const w = smootherstep(v);
  const bezierPt = bezierPoint(curve.p0, curve.c1, curve.c2, curve.p1, w);

  const scale = lerp(stopA.s, stopB.s, smoothstep(clamp01(v / 0.65)));

  const blendSpan = Math.min(0.3, Math.max(0.06, blend / span));
  const S = 1 - uStep(0, blendSpan, v);
  const T = uStep(1 - blendSpan, 1, v);

  let L = bezierPt.y + S * (getScreenAnchor(stopA, scrollY).y - anchorA.y) + T * (getScreenAnchor(stopB, scrollY).y - anchorB.y);
  let C = bezierPt.x;

  L += stopA.sink * stopA.s * (1 - uStep(0, 0.22, v)) + stopB.sink * stopB.s * uStep(0.78, 1, v);

  let airborne = false;
  if (stopA.behind && v < 0.36) {
    L -= Math.sin((v / 0.36) * Math.PI) * Math.min(64 * stopA.s, 72);
    airborne = v < 0.32;
  }
  if (stopB.behind && v > 0.68) {
    L -= Math.sin(((v - 0.68) / 0.32) * Math.PI) * Math.min(56 * stopB.s, 60);
    airborne = true;
  }
  if (stopA.sink && v < 0.2) {
    airborne = true;
  }

  const front = !( (stopA.behind && v < 0.12) || (stopB.behind && v > 0.92) );

  const boxT = v < 0.5
    ? lerpBox(stopA.box, DEFAULT_BOX, uStep(0, stopA.sink ? 0.22 : stopA.behind ? 0.36 : 0.06, v))
    : lerpBox(DEFAULT_BOX, stopB.box, uStep(stopB.sink ? 0.78 : stopB.behind ? 0.68 : 0.94, 1, v));

  const clamped = clampActorSafe(C, L, scale, boxT, safe);

  return {
    x: clamped.x,
    y: clamped.y,
    s: scale,
    front,
    airborne,
    k: P,
    t: v,
  };
}

/**
 * Global helper to send voice/reaction cue to traveling puppy
 */
export function cuePup(detail) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('pup:cue', { detail }));
  }
}

/**
 * PupJourney
 * Single continuous puppy journey across the entire page.
 */
export default function PupJourney() {
  const [journeyState, setJourneyState] = useState(() => ({
    active: false,
    x: 0,
    y: 0,
    scale: 1,
    pose: 'peek',
    facing: 1,
    walkPhase: 0,
    stride: 0,
    front: true,
    holding: true,
  }));

  const [bubble, setBubble] = useState({ text: '', show: false });
  const bubbleRef = useRef(bubble);
  useEffect(() => {
    bubbleRef.current = bubble;
  }, [bubble]);
  const bubbleTimerRef = useRef(null);

  const say = useCallback((text, durationMs = 1500) => {
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    setBubble({ text, show: true });
    bubbleTimerRef.current = setTimeout(() => {
      setBubble((prev) => ({ ...prev, show: false }));
    }, durationMs);
  }, []);

  useEffect(() => {
    const handleCue = (e) => {
      if (e.detail?.say) {
        say(e.detail.say, (e.detail.secs || 1.5) * 1000);
      }
    };
    window.addEventListener('pup:cue', handleCue);
    return () => window.removeEventListener('pup:cue', handleCue);
  }, [say]);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    // Set data-pup="live" on <html> to hide static fallback puppies
    document.documentElement.setAttribute('data-pup', 'live');

    let rafId = null;
    let journeyData = null;
    let lastX = 0;
    let lastY = 0;
    let currentFacing = 1;
    let targetFacing = 1;
    let currentWalkPhase = 0;
    let currentStride = 0;
    let targetStride = 0;
    let lastTime = performance.now() / 1000;
    let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    let meetScrollingUntil = 0;

    function scanJourney() {
      const isMobile = window.matchMedia('(max-width: 767px), (pointer: coarse) and (max-height: 519px)').matches;
      const docW = document.documentElement.clientWidth;
      const docH = window.innerHeight;
      const headerH = document.getElementById('site-header')?.offsetHeight ?? 76;
      const whatsappBar = document.querySelector('[data-whatsapp-bar]');
      const whatsappH = whatsappBar?.getClientRects().length ? whatsappBar.getBoundingClientRect().height : 0;

      const safe = {
        left: 10,
        top: headerH + 10,
        right: docW - 10,
        bottom: docH - 10 - whatsappH,
      };

      const stopEls = Array.from(document.querySelectorAll('[data-pup-stop]')).filter(
        (el) => el.getClientRects().length > 0
      );

      if (stopEls.length < 2) return;

      const stops = [];
      const meta = [];
      const initialHolds = [];

      stopEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const pose = el.dataset.pose || 'sit';
        const act = el.dataset.act || '';
        const rawScale = rect.width / 300;
        const s = act === 'basket' || isMobile ? rawScale : 1.12 * rawScale;
        const pivot = pose === 'peek' ? { x: 150, y: 159 } : PIVOT;

        // Sticky parent detection
        let stickyParent = null;
        let curr = el.parentElement;
        while (curr && curr !== document.body) {
          if (window.getComputedStyle(curr).position === 'sticky') {
            stickyParent = curr;
            break;
          }
          curr = curr.parentElement;
        }

        let track;
        if (!stickyParent) {
          track = { kind: 'page', top: rect.top + window.scrollY };
        } else {
          const stickyTop = parseFloat(window.getComputedStyle(stickyParent).top) || 0;
          const relY = rect.top - stickyParent.getBoundingClientRect().top;
          const savedPos = stickyParent.style.position;
          stickyParent.style.position = 'relative';
          const stickyRect = stickyParent.getBoundingClientRect();
          const pEl = stickyParent.parentElement;
          const pBottom = pEl.getBoundingClientRect().bottom - (parseFloat(window.getComputedStyle(pEl).paddingBottom) || 0);
          stickyParent.style.position = savedPos;

          const from = stickyRect.top + window.scrollY - stickyTop;
          const to = pBottom + window.scrollY - stickyRect.height - stickyTop;

          if (to <= from) {
            track = { kind: 'page', top: stickyRect.top + window.scrollY + relY };
          } else {
            track = { kind: 'pin', top: stickyTop + relY, from, to };
          }
        }

        if (track.kind !== 'screen') {
          track.top += pivot.y * (rawScale - s);
        }

        const isMeet = el.classList.contains('tp-meet__teddy') || act === 'treadmill';
        const startX = rect.left + pivot.x * (rawScale - s) + PIVOT.x * s;
        const endX = Math.max(startX + 120, docW - startX);

        const stop = {
          x: rect.left + pivot.x * (rawScale - s),
          track,
          s,
          behind: el.dataset.behind === 'true',
          sink: 0,
          box: getBox(pose),
          isMeet,
          startX,
          endX,
        };

        const scene = el.closest('[data-pup-scene]');
        stops.push(stop);
        meta.push({
          scene,
          pose,
          facing: el.dataset.facing === 'left' ? -1 : 1,
          act,
          isMeet,
        });

        // Compute initial hold range
        let holdRange;
        if (track.kind === 'pin') {
          holdRange = [track.from, track.to];
        } else {
          const span = isMobile ? M_SPAN : E_SPAN;
          const sTop = track.top;
          const n = sTop + stop.box[1] * stop.s;
          const l = sTop + stop.box[3] * stop.s;
          const r = (n + l) / 2;
          const iH = safe.bottom - safe.top;
          let o = r - (safe.top + span[1] * iH);
          let d = r - (safe.top + span[0] * iH);
          o = Math.max(o, l - safe.bottom);
          if (o > (d = Math.min(d, n - safe.top))) {
            o = d = r - (safe.top + iH / 2);
          }
          holdRange = [o, d];
        }

        if (!isMobile && scene && track.kind === 'page' && act !== 'basket' && act !== 'peekaboo') {
          const safeH = safe.bottom - safe.top;
          const sceneTop = scene.getBoundingClientRect().top + window.scrollY - safe.top + 0.08 * safeH;
          const stopBottom = track.top + stop.box[3] * stop.s - safe.bottom;
          if (holdRange[1] > sceneTop) {
            const sVal = Math.max(sceneTop, stopBottom + 0.12 * safeH);
            holdRange = [Math.max(stopBottom, sVal - Math.max(holdRange[1] - holdRange[0], 0.2 * safeH)), sVal];
          }
        }

        initialHolds.push(holdRange);
      });

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const holds = finalizeHolds(initialHolds, stops, maxScroll, isMobile);

      journeyData = {
        lane: isMobile,
        stops,
        meta,
        holds,
        safe,
        blend: 0.12 * window.innerHeight,
      };

      if (typeof window !== 'undefined') {
        window.__pupDebug = journeyData;
      }
    }

    function tick() {
      const now = performance.now() / 1000;
      const dt = Math.min(0.05, Math.max(0.001, now - lastTime));
      lastTime = now;

      if (!journeyData || journeyData.stops.length < 2) {
        scanJourney();
      }

      if (journeyData && journeyData.stops.length >= 2) {
        const scrollY = window.scrollY;
        const scrollDelta = scrollY - lastScrollY;
        lastScrollY = scrollY;

        const evalState = evalActorState(journeyData, scrollY);
        const { k, t, x, y, s, front, airborne } = evalState;
        const isHolding = t === 0;

        let pose = 'sit';

        if (isHolding) {
          const m = journeyData.meta[k];
          const sObj = journeyData.stops[k];

          if (sObj.isMeet) {
            if (bubbleRef.current?.show) {
              setBubble({ text: '', show: false });
            }
            // Meet the Pup section scroll-linked walking:
            // Down: walk left to right (face right)
            // Up:   walk right to left (face left)
            if (scrollDelta > 0.3) {
              targetFacing = 1;
              targetStride = 1;
              meetScrollingUntil = now + 0.18;
            } else if (scrollDelta < -0.3) {
              targetFacing = -1;
              targetStride = 1;
              meetScrollingUntil = now + 0.18;
            } else if (now > meetScrollingUntil) {
              targetStride = 0;
            }

            pose = targetStride > 0.05 ? 'walk' : 'stand';
          } else {
            pose = m.pose;
            targetFacing = m.facing;
            targetStride = 0;
          }
        } else {
          pose = airborne ? 'hop' : 'walk';
          targetStride = airborne ? 0 : 1;

          // Flip facing direction based on travel vector
          const dx = x - lastX;
          if (dx < -0.8) {
            targetFacing = -1;
          } else if (dx > 0.8) {
            targetFacing = 1;
          }
        }

        // Advance walk cycle based on travel distance
        const movedDist = Math.hypot(x - lastX, y - lastY);
        if (movedDist > 0.05) {
          currentWalkPhase += (movedDist / (46 * Math.max(0.2, s))) * Math.PI;
        }

        currentFacing += (targetFacing - currentFacing) * Math.min(1, dt * 10);
        currentStride += (targetStride - currentStride) * Math.min(1, dt * 12);

        lastX = x;
        lastY = y;

        const renderX = x - PIVOT.x * s;
        const renderY = y - PIVOT.y * s;

        setJourneyState({
          active: true,
          x: renderX,
          y: renderY,
          scale: s,
          pose,
          facing: currentFacing,
          walkPhase: currentWalkPhase,
          stride: currentStride,
          front,
          holding: isHolding,
        });

        // Update scene attributes for progress and entrance triggers
        journeyData.meta.forEach((m, idx) => {
          if (m.scene) {
            const isHere = isHolding && idx === k;
            const isVisited = idx <= k;
            if (m.scene.getAttribute('data-here') !== String(isHere)) {
              m.scene.setAttribute('data-here', String(isHere));
            }
            if (m.scene.getAttribute('data-visited') !== String(isVisited)) {
              m.scene.setAttribute('data-visited', String(isVisited));
            }
          }
        });
      }

      rafId = requestAnimationFrame(tick);
    }

    scanJourney();
    rafId = requestAnimationFrame(tick);

    const handleResize = () => {
      scanJourney();
    };

    const resizeObserver = new ResizeObserver(() => {
      scanJourney();
    });
    resizeObserver.observe(document.body);

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    document.fonts?.ready.then(scanJourney);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      document.documentElement.removeAttribute('data-pup');
      if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    };
  }, [say]);

  if (!journeyState.active) return null;

  return (
    <div
      aria-hidden="true"
      className="pup-layer"
      data-front={journeyState.front ? 'true' : 'false'}
    >
      <div
        className="pup-actor"
        data-holding={journeyState.holding ? 'true' : 'false'}
        style={{
          transform: `translate3d(${journeyState.x.toFixed(1)}px, ${journeyState.y.toFixed(1)}px, 0)`,
        }}
      >
        <div
          className="pup-actor__body"
          style={{
            transform: `scale(${journeyState.scale.toFixed(3)})`,
            transformOrigin: '0 0',
          }}
        >
          <InteractiveTeddy
            pose={journeyState.pose}
            facing={journeyState.facing}
            walkPhase={journeyState.walkPhase}
            stride={journeyState.stride}
            enableEyeTracking={journeyState.pose === 'peek'}
            interactive={journeyState.holding}
            peekabooIntro={false}
            autoWag={true}
            onSay={say}
          />
        </div>
        <span
          className="pup-bubble-at"
          style={{
            transform: `translate(${(journeyState.facing > 0 ? 214 : 300 - 214) * journeyState.scale}px, ${30 * journeyState.scale}px)`,
          }}
        >
          <span
            className="pup-bubble"
            data-show={bubble.show ? 'true' : 'false'}
          >
            {bubble.text}
          </span>
        </span>
      </div>
    </div>
  );
}
