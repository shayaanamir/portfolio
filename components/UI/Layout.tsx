'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <main className="relative w-full h-screen overflow-hidden bg-halftone text-white">
            {/* Background elements (static noise, etc can go here) */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('/noise.png')]"></div>

            {/* Content Wrapper */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </main>
    );
}
