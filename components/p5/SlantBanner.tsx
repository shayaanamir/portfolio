import React from 'react';
import { RansomText } from './RansomText';
import { SkewBadge } from './SkewBadge';

interface SlantBannerProps {
  kicker: string;
  title: string;
  stripe?: 'hazard' | 'hazard-red' | 'none';
  meta?: React.ReactNode;
  titleSize?: string;
}

const stripeStyle: Record<string, React.CSSProperties> = {
  hazard: {
    backgroundImage: 'repeating-linear-gradient(-45deg, #D92323 0 13px, #0D0D0D 13px 26px)',
  },
  'hazard-red': {
    backgroundImage: 'repeating-linear-gradient(-45deg, #732424 0 13px, #0D0D0D 13px 26px)',
  },
};

/**
 * Slanted crimson screen header with ransom-note title letters,
 * optional warning-tape stripe running across the bottom edge.
 */
export function SlantBanner({ kicker, title, stripe = 'hazard-red', meta, titleSize = '28px' }: SlantBannerProps) {
  return (
    <header style={{ position: 'relative', marginBottom: '8px' }}>
      {/* Main slanted band */}
      <div style={{
        position: 'relative',
        transform: 'skewY(-1deg)',
        borderTop: '5px solid #FFFFFF',
        borderBottom: '5px solid #FFFFFF',
        background: '#D92323',
        boxShadow: '6px 6px 0px #0D0D0D',
        overflow: 'hidden',
      }}>
        {/* Halftone overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(115,36,36,0.85) 2.2px, transparent 2.3px)',
          backgroundSize: '12px 12px',
          opacity: 0.7,
          pointerEvents: 'none',
        }} aria-hidden="true" />

        <div style={{
          position: 'relative',
          transform: 'skewY(1deg)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px 24px',
          padding: '16px 32px',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{
              fontFamily: "'Roboto Mono', ui-monospace, monospace",
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.42em',
              color: '#FFFFFF',
            }}>
              {kicker}
            </span>
            <h1>
              <span style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>{title}</span>
              <span aria-hidden="true">
                <RansomText text={title} fontSize={titleSize} />
              </span>
            </h1>
          </div>
          {meta && (
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
              {meta}
            </div>
          )}
        </div>
      </div>

      {/* Hazard stripe */}
      {stripe !== 'none' && (
        <div style={{
          position: 'absolute',
          bottom: '-12px',
          left: '40px',
          right: '96px',
          height: '18px',
          transform: 'rotate(-1deg)',
          borderTop: '3px solid #0D0D0D',
          borderBottom: '3px solid #0D0D0D',
          opacity: 0.95,
          pointerEvents: 'none',
          ...(stripe === 'hazard' ? stripeStyle.hazard : stripeStyle['hazard-red']),
        }} aria-hidden="true" />
      )}
    </header>
  );
}
