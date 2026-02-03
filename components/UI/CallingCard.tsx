"use client";

import { motion } from "framer-motion";
import { PORTFOLIO_DATA } from "@/app/data/portfolio";

export default function CallingCard() {
    return (
        // Perspective container for 3D effect
        <div className="w-full max-w-4xl mx-auto" style={{ perspective: "1500px" }}>
            <motion.div
                className="relative pointer-events-auto"
                initial={{
                    x: "80vw",      // Start from right side of viewport
                    y: "80vh",      // Start from bottom of viewport
                    z: 2000,        // Very close to camera
                    rotateX: 60,
                    rotateY: -30,
                    rotateZ: 90,    // Perpendicular start
                    opacity: 0,
                    scale: 1.5      // Start slightly larger
                }}
                animate={{
                    x: 0,
                    y: 0,
                    z: 0,
                    rotateX: 5,     // Settled 
                    rotateY: 0,     // Settled
                    rotateZ: -5,
                    opacity: 1,
                    scale: 1        // Natural size for crisp text
                }}
                transition={{
                    duration: 0.6,
                    delay: 0.2,
                    type: "spring",
                    stiffness: 150,
                    damping: 20,
                    mass: 1,
                    opacity: { duration: 0.1 }
                }}
            >
                {/* The Card Container */}
                <div className="relative bg-white p-3 shadow-2xl border-4 border-black max-w-3xl mx-auto transform-style-3d">

                    {/* Red graphical accent (Top Left corner) */}
                    <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#D91C2B] z-[-1]" />

                    {/* Main Content Box */}
                    <div className="bg-black p-8 text-white relative overflow-hidden">

                        <div className="border-4 border-white p-6">

                            <h1 className="text-6xl md:text-8xl font-bold uppercase italic text-white leading-tight drop-shadow-md pb-4" style={{ fontFamily: 'impact, sans-serif' }}>
                                {PORTFOLIO_DATA.name}
                            </h1>

                            <div className="mt-4 text-right">
                                <span className="text-2xl md:text-3xl font-bold bg-[#D91C2B] text-white px-4 py-2 uppercase skew-x-[-10deg] inline-block">
                                    {PORTFOLIO_DATA.title}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
