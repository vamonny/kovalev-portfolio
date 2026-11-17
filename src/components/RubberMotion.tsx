import React, { Fragment } from 'react';
import { motion } from 'motion/react';
import { useRubberScroll } from '../hooks/useRubberScroll';

interface RubberBlockProps {
  children: React.ReactNode;
  className?: string;
  /** Multiplier for scroll skewY (-4 to +4 deg at normal scroll). Use +/- to counter-flex columns like ContactsPage */
  skewFactor?: number;
  /** Vertical elastic drag amplitude in px driven by scroll velocity */
  driftFactor?: number;
  /** Entrance stagger delay in seconds */
  delay?: number;
  /** Disable whileInView entrance if above-the-fold hero */
  immediate?: boolean;
}

/**
 * Gives any section, column, card, or image plate the tactile rubber scroll flex
 * of ContactsPage combined with a crisp Swiss spring reveal.
 */
export function RubberBlock({
  children,
  className = '',
  skewFactor = 1.2,
  driftFactor = 10,
  delay = 0,
  immediate = false,
}: RubberBlockProps) {
  const vel = useRubberScroll(0.05);
  const clamped = Math.max(-1.4, Math.min(1.4, vel));
  const skewY = clamped * skewFactor;
  const translateY = -clamped * driftFactor;
  const scaleY = 1 + Math.min(0.035, Math.abs(clamped) * 0.022);

  return (
    <motion.div
      initial={immediate ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.06 }}
      transition={{ duration: 0.62, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      <div
        style={{
          transform: `translate3d(0, ${translateY.toFixed(2)}px, 0) skewY(${skewY.toFixed(2)}deg) scaleY(${scaleY.toFixed(4)})`,
          transition: Math.abs(clamped) > 0.01 ? 'none' : 'transform 460ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        className="will-change-transform"
      >
        {children}
      </div>
    </motion.div>
  );
}

interface RubberWordsProps {
  text: string;
  className?: string;
  as?: 'p' | 'span' | 'div' | 'h2' | 'h3';
  /** Base amplitude for per-word scroll elasticity */
  elasticity?: number;
  /** Animate words in cleanly on view/mount */
  reveal?: boolean;
  delay?: number;
}

/**
 * Word-level elastic typography for body leads & statements.
 * Words float with micro phase-offset on scroll/wheel and snap back softly without ever breaking mid-word.
 */
export function RubberWords({
  text,
  className = '',
  as: Tag = 'p',
  elasticity = 1,
  reveal = true,
  delay = 0,
}: RubberWordsProps) {
  const vel = useRubberScroll(0.05);
  const clamped = Math.max(-1.4, Math.min(1.4, vel));
  const words = text.trim().split(/\s+/).filter(Boolean);

  return (
    <Tag className={className}>
      {words.map((word, idx) => {
        const wave = 1 + ((idx % 4) - 1.5) * 0.25;
        const dy = -clamped * 5.2 * wave * elasticity;
        const skew = clamped * -1.4 * elasticity;

        return (
          <Fragment key={`${word}-${idx}`}>
            {idx > 0 && ' '}
            <motion.span
              initial={reveal ? { opacity: 0, y: 12 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.48,
                delay: delay + Math.min(0.45, idx * 0.018),
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block whitespace-nowrap"
            >
              <span
                style={{
                  transform: `translate3d(0, ${dy.toFixed(2)}px, 0) skewX(${skew.toFixed(2)}deg)`,
                  transition:
                    Math.abs(clamped) > 0.01
                      ? 'none'
                      : 'transform 480ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                className="inline-block will-change-transform"
              >
                {word}
              </span>
            </motion.span>
          </Fragment>
        );
      })}
    </Tag>
  );
}
