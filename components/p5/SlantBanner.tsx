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

/**
 * Screen header banner.
 *
 * Firefox / CSS3D compatibility note:
 * - NO skewY transform — nested skew inside CSS3DRenderer's preserve-3d
 *   context is misinterpreted as a 3D operation in Firefox, collapsing the
 *   banner to near-zero height.
 * - Instead, a flat crimson bar with a thick left accent stripe suggests the
 *   P5 energy without any transforms at all.
 * - h1 uses position:relative so its SR-only absolute child stays contained.
 */
export function SlantBanner({ kicker, title, stripe = 'hazard-red', meta, titleSize = '28px' }: SlantBannerProps) {
  return (
    <header style={{ position: 'relative', marginBottom: stripe !== 'none' ? '24px' : '8px' }}>
      {/* Crimson banner — flat (no skewY) */}
      <div style={{
        position: 'relative',
        background: '#D92323',
        borderTop: '5px solid #FFFFFF',
        borderBottom: '5px solid #FFFFFF',
        boxShadow: '6px 6px 0px #0D0D0D',
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
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px 24px',
          padding: '16px 32px',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Kicker */}
            <span style={{
              display: 'block',
              fontFamily: "'Roboto Mono', ui-monospace, monospace",
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.42em',
              color: '#FFFFFF',
            }}>
              {kicker}
            </span>

            {/* Title */}
            <h1 style={{ margin: 0, padding: 0, position: 'relative' }}>
              <span style={{
                position: 'absolute',
                width: '1px', height: '1px',
                padding: 0, margin: '-1px',
                overflow: 'hidden',
                clip: 'rect(0,0,0,0)',
                whiteSpace: 'nowrap',
                border: 0,
              }}>
                {title}
              </span>
              <span aria-hidden="true">
                <RansomText text={title} fontSize={titleSize} />
              </span>
            </h1>
          </div>

          {/* Meta badges */}
          {meta && (
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
              {meta}
            </div>
          )}
        </div>
      </div>

      {/* Hazard stripe — absolutely positioned below the banner */}
      {stripe !== 'none' && (
        <div style={{
          position: 'absolute',
          bottom: '-18px',
          left: '40px',
          right: '96px',
          height: '16px',
          borderTop: '3px solid #0D0D0D',
          borderBottom: '3px solid #0D0D0D',
          opacity: 0.95,
          pointerEvents: 'none',
          zIndex: 1,
          backgroundImage: stripe === 'hazard'
            ? 'repeating-linear-gradient(-45deg, #D92323 0 13px, #0D0D0D 13px 26px)'
            : 'repeating-linear-gradient(-45deg, #732424 0 13px, #0D0D0D 13px 26px)',
        }} aria-hidden="true" />
      )}
    </header>
  );
}
