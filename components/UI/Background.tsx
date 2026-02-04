"use client";

import Scene from "@/components/Canvas/Scene";

interface BackgroundProps {
    activeSection: string;
}

export default function Background({ activeSection }: BackgroundProps) {
    return (
        <Scene activeSection={activeSection} />
    );
}
