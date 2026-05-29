import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import AntigravityHero from '../components/AntigravityHero';
import PhysicsWavyRibbon from '../components/PhysicsWavyRibbon';
import PhysicsShowcase from '../components/PhysicsShowcase';
import CyberpunkLedMatrix from '../components/CyberpunkLedMatrix';
import TeamRolesSection from '../components/TeamRolesSection';
import { useAppStore } from '../store/useAppStore';
import { Zap, Cpu, MousePointer2, FlaskConical } from 'lucide-react';
import Lenis from 'lenis';

export default function LandingPage() {
  const { setLabOpen } = useAppStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  const yText = useTransform(scrollY, [0, 800], [0, 250]);
  const scaleText = useTransform(scrollY, [0, 800], [1, 0.8]);
  const opacityText = useTransform(scrollY, [0, 600], [1, 0]);
  const trackingText = useTransform(scrollY, [0, 800], ["-0.05em", "0.15em"]);
  const rotateXText = useTransform(scrollY, [0, 800], [0, 45]);
  const rotateZText = useTransform(scrollY, [0, 800], [0, 5]);
  const blurText = useTransform(scrollY, [0, 600], ["blur(0px)", "blur(10px)"]);

  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div ref={scrollRef} className="relative min-h-[500vh] bg-transparent">
      <AntigravityHero />

      {/* Hero Content */}
      <section className="sticky top-0 h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 text-[10px] font-bold tracking-[0.2em] uppercase mb-8">
            <Zap className="w-3 h-3 text-blue-600 dark:text-blue-400 animate-pulse" />
            <span>Next-Gen Simulation Engine</span>
          </div>
          
          <motion.h1 
            style={{ 
              y: yText, 
              scale: scaleText, 
              opacity: opacityText, 
              letterSpacing: trackingText,
              rotateX: rotateXText,
              rotateZ: rotateZText,
              filter: blurText
            }}
            className="text-8xl md:text-9xl font-display font-bold text-cinematic mb-6 leading-none"
          >
            Circuit.IQ
          </motion.h1>
          
          <motion.p 
            style={{ y: useTransform(scrollY, [0, 800], [0, 200]), opacity: opacityText }}
            className="max-w-2xl mx-auto text-2xl text-slate-500 dark:text-slate-400 font-light italic mb-12 leading-relaxed"
          >
            AI-Powered Virtual Physics Laboratory for the <span className="text-blue-600 dark:text-blue-400">Modern Engineer</span>.
          </motion.p>

          <motion.div style={{ opacity: opacityText }} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => setLabOpen(true)}
              className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl flex items-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-200 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-900/10 dark:shadow-white/10"
            >
              Start Experimenting
              <Zap size={20} fill="currentColor" />
            </button>
            <button className="px-10 py-4 bg-transparent border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
              Explore Library
            </button>
          </motion.div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 flex flex-col items-center gap-2 opacity-50"
        >
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">Scroll to Build</span>
          <MousePointer2 size={16} className="text-slate-500 dark:text-slate-400" />
        </motion.div>
      </section>

      {/* Assembly Section */}
      <section id="simulation-section" className="relative h-[150vh] flex flex-col items-center justify-center pointer-events-none">
         {/* The breadboard animation happens over this scroll distance */}
      </section>

      {/* Experiments Explorer Section with Wavy Ribbon stretching 100% full screen width */}
      <section id="experiments-section" className="relative py-32 w-full overflow-hidden">
          <div className="w-full mb-16">
              <PhysicsWavyRibbon />
          </div>
          
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-20">
                <h2 className="text-5xl font-display font-bold mb-4 text-slate-900 dark:text-white">Physics Domains</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Explore our extensive library of interactive physics experiments designed for students and enthusiasts.</p>
              </div>

              <div className="mt-16">
                <PhysicsShowcase />
              </div>
          </div>
      </section>

      {/* Cyberpunk LED Matrix Showcase Component */}
      <section className="relative py-20 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <CyberpunkLedMatrix />
        </div>
      </section>

      {/* Team Roles / Founders Showcase */}
      <TeamRolesSection />

      {/* Lab CTA */}
      <section className="py-24 flex flex-col items-center justify-center text-center">
          <h2 className="text-5xl md:text-6xl font-display font-medium tracking-tight mb-8 text-slate-900 dark:text-white">Ready to Experiment?</h2>
          <button 
            onClick={() => setLabOpen(true)}
            className="px-10 py-4.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-base hover:scale-105 transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/10"
          >
            Enter Virtual Laboratory
          </button>
      </section>

      {/* High-Fidelity Circuit.IQ Styled Footer */}
      <footer className="w-full bg-white dark:bg-space-black px-8 md:px-16 pt-24 pb-12 border-t border-slate-100 dark:border-white/5 relative z-10 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 mb-20 md:mb-28">
          {/* Left Column heading */}
          <div className="text-left">
            <h3 className="text-4xl md:text-5xl font-display font-normal tracking-tight text-slate-900 dark:text-white leading-tight">
              Ignite high-fidelity physics
            </h3>
          </div>

          {/* Right Columns of links */}
          <div className="flex gap-16 md:gap-28 text-left pr-4 md:pr-12">
            {/* Column A */}
            <div className="flex flex-col gap-3.5">
              <a href="#experiments" className="text-[13px] md:text-[14px] text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors duration-200">Simulation Engine</a>
              <a href="#virtual-lab" className="text-[13px] md:text-[14px] text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors duration-200">Interactive Labs</a>
              <a href="#formulas" className="text-[13px] md:text-[14px] text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors duration-200">Formulas & Equations</a>
              <a href="#changelog" className="text-[13px] md:text-[14px] text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors duration-200">Changelog</a>
              <a href="#sandbox" className="text-[13px] md:text-[14px] text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors duration-200">Virtual Sandbox</a>
              <a href="#releases" className="text-[13px] md:text-[14px] text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors duration-200">Research Releases</a>
            </div>

            {/* Column B */}
            <div className="flex flex-col gap-3.5">
              <a href="#blog" className="text-[13px] md:text-[14px] text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors duration-200">Academic Blog</a>
              <a href="#pricing" className="text-[13px] md:text-[14px] text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors duration-200">Lab Partners</a>
              <a href="#usecases" className="text-[13px] md:text-[14px] text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors duration-200">Physics Systems</a>
            </div>
          </div>
        </div>

        {/* Massive overlapping text design exactly like reference image */}
        <div className="w-full overflow-hidden text-center mb-16 select-none pointer-events-none">
          <motion.h2 
            initial={{ y: "40%", opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-[12.8vw] font-bold tracking-tighter text-slate-950 dark:text-white leading-none font-display inline-block"
            style={{ 
              letterSpacing: "-0.04em",
              fontStretch: "condensed"
            }}
          >
            Circuit.IQ
          </motion.h2>
        </div>

        {/* Lower branding bar */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-sans">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 dark:text-white text-[15px] tracking-tight font-display">Circuit.IQ Live Lab</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2.5 text-[12px] text-slate-600 dark:text-slate-400">
            <a href="#about" className="hover:text-slate-950 dark:hover:text-white transition-colors duration-200">About Circuit.IQ</a>
            <a href="#products" className="hover:text-slate-950 dark:hover:text-white transition-colors duration-200">Virtual Labs</a>
            <a href="#privacy" className="hover:text-slate-950 dark:hover:text-white transition-colors duration-200">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-950 dark:hover:text-white transition-colors duration-200">Terms of Use</a>
          </div>
        </div>
      </footer>

      <style>{`
        .text-gradient {
          background: linear-gradient(to right, #3b82f6, #9333ea);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 transition-colors">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{title}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
      </div>
    </div>
  );
}

function CategoryCard({ title, icon, items }: { title: string, icon: React.ReactNode, items: string[] }) {
  return (
    <div className="glass-panel p-8 group hover:border-blue-500/30 transition-colors cursor-pointer bg-white/80 dark:bg-black/40">
      <div className="text-blue-600 dark:text-blue-400 mb-6 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-xl font-display font-bold mb-4 text-slate-900 dark:text-white">{title}</h3>
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item} className="text-slate-600 dark:text-slate-400 text-sm flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-blue-500" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}


