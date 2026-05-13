import React, { useState, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, ContactShadows, PerspectiveCamera, Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Play, 
  Trash2, 
  Save, 
  Share2, 
  Plus, 
  Settings, 
  HelpCircle, 
  Bot,
  Layers,
  Activity,
  History,
  Zap,
  Cpu,
  FlaskConical,
  Box,
  MousePointer2
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../lib/utils';

// Constants for Breadboard & Snapping
const GRID_SIZE = 0.5;

// 3D Breadboard Component
const Breadboard3D = () => {
    return (
        <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
            <RoundedBox args={[12, 8, 0.4]} radius={0.1} smoothness={4}>
                <meshStandardMaterial color="#f1f5f9" roughness={0.3} metalness={0.1} />
            </RoundedBox>
            
            {/* Grid Holes */}
            {Array.from({ length: 23 }).map((_, i) => (
                Array.from({ length: 15 }).map((_, j) => (
                    <mesh key={`${i}-${j}`} position={[(i - 11) * GRID_SIZE, (j - 7) * GRID_SIZE, 0.21]}>
                        <circleGeometry args={[0.08, 16]} />
                        <meshBasicMaterial color="#cbd5e1" />
                    </mesh>
                ))
            ))}

            {/* Power rails */}
            <mesh position={[0, 3.8, 0.21]}>
                <planeGeometry args={[11, 0.05]} />
                <meshBasicMaterial color="#ef4444" />
            </mesh>
            <mesh position={[0, 4.2, 0.21]}>
                <planeGeometry args={[11, 0.05]} />
                <meshBasicMaterial color="#3b82f6" />
            </mesh>
        </group>
    );
}

// Draggable 3D Component with Grid Snapping Logic
const DraggableComponent = ({ 
    type, 
    initialPosition,
    onSelect
}: { 
    type: string, 
    initialPosition: [number, number, number],
    onSelect?: () => void
}) => {
    const groupRef = useRef<THREE.Group>(null);
    const [pos, setPos] = useState<[number, number, number]>(initialPosition);
    const [isDragging, setIsDragging] = useState(false);

    const handlePointerDown = (e: any) => {
        e.stopPropagation();
        setIsDragging(true);
        document.body.style.cursor = 'grabbing';
        onSelect?.();
    };

    const handlePointerUp = (e: any) => {
        setIsDragging(false);
        document.body.style.cursor = 'auto';
    };

    const handlePointerMove = (e: any) => {
        if (!isDragging) return;
        e.stopPropagation();
        
        const intersect = e.intersections?.[0];
        if (intersect) {
            const hit = intersect.point;
            // Snap to grid
            const snapX = Math.round(hit.x / GRID_SIZE) * GRID_SIZE;
            const snapZ = Math.round(hit.z / GRID_SIZE) * GRID_SIZE;
            setPos([snapX, 0, snapZ]);
        }
    };

    return (
        <group 
            ref={groupRef}
            position={pos} 
            onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
            onPointerOut={(e) => { 
                if(!isDragging) document.body.style.cursor = 'auto'; 
            }}
            onPointerOver={(e) => { 
                e.stopPropagation(); 
                if(!isDragging) document.body.style.cursor = 'grab'; 
            }}
        >
            {/* Visual Feedback Outline when dragging */}
            {isDragging && (
                <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[1, 1]} />
                    <meshBasicMaterial color="#3b82f6" transparent opacity={0.3} side={THREE.DoubleSide} />
                </mesh>
            )}

            <Float speed={isDragging ? 0 : 2} rotationIntensity={isDragging ? 0 : 0.2} floatIntensity={isDragging ? 0 : 0.2}>
                {type === 'resistor' && (
                    <group scale={1.5} position={[0, 0.4, 0]}>
                        <mesh rotation={[0, 0, Math.PI / 2]}>
                            <capsuleGeometry args={[0.15, 0.8, 8, 16]} />
                            <meshStandardMaterial color="#e0e0e0" roughness={0.2} metalness={0.8} />
                        </mesh>
                        <mesh rotation={[0, 0, Math.PI / 2]}>
                            <cylinderGeometry args={[0.2, 0.2, 0.4, 16]} />
                            <meshStandardMaterial color="#d1d5db" />
                        </mesh>
                        {/* Color Bands */}
                        <mesh position={[-0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                             <cylinderGeometry args={[0.21, 0.21, 0.05, 16]} />
                             <meshBasicMaterial color="#b91c1c" />
                        </mesh>
                        <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                             <cylinderGeometry args={[0.21, 0.21, 0.05, 16]} />
                             <meshBasicMaterial color="#a16207" />
                        </mesh>
                        {/* Shadow marker underneath */}
                        <mesh position={[0, -0.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                            <circleGeometry args={[0.2]} />
                            <meshBasicMaterial color="black" transparent opacity={0.2} />
                        </mesh>
                    </group>
                )}
                {type === 'led' && (
                    <group scale={1.2} position={[0, 0.4, 0]}>
                        <mesh position={[0, 0.2, 0]}>
                            <sphereGeometry args={[0.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={isDragging ? 0.5 : 2} transparent opacity={0.9} />
                        </mesh>
                        <mesh>
                            <cylinderGeometry args={[0.2, 0.2, 0.4, 16]} />
                            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={isDragging ? 0.2 : 0.8} transparent opacity={0.8} />
                        </mesh>
                        <mesh position={[0, -0.2, 0]}>
                            <cylinderGeometry args={[0.21, 0.21, 0.05, 16]} />
                            <meshStandardMaterial color="#9ca3af" />
                        </mesh>
                         {/* Shadow marker */}
                         <mesh position={[0, -0.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                            <circleGeometry args={[0.25]} />
                            <meshBasicMaterial color="black" transparent opacity={0.2} />
                        </mesh>
                    </group>
                )}
            </Float>
        </group>
    );
};

export default function LabStudio() {
    const { physicsBotOpen, setPhysicsBotOpen, currentExperiment, setCurrentExperiment } = useAppStore();
    const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
    const [tool, setTool] = useState<'move' | 'resistor' | 'led' | 'capacitor'>('move');
    const [components, setComponents] = useState([
        { id: '1', type: 'resistor', position: [-2, 0, 0] as [number, number, number] },
        { id: '2', type: 'led', position: [1, 0, 1] as [number, number, number] }
    ]);

    const handleCanvasClick = (e: any) => {
        if (tool !== 'move') {
            const hit = e.intersections?.[0]?.point;
            if (hit) {
                const snapX = Math.round(hit.x / GRID_SIZE) * GRID_SIZE;
                const snapZ = Math.round(hit.z / GRID_SIZE) * GRID_SIZE;
                setComponents([...components, {
                    id: Date.now().toString(),
                    type: tool,
                    position: [snapX, 0, snapZ]
                }]);
                setTool('move'); // Reset to move after placing
            }
        }
    };

    const experiments = [
        { id: 'ohms-law', name: "Ohm's Law Verification", category: "Electricity" },
        { id: 'faradays-law', name: "Faraday's Law", category: "Electromagnetism" },
        { id: 'snells-law', name: "Snell's Law", category: "Optics" },
        { id: 'hookes-law', name: "Hooke's Law", category: "Mechanics" },
        { id: 'photoelectric', name: "Photoelectric Effect", category: "Modern Physics" },
    ];

    return (
        <div className="fixed inset-0 pt-20 bg-white dark:bg-space-black flex flex-col z-10 transition-colors duration-300">
            {/* Toolbar */}
            <div className="h-16 border-b border-slate-200 dark:border-white/10 px-6 flex items-center justify-between bg-white dark:bg-space-black !rounded-none transition-colors duration-300">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500 dark:text-slate-400 text-[10px] font-mono uppercase tracking-widest">Experiment</span>
                        <select 
                            value={currentExperiment || 'ohms-law'} 
                            onChange={(e) => setCurrentExperiment(e.target.value)}
                            className="bg-transparent text-slate-900 dark:text-white font-medium focus:outline-none cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
                        >
                            {experiments.map(exp => (
                                <option key={exp.id} value={exp.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{exp.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="h-6 w-px bg-slate-200 dark:bg-white/10 transition-colors duration-300" />
                    <div className="flex items-center gap-4">
                        <button className={cn("p-2 rounded-lg transition-all", tool === 'move' ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5")} onClick={() => setTool('move')}><MousePointer2 size={18}/></button>
                        <div className="h-6 w-px bg-slate-200 dark:bg-white/10 transition-colors duration-300" />
                        <ToolButton active={tool === 'resistor'} onClick={() => setTool('resistor')} label="Resistor" icon={<Zap size={16}/>} />
                        <ToolButton active={tool === 'led'} onClick={() => setTool('led')} label="LED" icon={<Activity size={16}/>} />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="btn-primary flex items-center gap-2 border-none">
                        <Play size={18} fill="currentColor"/>
                        Simulate
                    </button>
                    <button 
                        onClick={() => setPhysicsBotOpen(!physicsBotOpen)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full transition-all font-semibold border text-sm",
                            physicsBotOpen ? "bg-blue-600 text-white border-blue-400/30 shadow-[0_0_15px_rgba(37,99,235,0.4)]" : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
                        )}
                    >
                        <Bot size={18}/>
                        PhysicsBot
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Sidebar Tools */}
                <aside className="w-20 border-r border-slate-200 dark:border-white/10 flex flex-col items-center py-6 gap-6 bg-slate-50 dark:bg-black/20 overflow-y-auto transition-colors duration-300">
                    <SidebarTool icon={<Box size={22}/>} active />
                    <SidebarTool icon={<Layers size={22}/>} />
                    <SidebarTool icon={<History size={22}/>} />
                    <div className="h-px w-8 bg-slate-200 dark:bg-white/10 my-2 transition-colors duration-300" />
                    <SidebarTool icon={<Settings size={22}/>} />
                </aside>

                {/* Main 3D Studio Area */}
                <main className="flex-1 relative bg-slate-50/50 dark:bg-black/10 overflow-hidden transition-colors duration-300">
                    <div className="absolute top-4 left-6 text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest z-10 transition-colors duration-300">
                        Active Workspace: {currentExperiment?.toUpperCase() || 'NEW_PROJECT'}
                    </div>

                    <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-slate-400 animate-pulse">Initializing Lab Environment...</div>}>
                        <Canvas dpr={[1, 2]} shadows>
                            <PerspectiveCamera makeDefault position={[0, 8, 12]} fov={40} />
                            <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} />
                            
                            <ambientLight intensity={0.6} />
                            <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
                            <pointLight position={[-10, 10, -10]} intensity={0.5} />
                            <spotLight position={[-5, 10, 5]} angle={0.15} penumbra={1} intensity={1} castShadow />

                            <Breadboard3D />
                            
                            {/* Interactive Placement Plane */}
                            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} onClick={handleCanvasClick} visible={false}>
                                <planeGeometry args={[100, 100]} />
                                <meshBasicMaterial />
                            </mesh>

                            {/* Render components */}
                            {components.map((comp) => (
                                <DraggableComponent 
                                    key={comp.id}
                                    type={comp.type} 
                                    initialPosition={comp.position}
                                    onSelect={() => setSelectedComponent(comp.id)}
                                />
                            ))}

                            <Grid 
                                infiniteGrid 
                                fadeDistance={30} 
                                cellColor="#bae6fd" 
                                cellThickness={0.5} 
                                sectionColor="#3b82f6" 
                                sectionSize={5} 
                            />
                            
                            <ContactShadows position={[0, -0.25, 0]} opacity={0.4} scale={20} blur={2} far={4.5} color="#000000" />
                            <Environment preset="city" />
                        </Canvas>
                    </Suspense>

                    {/* Simulation Status Overlay */}
                    <div className="absolute bottom-6 left-6 px-4 py-2 bg-white dark:bg-black/60 border border-slate-200 dark:border-white/10 rounded-2xl shadow-lg flex items-center gap-4 z-10 transition-colors duration-300">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                           <span className="text-[10px] font-mono text-slate-600 dark:text-slate-300">SIMULATION ENGINE: READY</span>
                        </div>
                        <div className="w-px h-4 bg-slate-200 dark:bg-white/10" />
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">CPU LOAD: 12%</span>
                    </div>

                    {/* Properties Panel (Floating) */}
                    <AnimatePresence>
                        {selectedComponent && (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="absolute right-8 top-8 w-64 bg-white dark:bg-black/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-6 z-20 rounded-3xl shadow-xl transition-colors duration-300"
                            >
                                <h3 className="font-display font-bold text-lg mb-4 text-slate-900 dark:text-white">Resistor R1</h3>
                                <div className="space-y-4">
                                    <PropertyField label="Resistance" value="1.2k" unit="Ω" />
                                    <PropertyField label="Tolerance" value="5" unit="%" />
                                    <PropertyField label="Power" value="0.25" unit="W" />
                                </div>
                                <button 
                                    className="w-full mt-6 py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 font-medium"
                                    onClick={() => {
                                        setComponents(components.filter(c => c.id !== selectedComponent));
                                        setSelectedComponent(null);
                                    }}
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                                <button className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300" onClick={() => setSelectedComponent(null)}>
                                    ✕
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>

                {/* Right Panel: AI Assistant */}
                <AnimatePresence>
                    {physicsBotOpen && (
                        <motion.aside 
                            initial={{ x: 400 }}
                            animate={{ x: 0 }}
                            exit={{ x: 400 }}
                            className="w-80 border-l border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-space-black flex flex-col transition-colors duration-300"
                        >
                            <div className="p-6 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-black/20 transition-colors duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div>
                                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-[0.2em]">PHYSICSBOT ACTIVE</span>
                                </div>
                                <h4 className="font-bold text-slate-900 dark:text-white">Assistant</h4>
                            </div>
                            
                            <div className="flex-1 p-6 overflow-y-auto space-y-4">
                                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-[11px] text-slate-700 dark:text-slate-300 italic border-l-2 border-blue-500 leading-relaxed shadow-sm transition-colors duration-300">
                                    "Hello! I see you are working on {currentExperiment || 'a new experiment'}. Try dragging components onto the grid plane to snap them in place. The Circuit graph evaluator is running."
                                </div>
                            </div>

                            <div className="p-4 border-t border-slate-200 dark:border-white/10 mt-auto bg-white dark:bg-black/20 transition-colors duration-300">
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-violet-glow rounded-xl opacity-0 group-hover:opacity-20 transition-opacity blur" />
                                    <input 
                                        type="text" 
                                        placeholder="Ask PhysicsBot..."
                                        className="relative w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500/50 focus:bg-white dark:focus:bg-white/10 transition-colors text-slate-900 dark:text-white shadow-sm"
                                    />
                                </div>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function SidebarTool({ icon, active }: { icon: React.ReactNode, active?: boolean }) {
    return (
        <button className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-sm",
            active ? "bg-white dark:bg-white/10 text-blue-600 border border-blue-200 dark:border-blue-500/30 shadow-md transform scale-105" : "bg-white dark:bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 border border-slate-200 dark:border-white/10"
        )}>
            {icon}
        </button>
    );
}

function ToolButton({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
    return (
        <button 
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                active ? "bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent"
            )}
        >
            {icon}
            {label}
        </button>
    );
}

function PropertyField({ label, value, unit }: { label: string, value: string, unit: string }) {
    return (
        <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">{label}</span>
            <div className="flex items-center gap-1 font-mono">
                <span className="text-slate-900 dark:text-white font-medium">{value}</span>
                <span className="text-blue-500 text-xs">{unit}</span>
            </div>
        </div>
    );
}
