import { CSSProperties, useEffect, useState } from 'react';

export function HomeContent() {
    const [phase, setPhase] = useState(0);
    const [isGlitching, setIsGlitching] = useState(false);

    useEffect(() => {
        const phaseInterval = setInterval(() => {
            // Start glitch effect
            setIsGlitching(true);

            // Change phase during glitch
            setTimeout(() => {
                setPhase((prev) => (prev + 1) % 2); // Only 2 phases now
            }, 300);

            // End glitch effect
            setTimeout(() => {
                setIsGlitching(false);
            }, 600);

        }, 3000);

        return () => clearInterval(phaseInterval);
    }, []);

    const containerStyle: CSSProperties = {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        gap: '20px',
        filter: isGlitching ? 'blur(2px) hue-rotate(90deg) brightness(1.3) contrast(1.5)' : 'none',
        opacity: isGlitching ? 0.7 : 1,
        transition: isGlitching ? 'none' : 'filter 0.3s ease-out, opacity 0.3s ease-out',
        fontFamily: 'Shoplift, sans-serif',
    };

    const glitchKeyframes = `
        @keyframes glitch-text {
            0%, 100% { 
                transform: translate(0);
                filter: hue-rotate(0deg);
            }
            10% { 
                transform: translate(-5px, 2px);
                filter: hue-rotate(90deg);
            }
            20% { 
                transform: translate(3px, -3px);
                filter: hue-rotate(180deg);
            }
            30% { 
                transform: translate(-2px, 1px);
                filter: hue-rotate(270deg);
            }
            40% { 
                transform: translate(4px, -2px);
                filter: hue-rotate(45deg);
            }
            50% { 
                transform: translate(-3px, 3px);
                filter: hue-rotate(135deg);
            }
            60% { 
                transform: translate(2px, -1px);
                filter: hue-rotate(225deg);
            }
            70% { 
                transform: translate(-1px, 2px);
                filter: hue-rotate(315deg);
            }
            80% { 
                transform: translate(3px, -3px);
                filter: hue-rotate(60deg);
            }
            90% { 
                transform: translate(-2px, 1px);
                filter: hue-rotate(120deg);
            }
        }
        @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
        }
    `;

    const verticalTextStyle: CSSProperties = {
        fontSize: '240px',
        fontWeight: 700,
        margin: 0,
        background: 'white',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        writingMode: 'vertical-lr',
        textOrientation: 'sideways',
        letterSpacing: '10px',
        fontFamily: 'Shoplift, sans-serif',
        animation: isGlitching ? 'glitch-text 0.6s linear' : 'none',
        textShadow: '0 0 30px rgba(102,126,234,0.5)',
    };

    const nameStyle: CSSProperties = {
        fontSize: '96px',
        fontWeight: 900,
        margin: 0,
        background: 'white',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontFamily: 'Shoplift, sans-serif',
        animation: isGlitching ? 'glitch-text 0.6s linear' : 'none',
        textShadow: '0 0 30px rgba(102,126,234,0.5)',
    };

    const textStyle: CSSProperties = {
        fontSize: '72px',
        fontWeight: 700,
        margin: 0,
        fontFamily: 'Shoplift, sans-serif',
        animation: isGlitching ? 'glitch-text 0.6s linear' : 'none',
    };

    // Scanline effect overlay
    const scanlineStyle: CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'repeating-linear-gradient(0deg, rgba(0, 255, 0, 0.03) 0px, rgba(0, 255, 0, 0.03) 1px, transparent 1px, transparent 2px)',
        pointerEvents: 'none',
        opacity: isGlitching ? 1 : 0.3,
        animation: 'scanline 8s linear infinite',
    };

    return (
        <>
            <style>{glitchKeyframes}</style>
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <div style={scanlineStyle}></div>
                <div style={containerStyle}>
                    {phase === 0 && (
                        <h1 style={verticalTextStyle}>
                            HELLO!
                        </h1>
                    )}
                    {phase === 1 && (
                        <>
                            <h1 style={textStyle}>I am</h1>
                            <h1 style={nameStyle}>SHAYAAN AMIR</h1>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}