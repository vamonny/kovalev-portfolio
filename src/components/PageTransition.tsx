import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { useSound } from '../context/SoundContext';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { playTransition } = useSound();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    playTransition();
  }, [location.pathname, playTransition]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
