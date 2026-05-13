import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Environment, Stars, Sparkles, Trail } from '@react-three/drei';
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

function FloatingComponent({ position, type, index, delay }: { position: [number, number, number], type: string, index: number, delay: number }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    // Idle floating animation
    meshRef.current.rotation.x = Math.sin(t / 4 + index) / 10;
    meshRef.current.rotation.y = Math.cos(t / 4 + index) / 10;
    meshRef.current.position.y += Math.sin(t + index) / 200;
  });

  return (
    <group ref={meshRef} position={position}>
      {type === 'resistor' && (
        <group>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.15, 1, 8, 16]} />
            <meshStandardMaterial color="#e0e0e0" roughness={0.2} metalness={0.8} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.4, 16]} />
            <meshStandardMaterial color="#d1d5db" />
          </mesh>
          <mesh position={[-0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
             <cylinderGeometry args={[0.21, 0.21, 0.05, 16]} />
             <meshBasicMaterial color="#b91c1c" />
          </mesh>
          <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
             <cylinderGeometry args={[0.21, 0.21, 0.05, 16]} />
             <meshBasicMaterial color="#a16207" />
          </mesh>
        </group>
      )}
      {type === 'capacitor' && (
        <mesh>
          <cylinderGeometry args={[0.2, 0.2, 0.6, 16]} />
          <meshStandardMaterial color="#374151" roughness={0.1} />
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.21, 0.21, 0.1, 16]} />
            <meshStandardMaterial color="#d1d5db" />
          </mesh>
        </mesh>
      )}
      {type === 'led' && (
        <group>
          <mesh position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.15, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} transparent opacity={0.9} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.15, 0.15, 0.4, 16]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} transparent opacity={0.8} />
          </mesh>
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.05, 16]} />
            <meshStandardMaterial color="#9ca3af" />
          </mesh>
        </group>
      )}
    </group>
  );
}

function GridLogoScene() {
  const containerRef = useRef<THREE.Group>(null);

  const logoPoints = useMemo(() => {
    // Generate an array of points forming a simple "C IQ" or "IQ"
    const points: [number, number][] = [];
    
    // C
    for(let a=0; a<Math.PI; a+=0.3) {
      points.push([-4 - Math.sin(a)*1.5, Math.cos(a)*2]);
    }
    // I
    for(let y=-2; y<=2; y+=0.5) points.push([0, y]);
    // Q
    for(let a=0; a<Math.PI*2; a+=0.3) {
      points.push([4 + Math.cos(a)*1.5, Math.sin(a)*2]);
    }
    points.push([4.8, -1.2]); // Q tail
    points.push([5.5, -2]);

    // Extra background breadboard grid dots
    const extra: [number, number][] = [];
    for(let i=0; i<150; i++) {
        extra.push([(Math.random() - 0.5)*20, (Math.random() - 0.5)*10]);
    }

    return [...points.map(p => ({ p, isLogo: true })), ...extra.map(p => ({ p, isLogo: false }))];
  }, []);

  const components = useMemo(() => {
    return logoPoints.map((item, i) => {
      // Start randomly scattered
      const startPos: [number, number, number] = [
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 30
      ];
      
      // End at logo pos
      const endPos: [number, number, number] = [
        item.p[0],
        item.p[1],
        item.isLogo ? 0 : -3 // Extra items slightly back
      ];
      
      const type = item.isLogo ? 'led' : (Math.random() > 0.5 ? 'resistor' : 'capacitor');
      
      return { startPos, endPos, type, id: i, delay: Math.random() };
    });
  }, [logoPoints]);

  const refs = useRef<THREE.Group[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    components.forEach((comp, i) => {
      const mesh = refs.current[i];
      if (mesh) {
        gsap.to(mesh.position, {
          x: comp.endPos[0],
          y: comp.endPos[1],
          z: comp.endPos[2],
          scrollTrigger: {
            trigger: "#root",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          }
        });
        
        gsap.to(mesh.rotation, {
          x: comp.type === 'resistor' ? 0 : Math.PI / 2,
          y: 0,
          z: comp.type === 'resistor' ? Math.PI / 2 : 0,
          scrollTrigger: {
            trigger: "#root",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          }
        });
      }
    });

    gsap.to(containerRef.current.position, {
      y: 2,
      z: -10,
      rotationX: 0.2,
      scrollTrigger: {
        trigger: "#root",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      }
    });

  }, [components]);

  return (
    <group ref={containerRef}>
      {components.map((comp, i) => (
        <group 
          key={comp.id} 
          ref={el => el && (refs.current[i] = el)} 
          position={comp.startPos}
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]}
        >
          <FloatingComponent position={[0,0,0]} type={comp.type} index={comp.id} delay={comp.delay} />
        </group>
      ))}
      {/* White sparkling stars instead of simple dots */}
      <Sparkles count={100} scale={20} size={2} color="#ffffff" opacity={0.6} speed={0.4} />
      <Stars radius={100} depth={50} count={3000} factor={3} saturation={0} fade speed={1} />
    </group>
  );
}

function Rig() {
  const { camera, mouse } = useThree();
  const vec = new THREE.Vector3();

  return useFrame(() => {
    camera.position.lerp(vec.set(mouse.x * 3, mouse.y * 3, camera.position.z), 0.05);
    camera.lookAt(0, 0, 0);
  });
}

export default function AntigravityHero() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={50} />
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#f8fafc" />
        
        <CursorGlitter />
        <GridLogoScene />
        <Rig />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
