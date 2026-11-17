import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { soundEngine } from '../audio/soundEngine';

const SOUND_STORAGE_KEY = 'kk_sound_enabled';

interface SoundContextValue {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
  playHover: () => void;
  playClick: () => void;
  playPluck: (pitchFactor?: number) => void;
  playMorph: () => void;
  playTransition: () => void;
  playSuccess: () => void;
  playIntroReveal: () => boolean;
  playIntroResolve: () => boolean;
}

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  // Enabled by default; remembers explicit mute preference if toggled off
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    try {
      const saved = window.localStorage.getItem(SOUND_STORAGE_KEY);
      if (saved === '0') return false;
    } catch {
      // ignore storage errors
    }
    return true;
  });

  useEffect(() => {
    soundEngine.setEnabled(soundEnabled, true);
  }, [soundEnabled]);

  // Unlock browser AudioContext seamlessly on the very first user gesture
  useEffect(() => {
    if (!soundEnabled) return;
    const handleFirstGesture = () => {
      soundEngine.unlock();
    };
    window.addEventListener('pointerdown', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true, passive: true });
    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
  }, [soundEnabled]);

  const setSoundEnabled = useCallback((next: boolean) => {
    setSoundEnabledState(next);
    soundEngine.setEnabled(next);
    try {
      window.localStorage.setItem(SOUND_STORAGE_KEY, next ? '1' : '0');
    } catch {
      // ignore storage errors
    }
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabledState((prev) => {
      const next = !prev;
      soundEngine.setEnabled(next);
      try {
        window.localStorage.setItem(SOUND_STORAGE_KEY, next ? '1' : '0');
      } catch {
        // ignore storage errors
      }
      return next;
    });
  }, []);

  const value: SoundContextValue = {
    soundEnabled,
    setSoundEnabled,
    toggleSound,
    playHover: useCallback(() => soundEngine.playHover(), []),
    playClick: useCallback(() => soundEngine.playClick(), []),
    playPluck: useCallback((p?: number) => soundEngine.playPluck(p), []),
    playMorph: useCallback(() => soundEngine.playMorph(), []),
    playTransition: useCallback(() => soundEngine.playTransition(), []),
    playSuccess: useCallback(() => soundEngine.playSuccess(), []),
    playIntroReveal: useCallback(() => soundEngine.playIntroReveal(), []),
    playIntroResolve: useCallback(() => soundEngine.playIntroResolve(), []),
  };

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error('useSound must be used inside SoundProvider');
  return ctx;
}
