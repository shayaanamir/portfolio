import React, { useState } from 'react';

interface CallingCardButtonProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  tone?: 'crimson' | 'chalk' | 'rust';
  size?: 'md' | 'lg';
}

const tones: Record<string, { bg: string; color: string; border: string; hoverBg: string; hoverColor: string }> = {
  crimson: { bg: '#D92323', color: '#FFFFFF', border: '#FFFFFF', hoverBg: '#FFFFFF', hoverColor: '#D92323' },
  chalk:   { bg: '#FFFFFF', color: '#0D0D0D', border: '#0D0D0D', hoverBg: '#D92323', hoverColor: '#FFFFFF' },
  rust:    { bg: '#732424', color: '#FFFFFF', border: '#FFFFFF', hoverBg: '#FFFFFF', hoverColor: '#732424' },
};

/**
 * Slanted "calling card" CTA — hover inverts colors and removes shadow
 * so the button reads as pressed into the board.
 */
export function CallingCardButton({ children, icon, trailing, href, onClick, tone = 'crimson', size = 'md' }: CallingCardButtonProps) {
  const [hovered, setHovered] = useState(false);
  const t = tones[tone];
  const pad = size === 'lg' ? '16px 32px' : '10px 20px';
  const fontSize = size === 'lg' ? '22px' : '15px';

  const style: React.CSSProperties = {
    display: 'inline-block',
    transform: hovered ? 'skewX(-12deg) translate(-2px,-2px)' : 'skewX(-12deg)',
    border: `3px solid ${t.border}`,
    background: hovered ? t.hoverBg : t.bg,
    boxShadow: hovered ? 'none' : '6px 6px 0px #0D0D0D',
    padding: pad,
    cursor: 'pointer',
    transition: 'transform 0.15s, box-shadow 0.15s, background 0.15s, color 0.15s',
    textDecoration: 'none',
  };

  const innerStyle: React.CSSProperties = {
    display: 'flex',
    transform: 'skewX(12deg)',
    alignItems: 'center',
    gap: '10px',
    fontFamily: "'Archivo Black', Impact, sans-serif",
    textTransform: 'uppercase',
    fontSize,
    lineHeight: 1,
    color: hovered ? t.hoverColor : t.color,
    letterSpacing: '0.04em',
    whiteSpace: 'nowrap',
  };

  const inner = (
    <span style={innerStyle}>
      {icon}{children}{trailing}
    </span>
  );

  if (href) {
    return (
      <a href={href} style={style} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        {inner}
      </a>
    );
  }

  return (
    <button type="button" style={style} onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {inner}
    </button>
  );
}
