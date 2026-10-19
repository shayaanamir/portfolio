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

/**
 * Magazine cutout / ransom-note treatment.
 *
 * Firefox / CSS3D note:
 * - Individual tile rotate() transforms removed — inside CSS3DRenderer's
 *   preserve-3d context Firefox interprets them as 3D rotations, causing
 *   tiles to flip out of the viewing plane.
 * - The alternating color blocks already sell the cutout effect without rotation.
 */
export function RansomText({ text, unit = 'word', fontSize = '28px' }: RansomTextProps) {
  const parts = unit === 'word' ? text.split(' ').filter(Boolean) : text.split('');

  return (
    <span style={{
      display: 'inline-flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '5px 7px',
    }}>
      {parts.map((part, i) => {
        if (part === '//' || part === '/') {
          return (
            <span key={`sep-${i}`} style={{
              fontFamily: "'Archivo Black', Impact, sans-serif",
              color: '#D92323',
              fontSize,
              padding: '0 2px',
            }} aria-hidden="true">
              //
            </span>
          );
        }
        const s = styles[(i * 3 + 1) % styles.length];
        return (
          <span
            key={`${part}-${i}`}
            style={{
              display: 'inline-block',
              background: s.bg,
              color: s.color,
              fontFamily: "'Archivo Black', Impact, sans-serif",
              fontSize,
              textTransform: 'uppercase',
              lineHeight: 1,
              padding: '4px 10px',
              boxShadow: '3px 3px 0px #0D0D0D',
              // No rotate() — inside CSS3D preserve-3d Firefox interprets
              // 2D rotate as a 3D perspective rotation, flipping tiles
            }}
          >
            {part}
          </span>
        );
      })}
    </span>
  );
}
