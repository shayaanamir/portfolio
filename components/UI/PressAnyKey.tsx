'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { RansomText } from './RansomText';
import { MenuHighlight } from './MenuHighlight';

type PressAnyKeyProps = {
  onEnter: () => void;
};

export function PressAnyKey({ onEnter }: PressAnyKeyProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="absolute bottom-[16%] left-[7%] z-30"
      initial={reduce ? false : { opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduce ? undefined : { opacity: 0, x: -16 }}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
    >
      <button
        type="button"
        onClick={onEnter}
        aria-label="Press any key to enter"
        className="group relative -rotate-6 whitespace-nowrap px-1 text-[38px] sm:text-[50px] outline-none cursor-pointer select-none"
      >
        <MenuHighlight />
        <motion.span
          className="relative inline-block"
          animate={reduce ? undefined : { opacity: [1, 0.55, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <RansomText text="Press any key" />
        </motion.span>
      </button>
    </motion.div>
  );
}
