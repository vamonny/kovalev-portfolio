import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSound } from './SoundContext';

export interface CurtainPayload {
  italicLine: string;
  regularLine?: string;
  thumbnail?: string;
}

type CurtainPhase = 'idle' | 'entering' | 'holding' | 'exiting';

interface NavigationContextValue {
  phase: CurtainPhase;
  payload: CurtainPayload | null;
  progress: number;
  transitionSeq: number;
  navigateWithCurtain: (to: string, payload?: CurtainPayload) => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { playTransition, playClick } = useSound();

  const [phase, setPhase] = useState<CurtainPhase>('idle');
  const [payload, setPayload] = useState<CurtainPayload | null>(null);
  const [progress, setProgress] = useState(0);
  const [transitionSeq, setTransitionSeq] = useState(0);
  const timersRef = useRef<number[]>([]);
  const rafRef = useRef<number>(0);

  const clearTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
    cancelAnimationFrame(rafRef.current);
  };

  const navigateWithCurtain = useCallback(
    (to: string, nextPayload?: CurtainPayload) => {
      playClick();

      const reduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reduced) {
        navigate(to);
        window.scrollTo({ top: 0, behavior: 'auto' });
        return;
      }

      clearTimers();
      playTransition();
      setTransitionSeq((s) => s + 1);
      setPayload(
        nextPayload || {
          italicLine: 'KIRILL',
          regularLine: 'KOVALEV',
        }
      );
      setProgress(0);
      setPhase('entering');

      // Snappy ~1.15s total transition: 300ms enter -> 440ms hold & counter -> 420ms exit
      const t1 = window.setTimeout(() => {
        setPhase('holding');
        const countStart = performance.now();
        const tickCounter = (now: number) => {
          const linear = Math.min(1, (now - countStart) / 420);
          const eased = 1 - Math.pow(1 - linear, 2.2);
          const pct = Math.min(100, Math.round(eased * 100));
          setProgress(pct);
          if (linear < 1) {
            rafRef.current = requestAnimationFrame(tickCounter);
          }
        };
        rafRef.current = requestAnimationFrame(tickCounter);
      }, 250);

      const t2 = window.setTimeout(() => {
        navigate(to);
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, behavior: 'auto' });
        });
        setProgress(100);
        setPhase('exiting');
      }, 720);

      const t3 = window.setTimeout(() => {
        setPhase('idle');
        setPayload(null);
      }, 1180);

      timersRef.current = [t1, t2, t3];
    },
    [navigate, playClick, playTransition]
  );

  return (
    <NavigationContext.Provider
      value={{ phase, payload, progress, transitionSeq, navigateWithCurtain }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useCurtainNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useCurtainNavigation must be used inside NavigationProvider');
  return ctx;
}
