import React, { useState } from 'react';
import { SlantBanner } from '../p5/SlantBanner';
import { SkewBadge } from '../p5/SkewBadge';
import { CallingCardButton } from '../p5/CallingCardButton';
import { SlashDivider } from '../p5/SlashDivider';

const skills = [
  { label: 'WebGL', note: 'Realtime rendering', icon: '⬡' },
  { label: 'Three.js', note: 'Scenes & tooling', icon: '△' },
  { label: 'React / Next.js', note: 'App architecture', icon: '</>' },
  { label: 'GLSL Shaders', note: 'Custom materials', icon: '∿' },
  { label: 'Motion Design', note: 'Framer Motion, GSAP', icon: '✦' },
  { label: 'Creative Direction', note: 'Concept to launch', icon: '◎' },
];

const traits = ['60 FPS PERFORMANCE BUDGETS', 'SHADER-FIRST THINKING', 'DESIGN & CODE IN ONE PAIR OF HANDS'];

export function AboutContent() {
  const [hoveredSkill, setHoveredSkill] = useState<number | null>(null);

  return (
    <div style={{
      width: '100%', height: '100%', background: '#0D0D0D',
      overflowY: 'auto', boxSizing: 'border-box',
      scrollbarWidth: 'thin', scrollbarColor: '#D92323 #0D0D0D',
    }}>
      <div style={{ padding: '32px 40px 48px', minHeight: '100%', boxSizing: 'border-box' }}>
        <SlantBanner
          kicker="PROFILE"
          title="ABOUT ME"
          titleSize="28px"
          meta={
            <>
              <SkewBadge tone="chalk">CREATIVE DEVELOPER</SkewBadge>
              <SkewBadge tone="ink">TOKYO / REMOTE</SkewBadge>
            </>
          }
        />

        {/* Bio statement */}
        <div style={{ marginTop: '40px', position: 'relative' }}>
          <div style={{
            border: '4px solid #FFFFFF', background: '#FFFFFF',
            boxShadow: '6px 6px 0px #0D0D0D',
            clipPath: 'polygon(0 14px, 3% 0, 100% 0, 100% calc(100% - 18px), 96% 100%, 2% 100%, 0 calc(100% - 6px))',
          }}>
            <div style={{ padding: '28px 32px 40px' }}>
              <p style={{
                fontFamily: "'Roboto Mono', ui-monospace, monospace",
                fontSize: '10px', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.3em',
                color: '#D92323', margin: '0 0 10px',
              }}>
                SHAYAAN AMIR // INTRODUCTION
              </p>
              <p style={{
                fontFamily: "'Barlow Condensed', Oswald, sans-serif",
                fontSize: '32px', fontWeight: 800, fontStyle: 'italic',
                textTransform: 'uppercase', lineHeight: 1.05,
                color: '#0D0D0D', margin: '0 0 16px',
              }}>
                I build interactive 3D experiences for the browser.
              </p>
              <p style={{
                fontFamily: "'Barlow Condensed', Oswald, sans-serif",
                fontSize: '18px', lineHeight: 1.4, color: 'rgba(13,13,13,0.8)',
                margin: 0,
              }}>
                Specializing in{' '}
                <span style={{ background: '#0D0D0D', color: '#FFFFFF', padding: '1px 5px' }}>Three.js</span>,{' '}
                <span style={{ background: '#D92323', color: '#FFFFFF', padding: '1px 5px' }}>shaders</span>, interactive WebGL and
                React architecture. Turning storyboards into realtime work that holds 60 FPS on a mid-range laptop.
              </p>
            </div>
          </div>
          <span style={{
            position: 'absolute', bottom: '-10px', left: '64px',
            height: '20px', width: '28px', background: '#FFFFFF',
            clipPath: 'polygon(0 0, 100% 0, 20% 100%)',
          }} aria-hidden="true" />
        </div>

        {/* Traits */}
        <ul style={{ margin: '28px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {traits.map((trait, i) => (
            <li key={trait}>
              <SkewBadge tone={i === 0 ? 'crimson' : i === 1 ? 'rust' : 'chalk'}>{trait}</SkewBadge>
            </li>
          ))}
        </ul>

        <SlashDivider tone="crimson" style={{ margin: '24px 0' }} />

        {/* Skills */}
        <section aria-labelledby="skills-heading">
          <h2 id="skills-heading" style={{
            fontFamily: "'Archivo Black', Impact, sans-serif",
            fontSize: '18px', textTransform: 'uppercase',
            fontStyle: 'italic', letterSpacing: '0.18em',
            color: '#FFFFFF', margin: '0 0 16px',
          }}>
            Skills
          </h2>
          <ul style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '14px', listStyle: 'none', margin: 0, padding: 0,
          }}>
            {skills.map((skill, i) => {
              const isHovered = hoveredSkill === i;
              const skew = i % 2 === 0 ? 'skewX(-6deg)' : 'skewX(6deg)';
              return (
                <li
                  key={skill.label}
                  onMouseEnter={() => setHoveredSkill(i)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    border: '3px solid #FFFFFF',
                    background: isHovered ? '#D92323' : '#0D0D0D',
                    padding: '12px 14px',
                    boxShadow: '3px 3px 0px #0D0D0D',
                    transform: isHovered ? 'skewX(0deg)' : skew,
                    transition: 'transform 0.2s, background 0.2s',
                    cursor: 'default',
                  }}
                >
                  <span style={{
                    display: 'grid', placeItems: 'center',
                    width: '36px', height: '36px', flexShrink: 0,
                    border: '2px solid #FFFFFF',
                    background: '#0D0D0D',
                    color: isHovered ? '#FFFFFF' : '#D92323',
                    fontSize: '16px',
                    transform: i % 2 === 0 ? 'skewX(6deg)' : 'skewX(-6deg)',
                  }}>
                    {skill.icon}
                  </span>
                  <span style={{ transform: i % 2 === 0 ? 'skewX(6deg)' : 'skewX(-6deg)' }}>
                    <span style={{ display: 'block', fontFamily: "'Barlow Condensed', Oswald, sans-serif", fontSize: '16px', fontWeight: 700, textTransform: 'uppercase', fontStyle: 'italic', color: '#FFFFFF', lineHeight: 1.2 }}>
                      {skill.label}
                    </span>
                    <span style={{ display: 'block', fontFamily: "'Roboto Mono', ui-monospace, monospace", fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.16em', color: isHovered ? '#FFFFFF' : '#7B7B7B' }}>
                      {skill.note}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* CTA */}
        <div style={{ marginTop: '32px' }}>
          <CallingCardButton tone="crimson" size="lg" href="#resume" icon={<span style={{ fontSize: '20px' }}>↓</span>}>
            Download Resume (PDF)
          </CallingCardButton>
        </div>
      </div>
    </div>
  );
}