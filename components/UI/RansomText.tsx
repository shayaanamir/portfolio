'use client';

import React from 'react';

type RansomTextProps = {
  text: string;
};

type LetterVariant = {
  fontFamily: string;
  fontSize: string;
  rotate: number;
  lift: string;
  inverted?: boolean;
};

const variants: LetterVariant[] = [
  { fontFamily: "'Shoplift', sans-serif", fontSize: '1em', rotate: 0, lift: '0em' },
  { fontFamily: "'Shoplift', sans-serif", fontSize: '1.08em', rotate: -3, lift: '-0.04em' },
  { fontFamily: "'Shoplift', 'Archivo Black', sans-serif", fontSize: '0.92em', rotate: 2, lift: '0.03em' },
  { fontFamily: "'Shoplift', sans-serif", fontSize: '0.95em', rotate: -5, lift: '0em', inverted: true },
  { fontFamily: "'Shoplift', sans-serif", fontSize: '1.05em', rotate: 4, lift: '0.02em' },
];

const outlined: React.CSSProperties = {
  color: '#ffffff',
  WebkitTextStroke: '0.14em var(--p5-ink, #0b0b0b)',
  paintOrder: 'stroke fill',
  textShadow: '0.06em 0.06em 0 var(--p5-ink, #0b0b0b)',
};

export function RansomText({ text }: RansomTextProps) {
  return (
    <span aria-hidden="true" className="inline-flex items-end leading-none select-none">
      {text.split('').map((char, i) => {
        if (char === ' ') {
          return <span key={`space-${i}`} className="inline-block w-[0.32em]" />;
        }
        const v = i === 0 ? variants[1] : variants[pickVariant(char, i)];
        const size = i === 0 ? '1.25em' : v.fontSize;
        const letter = char.toUpperCase();

        return (
          <span
            key={`${char}-${i}`}
            className="inline-block"
            style={{
              fontFamily: v.fontFamily,
              fontSize: size,
              transform: `translateY(${v.lift}) rotate(${v.rotate}deg)`,
              marginLeft: i === 0 ? 0 : '-0.02em',
              ...(v.inverted
                ? {
                    color: 'var(--p5-ink, #0b0b0b)',
                    background: '#ffffff',
                    padding: '0.02em 0.07em',
                    boxShadow: '0 0 0 0.06em var(--p5-ink, #0b0b0b), 0.08em 0.08em 0 var(--p5-ink, #0b0b0b)',
                  }
                : outlined),
            }}
          >
            {letter}
          </span>
        );
      })}
    </span>
  );
}

function pickVariant(char: string, index: number) {
  return (char.charCodeAt(0) + index * 7) % variants.length;
}
