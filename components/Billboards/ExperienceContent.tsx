import React, { useState } from 'react';
import { SlantBanner } from '../p5/SlantBanner';
import { SkewBadge } from '../p5/SkewBadge';

const roles = [
  {
    number: '01', role: 'LEAD FRONTEND', org: 'ENGINEER',
    period: '2023 — PRESENT', current: true,
    points: [
      'Shipped 6+ WebGL experiences holding 60 FPS on mid-tier hardware',
      'Built the shared React Three Fiber component library used by 4 product teams',
      'Cut first paint on the flagship 3D configurator from 4.8s to 1.6s',
    ],
  },
  {
    number: '02', role: 'CREATIVE', org: 'DEVELOPER',
    period: '2021 — 2023', current: false,
    points: [
      'Two Awwwards Site of the Day wins and one FWA for an interactive launch',
      'Led 11 campaign builds from concept board through release',
      'Introduced shader-based transitions now standard across the studio',
    ],
  },
  {
    number: '03', role: 'UI / UX &', org: 'WEB INTERN',
    period: '2020 — 2021', current: false,
    points: [
      'Rebuilt the design system in Figma, then again in code',
      'First projects in Three.js — the start of the 3D work',
    ],
  },
];

interface RoleCardProps {
  entry: typeof roles[0];
  tilt?: string;
  isFirst?: boolean;
}

function RoleCard({ entry, tilt = '-1deg', isFirst = false }: RoleCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', display: 'flex', flexDirection: 'column',
        border: '4px solid #FFFFFF', background: '#0D0D0D',
        boxShadow: hovered ? '0px 0px 0px #0D0D0D' : '6px 6px 0px #0D0D0D',
        transform: hovered ? 'rotate(0deg)' : `rotate(${tilt})`,
        transition: 'transform 0.2s, box-shadow 0.2s',
        overflow: 'hidden',
      }}
    >
      {/* Halftone */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(rgba(123,123,123,0.35) 1.6px, transparent 1.7px)',
        backgroundSize: '9px 9px', opacity: 0.4,
      }} aria-hidden="true" />

      {/* CURRENT badge */}
      {entry.current && (
        <span style={{
          position: 'absolute', top: '-14px', right: '-10px', zIndex: 10,
          transform: 'rotate(-14deg)',
          border: '3px solid #D92323', background: '#0D0D0D',
          padding: '3px 12px',
          fontFamily: "'Archivo Black', Impact, sans-serif",
          fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em',
          color: '#D92323',
        }}>
          CURRENT
        </span>
      )}

      {/* Header bar */}
      <div style={{
        position: 'relative', display: 'flex', alignItems: 'center', gap: '10px',
        borderBottom: '3px solid #FFFFFF', background: '#732424', padding: '7px 20px',
      }}>
        <span style={{ fontFamily: "'Roboto Mono', ui-monospace, monospace", fontSize: '10px', fontWeight: 700, letterSpacing: '0.3em', color: '#FFFFFF' }}>
          {entry.number}
        </span>
        <span style={{ marginLeft: 'auto', fontFamily: "'Barlow Condensed', Oswald, sans-serif", fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '0.18em', color: '#FFFFFF' }}>
          {entry.period}
        </span>
      </div>

      {/* Body */}
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px', padding: '18px 20px' }}>
        <h3 style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', margin: 0 }}>
          <span style={{ background: '#FFFFFF', color: '#0D0D0D', fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: '20px', textTransform: 'uppercase', lineHeight: 1, padding: '2px 8px', boxShadow: '3px 3px 0px #0D0D0D' }}>
            {entry.role}
          </span>
          <span style={{ background: '#D92323', color: '#FFFFFF', fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: '20px', textTransform: 'uppercase', lineHeight: 1, padding: '2px 8px', transform: 'rotate(-1deg)', boxShadow: '3px 3px 0px #0D0D0D' }}>
            {entry.org}
          </span>
        </h3>

        <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', listStyle: 'none', margin: 0, padding: 0 }}>
          {entry.points.map((point) => (
            <li key={point} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <span style={{
                marginTop: '6px', width: '10px', height: '10px', flexShrink: 0,
                background: '#D92323', transform: 'skewX(-12deg)', display: 'inline-block',
              }} aria-hidden="true" />
              <span style={{ fontFamily: "'Barlow Condensed', Oswald, sans-serif", fontSize: '15px', lineHeight: 1.4, color: 'rgba(255,255,255,0.85)' }}>
                {point}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function ExperienceContent() {
  return (
    <div style={{
      width: '100%', height: '100%', background: '#0D0D0D',
      overflowY: 'auto', boxSizing: 'border-box',
      scrollbarWidth: 'thin', scrollbarColor: '#D92323 #0D0D0D',
    }}>
      <div style={{ padding: '32px 40px 48px', minHeight: '100%', boxSizing: 'border-box' }}>
        <SlantBanner
          kicker="CAREER"
          title="EXPERIENCE"
          stripe="hazard"
          titleSize="28px"
          meta={
            <>
              <SkewBadge tone="chalk">CREATIVE DEV</SkewBadge>
              <SkewBadge tone="ink">3 ROLES</SkewBadge>
            </>
          }
        />

        {/* Hazard divider */}
        <div style={{
          margin: '28px 0',
          height: '14px',
          borderTop: '3px solid #FFFFFF', borderBottom: '3px solid #FFFFFF',
          backgroundImage: 'repeating-linear-gradient(-45deg, #D92323 0 13px, #0D0D0D 13px 26px)',
        }} aria-hidden="true" />

        {/* Timeline + cards */}
        <div style={{ position: 'relative' }}>
          {/* Zigzag timeline */}
          <div style={{
            position: 'absolute', left: '22px', top: 0, width: '24px', height: '100%',
            pointerEvents: 'none',
          }} aria-hidden="true">
            <svg viewBox="0 0 24 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <polyline points="12,0 20,14 4,30 20,48 4,66 20,82 12,100" fill="none" stroke="#D92323" strokeWidth="5" />
              <polyline points="12,0 20,14 4,30 20,48 4,66 20,82 12,100" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
            </svg>
          </div>

          <ol style={{ display: 'flex', flexDirection: 'column', gap: '28px', listStyle: 'none', margin: 0, padding: 0 }}>
            {roles.map((entry, i) => (
              <li key={entry.number} style={{ position: 'relative', paddingLeft: '88px' }}>
                {/* Timeline dot */}
                <span style={{
                  position: 'absolute', left: '10px', top: '20px', zIndex: 10,
                  width: '44px', height: '44px',
                  display: 'grid', placeItems: 'center',
                  border: '4px solid #FFFFFF', background: '#0D0D0D',
                  boxShadow: '3px 3px 0px #0D0D0D',
                }} aria-hidden="true">
                  <span style={{ width: '14px', height: '14px', transform: 'skewX(-12deg)', background: i === 0 ? '#FFFFFF' : '#D92323', display: 'inline-block' }} />
                </span>
                <RoleCard entry={entry} tilt={i % 2 === 0 ? '-1deg' : '1deg'} isFirst={i === 0} />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}