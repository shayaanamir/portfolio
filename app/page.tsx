'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Background from '@/components/UI/Background';
import Layout from '@/components/UI/Layout';
import { RadialMenu } from '@/components/UI/RadialMenu';
import { PressAnyKey } from '@/components/UI/PressAnyKey';
import { menuItems } from '@/data/menuItems';

const IGNORED_KEYS = ['Escape', 'Tab', 'Shift', 'Control', 'Alt', 'Meta', 'CapsLock'];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const reduce = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Safety fallback: if 3D scene doesn't fire intro within 4s, reveal prompt
  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroDone(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpen = useCallback(() => {
    setMenuOpen(true);
    // Transition scene immediately to the first active menu item
    if (menuItems.length > 0) {
      setActiveSection(menuItems[0].id);
    }
  }, []);

  const handleClose = useCallback(() => {
    setMenuOpen(false);
    setActiveSection('home');
  }, []);

  const handleSelect = useCallback((id: string) => {
    setActiveSection(id);
  }, []);

  const handleIntroComplete = useCallback(() => {
    setIntroDone(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (menuOpen) {
        if (e.key === 'Escape') {
          handleClose();
        }
        return;
      }
      // Only allow opening menu after intro camera pan completes
      if (!introDone) return;
      if (IGNORED_KEYS.includes(e.key)) return;
      e.preventDefault();
      handleOpen();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen, introDone, handleClose, handleOpen]);

  const uiLayer = (
    <div
      id="ui-portal-root"
      className="fixed inset-0 pointer-events-none select-none"
      style={{ zIndex: 999999, isolation: 'isolate' }}
    >
      <AnimatePresence mode="wait">
        {menuOpen ? (
          <motion.div
            key="menu"
            className="pointer-events-none absolute inset-0 origin-bottom-left"
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
        ) : introDone ? (
          <PressAnyKey
            key="prompt"
            onEnter={handleOpen}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );

  return (
    <Layout>
      {/* Persistent 3D Three.js Canvas */}
      <Background
        activeSection={activeSection}
        onIntroComplete={handleIntroComplete}
      />

      {/* Render UI layer directly into document.body to guarantee it is above all CSS3D billboards */}
      {mounted ? createPortal(uiLayer, document.body) : null}
    </Layout>
  );
}
