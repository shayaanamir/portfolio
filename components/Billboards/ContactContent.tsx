import { CSSProperties } from "react";

export function ContactContent() {
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
            <h1 style={headingStyle}>Get In Touch</h1>
            <p style={{ fontSize: '26px', lineHeight: 1.6, marginBottom: '24px' }}>
                Let's collaborate on your next project!
            </p>
            <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
                <a href="mailto:hello@example.com" style={{ color: '#667eea', textDecoration: 'none', fontSize: '22px', cursor: 'pointer' }}>
                    📧 hello@example.com
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: '#667eea', textDecoration: 'none', fontSize: '22px', cursor: 'pointer' }}>
                    🐦 @yourhandle
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: '#667eea', textDecoration: 'none', fontSize: '22px', cursor: 'pointer' }}>
                    💻 github.com/yourusername
                </a>
            </div>
            <button
                style={baseButtonStyle}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onClick={() => alert('Send Message clicked!')}
            >
                Send Message
            </button>
        </div>
    );
}