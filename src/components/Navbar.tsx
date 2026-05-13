import React from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { LayoutGrid, FlaskConical, Cpu, Bot, FileText, Info, Zap, Moon, Sun } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Navbar() {
  const { setLabOpen, isLabOpen, theme, toggleTheme } = useAppStore();

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 h-20 px-6 flex items-center justify-between pointer-events-none"
    >
      <div className="flex items-center gap-2 pointer-events-auto cursor-pointer" onClick={() => setLabOpen(false)}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-neon to-blue-electric flex items-center justify-center shadow-lg shadow-indigo-neon/20">
          <Zap className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-display font-bold tracking-tighter text-slate-900 dark:text-white transition-colors">Circuit.<span className="text-blue-600">IQ</span></span>
      </div>

      <div className="hidden md:flex items-center gap-8 backdrop-blur-sm bg-white/50 dark:bg-black/10 border border-slate-200 dark:border-white/5 px-8 py-3 rounded-full pointer-events-auto transition-colors">
        <NavLink icon={<LayoutGrid size={18} />} label="Home" active={!isLabOpen} onClick={() => setLabOpen(false)} />
        <NavLink icon={<FlaskConical size={18} />} label="Experiments" />
        <NavLink icon={<Cpu size={18} />} label="Virtual Lab" active={isLabOpen} onClick={() => setLabOpen(true)} />
        <NavLink icon={<Bot size={18} />} label="PhysicsBot" />
        <NavLink icon={<FileText size={18} />} label="Docs" />
      </div>

      <div className="flex items-center gap-4 pointer-events-auto">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-slate-300"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button 
          onClick={() => setLabOpen(true)}
          className="btn-primary"
        >
          Launch Lab
        </button>
      </div>
    </motion.nav>
  );
}

function NavLink({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-white",
        active ? "text-blue-600 dark:text-white" : "text-slate-500 dark:text-slate-400"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
