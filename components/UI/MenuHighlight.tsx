'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const outerShape = 'polygon(2% 20%, 97% 0%, 100% 68%, 91% 100%, 0% 86%)';
const innerShape = 'polygon(7% 31%, 93% 13%, 95% 70%, 5% 78%)';
const glintShape = 'polygon(56% 0%, 74% 0%, 48% 100%, 30% 100%)';

export function MenuHighlight() {
  const reduce = useReducedMotion();

  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute -inset-x-7 -inset-y-4 origin-left"
      initial={reduce ? false : { opacity: 0, scaleX: 0.55 }}
      animate={{ opacity: 1, scaleX: 1 }}
      exit={reduce ? undefined : { opacity: 0, scaleX: 0.7 }}
      transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* hard black drop shadow */}
      <span
        className="absolute inset-0 translate-x-[7px] translate-y-[7px]"
        style={{ clipPath: outerShape, backgroundColor: 'var(--p5-ink, #0b0b0b)' }}
      />
      {/* bright cyan slash */}
      <span
        className="absolute inset-0"
        style={{ clipPath: outerShape, backgroundColor: 'var(--p5-cyan, #2ee9ff)' }}
      />
      {/* deep blue core with a light glint */}
      <span
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: innerShape, backgroundColor: 'var(--p5-blue, #1c45f2)' }}
      >
        <span
          className="absolute inset-0 opacity-50"
          style={{ clipPath: glintShape, background: 'var(--p5-cyan-light, #9ff8ff)' }}
        />
      </span>
    </motion.span>
  );
}
