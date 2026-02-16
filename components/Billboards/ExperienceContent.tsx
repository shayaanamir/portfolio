import { CSSProperties } from "react";

export function ExperienceContent() {
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
            <h1 style={headingStyle}>Experience</h1>
            <div style={{ display: 'grid', gap: '24px', maxHeight: 'calc(100% - 200px)', overflowY: 'auto' }}>
                <div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '32px' }}>Senior Frontend Developer</h3>
                    <p style={{ fontSize: '18px', opacity: 0.6, margin: '0 0 12px 0' }}>
                        Company Name • 2022 - Present
                    </p>
                    <p style={{ fontSize: '22px', lineHeight: 1.6, opacity: 0.9 }}>
                        Leading development of interactive 3D web experiences and WebGL applications.
                    </p>
                </div>
                <div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '32px' }}>Creative Developer</h3>
                    <p style={{ fontSize: '18px', opacity: 0.6, margin: '0 0 12px 0' }}>
                        Agency • 2020 - 2022
                    </p>
                    <p style={{ fontSize: '22px', lineHeight: 1.6, opacity: 0.9 }}>
                        Built award-winning interactive campaigns for major brands.
                    </p>
                </div>
            </div>
        </div>
    );
}