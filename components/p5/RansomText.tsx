import React from 'react';

type Unit = 'word' | 'char';

interface RansomTextProps {
  text: string;
  unit?: Unit;
  className?: string;
  fontSize?: string;
}

const styles = [
  { bg: '#FFFFFF', color: '#0D0D0D' },
  { bg: '#0D0D0D', color: '#FFFFFF' },
  { bg: '#D92323', color: '#FFFFFF' },
  { bg: '#FFFFFF', color: '#D92323' },
];

const tilts = ['-2deg', '1deg', '-1deg', '2deg', '0deg'];

/**
 * Magazine cutout / ransom-note treatment — each word becomes its own pasted
 * block, alternating ink-on-chalk and chalk-on-crimson.
 */
export function RansomText({ text, unit = 'word', className = '', fontSize = '32px' }: RansomTextProps) {
  const parts = unit === 'word' ? text.split(' ').filter(Boolean) : text.split('');

  return (
    <span style={{ display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px 8px' }} className={className}>
      {parts.map((part, i) => {
        if (part === '//' || part === '/') {
          return (
            <span key={`${part}-${i}`} style={{ fontFamily: "'Archivo Black', Impact, sans-serif", color: '#D92323', fontSize, padding: '0 2px' }} aria-hidden="true">
              //
            </span>
          );
        }
        const s = styles[(i * 3 + 1) % styles.length];
        return (
          <span
            key={`${part}-${i}`}
            style={{
              background: s.bg,
              color: s.color,
              fontFamily: "'Archivo Black', Impact, sans-serif",
              fontSize,
              textTransform: 'uppercase',
              lineHeight: 1,
              padding: '4px 10px',
              display: 'inline-block',
              transform: `rotate(${tilts[i % tilts.length]})`,
              boxShadow: '3px 3px 0px #0D0D0D',
            }}
          >
            {part}
          </span>
        );
      })}
    </span>
  );
}
