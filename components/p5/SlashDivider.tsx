import React from 'react';

interface SlashDividerProps {
  tone?: 'crimson' | 'chalk' | 'rust';
  style?: React.CSSProperties;
}

const toneColor: Record<string, string> = {
  crimson: '#D92323',
  chalk: '#FFFFFF',
  rust: '#732424',
};

/** Sharp diagonal slash divider — a run of skewed bars thinning to the right. */
export function SlashDivider({ tone = 'crimson', style }: SlashDividerProps) {
  const color = toneColor[tone];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', ...style }} aria-hidden="true">
      {[10, 8, 6, 5, 4, 3, 3, 2].map((w, i) => (
        <span
          key={i}
          style={{
            background: color,
            height: '16px',
            width: `${w * 3}px`,
            transform: 'skewX(-26deg)',
            opacity: 1 - i * 0.1,
            display: 'inline-block',
          }}
        />
      ))}
    </div>
  );
}
