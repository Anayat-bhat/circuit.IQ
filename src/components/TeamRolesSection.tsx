import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { Play, Sparkles, User, Code, Cpu, Activity, FileText } from 'lucide-react';

interface TeamMember {
  id: number;
  role: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  bgGradient: string;
  visualEffect: React.ReactNode;
}

export default function TeamRolesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const xTranslation = useTransform(scrollYProgress, [0, 1], [150, -150]);

  const team: TeamMember[] = [
    {
      id: 1,
      role: "AI Integration + Project Lead",
      title: "Core AI Architect & Project Lead",
      description: "Directing semantic reasoning models, integrating agent scaffolding libraries, and keeping the lab's vision perfectly on track.",
      icon: <Cpu className="w-5 h-5 text-purple-400" />,
      bgGradient: "from-purple-600/20 via-slate-900 to-indigo-950/20",
      visualEffect: <QuantumParticlesWave color="#8b5cf6" />
    },
    {
      id: 2,
      role: "Physics Simulation Engineer",
      title: "Scientific Simulation Specialist",
      description: "Formulating physical constraints, ensuring rigid mathematical fidelity of Ohm's Law and KCL/KVL formulas dynamically.",
      icon: <Activity className="w-5 h-5 text-blue-400" />,
      bgGradient: "from-blue-600/20 via-slate-900 to-cyan-950/20",
      visualEffect: <MathWaves color="#3b82f6" />
    },
    {
      id: 3,
      role: "Frontend Developer",
      title: "User Experience Engineer",
      description: "Pistol-crafting buttery transitions, fine typography pairings, and responsive state synchronization across all systems.",
      icon: <Code className="w-5 h-5 text-emerald-400" />,
      bgGradient: "from-emerald-600/20 via-slate-900 to-teal-950/20",
      visualEffect: <UIBentoGrid color="#10b981" />
    },
    {
      id: 4,
      role: "Backend Developer",
      title: "Distributed Systems Engineer",
      description: "Sustaining concurrent real-time nodes, handling authentication caches, and ensuring database queries are blazing fast.",
      icon: <User className="w-5 h-5 text-amber-400" />,
      bgGradient: "from-amber-600/20 via-slate-900 to-orange-950/20",
      visualEffect: <DatabaseCylinder color="#f59e0b" />
    },
    {
      id: 5,
      role: "Content + QA + Documentation",
      title: "Technical Writer & Product QA",
      description: "Crafting comprehensive textbook-grade lab experiments, validating system states, and documenting every formula precisely.",
      icon: <FileText className="w-5 h-5 text-rose-400" />,
      bgGradient: "from-rose-600/20 via-slate-900 to-pink-950/20",
      visualEffect: <TextRain color="#f43f5e" />
    }
  ];

  return (
    <section ref={containerRef} className="relative py-36 w-full overflow-hidden bg-transparent select-none">
      <div className="max-w-7xl mx-auto px-6 mb-20 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/5 text-blue-600 dark:text-blue-400 text-[10px] font-mono font-bold tracking-widest uppercase mb-6">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>THE FIVE CORE FOUNDERS</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-display font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
              Built by engineers for the modern era
            </h2>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="text-slate-500 dark:text-slate-400 max-w-md text-base md:text-lg font-light leading-relaxed"
          >
            Meet the five dedicated craftspeople behind Circuit.IQ. Our mission is to democratize high-fidelity physics models for students and enthusiasts globally.
          </motion.p>
        </div>
      </div>

      {/* Horizontal horizontal sliding showcase - Styled to perfection like Google Antigravity */}
      <div className="w-full relative overflow-x-auto no-scrollbar py-8 px-6 lg:px-24">
        <motion.div 
          style={{ x: xTranslation }}
          className="flex gap-8 w-max min-w-full"
        >
          {team.map((member, index) => (
            <TeamMemberCard key={member.id} member={member} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Custom Team Member Card with Google Antigravity style tilt and text animations
function TeamMemberCard({ member, index }: { member: TeamMember; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Smooth mouse tilt coordinates
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), { stiffness: 150, damping: 22 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { stiffness: 150, damping: 22 });

  // Floating hover spotlight coordinates
  const [spotlight, setSpotlight] = useState({ posX: 0, posY: 0, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    x.set(mouseX / width);
    y.set(mouseY / height);

    setSpotlight({
      posX: e.clientX - rect.left,
      posY: e.clientY - rect.top,
      opacity: 1
    });
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setSpotlight((prev) => ({ ...prev, opacity: 0 }));
    setHovered(false);
  };

  // Define custom developer neon glow colors corresponding to each specific team member
  const getGlowColor = () => {
    if (member.id === 1) return 'rgba(168, 85, 247, 0.15)'; // Purple
    if (member.id === 2) return 'rgba(59, 130, 246, 0.15)';  // Blue
    if (member.id === 3) return 'rgba(16, 185, 129, 0.15)'; // Emerald
    if (member.id === 4) return 'rgba(245, 158, 11, 0.15)';  // Amber
    return 'rgba(244, 63, 94, 0.15)';                      // Rose
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 80, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 18,
        delay: index * 0.08 
      }}
      style={{ 
        rotateX: rotateX, 
        rotateY: rotateY, 
        transformStyle: "preserve-3d",
        perspective: "1200px"
      }}
      className="w-[380px] md:w-[440px] aspect-[13/16] rounded-[32px] bg-slate-950 border border-slate-800/80 hover:border-slate-700 dark:hover:border-slate-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] transition-all duration-300 relative overflow-hidden flex flex-col justify-between group cursor-pointer p-9 select-none"
    >
      {/* Background radial gradient spotlight tracker */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 rounded-[32px] z-10"
        style={{
          opacity: spotlight.opacity,
          background: `radial-gradient(450px circle at ${spotlight.posX}px ${spotlight.posY}px, ${getGlowColor()}, transparent 100%)`
        }}
      />

      {/* Background visual effect matching specific roles */}
      <div className={`absolute inset-0 bg-gradient-to-br ${member.bgGradient} opacity-30 z-0 transition-opacity duration-300 group-hover:opacity-40`} />
      
      {/* Dynamic interactive background element (representing video simulator work canvas) */}
      <div className="absolute inset-0 z-10 overflow-hidden opacity-25 group-hover:opacity-65 group-hover:scale-105 transition-all duration-500">
        {member.visualEffect}
      </div>

      {/* High-tech grid overlay inside card */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-10" style={{
        backgroundImage: "linear-gradient(to right, rgba(255, 255, 255, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 1px, transparent 1px)",
        backgroundSize: "24px 24px"
      }} />

      {/* Premium Video Play Overlay with high-fidelity glassmorphism */}
      <div className="absolute inset-0 flex items-center justify-center z-20 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[3px]">
        <div className="flex flex-col items-center gap-4">
          <motion.div 
            animate={hovered ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] } : {}}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-xl flex items-center justify-center shadow-2xl shadow-black/80 ring-4 ring-white/5"
          >
            <Play className="w-6 h-6 text-white fill-white translate-x-[2px]" />
          </motion.div>
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-[10px] font-mono font-bold tracking-widest text-white px-3 py-1 bg-white/5 rounded-full border border-white/10 shadow-lg"
          >
            PLAY PROTOTYPE DEMO
          </motion.span>
        </div>
      </div>

      {/* Card Header Info with 3D Pop Out */}
      <div className="relative z-20 flex justify-between items-start transition-transform duration-300" style={{ transform: hovered ? "translateZ(50px) scale(1.02)" : "translateZ(20px)" }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700/80 flex items-center justify-center shadow-xl group-hover:border-slate-500/50 transition-colors duration-300">
            {member.icon}
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider">TEAM FOUNDER</span>
            <div className="text-xs font-mono font-extrabold text-slate-300 tracking-wide group-hover:text-white transition-colors duration-200">{member.role}</div>
          </div>
        </div>
      </div>

      {/* Card Bottom Panel with Title & Description sliding upwards */}
      <div className="relative z-20 space-y-4 transition-transform duration-300" style={{ transform: hovered ? "translateZ(60px)" : "translateZ(20px)" }}>
        <h3 className="text-2xl md:text-3xl font-bold font-display text-white tracking-tight group-hover:text-blue-400 transition-colors duration-200">
          {member.title}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed font-light group-hover:text-slate-200 transition-colors duration-300">
          {member.description}
        </p>
      </div>
    </motion.div>
  );
}

// -----------------------------------------------------------------------------------------------------------
// 5 beautiful futuristic code-like dynamic canvas visualizers
// -----------------------------------------------------------------------------------------------------------

function QuantumParticlesWave({ color }: { color: string }) {
  return (
    <div className="w-full h-full relative">
      <div className="absolute inset-0 bg-transparent flex items-center justify-center">
        <div className="w-2/3 h-2/3 border border-purple-500/10 rounded-full animate-ping opacity-25" />
        <div className="w-1/2 h-1/2 border border-violet-500/10 rounded-full animate-spin-slow opacity-30" />
      </div>
      <svg className="w-full h-full">
        <path d="M 0,100 Q 100,20 200,100 T 400,100" fill="none" stroke={`${color}15`} strokeWidth="3" className="animate-pulse" />
        <path d="M 0,130 Q 150,220 300,130 T 400,130" fill="none" stroke={`${color}10`} strokeWidth="2" />
      </svg>
    </div>
  );
}

function MathWaves({ color }: { color: string }) {
  return (
    <div className="w-full h-full relative">
      <svg className="w-full h-full">
        <g stroke={`${color}15`} strokeWidth="1.5" fill="none">
          <path d="M0 140 C 90 200, 150 50, 400 140" />
          <path d="M0 160 C 120 120, 180 200, 400 120" />
          <path d="M0 110 C 60 70, 220 180, 400 160" />
        </g>
      </svg>
    </div>
  );
}

function UIBentoGrid({ color }: { color: string }) {
  return (
    <div className="w-full h-full p-6 flex flex-col justify-between opacity-20 group-hover:opacity-40 transition-opacity duration-300">
      <div className="flex gap-2">
        <div className="w-1/3 aspect-video rounded-md bg-white/5 border border-white/5" />
        <div className="w-2/3 aspect-video rounded-md bg-white/5 border border-white/5" />
      </div>
      <div className="w-full h-1/3 rounded-md bg-white/5 border border-white/5 mt-auto" />
    </div>
  );
}

function DatabaseCylinder({ color }: { color: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
      <div className="w-16 h-8 rounded-full border border-amber-500/10 bg-amber-500/5 animate-pulse" />
      <div className="w-16 h-8 rounded-full border border-amber-500/15 bg-amber-500/5 scale-105" />
      <div className="w-16 h-8 rounded-full border border-amber-500/10 bg-amber-500/5" />
    </div>
  );
}

function TextRain({ color }: { color: string }) {
  return (
    <div className="w-full h-full font-mono text-[7px] text-slate-500/20 p-4 leading-normal select-none overflow-hidden text-left">
      <div>import {`{ motion }`} from 'motion/react';</div>
      <div>const LayoutCycle = () =&gt; {`{`}</div>
      <div className="pl-2">const [decay, setDecay] = useState(0.4);</div>
      <div className="pl-2">useEffect(() =&gt; {`{`}</div>
      <div className="pl-4">const sim = createPhysicsSimulation();</div>
      <div className="pl-4">sim.addNode(OhmLawCircuit);</div>
      <div className="pl-2">{`}, [])`}</div>
      <div>{`}`}</div>
      <div className="mt-4">export default LayoutCycle;</div>
    </div>
  );
}
