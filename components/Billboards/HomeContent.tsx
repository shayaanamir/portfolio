import React, { CSSProperties, useEffect, useState } from 'react';
import { RansomText } from '../p5/RansomText';
import { SlashDivider } from '../p5/SlashDivider';

export function HomeContent() {
  const [phase, setPhase] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const phaseInterval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setPhase((prev) => (prev + 1) % 2), 300);
      setTimeout(() => setIsGlitching(false), 600);
    }, 3500);
    return () => clearInterval(phaseInterval);
  }, []);

  const containerStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#0D0D0D',
    position: 'relative',
    overflow: 'hidden',
    filter: isGlitching ? 'blur(2px) hue-rotate(90deg) brightness(1.3) contrast(1.5)' : 'none',
    opacity: isGlitching ? 0.7 : 1,
    transition: isGlitching ? 'none' : 'filter 0.3s ease-out, opacity 0.3s ease-out',
  };

  return (
    <div style={containerStyle}>
      {/* Halftone texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(rgba(123,123,123,0.25) 1.6px, transparent 1.7px)',
        backgroundSize: '9px 9px',
      }} aria-hidden="true" />

      {/* CRT scanlines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10,
        backgroundImage: 'repeating-linear-gradient(to bottom, rgba(13,13,13,0.5) 0 1px, rgba(13,13,13,0) 1px 3px)',
        opacity: 0.4,
      }} aria-hidden="true" />

      {/* Hazard top stripe */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '16px',
        backgroundImage: 'repeating-linear-gradient(-45deg, #D92323 0 12px, #0D0D0D 12px 24px)',
        borderBottom: '3px solid #FFFFFF',
        opacity: 0.9,
      }} aria-hidden="true" />

      {/* Hazard bottom stripe */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '16px',
        backgroundImage: 'repeating-linear-gradient(-45deg, #D92323 0 12px, #0D0D0D 12px 24px)',
        borderTop: '3px solid #FFFFFF',
        opacity: 0.9,
      }} aria-hidden="true" />

      {/* Phase 0: HELLO! in ransom-note vertical style */}
      {phase === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', zIndex: 5 }}>
          <span style={{
            fontFamily: "'Roboto Mono', ui-monospace, monospace",
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.42em',
            color: '#D92323',
          }}>
            SHAYAAN AMIR // CREATIVE DEVELOPER
          </span>
          <h1 style={{ margin: 0 }}>
            <RansomText text="HELLO !" fontSize="72px" />
          </h1>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <SlashDivider tone="crimson" />
            <span style={{
              fontFamily: "'Barlow Condensed', Oswald, sans-serif",
              fontSize: '22px',
              fontWeight: 700,
              fontStyle: 'italic',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: '#7B7B7B',
            }}>
              THREE.JS • WEBGL • REACT
            </span>
            <SlashDivider tone="crimson" />
          </div>
        </div>
      )}

      {/* Phase 1: I AM / SHAYAAN AMIR */}
      {phase === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', zIndex: 5 }}>
          <h1 style={{ margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <span style={{
              fontFamily: "'Barlow Condensed', Oswald, sans-serif",
              fontSize: '40px',
              fontWeight: 800,
              fontStyle: 'italic',
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              color: '#7B7B7B',
            }}>
              I AM
            </span>
            <span style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <span style={{
                display: 'inline-block',
                background: '#FFFFFF',
                color: '#0D0D0D',
                fontFamily: "'Archivo Black', Impact, sans-serif",
                fontSize: '80px',
                textTransform: 'uppercase',
                lineHeight: 1,
                padding: '6px 18px',
                transform: 'rotate(-1.5deg)',
                boxShadow: '6px 6px 0px #0D0D0D',
              }}>
                SHAYAAN
              </span>
              <span style={{
                display: 'inline-block',
                background: '#D92323',
                color: '#FFFFFF',
                fontFamily: "'Archivo Black', Impact, sans-serif",
                fontSize: '80px',
                textTransform: 'uppercase',
                lineHeight: 1,
                padding: '6px 18px',
                transform: 'rotate(1deg)',
                boxShadow: '6px 6px 0px #732424',
              }}>
                AMIR
              </span>
            </span>
          </h1>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px' }}>
            {['CREATIVE DEVELOPER', 'TOKYO / REMOTE', 'OPEN TO WORK'].map((badge, i) => (
              <span key={badge} style={{
                display: 'inline-block',
                transform: 'skewX(-12deg)',
                background: i === 0 ? '#D92323' : i === 1 ? '#FFFFFF' : '#0D0D0D',
                color: i === 1 ? '#0D0D0D' : '#FFFFFF',
                border: `3px solid ${i === 1 ? '#0D0D0D' : '#FFFFFF'}`,
                boxShadow: '3px 3px 0px #0D0D0D',
                padding: '3px 14px',
              }}>
                <span style={{
                  display: 'inline-block', transform: 'skewX(12deg)',
                  fontFamily: "'Barlow Condensed', Oswald, sans-serif",
                  fontSize: '13px', fontWeight: 800, textTransform: 'uppercase',
                  fontStyle: 'italic', letterSpacing: '0.14em',
                }}>
                  {badge}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}