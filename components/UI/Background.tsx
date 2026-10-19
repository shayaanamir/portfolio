"use client";

import Scene from "@/components/Canvas/Scene";

interface BackgroundProps {
    activeSection: string;
    onIntroComplete?: () => void;
}

export default function Background({ activeSection, onIntroComplete }: BackgroundProps) {
    return (
        <Scene activeSection={activeSection} onIntroComplete={onIntroComplete} />
    );
}
