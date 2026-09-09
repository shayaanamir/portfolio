import React, { useState } from 'react';
import { SlantBanner } from '../p5/SlantBanner';
import { SkewBadge } from '../p5/SkewBadge';

const channels = [
  {
    label: 'EMAIL',
    value: 'shayaanamir@example.com',
    href: 'mailto:shayaanamir@example.com',
    accent: { bg: '#D92323', iconColor: '#FFFFFF', tileBorder: '#FFFFFF' },
    icon: '✉',
  },
  {
    label: 'GITHUB',
    value: 'github.com/shayaanamir',
    href: 'https://github.com/shayaanamir',
    accent: { bg: '#FFFFFF', iconColor: '#0D0D0D', tileBorder: '#0D0D0D' },
    icon: '⌥',
  },
  {
    label: 'LINKEDIN',
    value: 'linkedin.com/in/shayaanamir',
    href: 'https://linkedin.com/in/shayaanamir',
    accent: { bg: '#732424', iconColor: '#FFFFFF', tileBorder: '#FFFFFF' },
    icon: 'in',
  },
];

interface ChannelTileProps {
  channel: typeof channels[0];
  index: number;
}

function ChannelTile({ channel, index }: ChannelTileProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <li>
      <a
        href={channel.href}
        target={channel.label !== 'EMAIL' ? '_blank' : undefined}
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative', display: 'flex', alignItems: 'center', gap: '24px',
          border: '5px solid #FFFFFF', background: hovered ? '#D92323' : '#0D0D0D',
          padding: '24px 32px',
          boxShadow: hovered ? '0px 0px 0px #0D0D0D' : '6px 6px 0px #0D0D0D',
          transform: hovered ? 'rotate(0deg) translateY(-3px)' : `rotate(${index % 2 === 0 ? '-1deg' : '1deg'})`,
          transition: 'transform 0.2s, box-shadow 0.2s, background 0.2s',
          textDecoration: 'none',
          cursor: 'pointer',
          overflow: 'hidden',
        }}
      >
        {/* Halftone */}
        <span style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(rgba(123,123,123,0.35) 1.6px, transparent 1.7px)',
          backgroundSize: '9px 9px', opacity: 0.45,
        }} aria-hidden="true" />

        {/* Icon tile */}
        <span style={{
          position: 'relative', display: 'grid', placeItems: 'center',
          width: '72px', height: '72px', flexShrink: 0,
          transform: 'skewX(-12deg)',
          border: `4px solid ${channel.accent.tileBorder}`,
          background: channel.accent.bg,
        }}>
          <span style={{
            transform: 'skewX(12deg)',
            fontSize: '28px',
            color: channel.accent.iconColor,
            fontFamily: channel.label === 'LINKEDIN' ? "'Archivo Black', sans-serif" : 'inherit',
            fontWeight: 900,
          }}>
            {channel.icon}
          </span>
        </span>

        {/* Text */}
        <span style={{ position: 'relative', minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: '40px', textTransform: 'uppercase', lineHeight: 1, letterSpacing: '0.06em', color: '#FFFFFF' }}>
            {channel.label}
          </span>
          <span style={{ display: 'block', marginTop: '6px', fontFamily: "'Roboto Mono', ui-monospace, monospace", fontSize: '13px', fontWeight: 700, letterSpacing: '0.2em', color: hovered ? '#FFFFFF' : '#7B7B7B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {channel.value}
          </span>
        </span>

        {/* Arrow */}
        <span style={{
          position: 'relative', marginLeft: 'auto', fontSize: '40px',
          color: hovered ? '#FFFFFF' : '#D92323',
          transform: hovered ? 'translate(4px, -4px)' : 'none',
          transition: 'transform 0.2s, color 0.2s',
        }} aria-hidden="true">
          ↗
        </span>
      </a>
    </li>
  );
}

export function ContactContent() {
  return (
    <div style={{
      width: '100%', height: '100%', background: '#0D0D0D',
      overflowY: 'auto', boxSizing: 'border-box',
      scrollbarWidth: 'thin', scrollbarColor: '#D92323 #0D0D0D',
    }}>
      <div style={{ padding: '32px 40px 56px', minHeight: '100%', boxSizing: 'border-box' }}>
        <SlantBanner
          kicker="GET IN TOUCH"
          title="CONTACT"
          titleSize="28px"
          meta={
            <>
              <SkewBadge tone="chalk">REPLIES WITHIN A DAY</SkewBadge>
              <SkewBadge tone="ink">OPEN TO PROJECTS</SkewBadge>
            </>
          }
        />

        <p style={{
          margin: '36px 0 28px', maxWidth: '680px',
          fontFamily: "'Barlow Condensed', Oswald, sans-serif",
          fontSize: '22px', lineHeight: 1.4, color: 'rgba(255,255,255,0.85)',
        }}>
          Product launches, configurators, interactive stories — if it runs in a browser
          and needs to look good doing it, pick a line below.
        </p>

        <ul style={{ display: 'flex', flexDirection: 'column', gap: '20px', listStyle: 'none', margin: 0, padding: 0 }}>
          {channels.map((channel, i) => (
            <ChannelTile key={channel.label} channel={channel} index={i} />
          ))}
        </ul>

        {/* Hazard footer */}
        <div style={{
          marginTop: '40px', height: '14px',
          borderTop: '3px solid #FFFFFF', borderBottom: '3px solid #FFFFFF',
          backgroundImage: 'repeating-linear-gradient(-45deg, #D92323 0 13px, #0D0D0D 13px 26px)',
        }} aria-hidden="true" />
      </div>
    </div>
  );
}