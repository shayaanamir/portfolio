import React from 'react';

interface SkewBadgeProps {
  children: React.ReactNode;
  tone?: 'crimson' | 'chalk' | 'rust' | 'ink';
  style?: React.CSSProperties;
}

const tones: Record<string, { bg: string; color: string; border: string }> = {
  crimson: { bg: '#D92323', color: '#FFFFFF', border: '#FFFFFF' },
  chalk:   { bg: '#FFFFFF', color: '#0D0D0D', border: '#0D0D0D' },
  rust:    { bg: '#732424', color: '#FFFFFF', border: '#FFFFFF' },
  ink:     { bg: '#0D0D0D', color: '#FFFFFF', border: '#FFFFFF' },
};

/** Slanted italic badge — the P5 pill / label treatment. */
export function SkewBadge({ children, tone = 'crimson', style }: SkewBadgeProps) {
  const t = tones[tone];
  return (
    <span style={{
      display: 'inline-block',
      transform: 'skewX(-12deg)',
      border: `3px solid ${t.border}`,
      background: t.bg,
      boxShadow: '3px 3px 0px #0D0D0D',
      padding: '3px 14px',
      ...style,
    }}>
      <span style={{
        display: 'inline-block',
        transform: 'skewX(12deg)',
        fontFamily: "'Barlow Condensed', Oswald, sans-serif",
        fontSize: '13px',
        fontWeight: 800,
        textTransform: 'uppercase',
        fontStyle: 'italic',
        letterSpacing: '0.14em',
        color: t.color,
      }}>
        {children}
      </span>
    </span>
  );
}
