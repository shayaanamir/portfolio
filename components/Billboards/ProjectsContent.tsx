import { CSSProperties } from "react";

export function ProjectsContent() {
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

    const projectCardStyle: CSSProperties = {
        padding: '20px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background 0.2s'
    };

    return (
        <div>
            <h1 style={headingStyle}>Projects</h1>
            <div style={{ display: 'grid', gap: '16px', maxHeight: 'calc(100% - 250px)', overflowY: 'auto' }}>
                <div
                    style={projectCardStyle}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onClick={() => alert('Project 1 clicked!')}
                >
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '28px' }}>3D Portfolio</h3>
                    <p style={{ fontSize: '20px', opacity: 0.8 }}>Interactive 3D experience built with Three.js</p>
                </div>
                <div
                    style={projectCardStyle}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onClick={() => alert('Project 2 clicked!')}
                >
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '28px' }}>WebGL Game</h3>
                    <p style={{ fontSize: '20px', opacity: 0.8 }}>Multiplayer browser game with real-time physics</p>
                </div>
            </div>
            <button
                style={baseButtonStyle}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onClick={() => alert('View All Projects clicked!')}
            >
                View All Projects
            </button>
        </div>
    );
}