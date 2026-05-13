import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import AntigravityHero from '../components/AntigravityHero';
import { useAppStore } from '../store/useAppStore';
import { Zap, Cpu, MousePointer2, FlaskConical } from 'lucide-react';
import Lenis from 'lenis';

export default function LandingPage() {
  const { setLabOpen } = useAppStore();
  const scrollRef = useRef<HTMLDivElement>(null);

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
          
          <h1 className="text-8xl md:text-9xl font-display font-bold tracking-tighter text-cinematic mb-6 leading-none">
            Circuit.IQ
          </h1>
          
          <p className="max-w-2xl mx-auto text-2xl text-slate-500 dark:text-slate-400 font-light italic mb-12 leading-relaxed">
            AI-Powered Virtual Physics Laboratory for the <span className="text-blue-600 dark:text-blue-400">Modern Engineer</span>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
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
          </div>
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
      <section id="simulation-section" className="relative h-[200vh] flex flex-col items-center justify-center pointer-events-none">
         <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-12 max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 z-20"
          >
            <div>
              <h2 className="text-4xl font-display font-bold mb-6 text-slate-900 dark:text-white">Real-time Simulation</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Experience physics like never before. Our custom-built solver handles thousands of nodes in real-time, providing immediate feedback for electronic circuits, electromagnetic fields, and wave propagation.
              </p>
              <div className="flex flex-col gap-4">
                <FeatureItem icon={<Cpu size={20}/>} title="SPICE-compliant solver" description="Industry standard accuracy in your browser." />
                <FeatureItem icon={<Zap size={20}/>} title="High-frequency analysis" description="Simulate signals up to 10GHz with ease." />
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 aspect-video bg-blue-50/50 dark:bg-blue-900/10 flex items-center justify-center">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent)]" />
               <motion.div 
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
               >
                  <Cpu size={100} className="text-blue-500 opacity-20" />
               </motion.div>
            </div>
         </motion.div>
      </section>

      {/* Experiments Explorer */}
      <section className="relative px-6 py-32 max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-display font-bold mb-4 text-slate-900 dark:text-white">Physics Domains</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Explore our extensive library of interactive physics experiments designed for students and enthusiasts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CategoryCard title="Electricity & Circuits" icon={<Zap size={32}/>} items={["Ohm's Law", "KVL & KCL", "RLC Circuits"]} />
            <CategoryCard title="Optics & Light" icon={<FlaskConical size={32}/>} items={["Snell's Law", "Prism Dispersion", "Ideal Lens"]} />
            <CategoryCard title="Modern Physics" icon={<Cpu size={32}/>} items={["Photoelectric Effect", "Bohr Model", "Boyle's Law"]} />
          </div>
      </section>

      {/* Lab CTA */}
      <section className="py-32 flex flex-col items-center justify-center text-center">
          <h2 className="text-6xl font-display font-bold mb-8 text-slate-900 dark:text-white">Ready to Experiment?</h2>
          <button 
            onClick={() => setLabOpen(true)}
            className="px-12 py-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg hover:scale-110 transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/10"
          >
            Enter Virtual Laboratory
          </button>
      </section>

      <footer className="py-12 border-t border-slate-200 dark:border-white/10 text-center text-slate-500 dark:text-slate-400 text-[10px] font-mono tracking-[0.3em] uppercase relative z-10 transition-colors">
          © 2026 Circuit.IQ Laboratory • All Rights Reserved
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
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


