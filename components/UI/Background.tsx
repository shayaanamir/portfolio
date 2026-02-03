"use client";

import { motion } from "framer-motion";

export default function Background() {
    return (
        <motion.div
            className="fixed inset-0 z-0 overflow-hidden bg-transparent" // Transparent so body color or image transparency works
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // smooth ease-out
        >
            <img
                src="/images/background.png"
                alt="Background"
                className="w-full h-full object-cover"
                style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "cover",
                }}
            />
            {/* Optional: Add a subtle overlay or pattern if needed later */}
        </motion.div>
    );
}
