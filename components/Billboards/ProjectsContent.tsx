import React, { useState } from 'react';
import { SlantBanner } from '../p5/SlantBanner';
import { SkewBadge } from '../p5/SkewBadge';
import { CallingCardButton } from '../p5/CallingCardButton';
import { SlashDivider } from '../p5/SlashDivider';

const projects = [
  {
    number: '01', title: 'METAVERSE', titleB: 'ENGINE',
    subtitle: 'Interactive 3D World',
    brief: 'Streamed GLTF districts, instanced crowd shaders, 60 FPS on mid-tier laptops.',
    tags: ['THREE.JS', 'R3F', 'TYPESCRIPT'], status: 'LIVE' as const, year: '2025',
  },
  {
    number: '02', title: 'LIQUID', titleB: 'CHROME',
    subtitle: 'Realtime Shader Playground',
    brief: 'Raymarched metal surfaces with live GLSL editing and a node-based material graph.',
    tags: ['GLSL', 'WEBGL2', 'ZUSTAND'], status: 'LIVE' as const, year: '2024',
  },
  {
    number: '03', title: 'PRODUCT', titleB: 'CONFIGURATOR',
    subtitle: '3D Commerce Experience',
    brief: 'Cut checkout friction by 34% with configurable materials and camera choreography.',
    tags: ['NEXT.JS', 'R3F', 'GSAP'], status: 'IN PROGRESS' as const, year: '2026',
  },
];

const statusStyle: Record<string, { bg: string; color: string }> = {
  'LIVE': { bg: '#D92323', color: '#FFFFFF' },
  'IN PROGRESS': { bg: '#FFFFFF', color: '#0D0D0D' },
  'CASE STUDY': { bg: '#7B7B7B', color: '#0D0D0D' },
};

interface ProjectCardProps {
  project: typeof projects[0];
  featured?: boolean;
  tilt?: string;
}

function ProjectCard({ project, featured = false, tilt = '-1deg' }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);
  const s = statusStyle[project.status];

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', display: 'flex', flexDirection: 'column', height: '100%',
        border: '4px solid #FFFFFF', background: '#0D0D0D',
        boxShadow: hovered ? '0px 0px 0px #0D0D0D' : '6px 6px 0px #0D0D0D',
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)',
        transform: hovered ? 'rotate(0deg) translate(-2px, -2px)' : `rotate(${tilt})`,
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'default',
        overflow: 'hidden',
      }}
    >
      {/* Halftone */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(rgba(123,123,123,0.35) 1.6px, transparent 1.7px)',
        backgroundSize: '9px 9px', opacity: 0.45,
      }} aria-hidden="true" />

      {/* Angled red corner */}
      <div style={{
        position: 'absolute', right: 0, top: 0, width: '56px', height: '56px',
        background: '#D92323', clipPath: 'polygon(100% 0, 100% 100%, 0 0)',
      }} aria-hidden="true" />

      {/* Header bar */}
      <div style={{
        position: 'relative', display: 'flex', alignItems: 'center', gap: '10px',
        borderBottom: '3px solid #FFFFFF', background: '#732424',
        padding: '8px 20px',
      }}>
        <span style={{ fontFamily: "'Roboto Mono', ui-monospace, monospace", fontSize: '10px', fontWeight: 700, letterSpacing: '0.3em', color: '#FFFFFF' }}>
          {project.number}
        </span>
        <span style={{ fontFamily: "'Roboto Mono', ui-monospace, monospace", fontSize: '9px', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.7)' }}>
          {project.year}
        </span>
        <span style={{
          marginLeft: 'auto', marginRight: '40px',
          transform: 'skewX(-12deg)',
          background: s.bg, color: s.color,
          padding: '2px 10px',
          fontFamily: "'Barlow Condensed', Oswald, sans-serif",
          fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', fontStyle: 'italic',
        }}>
          <span style={{ display: 'inline-block', transform: 'skewX(12deg)' }}>{project.status}</span>
        </span>
      </div>

      {/* Body */}
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: featured ? '16px' : '10px', padding: featured ? '20px 24px' : '16px 20px' }}>
        <div>
          <h3 style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', margin: '0 0 8px' }}>
            <span style={{ background: '#FFFFFF', color: '#0D0D0D', fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: featured ? '36px' : '24px', textTransform: 'uppercase', lineHeight: 1, padding: '3px 8px', boxShadow: '3px 3px 0px #0D0D0D' }}>
              {project.title}
            </span>
            <span style={{ background: '#D92323', color: '#FFFFFF', fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: featured ? '36px' : '24px', textTransform: 'uppercase', lineHeight: 1, padding: '3px 8px', transform: 'rotate(-1deg)', boxShadow: '3px 3px 0px #0D0D0D' }}>
              {project.titleB}
            </span>
          </h3>
          <p style={{ fontFamily: "'Barlow Condensed', Oswald, sans-serif", fontSize: featured ? '14px' : '12px', fontWeight: 700, textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '0.2em', color: '#D92323', margin: 0 }}>
            {project.subtitle}
          </p>
        </div>

        <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', listStyle: 'none', margin: 0, padding: 0 }}>
          {project.tags.map((tag, i) => (
            <li key={tag} style={{
              padding: '2px 7px',
              fontFamily: "'Roboto Mono', ui-monospace, monospace",
              fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em',
              background: i % 2 === 0 ? '#FFFFFF' : 'transparent',
              color: i % 2 === 0 ? '#0D0D0D' : '#FFFFFF',
              border: i % 2 === 0 ? 'none' : '1px solid #7B7B7B',
              transform: i % 3 === 0 ? 'rotate(-2deg)' : 'rotate(1deg)',
            }}>
              {tag}
            </li>
          ))}
        </ul>

        <p style={{ fontFamily: "'Barlow Condensed', Oswald, sans-serif", fontSize: featured ? '18px' : '14px', lineHeight: 1.4, color: 'rgba(255,255,255,0.85)', margin: 0 }}>
          {project.brief}
        </p>

        <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
          <CallingCardButton tone="chalk" href="#demo" icon={<span>↗</span>}>
            View project
          </CallingCardButton>
        </div>
      </div>
    </article>
  );
}

export function ProjectsContent() {
  const [featured, ...rest] = projects;

  return (
    <div style={{
      width: '100%', height: '100%', background: '#0D0D0D',
      overflowY: 'auto', boxSizing: 'border-box',
      scrollbarWidth: 'thin', scrollbarColor: '#D92323 #0D0D0D',
    }}>
      <div style={{ padding: '32px 40px 48px', minHeight: '100%', boxSizing: 'border-box' }}>
        <SlantBanner
          kicker="SELECTED WORK"
          title="PROJECTS"
          stripe="hazard"
          titleSize="28px"
          meta={
            <>
              <SkewBadge tone="chalk">INTERACTIVE 3D & WEBGL</SkewBadge>
              <SkewBadge tone="ink">2024 — 2026</SkewBadge>
            </>
          }
        />

        <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '24px' }}>
          <div>
            <ProjectCard project={featured} featured tilt="-1deg" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {rest.map((project, i) => (
              <ProjectCard key={project.number} project={project} tilt={i === 0 ? '1deg' : '-1deg'} />
            ))}
          </div>
        </div>

        <div style={{ marginTop: '40px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <SlashDivider tone="crimson" />
          <CallingCardButton tone="crimson" href="#archive" trailing={<span>→</span>}>
            See all projects
          </CallingCardButton>
        </div>
      </div>
    </div>
  );
}