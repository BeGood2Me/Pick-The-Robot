'use client';

/**
 * Adapted from Originkit text-colour-sweep for PickTheRobot.
 * Word-level scroll reveal: muted ink → full ink (landing-page skill B11).
 * @see https://www.originkit.dev/components/text-colour-sweep
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.32, 0.72, 0, 1] as const;

type WordColourRevealProps = {
  lines: string[];
  className?: string;
  mutedColor?: string;
  activeColor?: string;
};

export function WordColourReveal({
  lines,
  className = '',
  mutedColor = 'rgb(122 143 168 / 0.32)',
  activeColor = 'var(--color-ink)',
}: WordColourRevealProps) {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeCount, setActiveCount] = useState(0);

  const words = useMemo(
    () => lines.flatMap((line) => line.trim().split(/\s+/).filter(Boolean)),
    [lines],
  );

  useEffect(() => {
    if (reduceMotion) {
      setActiveCount(words.length);
      return;
    }

    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;

        let i = 0;
        const tick = () => {
          i += 1;
          setActiveCount(i);
          if (i < words.length) {
            window.setTimeout(tick, 90);
          }
        };
        tick();
        observer.disconnect();
      },
      { rootMargin: '0px 0px -28% 0px', threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reduceMotion, words.length]);

  let flatIndex = 0;

  return (
    <div ref={sectionRef} className={className}>
      {lines.map((line, lineIndex) => {
        const lineWords = line.trim().split(/\s+/).filter(Boolean);
        return (
          <p
            key={`${line}-${lineIndex}`}
            className="font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
            style={{ maxWidth: 680 }}
          >
            {lineWords.map((word, wordIndex) => {
              const index = flatIndex;
              flatIndex += 1;
              const active = index < activeCount;
              return (
                <motion.span
                  key={`${word}-${index}`}
                  className="inline-block"
                  initial={false}
                  animate={{ color: active ? activeColor : mutedColor }}
                  transition={{ duration: 0.7, ease: EASE }}
                >
                  {word}
                  {wordIndex < lineWords.length - 1 ? '\u00A0' : ''}
                </motion.span>
              );
            })}
          </p>
        );
      })}
    </div>
  );
}
