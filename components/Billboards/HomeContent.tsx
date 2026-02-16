
import { CSSProperties } from 'react';

export function HomeContent() {
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
    };

    return (
        <div>
            <h1 style={headingStyle}>Welcome</h1>
            <p style={{ fontSize: '28px', lineHeight: 1.6, marginBottom: '16px' }}>
                Hi, I'm a creative developer passionate about building immersive web experiences.
            </p>
            <p style={{ fontSize: '22px', lineHeight: 1.6, opacity: 0.8 }}>
                Explore my work and let's create something amazing together.
            </p>
            <button
                style={baseButtonStyle}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onClick={() => alert('Button clicked! You can add your custom logic here.')}
            >
                Get Started
            </button>
        </div>
    );
}