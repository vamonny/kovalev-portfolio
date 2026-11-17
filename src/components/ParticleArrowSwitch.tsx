import React, { useEffect, useRef, useState, useCallback } from 'react';

interface ParticleArrowSwitchProps {
  /** Controlled activation state (true = slid to right / entered) */
  activated: boolean;
  /** Called when the user slides past threshold or clicks to enter */
  onActivate: () => void;
  /** Reports 0..1 eased progress so the parent backdrop can morph smoothly in sync */
  onProgressChange?: (progress: number) => void;
  /** Called on hover for tactile sound cue */
  onHover?: () => void;
  /** Accessible label */
  ariaLabel?: string;
}

interface DotParticle {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  burstAngle: number;
  burstForce: number;
  swirlDir: number;
  assembleDelay: number;
  sizeSeed: number;
  isAccent: boolean;
}

// Perfectly concentric squircle geometry:
// R_outer (38px) = R_thumb (29px) + PADDING (9px)
const TRACK_W = 224;
const TRACK_H = 122;
const PADDING = 9;
const TRACK_RADIUS = 38;
const THUMB_SIZE = TRACK_H - PADDING * 2; // 104px
const THUMB_RADIUS = TRACK_RADIUS - PADDING; // 29px
const MAX_TRAVEL = TRACK_W - PADDING * 2 - THUMB_SIZE; // 102px
const CELL = 3.1;

const SOURCE_ARROW_GRID = [
  '...............',
  '...............',
  '.......##......',
  '........##.....',
  '.........##....',
  '..........##...',
  '..###########..',
  '..############.',
  '..###########..',
  '..........##...',
  '.........##....',
  '........##.....',
  '.......##......',
  '...............',
  '...............',
];

const TARGET_ARROW_GRID = [
  '...............',
  '...............',
  '.....#########.',
  '......########.',
  '.......#######.',
  '..........####.',
  '.........#####.',
  '........##.###.',
  '.......##...##.',
  '......##.....#.',
  '.....##........',
  '....##.........',
  '...##..........',
  '...............',
  '...............',
];

function extractGridCoords(grid: string[]): Array<{ gx: number; gy: number }> {
  const pts: Array<{ gx: number; gy: number }> = [];
  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    for (let x = 0; x < row.length; x++) {
      if (row[x] === '#') {
        pts.push({ gx: x - 7, gy: y - 7 });
      }
    }
  }
  return pts;
}

function seededNoise(i: number, salt: number): number {
  const x = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function createParticles(): DotParticle[] {
  const src = extractGridCoords(SOURCE_ARROW_GRID);
  const dst = extractGridCoords(TARGET_ARROW_GRID);
  const count = Math.max(src.length, dst.length);
  const particles: DotParticle[] = [];

  for (let i = 0; i < count; i++) {
    const s = src[i % src.length];
    const d = dst[i % dst.length];
    const n1 = seededNoise(i, 1);
    const n2 = seededNoise(i, 2);
    const n3 = seededNoise(i, 3);
    const n4 = seededNoise(i, 4);

    // Order assembly gently from core outward + slight left-to-right sweep
    const distFromCenter = Math.hypot(d.gx, d.gy) / 7;
    const assembleDelay = clamp(distFromCenter * 0.22 + n4 * 0.18, 0, 0.36);

    particles.push({
      sx: s.gx * CELL,
      sy: s.gy * CELL,
      tx: d.gx * CELL,
      ty: d.gy * CELL,
      x: s.gx * CELL,
      y: s.gy * CELL,
      vx: 0,
      vy: 0,
      burstAngle: n1 * Math.PI * 2,
      burstForce: 150 + n2 * 210,
      swirlDir: n3 > 0.5 ? 1 : -1,
      assembleDelay,
      sizeSeed: 0.72 + n1 * 0.54,
      isAccent: n2 > 0.64,
    });
  }

  return particles;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function mixRgb(c1: [number, number, number], c2: [number, number, number], t: number): string {
  const r = Math.round(lerp(c1[0], c2[0], t));
  const g = Math.round(lerp(c1[1], c2[1], t));
  const b = Math.round(lerp(c1[2], c2[2], t));
  return `rgb(${r}, ${g}, ${b})`;
}

export function ParticleArrowSwitch({
  activated,
  onActivate,
  onProgressChange,
  onHover,
  ariaLabel = 'Enter portfolio',
}: ParticleArrowSwitchProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const glowSpillRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const cushionRef = useRef<HTMLDivElement>(null);
  const neonOuterRef = useRef<SVGRectElement>(null);
  const neonMidRef = useRef<SVGRectElement>(null);
  const neonCoreRef = useRef<SVGRectElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [dragging, setDragging] = useState(false);

  const particlesRef = useRef<DotParticle[]>(createParticles());
  const hoveredRef = useRef(false);
  const draggingRef = useRef(false);
  const activatedRef = useRef(activated);
  const progressRef = useRef(activated ? 1 : 0);
  const targetProgressRef = useRef(activated ? 1 : 0);
  const velocityRef = useRef(0);
  const prevThumbXRef = useRef(0);
  const orbitPosRef = useRef(84.5);
  const activateTimeRef = useRef<number | null>(null);
  const burstFiredRef = useRef(false);
  const lastReportedRef = useRef(-1);

  const dragStateRef = useRef<{
    active: boolean;
    pointerId: number;
    startX: number;
    startProgress: number;
    moved: boolean;
  }>({
    active: false,
    pointerId: -1,
    startX: 0,
    startProgress: 0,
    moved: false,
  });

  const onProgressRef = useRef(onProgressChange);
  onProgressRef.current = onProgressChange;

  const fireParticleBurst = useCallback((strength = 1) => {
    const dots = particlesRef.current;
    for (let i = 0; i < dots.length; i++) {
      const dot = dots[i];
      const angle = dot.burstAngle + (Math.random() - 0.5) * 0.45;
      const tangential = angle + (Math.PI / 2) * dot.swirlDir;
      const spd = dot.burstForce * strength;
      dot.vx += Math.cos(angle) * spd * 0.72 + Math.cos(tangential) * spd * 0.45 - 65 * strength;
      dot.vy += Math.sin(angle) * spd * 0.72 + Math.sin(tangential) * spd * 0.45;
    }
  }, []);

  const applyVisualDom = useCallback((p: number, speedNorm: number, orbitPct: number) => {
    const cp = clamp(p, 0, 1);
    const thumbX = p * MAX_TRAVEL;
    const warmMix = clamp((cp - 0.14) / 0.62, 0, 1);
    const hovered = hoveredRef.current;
    const isDragging = draggingRef.current;

    // Tactile liquid-ceramic squash & stretch while gliding
    const baseScale = isDragging ? 0.96 : hovered && !activatedRef.current ? 1.02 : 1;
    const stretchX = baseScale * (1 + speedNorm * 0.055);
    const stretchY = baseScale * (1 - speedNorm * 0.038);

    // Dynamic Neon Edge Arc orbiting continuously around all 4 sides/corners
    const arcBoost = speedNorm * 14;
    const outerLen = 28 + arcBoost;
    const midLen = 24 + arcBoost * 0.9;
    const coreLen = 15 + arcBoost * 0.75;

    const sweepStart = (orbitPct + cp * 58) % 100;
    const outerDashOffset = -sweepStart;
    const midDashOffset = -(sweepStart + (outerLen - midLen) * 0.5);
    const coreDashOffset = -(sweepStart + (outerLen - coreLen) * 0.5);

    // Exact directional angle (radians) of the glowing arc center on the squircle
    const centerPct = (sweepStart + outerLen * 0.5) % 100;
    const theta = ((centerPct - 6.25) / 100) * Math.PI * 2 - Math.PI / 2;
    const gx = 50 + Math.cos(theta) * 42;
    const gy = 50 + Math.sin(theta) * 42;

    const track = trackRef.current;
    if (track) {
      const topR = Math.round(lerp(4, 204, cp));
      const topG = Math.round(lerp(5, 203, cp));
      const topB = Math.round(lerp(8, 196, cp));
      const botR = Math.round(lerp(11, 229, cp));
      const botG = Math.round(lerp(12, 228, cp));
      const botB = Math.round(lerp(17, 221, cp));
      track.style.background = `linear-gradient(180deg, rgb(${topR}, ${topG}, ${topB}) 0%, rgb(${botR}, ${botG}, ${botB}) 100%)`;

      track.style.boxShadow =
        cp < 0.5
          ? `inset 0 11px 24px rgba(0, 0, 0, 0.96), inset 0 2px 6px rgba(0, 0, 0, 0.9), inset 0 -1px 2px rgba(255, 255, 255, 0.06), 0 1px 0 rgba(255, 255, 255, 0.04), 0 22px 54px -12px rgba(0, 0, 0, 0.95)`
          : `inset 0 7px 16px rgba(11, 11, 11, ${lerp(0.45, 0.16, cp)}), inset 0 -3px 8px rgba(255, 255, 255, ${lerp(
              0.15,
              0.9,
              cp
            )}), 0 14px 36px -12px rgba(11, 11, 11, 0.18)`;
    }

    const spill = glowSpillRef.current;
    if (spill) {
      spill.style.left = `${PADDING + thumbX - 12}px`;
      spill.style.background =
        warmMix < 0.35
          ? `radial-gradient(circle at ${gx.toFixed(1)}% ${gy.toFixed(1)}%, rgba(44, 102, 255, ${
              hovered ? 0.62 : 0.46
            }) 0%, rgba(28, 68, 210, 0.18) 38%, transparent 72%)`
          : `radial-gradient(circle at ${gx.toFixed(1)}% ${gy.toFixed(1)}%, rgba(255, 118, 0, ${
              0.58 * warmMix
            }) 0%, rgba(255, 168, 42, ${0.24 * warmMix}) 42%, transparent 74%)`;
    }

    const thumb = thumbRef.current;
    if (thumb) {
      thumb.style.transform = `translate3d(${thumbX.toFixed(2)}px, 0, 0) scale(${stretchX.toFixed(
        4
      )}, ${stretchY.toFixed(4)})`;
      if (p < 0.45) {
        const k = p / 0.45;
        const c1r = Math.round(lerp(28, 164, k));
        const c1g = Math.round(lerp(31, 160, k));
        const c1b = Math.round(lerp(42, 152, k));
        const c2r = Math.round(lerp(10, 118, k));
        const c2g = Math.round(lerp(11, 114, k));
        const c2b = Math.round(lerp(16, 110, k));
        thumb.style.background = `linear-gradient(145deg, rgb(${c1r}, ${c1g}, ${c1b}) 0%, rgb(${c2r}, ${c2g}, ${c2b}) 100%)`;
      } else {
        thumb.style.background = `linear-gradient(145deg, #FFFFFF 0%, #F5F3EC 62%, rgba(255, 224, 174, ${
          0.7 + warmMix * 0.3
        }) 100%)`;
      }

      thumb.style.boxShadow =
        warmMix < 0.35
          ? `0 14px 28px -4px rgba(0, 0, 0, 0.94), inset 0 1px 1px rgba(255, 255, 255, 0.16), inset 0 -3px 6px rgba(0, 0, 0, 0.72)`
          : `0 14px 28px -6px rgba(18, 12, 6, 0.28), inset 0 2px 2px rgba(255, 255, 255, 0.98), inset 0 -3px 8px rgba(255, 148, 42, 0.25)`;
    }

    const cushion = cushionRef.current;
    if (cushion) {
      cushion.style.background =
        warmMix < 0.35
          ? `radial-gradient(circle at ${gx.toFixed(1)}% ${gy.toFixed(1)}%, rgba(92, 142, 255, 0.28), transparent 54%)`
          : `radial-gradient(circle at ${gx.toFixed(1)}% ${gy.toFixed(1)}%, rgba(255, 158, 44, 0.42), transparent 58%)`;
    }

    const outerColor = mixRgb([36, 98, 255], [255, 108, 0], warmMix);
    const midColor = mixRgb([124, 174, 255], [255, 178, 52], warmMix);

    if (neonOuterRef.current) {
      neonOuterRef.current.style.strokeDasharray = `${outerLen.toFixed(1)} ${(100 - outerLen).toFixed(1)}`;
      neonOuterRef.current.style.strokeDashoffset = `${outerDashOffset.toFixed(2)}`;
      neonOuterRef.current.style.stroke = outerColor;
      neonOuterRef.current.style.opacity = `${clamp(0.82 + speedNorm * 0.18, 0.82, 1)}`;
    }
    if (neonMidRef.current) {
      neonMidRef.current.style.strokeDasharray = `${midLen.toFixed(1)} ${(100 - midLen).toFixed(1)}`;
      neonMidRef.current.style.strokeDashoffset = `${midDashOffset.toFixed(2)}`;
      neonMidRef.current.style.stroke = midColor;
    }
    if (neonCoreRef.current) {
      neonCoreRef.current.style.strokeDasharray = `${coreLen.toFixed(1)} ${(100 - coreLen).toFixed(1)}`;
      neonCoreRef.current.style.strokeDashoffset = `${coreDashOffset.toFixed(2)}`;
    }
  }, []);

  useEffect(() => {
    activatedRef.current = activated;
    if (activated) {
      targetProgressRef.current = 1;
      if (activateTimeRef.current === null) {
        activateTimeRef.current = performance.now() * 0.001;
      }
      if (!burstFiredRef.current) {
        burstFiredRef.current = true;
        fireParticleBurst(1.1);
      }
    } else if (!dragStateRef.current.active) {
      progressRef.current = 0;
      targetProgressRef.current = 0;
      velocityRef.current = 0;
      prevThumbXRef.current = 0;
      orbitPosRef.current = 84.5;
      activateTimeRef.current = null;
      burstFiredRef.current = false;
      lastReportedRef.current = -1;
      const dots = particlesRef.current;
      for (let i = 0; i < dots.length; i++) {
        dots[i].x = dots[i].sx;
        dots[i].y = dots[i].sy;
        dots[i].vx = 0;
        dots[i].vy = 0;
      }
      applyVisualDom(0, 0, orbitPosRef.current);
      onProgressRef.current?.(0);
    }
  }, [activated, applyVisualDom, fireParticleBurst]);

  useEffect(() => {
    let raf = 0;
    let lastTime = performance.now();

    const stepAndDrawParticles = (
      p: number,
      thumbDx: number,
      dt: number,
      nowSec: number
    ) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      const size = THUMB_SIZE;
      const targetPx = Math.round(size * dpr);
      if (canvas.width !== targetPx || canvas.height !== targetPx) {
        canvas.width = targetPx;
        canvas.height = targetPx;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2;
      const dots = particlesRef.current;

      const elapsedAfterActivate =
        activateTimeRef.current !== null ? nowSec - activateTimeRef.current : 0;

      // Inertia counter-force from physical thumb displacement (creates authentic motion trail)
      const inertiaX = -thumbDx * 16;

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        // Determine per-particle attraction mode:
        // Resting (not activated and p < 0.35): spring toward SOURCE (→)
        // Mid-transition or before per-dot assembleDelay finishes: free swirling dust cloud!
        // Settling (after thumb approaches right + staggered delay): crisp magnetic snap to TARGET (↗)
        let targetX = dot.sx;
        let targetY = dot.sy;
        let springK = 220;
        let damping = 18;

        if (activatedRef.current) {
          const settleStart = 0.26 + dot.assembleDelay; // staggered wave assembly after thumb lands (~0.35–0.62s)
          if (elapsedAfterActivate < settleStart) {
            // Free swirling dust cloud phase: weak center containment + rotational curl
            const angle = Math.atan2(dot.y, dot.x) + (Math.PI / 2) * dot.swirlDir;
            const swirlPush = 52;
            dot.vx += (Math.cos(angle) * swirlPush - dot.x * 5.2 + inertiaX) * dt;
            dot.vy += (Math.sin(angle) * swirlPush - dot.y * 5.2) * dt;
            dot.vx *= Math.exp(-3.4 * dt);
            dot.vy *= Math.exp(-3.4 * dt);
            dot.x += dot.vx * dt;
            dot.y += dot.vy * dt;
          } else {
            // Smooth staggered magnetic convergence into final '↗' arrow
            const lockAge = elapsedAfterActivate - settleStart;
            const ramp = clamp(lockAge / 0.24, 0, 1);
            targetX = dot.tx;
            targetY = dot.ty;
            springK = lerp(75, 290, ramp);
            damping = lerp(9, 20, ramp);

            const ax = (targetX - dot.x) * springK - dot.vx * damping + inertiaX * 0.25;
            const ay = (targetY - dot.y) * springK - dot.vy * damping;
            dot.vx += ax * dt;
            dot.vy += ay * dt;
            dot.x += dot.vx * dt;
            dot.y += dot.vy * dt;
          }
        } else if (draggingRef.current || p > 0.03) {
          // Live interactive dragging: dots lag behind & scatter into swirl proportionally to pull
          const scatter = clamp(p * 1.4, 0, 1);
          const swirlX = Math.cos(dot.burstAngle + p * 3.5 * dot.swirlDir) * 20 * scatter;
          const swirlY = Math.sin(dot.burstAngle + p * 3.5 * dot.swirlDir) * 20 * scatter;
          targetX = lerp(dot.sx, dot.tx, p) + swirlX;
          targetY = lerp(dot.sy, dot.ty, p) + swirlY;
          springK = lerp(220, 68, scatter);
          damping = lerp(18, 8.5, scatter);

          const ax = (targetX - dot.x) * springK - dot.vx * damping + inertiaX;
          const ay = (targetY - dot.y) * springK - dot.vy * damping;
          dot.vx += ax * dt;
          dot.vy += ay * dt;
          dot.x += dot.vx * dt;
          dot.y += dot.vy * dt;
        } else {
          // Idle resting micro-shimmer on hover
          const jitter = hoveredRef.current ? Math.sin(nowSec * 3.2 + i * 0.85) * 0.45 : 0;
          targetX = dot.sx + jitter;
          targetY = dot.sy;
          const ax = (targetX - dot.x) * 240 - dot.vx * 20;
          const ay = (targetY - dot.y) * 240 - dot.vy * 20;
          dot.vx += ax * dt;
          dot.vy += ay * dt;
          dot.x += dot.vx * dt;
          dot.y += dot.vy * dt;
        }

        // Keep particles inside soft thumb boundary
        const maxR = THUMB_SIZE * 0.41;
        const dist = Math.hypot(dot.x, dot.y);
        if (dist > maxR) {
          const k = maxR / dist;
          dot.x *= k;
          dot.y *= k;
          dot.vx *= -0.35;
          dot.vy *= -0.35;
        }

        const speed = Math.hypot(dot.vx, dot.vy);
        const motionMix = clamp(speed / 120, 0, 1);

        const dotSize = lerp(2.25, 1.65 * dot.sizeSeed, motionMix);
        const half = Math.max(0.68, dotSize / 2);

        // Color transitions smoothly from glowing ice-white (left) -> warm amber/dark ink scatter -> crisp obsidian (right)
        let r: number;
        let g: number;
        let b: number;
        let alpha: number;

        if (p < 0.46) {
          const t = p / 0.46;
          if (dot.isAccent) {
            r = Math.round(lerp(168, 255, t));
            g = Math.round(lerp(202, 148, t));
            b = Math.round(lerp(255, 36, t));
          } else {
            r = Math.round(lerp(255, 215, t));
            g = Math.round(lerp(255, 165, t));
            b = Math.round(lerp(255, 105, t));
          }
          alpha = lerp(0.98, 0.78 + 0.2 * dot.sizeSeed, t);
        } else {
          const t = clamp((p - 0.46) / 0.54, 0, 1);
          if (dot.isAccent && motionMix > 0.18) {
            r = Math.round(lerp(255, 16, t));
            g = Math.round(lerp(136, 16, t));
            b = Math.round(lerp(24, 20, t));
          } else {
            r = Math.round(lerp(92, 12, t));
            g = Math.round(lerp(72, 12, t));
            b = Math.round(lerp(54, 16, t));
          }
          alpha = lerp(0.78, 0.98, t * (1 - motionMix * 0.25));
        }

        const px = cx + dot.x;
        const py = cy + dot.y;

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0.25, 1)})`;
        if (motionMix > 0.14) {
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(Math.atan2(dot.vy, dot.vx));
          ctx.fillRect(-half * (1 + motionMix * 0.45), -half, half * 2 * (1 + motionMix * 0.45), half * 2);
          ctx.restore();
        } else {
          ctx.fillRect(px - half, py - half, half * 2, half * 2);
        }
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.032, Math.max(0.004, (now - lastTime) / 1000));
      lastTime = now;

      const drag = dragStateRef.current;
      if (!drag.active) {
        const diff = targetProgressRef.current - progressRef.current;
        // Snappy, elastic hardware switch glide (~420ms travel with micro-settle)
        const stiffness = targetProgressRef.current > 0.5 ? 210 : 180;
        const damping = targetProgressRef.current > 0.5 ? 20 : 19;
        const accel = diff * stiffness - velocityRef.current * damping;
        velocityRef.current += accel * dt;
        progressRef.current = clamp(progressRef.current + velocityRef.current * dt, -0.04, 1.05);

        if (Math.abs(diff) < 0.001 && Math.abs(velocityRef.current) < 0.002) {
          progressRef.current = targetProgressRef.current;
          velocityRef.current = 0;
        }
      }

      const p = progressRef.current;
      const cp = clamp(p, 0, 1);
      const thumbX = p * MAX_TRAVEL;
      const thumbDx = thumbX - prevThumbXRef.current;
      prevThumbXRef.current = thumbX;
      const speedNorm = clamp(Math.abs(thumbDx) / (MAX_TRAVEL * 0.08), 0, 1);

      if (Math.abs(lastReportedRef.current - cp) > 0.006) {
        lastReportedRef.current = cp;
        onProgressRef.current?.(cp);
      }

      const timeSec = now * 0.001;
      // Continuous clockwise perimeter orbit (faster on hover/motion)
      const orbitSpeed = hoveredRef.current ? 42 : 28;
      orbitPosRef.current = (orbitPosRef.current + dt * (orbitSpeed + speedNorm * 45)) % 100;

      applyVisualDom(p, speedNorm, orbitPosRef.current);
      stepAndDrawParticles(p, thumbDx, dt, timeSec);
      raf = requestAnimationFrame(tick);
    };

    applyVisualDom(progressRef.current, 0, orbitPosRef.current);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [applyVisualDom]);

  const triggerActivation = useCallback(() => {
    if (activatedRef.current) return;
    targetProgressRef.current = 1;
    if (activateTimeRef.current === null) {
      activateTimeRef.current = performance.now() * 0.001;
    }
    if (!burstFiredRef.current) {
      burstFiredRef.current = true;
      fireParticleBurst(1.1);
    }
    onActivate();
  }, [onActivate, fireParticleBurst]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activatedRef.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStateRef.current = {
      active: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      startProgress: progressRef.current,
      moved: false,
    };
    draggingRef.current = true;
    setDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragStateRef.current;
    if (!drag.active || drag.pointerId !== e.pointerId || activatedRef.current) return;
    const dx = e.clientX - drag.startX;
    if (Math.abs(dx) > 4) {
      drag.moved = true;
    }
    const nextP = clamp(drag.startProgress + dx / MAX_TRAVEL, 0, 1);
    progressRef.current = nextP;
    targetProgressRef.current = nextP;
  };

  const finishPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragStateRef.current;
    if (!drag.active || drag.pointerId !== e.pointerId) return;
    drag.active = false;
    draggingRef.current = false;
    setDragging(false);

    if (activatedRef.current) return;

    if (!drag.moved) {
      triggerActivation();
      return;
    }

    if (progressRef.current >= 0.4) {
      triggerActivation();
    } else {
      targetProgressRef.current = 0;
    }
  };

  return (
    <div
      ref={trackRef}
      role="switch"
      aria-checked={activated}
      aria-label={ariaLabel}
      tabIndex={0}
      onClick={(e) => {
        if (e.detail === 0 && !activatedRef.current) {
          triggerActivation();
        }
      }}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') && !activatedRef.current) {
          e.preventDefault();
          triggerActivation();
        }
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishPointer}
      onPointerCancel={finishPointer}
      onPointerEnter={() => {
        hoveredRef.current = true;
        onHover?.();
      }}
      onPointerLeave={() => {
        hoveredRef.current = false;
      }}
      style={{
        width: TRACK_W,
        height: TRACK_H,
        padding: PADDING,
        borderRadius: TRACK_RADIUS,
        border: '1px solid rgba(255, 255, 255, 0.045)',
      }}
      className={`relative select-none touch-none outline-none transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
        dragging ? 'cursor-grabbing scale-[0.985]' : 'cursor-pointer hover:scale-[1.025]'
      } focus-visible:ring-2 focus-visible:ring-white/50`}
    >
      <div
        ref={glowSpillRef}
        aria-hidden="true"
        style={{
          width: THUMB_SIZE + 24,
          height: THUMB_SIZE,
          borderRadius: THUMB_RADIUS + 4,
          filter: 'blur(12px)',
        }}
        className="pointer-events-none absolute top-[9px]"
      />

      <div
        ref={thumbRef}
        style={{
          width: THUMB_SIZE,
          height: THUMB_SIZE,
          borderRadius: THUMB_RADIUS,
        }}
        className="relative flex items-center justify-center will-change-transform"
      >
        <div
          aria-hidden="true"
          style={{
            borderRadius: THUMB_RADIUS,
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
          className="pointer-events-none absolute inset-0"
        />

        <div
          ref={cushionRef}
          aria-hidden="true"
          style={{ borderRadius: THUMB_RADIUS - 1 }}
          className="pointer-events-none absolute inset-[1px]"
        />

        <svg
          viewBox={`0 0 ${THUMB_SIZE} ${THUMB_SIZE}`}
          width={THUMB_SIZE}
          height={THUMB_SIZE}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-visible z-10"
        >
          <rect
            ref={neonOuterRef}
            x={0.5}
            y={0.5}
            width={THUMB_SIZE - 1}
            height={THUMB_SIZE - 1}
            rx={THUMB_RADIUS}
            ry={THUMB_RADIUS}
            pathLength={100}
            fill="none"
            strokeWidth={11}
            strokeLinecap="round"
            strokeDasharray="28 72"
            style={{ filter: 'blur(9px)' }}
          />
          <rect
            ref={neonMidRef}
            x={0.5}
            y={0.5}
            width={THUMB_SIZE - 1}
            height={THUMB_SIZE - 1}
            rx={THUMB_RADIUS}
            ry={THUMB_RADIUS}
            pathLength={100}
            fill="none"
            strokeWidth={4.2}
            strokeLinecap="round"
            strokeDasharray="24 76"
            style={{ filter: 'blur(2.2px)' }}
          />
          <rect
            ref={neonCoreRef}
            x={0.5}
            y={0.5}
            width={THUMB_SIZE - 1}
            height={THUMB_SIZE - 1}
            rx={THUMB_RADIUS}
            ry={THUMB_RADIUS}
            pathLength={100}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={1.65}
            strokeLinecap="round"
            strokeDasharray="15 85"
            style={{ filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.95))' }}
          />
        </svg>

        <canvas
          ref={canvasRef}
          style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
          className="relative z-20 pointer-events-none block"
        />
      </div>
    </div>
  );
}
