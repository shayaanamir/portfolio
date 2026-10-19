'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Background from '@/components/UI/Background';
import Layout from '@/components/UI/Layout';
import { RadialMenu } from '@/components/UI/RadialMenu';
import { PressAnyKey } from '@/components/UI/PressAnyKey';
import { menuItems } from '@/data/menuItems';

const IGNORED_KEYS = ['Escape', 'Tab', 'Shift', 'Control', 'Alt', 'Meta', 'CapsLock'];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const reduce = useReducedMotion();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (menuOpen) {
        if (e.key === 'Escape') {
          setMenuOpen(false);
          setActiveSection('home');
        }
        return;
      }
      if (IGNORED_KEYS.includes(e.key)) return;
      e.preventDefault();
      setMenuOpen(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const handleSelect = (id: string) => {
    setActiveSection(id);
  };

  const handleClose = () => {
    setMenuOpen(false);
    setActiveSection('home');
  };

  return (
    <Layout>
      {/* Persistent 3D Three.js Canvas */}
      <Background activeSection={activeSection} />

      {/* Main UI Layer */}
      <AnimatePresence mode="wait">
        {menuOpen ? (
          <motion.div
            key="menu"
            className="pointer-events-none absolute inset-0 origin-bottom-left z-20"
            initial={reduce ? false : { opacity: 0, rotate: -24 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={reduce ? undefined : { opacity: 0, rotate: -24 }}
            transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}
          >
            <RadialMenu
              items={menuItems}
              onSelect={handleSelect}
              onClose={handleClose}
            />
          </motion.div>
        ) : (
          <PressAnyKey
            key="prompt"
            onEnter={() => setMenuOpen(true)}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
}
