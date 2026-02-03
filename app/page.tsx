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
      <Background />

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

        {/* Dynamic Content Area */}
        <div className="w-2/3 h-full flex items-center justify-center p-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 50, skewX: -10 }}
              animate={{ opacity: 1, x: 0, skewX: 0 }}
              exit={{ opacity: 0, x: -50, skewX: 10 }}
              transition={{ duration: 0.3 }}
              className={`text-white w-full transition-all duration-300
                ${activeSection !== 'home' ? 'bg-black/90 p-10 border-4 border-white p5-shadow max-w-2xl max-h-[80vh] overflow-y-auto' : 'p-0 overflow-visible flex items-center justify-center'}`}
              style={{
                clipPath: activeSection === 'home' ? 'none' : 'polygon(5% 0%, 100% 0%, 100% 95%, 95% 100%, 0% 100%, 0% 5%)'
              }}
            >
              {activeSection === 'home' && (
                <div className="flex items-center justify-center min-h-[300px]">
                  <CallingCard />
                </div>
              )}

              {activeSection === 'projects' && (
                <div>
                  <h2 className="text-4xl font-black mb-6 text-[#00ccff] uppercase">Confidants (Projects)</h2>
                  <div className="space-y-6">
                    {PORTFOLIO_DATA.projects.map(p => (
                      <div key={p.id} className="border-b-2 border-dashed border-gray-600 pb-4">
                        <h3 className="text-2xl font-bold">{p.title}</h3>
                        <span className="text-sm bg-[#D91C2B] px-2 py-0.5 rounded-sm">{p.category}</span>
                        <p className="mt-2 text-gray-300">{p.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'skills' && (
                <div>
                  <h2 className="text-4xl font-black mb-6 text-[#ffe600] uppercase text-black" style={{ textShadow: 'none' }}>Abilities</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {PORTFOLIO_DATA.skills.map(s => (
                      <div key={s.name} className="relative h-12 bg-gray-800 skew-x-[-12deg] overflow-hidden">
                        <div
                          className="absolute top-0 left-0 h-full bg-[#ffe600]"
                          style={{ width: `${s.power}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-between px-6 font-bold skew-x-[12deg]">
                          <span className='mix-blend-difference text-white'>{s.name}</span>
                          <span className='mix-blend-difference text-white'>{s.power}/99</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </Layout>
  );
}
