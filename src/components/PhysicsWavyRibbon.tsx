import React, { useRef, useEffect } from 'react';
import { 
  Activity, 
  Play, 
  Workflow, 
  Cpu, 
  Magnet, 
  Waves, 
  Atom, 
  Gauge, 
  Zap, 
  Triangle, 
  Scale, 
  Thermometer, 
  Compass, 
  RotateCw 
} from 'lucide-react';

const icons = [
  { Icon: Activity, label: "Resistor" },
  { Icon: Play, label: "Diode" },
  { Icon: Cpu, label: "Transistor" },
  { Icon: Workflow, label: "Capacitor" },
  { Icon: Magnet, label: "Magnet" },
  { Icon: Waves, label: "Waveform" },
  { Icon: Atom, label: "Quantum Atom" },
  { Icon: Gauge, label: "Voltmeter" },
  { Icon: Zap, label: "Electric Charge" },
  { Icon: Triangle, label: "Optic Prism" },
  { Icon: Scale, label: "Gravity" },
  { Icon: Thermometer, label: "Thermodynamics" },
  { Icon: Compass, label: "Magnetometer" },
  { Icon: RotateCw, label: "Kinematics" }
];

export default function PhysicsWavyRibbon() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  // Handle tracking of mouse inside the container
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseRef.current = { x, y, active: true };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const container = containerRef.current;
    if (container) {
      window.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (container) {
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // Animation Loop for real-time physics calculation at 60fps/120fps
  useEffect(() => {
    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      time += 0.03; // speed of the wave moving down the ribbon
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const containerWidth = rect.width;
      const containerHeight = rect.height;

      const itemsLength = icons.length;
      const spacing = containerWidth / (itemsLength + 1);

      itemRefs.current.forEach((el, index) => {
        if (!el) return;

        // Base horizontal spacing evenly distributed across container
        const targetX = spacing * (index + 1);

        // Sine wave calculations for wavy structure
        const frequency = 0.0045; // shape & tightness of the waves (smooth, elegant)
        const waveX = targetX * frequency - time;
        const baseHeight = containerHeight / 2;
        
        // Beautiful deeper amplitude wave (80px displacement)
        let targetY = baseHeight + Math.sin(waveX) * 80;

        // Mouse interaction logic (magnetic pull and vertical/horizontal bending)
        let scale = 1;
        let shadowOpacity = 0.06;
        let rotationX = 0;
        let rotationY = 0;
        let skewX = 0;

        if (mouseRef.current.active) {
          const mX = mouseRef.current.x;
          const mY = mouseRef.current.y;
          const dx = mX - targetX;
          const dy = mY - targetY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Proximity effect radius
          if (distance < 220) {
            const force = (220 - distance) / 220; // normalized force value [0 to 1]
            
            // Softly bend and lift the item to follow the mouse height
            targetY += dy * force * 0.6;
            
            // Interactive 3D tilt effects
            rotationY = dx * force * 0.2;
            rotationX = -dy * force * 0.2;
            skewX = (dx * dy) * force * 0.0012;

            // Bouncy scale up on proximity
            scale = 1 + force * 0.22;
            shadowOpacity = 0.06 + force * 0.15;
          }
        }

        // Apply advanced inline style parameters straight on DOM elements for maximum GPU-accelerated framerates
        // Circle is w-18 (72px), so subtract 36px to center perfectly on the coordinate
        el.style.transform = `translate3d(${targetX - 36}px, ${targetY - 36}px, 0px) scale(${scale}) rotateX(${rotationX}deg) rotateY(${rotationY}deg) skewX(${skewX}deg)`;
        
        // Dynamic borders & shadows based on theme and mouse proximity
        el.style.boxShadow = `0 ${10 * scale}px ${30 * scale}px rgba(59, 130, 246, ${shadowOpacity})`;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-64 overflow-hidden mb-12 pointer-events-auto"
      style={{ perspective: "1000px" }}
    >
      
      {icons.map((item, idx) => {
        const IconComponent = item.Icon;
        return (
          <div
            key={idx}
            ref={el => { itemRefs.current[idx] = el; }}
            className="absolute left-0 top-0 w-18 h-18 rounded-full flex items-center justify-center transition-shadow duration-300 cursor-pointer group select-none
                     bg-white/90 dark:bg-slate-900/70 backdrop-blur-md
                     border border-slate-200/60 dark:border-white/15
                     shadow-md hover:border-blue-500/45 dark:hover:border-blue-400/45"
          >
            <div className="flex flex-col items-center justify-center relative">
              <IconComponent 
                className="w-7 h-7 text-slate-800 dark:text-slate-200 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200" 
                strokeWidth={1.75}
              />
              {/* Discrete indicator label on hover */}
              <span className="absolute -bottom-8 scale-0 group-hover:scale-100 transition-all duration-200 text-[10px] font-mono whitespace-nowrap bg-slate-950 text-white dark:bg-white dark:text-slate-950 px-2.5 py-1 rounded-md shadow-lg z-20 font-bold uppercase tracking-wider">
                {item.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
