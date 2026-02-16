import { CSSProperties } from "react";

export function AboutContent() {
    const baseButtonStyle: CSSProperties = {
        padding: '16px 32px',
        fontSize: '22px',
        cursor: 'pointer',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        marginTop: '20px',
        transition: 'transform 0.2s',
        fontWeight: 600,
    };

    const headingStyle: CSSProperties = {
        margin: '0 0 24px 0',
        fontSize: '64px',
        fontWeight: 700,
        background: 'linear-gradient(135deg, #ffffffff 0%, #ffffffff 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    };

    return (
        <div>
            <h1 style={headingStyle}>About Me</h1>
            <p style={{ fontSize: '24px', lineHeight: 1.6, marginBottom: '16px' }}>
                I specialize in Three.js, React, and creative coding.
            </p>
            <ul style={{ fontSize: '22px', lineHeight: 1.8, opacity: 0.9 }}>
                <li>🎨 Creative Development</li>
                <li>🚀 WebGL & Three.js</li>
                <li>⚡ React & Next.js</li>
                <li>🎯 Interactive Experiences</li>
            </ul>
            <button
                style={baseButtonStyle}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onClick={() => alert('Download Resume clicked!')}
            >
                Download Resume
            </button>
        </div>
    );
}