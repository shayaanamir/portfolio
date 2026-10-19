'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { RansomText } from './RansomText';
import { MenuHighlight } from './MenuHighlight';

export type MenuItem = {
  id: string;
  label: string;
};

type RadialMenuProps = {
  items: MenuItem[];
  initialIndex?: number;
  onSelect?: (id: string) => void;
  onClose?: () => void;
};

// Clock geometry (px). The clock's center sits just off the bottom-left corner,
// so a quarter of the dial is visible. The dial and labels rotate together so the
// selected option always lands under the fixed hand.
const SIZE = 640;
const CX = -40;
const CY = SIZE + 40;
const DIAL_RADIUS = 360;
const LABEL_RADIUS = 386;
const HUB_RADIUS = 190;
const FOCAL_ANGLE = 44;
const STEP = 20;
const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const MINOR_TICKS = Array.from({ length: 120 }, (_, i) => i * 3);
const PAD = 24;

export function RadialMenu({ items, initialIndex = 0, onSelect, onClose }: RadialMenuProps) {
  const [active, setActive] = useState(initialIndex);
  const reduce = useReducedMotion();

  const move = useCallback(
    (delta: number) => setActive((i) => Math.min(items.length - 1, Math.max(0, i + delta))),
    [items.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        move(-1);
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        move(1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onSelect?.(items[active]?.id);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose?.();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, items, move, onSelect, onClose]);

  const spring = reduce
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 520, damping: 42, mass: 0.8 };

  const box = DIAL_RADIUS + PAD;
  const handLength = DIAL_RADIUS - 70;

  return (
    <nav
      aria-label="Main menu"
      className="pointer-events-none absolute bottom-0 left-0 origin-bottom-left scale-[0.62] sm:scale-[0.8] lg:scale-100 z-30"
      style={{ width: SIZE, height: SIZE }}
    >
      {/* Static dial body */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 overflow-visible"
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
      >
        <circle cx={CX} cy={CY} r={DIAL_RADIUS + 8} fill="var(--p5-red, #D92323)" />
        <circle cx={CX} cy={CY} r={DIAL_RADIUS} fill="var(--p5-ink, #0b0b0b)" />
        <circle cx={CX} cy={CY} r={DIAL_RADIUS - 12} fill="none" stroke="#ffffff" strokeWidth={2} />
      </svg>

      {/* Rotating dial face: ticks, hour markers, numerals */}
      <motion.div
        aria-hidden="true"
        className="absolute h-0 w-0"
        style={{ left: CX, top: CY, transformOrigin: '0 0' }}
        initial={false}
        animate={{ rotate: -active * STEP }}
        transition={spring}
      >
        <svg
          className="absolute overflow-visible"
          style={{ left: -box, top: -box }}
          width={box * 2}
          height={box * 2}
          viewBox={`${-box} ${-box} ${box * 2} ${box * 2}`}
        >
          {MINOR_TICKS.map((deg) => {
            const major = deg % 15 === 0;
            const a = local(deg, DIAL_RADIUS - 18);
            const b = local(deg, DIAL_RADIUS - (major ? 40 : 28));
            return (
              <line
                key={deg}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="#ffffff"
                strokeOpacity={major ? 0.9 : 0.45}
                strokeWidth={major ? 3 : 1.5}
              />
            );
          })}

          {items.map((item, i) => {
            const deg = FOCAL_ANGLE - i * STEP;
            const isActive = i === active;
            const n = local(deg, DIAL_RADIUS - 92);
            return (
              <g key={item.id}>
                <polygon
                  points={wedge(deg, DIAL_RADIUS - 18, DIAL_RADIUS - 62, 2.2)}
                  fill={isActive ? 'var(--p5-cyan, #2ee9ff)' : 'var(--p5-red, #D92323)'}
                  stroke="#ffffff"
                  strokeWidth={2}
                  style={{ transition: 'fill 150ms ease-out' }}
                />
                <text
                  x={n.x}
                  y={n.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily="'Shoplift', 'Archivo Black', Impact, sans-serif"
                  fontSize={26}
                  fill={isActive ? '#ffffff' : 'rgba(255,255,255,0.55)'}
                  transform={`rotate(${90 - deg} ${n.x} ${n.y})`}
                  style={{ transition: 'fill 150ms ease-out' }}
                >
                  {NUMERALS[i] ?? i + 1}
                </text>
              </g>
            );
          })}

          <circle
            r={DIAL_RADIUS - 130}
            fill="none"
            stroke="#ffffff"
            strokeOpacity={0.35}
            strokeWidth={1.5}
            strokeDasharray="2 9"
          />
        </svg>
      </motion.div>

      {/* Fixed clock hand pointing at the selection */}
      <div
        aria-hidden="true"
        className="absolute h-0"
        style={{
          left: CX,
          top: CY,
          width: handLength,
          transformOrigin: '0 0',
          transform: `rotate(${-FOCAL_ANGLE}deg)`,
        }}
      >
        <svg
          className="absolute left-0 top-0 -translate-y-1/2 overflow-visible"
          width={handLength}
          height={40}
          viewBox={`0 -20 ${handLength} 40`}
        >
          <polygon
            points={`0,-11 ${handLength - 48},-5 ${handLength - 48},-15 ${handLength},0 ${handLength - 48},15 ${handLength - 48},5 0,11`}
            fill="#ffffff"
            stroke="var(--p5-ink, #0b0b0b)"
            strokeWidth={4}
            strokeLinejoin="round"
          />
          <polygon
            points={`${handLength - 42},-8 ${handLength - 12},0 ${handLength - 42},8`}
            fill="var(--p5-red, #D92323)"
          />
        </svg>
      </div>

      {/* Hub cap */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 overflow-visible"
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
      >
        <circle cx={CX} cy={CY} r={HUB_RADIUS} fill="#161616" stroke="var(--p5-red, #D92323)" strokeWidth={8} />
        <circle cx={CX} cy={CY} r={HUB_RADIUS - 14} fill="none" stroke="#ffffff" strokeOpacity={0.6} strokeWidth={1.5} />
      </svg>

      {/* Menu items riding the bezel */}
      <ul role="menu" className="contents">
        {items.map((item, i) => {
          const offset = i - active;
          const angle = FOCAL_ANGLE - offset * STEP;
          const p = point(angle, LABEL_RADIUS);
          const isActive = offset === 0;
          const distance = Math.abs(offset);

          return (
            <motion.li
              key={item.id}
              role="none"
              className="absolute left-0 top-0 h-0"
              style={{ transformOrigin: '0% 0%', zIndex: isActive ? 10 : 5 - distance }}
              initial={false}
              animate={{
                x: p.x,
                y: p.y,
                rotate: 10 - angle * 0.42,
                scale: isActive ? 1.28 : 1 - distance * 0.06,
                opacity: distance <= 2 ? 1 : distance === 3 ? 0.35 : 0,
              }}
              transition={spring}
            >
              <button
                type="button"
                role="menuitem"
                aria-current={isActive ? 'page' : undefined}
                tabIndex={distance > 3 ? -1 : 0}
                onClick={() => {
                  setActive(i);
                  onSelect?.(item.id);
                }}
                className="group pointer-events-auto absolute left-0 top-0 -translate-y-1/2 whitespace-nowrap px-1 text-[40px] outline-none cursor-pointer"
              >
                <AnimatePresence>{isActive && <MenuHighlight key="hl" />}</AnimatePresence>
                <span
                  className={`relative inline-block transition-transform duration-150 ease-out ${
                    isActive ? '' : 'group-hover:translate-x-2'
                  }`}
                >
                  <RansomText text={item.label} />
                </span>
                <span className="sr-only">{item.label}</span>
              </button>
            </motion.li>
          );
        })}
      </ul>

      {/* Controls hint on the hub */}
      <div
        aria-hidden="true"
        className="absolute bottom-7 left-7 flex flex-col gap-1.5 text-[11px] uppercase tracking-wider text-white select-none"
        style={{ fontFamily: "'Barlow Condensed', 'Archivo Black', sans-serif" }}
      >
        <span className="flex items-center gap-2">
          <kbd className="bg-white px-1.5 py-0.5 text-black font-bold text-[10px]">↑↓</kbd> Select
        </span>
        <span className="flex items-center gap-2">
          <kbd className="bg-[#D92323] px-1.5 py-0.5 text-white font-bold text-[10px]">⏎</kbd> Go
        </span>
        <button
          type="button"
          onClick={() => onClose?.()}
          className="flex items-center gap-2 pointer-events-auto hover:opacity-80 transition-opacity cursor-pointer bg-transparent border-none p-0 text-white font-inherit uppercase"
        >
          <kbd className="border border-white px-1 py-px text-white font-bold text-[10px]">Esc</kbd> Back
        </button>
      </div>
    </nav>
  );
}

function point(angleDeg: number, r: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY - r * Math.sin(rad) };
}

// Point relative to the clock center (used inside the rotating dial).
function local(angleDeg: number, r: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: r * Math.cos(rad), y: -r * Math.sin(rad) };
}

// A tapered hour marker pointing toward the center.
function wedge(angleDeg: number, outer: number, inner: number, halfWidthDeg: number) {
  const a = local(angleDeg - halfWidthDeg, outer);
  const b = local(angleDeg + halfWidthDeg, outer);
  const c = local(angleDeg, inner);
  return `${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y}`;
}
