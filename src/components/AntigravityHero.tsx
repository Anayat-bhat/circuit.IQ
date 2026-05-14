import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Environment, Stars, Sparkles, Trail, QuadraticBezierLine, Float } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function CursorGlitter() {
  const { mouse, viewport } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const trailRef = useRef<any>(null);

  useFrame(() => {
    if (meshRef.current) {
      const x = (mouse.x * viewport.width) / 2;
      const y = (mouse.y * viewport.height) / 2;
      meshRef.current.position.lerp(new THREE.Vector3(x, y, 0), 0.1);
    }
  });

  return (
    <Trail 
      ref={trailRef}
      width={0.5} 
      length={10} 
      color={new THREE.Color(1, 1, 1)} 
      attenuation={(t) => t * t}
    >
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color={[2, 2, 2]} toneMapped={false} />
      </mesh>
    </Trail>
  );
}

function FloatingComponent({ position, type, index, delay, progressRef, isLogo }: { position: [number, number, number], type: string, index: number, delay: number, progressRef?: React.MutableRefObject<{value: number}>, isLogo?: boolean }) {
  const meshRef = useRef<THREE.Group>(null);
  const materialRef1 = useRef<THREE.MeshStandardMaterial>(null);
  const materialRef2 = useRef<THREE.MeshStandardMaterial>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    const progress = progressRef ? progressRef.current.value : 0;
    
    // Lerp wobble magnitude based on progress
    const baseWobbleY = 0;
    const baseRotX = 0;
    const baseRotZ = 0;

    const easeProgress = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    const wobbleY = THREE.MathUtils.lerp(0.5, baseWobbleY, easeProgress);
    const wobbleX = THREE.MathUtils.lerp(0.5, 0, easeProgress);

    meshRef.current.position.y = Math.sin(t * 2 + index) * wobbleY;
    meshRef.current.position.x = Math.cos(t * 1.5 + index) * wobbleX;
    
    meshRef.current.rotation.x = THREE.MathUtils.lerp(t * 0.5 + index, baseRotX, easeProgress);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(t * 0.8 + index, 0, easeProgress);
    meshRef.current.rotation.z = THREE.MathUtils.lerp(t * 0.6 + index, baseRotZ, easeProgress);

    if (materialRef1.current) {
        materialRef1.current.emissiveIntensity = THREE.MathUtils.lerp(0.1, emissiveFactor, Math.pow(progress, 4));
    }
    if (materialRef2.current) {
        materialRef2.current.emissiveIntensity = THREE.MathUtils.lerp(0.05, emissiveFactor * 0.8, Math.pow(progress, 4));
    }
  });

  const ledColor = isLogo ? "#a3e635" : (index % 2 === 0 ? "#4ade80" : "#60a5fa");
  const ledEmissive = isLogo ? "#84cc16" : (index % 2 === 0 ? "#22c55e" : "#3b82f6");
  const emissiveFactor = isLogo ? 6 : 2;

  return (
    <group ref={meshRef} position={position} scale={0.5}>
      {type === 'resistor' && (
        <group>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.15, 1, 8, 16]} />
            <meshStandardMaterial color="#fcd34d" roughness={0.3} metalness={0.2} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.4, 16]} />
            <meshStandardMaterial color="#c2410c" />
          </mesh>
          {/* Color bands */}
          <mesh position={[-0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
             <cylinderGeometry args={[0.21, 0.21, 0.05, 16]} />
             <meshBasicMaterial color="#b91c1c" />
          </mesh>
          <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
             <cylinderGeometry args={[0.21, 0.21, 0.05, 16]} />
             <meshBasicMaterial color="#a16207" />
          </mesh>
          {/* leads */}
          <mesh position={[-0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
             <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
             <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
             <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
             <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      )}
      {type === 'transistor' && (
        <group>
          <mesh position={[0, 0.2, 0]}>
             <cylinderGeometry args={[0.2, 0.2, 0.4, 16, 1, false, 0, Math.PI]} />
             <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.2, -0.05]}>
             <boxGeometry args={[0.4, 0.4, 0.1]} />
             <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
          <mesh position={[-0.1, -0.2, 0]}>
             <cylinderGeometry args={[0.02, 0.02, 0.4]} />
             <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.2, 0]}>
             <cylinderGeometry args={[0.02, 0.02, 0.4]} />
             <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0.1, -0.2, 0]}>
             <cylinderGeometry args={[0.02, 0.02, 0.4]} />
             <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      )}
      {type === 'led' && (
        <group>
          <mesh position={[0, 0.4, 0]}>
            <sphereGeometry args={[0.18, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial ref={materialRef1} color={ledColor} emissive={ledEmissive} emissiveIntensity={0.1} transparent opacity={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.4, 16]} />
            <meshStandardMaterial ref={materialRef2} color={ledColor} emissive={ledEmissive} emissiveIntensity={0.05} transparent opacity={0.8} roughness={0.1} />
          </mesh>
          <mesh position={[0, -0.02, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.05, 16]} />
            <meshStandardMaterial color="#9ca3af" roughness={0.4} />
          </mesh>
          <mesh position={[-0.08, -0.2, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.4]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0.08, -0.2, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.4]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      )}
    </group>
  );
}

function Breadboard() {
  return (
    <group position={[0, 0, 0]}>
       {/* Main body */}
       <mesh>
         <boxGeometry args={[22, 0.5, 7]} />
         <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
       </mesh>
       {/* Center Trough */}
       <mesh position={[0, 0.255, 0]}>
         <boxGeometry args={[21.5, 0.1, 0.4]} />
         <meshStandardMaterial color="#94a3b8" />
       </mesh>
       {/* Power Rails */ /* Top */}
       <mesh position={[0, 0.255, -2.9]}>
          <planeGeometry args={[20.5, 0.05]} rotation={[-Math.PI/2, 0, 0]} />
          <meshBasicMaterial color="#ef4444" opacity={0.6} transparent />
       </mesh>
       <mesh position={[0, 0.255, -2.3]}>
          <planeGeometry args={[20.5, 0.05]} rotation={[-Math.PI/2, 0, 0]} />
          <meshBasicMaterial color="#3b82f6" opacity={0.6} transparent />
       </mesh>
       {/* Power Rails */ /* Bottom */}
       <mesh position={[0, 0.255, 2.3]}>
          <planeGeometry args={[20.5, 0.05]} rotation={[-Math.PI/2, 0, 0]} />
          <meshBasicMaterial color="#3b82f6" opacity={0.6} transparent />
       </mesh>
       <mesh position={[0, 0.255, 2.9]}>
          <planeGeometry args={[20.5, 0.05]} rotation={[-Math.PI/2, 0, 0]} />
          <meshBasicMaterial color="#ef4444" opacity={0.6} transparent />
       </mesh>
       
       {/* Grid representation of holes */}
       <group position={[0, 0.251, 0]}>
         <gridHelper args={[21, 84, 0x0f172a, 0x0f172a]} material-opacity={0.3} material-transparent />
       </group>
    </group>
  );
}

function BreadboardWires({ logoPoints }: { logoPoints: any[] }) {
  const wires = useMemo(() => {
     const result = [];
     const pts = logoPoints.filter(p => p.isLogo);
     if (pts.length === 0) return result;
     
     // Generate some fixed wire positions around the breadboard to look like connections
     for(let i = 0; i < 40; i++) {
        const p1 = pts[Math.floor(Math.random() * pts.length)].p;
        // Make wires go from random points to other random points, or the power rails
        const toRail = Math.random() > 0.5;
        const p2 = toRail ? [p1[0] + (Math.random() - 0.5) * 4, Math.random() > 0.5 ? 2.8 : -2.8] : pts[Math.floor(Math.random() * pts.length)].p;
        
        const dist = Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
        
        const colorDecider = Math.random();
        let color = '#3b82f6';
        if (toRail) color = p2[1] > 0 ? (Math.random() > 0.5 ? '#ef4444' : '#3b82f6') : (Math.random() > 0.5 ? '#ef4444' : '#10b981');
        else color = colorDecider > 0.6 ? '#f59e0b' : (colorDecider > 0.3 ? '#10b981' : '#a855f7');
        
        result.push({
           start: new THREE.Vector3(p1[0], 0.26, p1[1]),
           end: new THREE.Vector3(p2[0], 0.26, p2[1]),
           mid: new THREE.Vector3((p1[0]+p2[0])/2, 0.5 + dist * 0.2, (p1[1]+p2[1])/2),
           color
        });
     }
     return result;
  }, [logoPoints]);

  return (
     <group>
        {wires.map((w, i) => (
            <QuadraticBezierLine key={i} start={w.start} end={w.end} mid={w.mid} color={w.color} lineWidth={2} transparent opacity={0.6} />
        ))}
     </group>
  );
}

function GridLogoScene({ progressRef }: { progressRef: React.MutableRefObject<{value: number}> }) {
  const breadboardRef = useRef<THREE.Group>(null);
  const containerRef = useRef<THREE.Group>(null);

  const logoPoints = useMemo(() => {
    const textLines = [
      " CCCCC  III  RRRR   CCC U   U III TTTTT    III  QQQQ ",
      " C       I   R   R C    U   U  I    T       I  Q    Q",
      " C       I   RRRR  C    U   U  I    T       I  Q    Q",
      " C       I   R  R  C    U   U  I    T       I  Q  Q Q",
      " CCCCC  III  R   R  CCC  UUU  III   T    . III  QQQQQ"
    ];
    
    const points: [number, number][] = [];
    const scaleX = 0.4;
    const scaleZ = 0.6;
    const offsetX = (textLines[0].length * scaleX) / 2;
    const offsetZ = (textLines.length * scaleZ) / 2;
    
    textLines.forEach((line, z) => {
      for (let x = 0; x < line.length; x++) {
        if (line[x] !== ' ') {
          points.push([x * scaleX - offsetX, z * scaleZ - offsetZ]);
        }
      }
    });

    const extra: [number, number][] = [];
    const used = new Set<string>();
    points.forEach(p => used.add(`${p[0].toFixed(2)},${p[1].toFixed(2)}`));
    
    for(let i=0; i<250; i++) {
        const snap = (v: number) => Math.round(v * 2) / 2;
        let x = snap((Math.random() - 0.5)*20);
        let z = snap((Math.random() - 0.5)*5);
        if (z === 0) z = 0.5;
        let key = `${x.toFixed(2)},${z.toFixed(2)}`;
        let tries = 0;
        
        while (used.has(key) && tries < 10) {
            x = snap((Math.random() - 0.5)*20);
            z = snap((Math.random() - 0.5)*5);
            if (z === 0) z = 0.5;
            key = `${x.toFixed(2)},${z.toFixed(2)}`;
            tries++;
        }
        used.add(key);
        extra.push([x, z]);
    }

    return [...points.map(p => ({ p, isLogo: true })), ...extra.map(p => ({ p, isLogo: false }))];
  }, []);

  const components = useMemo(() => {
    return logoPoints.map((item, i) => {
      const type = item.isLogo ? 'led' : (Math.random() > 0.5 ? 'resistor' : 'transistor');
      
      const swirlRadius = 8 + Math.random() * 30; // Wider spread
      const swirlAngle = Math.random() * Math.PI * 2;
      const swirlY = 10 + (Math.random() - 0.5) * 40; // Taller spread
      const swirlOrbitSpeed = (Math.random() - 0.5) * 0.4;
      const swirlVertSpeed = (Math.random() - 0.5) * 0.2;
      
      const endPos: [number, number, number] = [
        item.p[0],
        type === 'resistor' ? 0.35 : 0.25, 
        item.p[1]
      ];
      
      return { 
        type, id: i, delay: Math.random(), 
        swirlRadius, swirlAngle, swirlY, swirlOrbitSpeed, swirlVertSpeed, endPos,
        isLogo: item.isLogo
      };
    });
  }, [logoPoints]);

  const refs = useRef<THREE.Group[]>([]);

  useEffect(() => {
    // Animate the progress value from 0 (swirling) to 1 (breadboard)
    gsap.to(progressRef.current, {
      value: 1,
      scrollTrigger: {
        trigger: "#simulation-section",
        start: "top center",
        end: "center center",
        scrub: 1,
      }
    });

    // Bring the breadboard up from the void
    if (breadboardRef.current) {
      gsap.fromTo(breadboardRef.current.position, 
        { y: -40, z: -20, rotationX: 0.2 },
        {
          y: 0,
          z: 0,
          rotationX: 0,
          scrollTrigger: {
            trigger: "#simulation-section",
            start: "top center",
            end: "center center",
            scrub: 1,
          }
        }
      );
      
      // opacity fade-in for the breadboard might not work directly on a group without material traversal,
      // so we just rely on it flying in from below
    }

  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const progress = progressRef.current.value;

    components.forEach((comp, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;

      // Swirl Positions
      const sx = Math.cos(comp.swirlAngle + t * comp.swirlOrbitSpeed) * comp.swirlRadius;
      const sz = Math.sin(comp.swirlAngle + t * comp.swirlOrbitSpeed) * comp.swirlRadius;
      const sy = comp.swirlY + Math.sin(t * comp.swirlVertSpeed) * 10;
      
      // Swirl Rotations
      const sRotX = t * comp.swirlOrbitSpeed;
      const sRotY = comp.swirlAngle + t * comp.swirlOrbitSpeed;
      const sRotZ = t * comp.swirlVertSpeed;

      // End Rotations
      const eRotX = 0;
      const eRotY = comp.isLogo ? 0 : Math.random() * Math.PI * 0.2;
      const eRotZ = comp.type === 'resistor' ? Math.PI / 2 : 0;

      // Smooth easing curve
      const easeProgress = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      // Interpolate
      mesh.position.x = THREE.MathUtils.lerp(sx, comp.endPos[0], easeProgress);
      mesh.position.y = THREE.MathUtils.lerp(sy, comp.endPos[1], easeProgress);
      mesh.position.z = THREE.MathUtils.lerp(sz, comp.endPos[2], easeProgress);

      // Simple rotation lerp
      mesh.rotation.x = THREE.MathUtils.lerp(sRotX, eRotX, easeProgress);
      mesh.rotation.y = THREE.MathUtils.lerp(sRotY, eRotY, easeProgress);
      mesh.rotation.z = THREE.MathUtils.lerp(sRotZ, eRotZ, easeProgress);
    });
  });

  return (
    <group ref={containerRef}>
      <group ref={breadboardRef}>
        <Breadboard />
        <BreadboardWires logoPoints={logoPoints} />
      </group>
      {components.map((comp, i) => (
        <group 
          key={comp.id} 
          ref={el => el && (refs.current[i] = el)} 
        >
          <FloatingComponent position={[0,0,0]} type={comp.type} index={comp.id} delay={comp.delay} progressRef={progressRef} isLogo={comp.isLogo} />
        </group>
      ))}
      <Sparkles count={250} scale={35} size={2.5} color="#60a5fa" opacity={0.8} speed={0.5} />
      <Stars radius={100} depth={50} count={4000} factor={3} saturation={1} fade speed={1.5} />
    </group>
  );
}

function Rig({ progressRef }: { progressRef: React.MutableRefObject<{value: number}> }) {
  const { camera, mouse } = useThree();
  const vec = new THREE.Vector3();
  const target = new THREE.Vector3(0, 0, 0);

  return useFrame(({ clock }) => {
    const progress = progressRef.current ? progressRef.current.value : 0;
    const t = clock.getElapsedTime() * 0.2; 
    
    // When swirling, orbit widely. When settled, lock to front-ish view for readability.
    const idealOrbitX = Math.sin(t) * 28;
    const idealOrbitZ = Math.cos(t) * 28;
    const idealOrbitY = 12;

    const settledCamX = 0;
    const settledCamY = 14;
    const settledCamZ = 12;

    const baseCamX = THREE.MathUtils.lerp(idealOrbitX, settledCamX, progress);
    const baseCamY = THREE.MathUtils.lerp(idealOrbitY, settledCamY, progress);
    const baseCamZ = THREE.MathUtils.lerp(idealOrbitZ, settledCamZ, progress);

    const mouseMultX = THREE.MathUtils.lerp(30, 2, progress);
    const mouseMultY = THREE.MathUtils.lerp(25, 1, progress);
    
    const targetX = baseCamX + mouse.x * mouseMultX;
    const targetY = baseCamY + mouse.y * mouseMultY;
    const targetZ = baseCamZ;

    camera.position.lerp(vec.set(targetX, targetY, targetZ), 0.05);
    camera.lookAt(target);
  });
}

export default function AntigravityHero() {
  const progressRef = useRef({ value: 0 });
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 12, 22]} fov={45} />
        <ambientLight intensity={0.6} />
        <spotLight position={[15, 20, 15]} angle={0.3} penumbra={1} intensity={2} color="#ffffff" castShadow />
        <pointLight position={[-10, 5, -10]} intensity={1.5} color="#3b82f6" />
        <pointLight position={[10, 5, 10]} intensity={1} color="#fcf0d5" />
        
        <CursorGlitter />
        <GridLogoScene progressRef={progressRef} />
        <Rig progressRef={progressRef} />
        <Environment preset="night" />
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} />
          <Vignette eskil={false} offset={0.1} darkness={0.8} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
