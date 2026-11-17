import { useEffect, useState } from 'react';

type Listener = (vel: number) => void;

const listeners = new Set<Listener>();
let initialized = false;
let targetVel = 0;
let currentVel = 0;
let springVel = 0;
let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
let lastTouchY: number | null = null;
let rafId = 0;

function ensureEngineStarted() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  lastScrollY = window.scrollY;

  const wake = () => {
    if (!rafId && listeners.size > 0) {
      rafId = requestAnimationFrame(tick);
    }
  };

  const injectImpulse = (rawDelta: number) => {
    targetVel = Math.max(-1.6, Math.min(1.6, targetVel + rawDelta));
    wake();
  };

  const onScroll = () => {
    const y = window.scrollY;
    const dy = y - lastScrollY;
    lastScrollY = y;
    if (Math.abs(dy) > 0.1) {
      targetVel = Math.max(-1.6, Math.min(1.6, dy * 0.055));
      wake();
    }
  };

  // Also react to wheel/touchpad even on non-scrolling 100vh views (like Home) or at page edges
  const onWheel = (e: WheelEvent) => {
    const raw = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (Math.abs(raw) < 0.5) return;
    // Scale gently so scrolling + wheel feel cohesive without oversaturating
    injectImpulse(raw * 0.0085);
  };

  const onTouchStart = (e: TouchEvent) => {
    if (e.touches[0]) lastTouchY = e.touches[0].clientY;
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!e.touches[0]) return;
    if (lastTouchY !== null) {
      const dy = lastTouchY - e.touches[0].clientY;
      injectImpulse(dy * 0.018);
    }
    lastTouchY = e.touches[0].clientY;
  };

  const onTouchEnd = () => {
    lastTouchY = null;
  };

  const tick = () => {
    targetVel *= 0.84;

    const stiffness = 0.16;
    const damping = 0.74;
    const force = (targetVel - currentVel) * stiffness;
    springVel = (springVel + force) * damping;
    currentVel += springVel;

    const isMoving =
      Math.abs(targetVel) > 0.001 ||
      Math.abs(currentVel) > 0.0018 ||
      Math.abs(springVel) > 0.0018;

    if (isMoving && listeners.size > 0) {
      listeners.forEach((cb) => cb(currentVel));
      rafId = requestAnimationFrame(tick);
    } else {
      targetVel = 0;
      currentVel = 0;
      springVel = 0;
      rafId = 0;
      listeners.forEach((cb) => cb(0));
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('wheel', onWheel, { passive: true });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: true });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
}

/**
 * Shared damped-spring scroll & wheel velocity (-1.6 to 1.6 normalized)
 * so all sections, typography, and SVG arches flex and snap back like living rubber.
 */
export function useRubberScroll(sensitivity = 0.05) {
  const [velocity, setVelocity] = useState(0);

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    ensureEngineStarted();
    const scale = sensitivity / 0.05;
    const cb: Listener = (vel) => {
      setVelocity(vel * scale);
    };
    listeners.add(cb);

    return () => {
      listeners.delete(cb);
      if (listeners.size === 0 && rafId) {
        // Keep engine lightweight; listeners re-subscribe on route mount
      }
    };
  }, [sensitivity]);

  return velocity;
}
