import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Environment, Stars, Sparkles, Trail, QuadraticBezierLine, RoundedBox } from '@react-three/drei';
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
  
  const ledColor = "#4ade80";
  const ledEmissive = "#22c55e";
  const emissiveFactor = isLogo ? 6 : 2;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const progress = progressRef ? progressRef.current.value : 0;
    
    // Dynamic color and blinking logic for LEDs
    if (materialRef1.current && materialRef2.current) {
        if (type === 'led') {
            const timeOffset = index * 0.5;
            let currentEmissiveIntensity = THREE.MathUtils.lerp(0.1, emissiveFactor, Math.pow(progress, 4));

            // Morph color beautifully when fully formed
            if (progress > 0.9) {
                // Randomly blink off briefly to look like computation
                const blinkSpeed = isLogo ? 6 : 4;
                const blinkPhase = Math.sin(t * blinkSpeed + timeOffset);
                const isBlinking = blinkPhase > 0.85;
                if (isBlinking) currentEmissiveIntensity = 0;

                const targetColor = new THREE.Color(ledEmissive);
                materialRef1.current.emissive.copy(targetColor);
                materialRef2.current.emissive.copy(targetColor);
                if (!isBlinking) {
                    currentEmissiveIntensity *= (1 + Math.sin(t * 4 + index) * 0.3); // pulse smoothly
                }
            } else {
                 materialRef1.current.emissive.set(ledEmissive);
                 materialRef2.current.emissive.set(ledEmissive);
            }

            materialRef1.current.emissiveIntensity = currentEmissiveIntensity;
            materialRef2.current.emissiveIntensity = currentEmissiveIntensity * 0.8;
        } else {
            materialRef1.current.emissiveIntensity = THREE.MathUtils.lerp(0.1, emissiveFactor, Math.pow(progress, 4));
            materialRef2.current.emissiveIntensity = THREE.MathUtils.lerp(0.05, emissiveFactor * 0.8, Math.pow(progress, 4));
        }
    }
  });

  return (
    <group ref={meshRef} position={position} scale={0.8}>
      {type === 'resistor' && (
        <group>
          {/* Main body: using a capsule for smooth ends */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.13, 0.6, 16, 16]} />
            <meshStandardMaterial color="#eacba0" roughness={0.9} />
          </mesh>
          {/* Realistic wider end caps */}
          <mesh position={[-0.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
             <cylinderGeometry args={[0.16, 0.16, 0.15, 16]} />
             <meshStandardMaterial color="#eacba0" roughness={0.9} />
          </mesh>
          <mesh position={[0.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
             <cylinderGeometry args={[0.16, 0.16, 0.15, 16]} />
             <meshStandardMaterial color="#eacba0" roughness={0.9} />
          </mesh>
          
          {/* Color bands on the central body */}
          <mesh position={[-0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
             <cylinderGeometry args={[0.132, 0.132, 0.08, 16]} />
             <meshBasicMaterial color="#b91c1c" />
          </mesh>
          <mesh position={[0.0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
             <cylinderGeometry args={[0.132, 0.132, 0.08, 16]} />
             <meshBasicMaterial color="#ca8a04" />
          </mesh>
          <mesh position={[0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
             <cylinderGeometry args={[0.132, 0.132, 0.08, 16]} />
             <meshBasicMaterial color="#1e3a8a" />
          </mesh>
          <mesh position={[0.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
             {/* Gold tolerance band on the right end cap */}
             <cylinderGeometry args={[0.162, 0.162, 0.05, 16]} />
             <meshBasicMaterial color="#d4af37" />
          </mesh>

          {/* leads */}
          <group position={[-0.425, 0, 0]}>
            <mesh position={[-0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
               <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
               <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[-0.4, -0.25, 0]}>
               <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
               <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* The bend joint */}
            <mesh position={[-0.4, 0, 0]}>
               <sphereGeometry args={[0.02, 8, 8]} />
               <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>

          <group position={[0.425, 0, 0]}>
            <mesh position={[0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
               <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
               <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0.4, -0.25, 0]}>
               <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
               <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* The bend joint */}
            <mesh position={[0.4, 0, 0]}>
               <sphereGeometry args={[0.02, 8, 8]} />
               <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
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

function BreadboardHoles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const { positions } = useMemo(() => {
     const cols = 64;
     const items = [];
     const startX = -((cols - 1) * 0.3) / 2;
     
     // 5 rows top, 5 rows bottom
     const rows = [-1.8, -1.5, -1.2, -0.9, -0.6, 0.6, 0.9, 1.2, 1.5, 1.8];
     
     for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows.length; j++) {
           items.push([startX + i * 0.3, 0, rows[j]]);
        }
     }
     
     // Power rails
     const pRows = [-3.2, -2.6, 2.6, 3.2];
     for (let i = 0; i < cols; i += 2) {
        for (let j = 0; j < pRows.length; j++) {
           items.push([startX + i * 0.3, 0, pRows[j]]);
        }
     }
     
     return { positions: items };
  }, []);

  useEffect(() => {
     if (meshRef.current) {
        const dummy = new THREE.Object3D();
        positions.forEach((pos, i) => {
           dummy.position.set(pos[0], pos[1], pos[2]);
           dummy.rotation.set(-Math.PI / 2, 0, 0);
           dummy.updateMatrix();
           meshRef.current?.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
     }
  }, [positions]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, positions.length]}>
      <circleGeometry args={[0.07, 8]} />
      <meshBasicMaterial color="#0f172a" depthWrite={false} />
    </instancedMesh>
  );
}

function Breadboard() {
  return (
    <group position={[0, -0.25, 0]}>
       {/* Main body */}
       <RoundedBox args={[22, 0.8, 8]} radius={0.15} position={[0, 0, 0]}>
         <meshStandardMaterial color="#f8fafc" roughness={0.4} />
       </RoundedBox>
       
       {/* Center Trough */}
       <mesh position={[0, 0.39, 0]}>
         <boxGeometry args={[21, 0.05, 0.5]} />
         <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
       </mesh>
       
       {/* Breadboard lines and holes using textures or lines to save perf */}
       {/* Power Rail Lines */ /* Top */}
       <mesh position={[0, 0.405, -3.2]} rotation={[-Math.PI/2, 0, 0]}>
          <planeGeometry args={[20.5, 0.06]} />
          <meshBasicMaterial color="#ef4444" />
       </mesh>
       <mesh position={[0, 0.405, -2.6]} rotation={[-Math.PI/2, 0, 0]}>
          <planeGeometry args={[20.5, 0.06]} />
          <meshBasicMaterial color="#3b82f6" />
       </mesh>
       {/* Power Rail Lines */ /* Bottom */}
       <mesh position={[0, 0.405, 2.6]} rotation={[-Math.PI/2, 0, 0]}>
          <planeGeometry args={[20.5, 0.06]} />
          <meshBasicMaterial color="#3b82f6" />
       </mesh>
       <mesh position={[0, 0.405, 3.2]} rotation={[-Math.PI/2, 0, 0]}>
          <planeGeometry args={[20.5, 0.06]} />
          <meshBasicMaterial color="#ef4444" />
       </mesh>
       
       {/* Grid representation of holes */}
       <group position={[0, 0.405, 0]}>
         <BreadboardHoles />
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
           start: new THREE.Vector3(p1[0], 0.16, p1[1]),
           end: new THREE.Vector3(p2[0], 0.16, p2[1]),
           mid: new THREE.Vector3((p1[0]+p2[0])/2, 0.4 + dist * 0.2, (p1[1]+p2[1])/2),
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
      " CCCCC  III  RRRR   CCC U   U III TTTTT    III   QQQ  ",
      " C       I   R   R C    U   U  I    T       I   Q   Q ",
      " C       I   RRRR  C    U   U  I    T       I   Q   Q ",
      " C       I   R  R  C    U   U  I    T       I   Q  QQ ",
      " CCCCC  III  R   R  CCC  UUU  III   T    . III   QQQQ "
    ];
    
    const points: [number, number][] = [];
    const scaleX = 0.35;
    const scaleZ = 0.5;
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
    
    for(let i=0; i<15; i++) {
        const snap = (v: number) => Math.round(v * 2) / 2;
        let x = snap((Math.random() - 0.5)*19);
        let z = snap((Math.random() - 0.5)*4.5);
        if (z === 0) z = 0.5;
        let key = `${x.toFixed(2)},${z.toFixed(2)}`;
        let tries = 0;
        
        while (used.has(key) && tries < 10) {
            x = snap((Math.random() - 0.5)*19);
            z = snap((Math.random() - 0.5)*4.5);
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
      const type = item.isLogo ? 'led' : 'resistor';
      
      const swirlRadius = 8 + Math.random() * 30; // Wider spread
      const swirlAngle = Math.random() * Math.PI * 2;
      const swirlY = 10 + (Math.random() - 0.5) * 40; // Taller spread
      const swirlOrbitSpeed = (Math.random() - 0.5) * 0.4;
      const swirlVertSpeed = (Math.random() - 0.5) * 0.2;
      const randomRotY = 0; // Keep resistors perfectly straight
      
      const endPos: [number, number, number] = [
        item.p[0],
        type === 'resistor' ? 0.35 : 0.25, 
        item.p[1]
      ];
      
      const crazyX = (Math.random() - 0.5) * 15;
      const crazyY = (Math.random() - 0.5) * 15;
      const crazyZ = (Math.random() - 0.5) * 15;
      
      return { 
        type, id: i, delay: Math.random(), 
        swirlRadius, swirlAngle, swirlY, swirlOrbitSpeed, swirlVertSpeed, endPos,
        isLogo: item.isLogo, crazyX, crazyY, crazyZ, randomRotY
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
        start: "top bottom",
        end: "center center",
        scrub: 0.2,
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
            start: "top bottom",
            end: "center center",
            scrub: 0.2,
          }
        }
      );
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
      let eRotX = 0;
      let eRotY = comp.isLogo ? 0 : comp.randomRotY;
      let eRotZ = 0; // Resistors horizontal to show plugged into breadboard

      // Unique assembly animation logic
      const distToCenter = Math.sqrt(comp.endPos[0]*comp.endPos[0] + comp.endPos[2]*comp.endPos[2]);
      const leftToRight = Math.max(0, Math.min(1, (comp.endPos[0] + 10) / 20)); // 0 to 1 based on X pos
      const waveOffset = leftToRight * 0.2; // sweeping wave from left to right
      let delayedProgress = Math.max(0, Math.min(1, (progress - waveOffset) / (1 - waveOffset)));
      
      // Bouncy easing for assembling
      let rawEase = delayedProgress === 1 ? 1 : (delayedProgress < 0.5 ? 4 * delayedProgress * delayedProgress * delayedProgress : 1 - Math.pow(-2 * delayedProgress + 2, 3) / 2);
      
      // Snap to 1 early to prevent micro-jiggles and vibration when near the end of the scroll
      let easeProgress = rawEase > 0.95 ? 1 : rawEase;

      let targetX = comp.endPos[0];
      let targetY = comp.endPos[1];
      let targetZ = comp.endPos[2];

      // Make them drop and pop subtly
      if (delayedProgress > 0.0 && delayedProgress < 1.0) {
           // Smoothly fade the intensity to strictly 0 as delayedProgress hits 1
           const hoverIntensity = Math.sin(delayedProgress * Math.PI) * 0.5;
           targetY += hoverIntensity * 5; // fly higher before dropping
           
           // Flip subtly while dropping
           const rotIntensity = Math.sin(delayedProgress * Math.PI);
           eRotX += rotIntensity * Math.PI * 0.25;
           eRotY += rotIntensity * Math.PI * 0.5;
      }

      if (easeProgress >= 0.999) {
          mesh.position.set(targetX, targetY, targetZ);
          mesh.rotation.set(eRotX, eRotY, eRotZ);
      } else {
          // Interpolate
          mesh.position.x = THREE.MathUtils.lerp(sx, targetX, easeProgress);
          mesh.position.y = THREE.MathUtils.lerp(sy, targetY, easeProgress);
          mesh.position.z = THREE.MathUtils.lerp(sz, targetZ, easeProgress);

          // Simple rotation lerp
          mesh.rotation.x = THREE.MathUtils.lerp(sRotX, eRotX, easeProgress);
          mesh.rotation.y = THREE.MathUtils.lerp(sRotY, eRotY, easeProgress);
          mesh.rotation.z = THREE.MathUtils.lerp(sRotZ, eRotZ, easeProgress);
      }
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
    const idealOrbitX = Math.sin(t) * 35;
    const idealOrbitZ = Math.cos(t) * 35;
    const idealOrbitY = 18;

    const settledCamX = 0;
    const settledCamY = 14;
    const settledCamZ = 10;

    const baseCamX = THREE.MathUtils.lerp(idealOrbitX, settledCamX, progress);
    const baseCamY = THREE.MathUtils.lerp(idealOrbitY, settledCamY, progress);
    const baseCamZ = THREE.MathUtils.lerp(idealOrbitZ, settledCamZ, progress);

    const mouseMultX = THREE.MathUtils.lerp(30, 0.5, progress); // lower mouse influence when settled
    const mouseMultY = THREE.MathUtils.lerp(25, 0.5, progress);
    
    const targetX = baseCamX + mouse.x * mouseMultX;
    const targetY = baseCamY + mouse.y * mouseMultY;
    const targetZ = baseCamZ;

    camera.position.lerp(vec.set(targetX, targetY, targetZ), 0.05);
    camera.lookAt(target);
  });
}

export default function AntigravityHero() {
  const progressRef = useRef({ value: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
     if (wrapperRef.current) {
        gsap.to(wrapperRef.current, {
           opacity: 0,
           scrollTrigger: {
              trigger: "#simulation-section",
              start: "bottom bottom",
              end: "bottom center",
              scrub: true,
           }
        });
     }
  }, []);

  return (
    <div ref={wrapperRef} className="fixed inset-0 pointer-events-none z-0">
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
        <EffectComposer>
          <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} />
          <Vignette eskil={false} offset={0.1} darkness={0.8} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
