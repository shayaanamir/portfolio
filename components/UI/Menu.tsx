'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const menuItems = [
    { label: 'HOME', id: 'home', color: '#ff0000' },
    { label: 'SKILLS', id: 'skills', color: '#ffe600' },
    { label: 'CONFIDANTS', id: 'projects', color: '#00ccff' },
    { label: 'MAP', id: 'contact', color: '#ff00ff' },
];

interface MenuProps {
    onSelect: (id: string) => void;
}

export default function Menu({ onSelect }: MenuProps) {
    const [hovered, setHovered] = useState<string | null>(null);

    return (
        <div className="fixed left-10 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4 font-bold uppercase tracking-tighter font-shoplift">
            {menuItems.map((item) => (
                <motion.div
                    key={item.id}
                    className="relative cursor-pointer group"
                    onHoverStart={() => setHovered(item.id)}
                    onHoverEnd={() => setHovered(null)}
                    onClick={() => onSelect(item.id)}
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 10 }}
                >
                    {/* Background jagged shape */}
                    <div
                        className={`absolute inset-0 bg-black -z-10 transform -skew-x-12 origin-left transition-transform duration-200 ${hovered === item.id ? 'scale-x-110' : 'scale-x-100'}`}
                        style={{ backgroundColor: hovered === item.id ? 'var(--p5-black)' : 'var(--p5-black)' }}
                    />

                    {/* Text Container */}
                    <div
                        className={`px-8 py-4 text-4xl md:text-6xl text-white transition-colors duration-200 p5-skew`}
                        style={{
                            color: hovered === item.id ? item.color : 'white',
                            textShadow: '2px 2px 0px black'
                        }}
                    >
                        {item.label}
                    </div>

                    {/* Decorative Elements */}
                    {hovered === item.id && (
                        <motion.div
                            layoutId="active-indicator"
                            className="absolute -right-12 top-1/2 w-20 h-2 bg-white"
                            style={{ backgroundColor: item.color }}
                        />
                    )}
                </motion.div>
            ))}
        </div>
    );
}
