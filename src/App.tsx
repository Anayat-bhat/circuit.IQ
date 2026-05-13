/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useAppStore } from './store/useAppStore';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LabStudio from './pages/LabStudio';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const { isLabOpen } = useAppStore();

  return (
    <div className="min-h-screen bg-space-black relative overflow-hidden">
      <div className="atmospheric-bg" />
      <div className="glow-top-left" />
      <div className="glow-bottom-right" />
      
      <Navbar />
      
      <AnimatePresence mode="wait">
        {!isLabOpen ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <LandingPage />
          </motion.div>
        ) : (
          <motion.div
            key="lab"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <LabStudio />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

