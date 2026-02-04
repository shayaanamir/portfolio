'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Background from '@/components/UI/Background';
import CallingCard from '@/components/UI/CallingCard';
import Menu from '@/components/UI/Menu';
import Layout from '@/components/UI/Layout';
import { PORTFOLIO_DATA } from '@/app/data/portfolio';

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');

  return (
    <Layout>
      {/* Persistent Layers */}
      <Background activeSection={activeSection} />

      {/* Main UI Layer - Fades in after intro */}
      <motion.div
        className="relative z-10 w-full h-full flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        {/* Menu */}
        <div className="w-1/3 h-full relative">
          <Menu onSelect={setActiveSection} />
        </div>

        {/* Dynamic Content Area - REMOVED as per request to focus on 3D world */}
        <div className="w-2/3 h-full pointer-events-none">
          {/* Placeholder for future non-intrusive UI if needed */}
        </div>
      </motion.div>
    </Layout>
  );
}
