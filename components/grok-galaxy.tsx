'use client';

import React, { useRef, useMemo, useState, useEffect, createContext, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, a } from '@react-spring/three';
import { motion } from 'motion/react';
import { Particles } from "./magicui/particles";

const questionPool = [
  "What’s the best way to hedge against inflation in 2024?",
  "How do ETFs compare to mutual funds for long-term growth?",
  "What are the risks of algorithmic trading for retail investors?",
  "How does AI impact modern portfolio management?",
  "180 Redditors want to buy SPY.",
  "Most discussed stock this week: NVDA.",
  "Is now a good time to rebalance a 60/40 portfolio?",
  "Why is TSLA so volatile this month?",
  "What are the best dividend stocks for 2024?",
  "Redditors are bullish on QQQ.",
];

// Deterministic seeded random number generator
function mulberry32(seed: number) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

// Organic "galaxy" style node distribution
function getHardcodedNodes(size = 0.14) {
  const nodes = [];
  const radius = 7;
  const total = 160;
  let spreadFactor = 0.5;

  // Use a fixed seed for deterministic layout
  const rand = mulberry32(42);

  // Make every 6th node blue, rest grey
  let blueIndex = 0;
  for (let i = 0; i < total; i++) {
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    const r = radius * (1 + rand() * spreadFactor);

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    const isBlue = i % 6 === 0;
    nodes.push({
      position: [x, y, z] as [number, number, number],
      label: isBlue ? questionPool[blueIndex++ % questionPool.length] : "",
      size, // use the parameter
      hoverable: isBlue,
      isBlue
    });
  }

  return nodes;
}

function Node({
  position,
  label,
  size,
  hoverable,
  isBlue
}: {
  position: [number, number, number];
  label: string;
  size: number;
  hoverable: boolean;
  isBlue: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Pick a random finance question/info for blue nodes
  const [financeInfo] = useState(() => questionPool[Math.floor(Math.random() * questionPool.length)]);

  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const check = () => setIsMobileOrTablet(window.innerWidth < 800);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useFrame(() => {
    // Always face the camera in 2D (no rotation)
    if (ref.current) {
      ref.current.rotation.set(0.2, 0, 0.5);
    }
  });

  // Force all visibleDistance < 7 nodes to always be bright sky blue
  const color = isBlue ? '#38bdf8' : '#FAFAFA';

  const handlePointerOver = () => {
    if (!hoverable || isMobileOrTablet) return;
    setHovered(true);
    setShowTooltip(true);
  };

  const handlePointerOut = () => {
    if (!hoverable || isMobileOrTablet) return;
    setHovered(false);
    setShowTooltip(false);
  };

  const { scale } = useSpring({
    scale: hovered ? 1.5 : 1,
    config: { tension: 170, friction: 18 }
  });

  return (
    <>
      {hoverable && (
        <mesh
          position={position}
          rotation={[0, 0, 0]}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <boxGeometry args={[2, 2, 0.1]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      )}

      <a.mesh
        ref={ref}
        position={position}
        scale={scale}
        rotation={[0, 0, 0]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[size, size, 0.05]} />
        <meshStandardMaterial
          color={color}
          emissive={isBlue ? '#38bdf8' : '#FAFAFA'}
          emissiveIntensity={isBlue ? 0.4 : 0}
        />
        {showTooltip && (
          <Html position={[0, size * 1.5, 0]} center distanceFactor={10} zIndexRange={[isBlue ? 50 : 20, 0]}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.18, ease: "easeInOut" }}
              className={`${isBlue ? "z-50" : "z-20"} text-[14px] font-bold text-foreground bg-neutral-100 px-3 py-2 rounded-md backdrop-blur-lg shadow-lg text-center whitespace-nowrap select-none`}
              style={{ zIndex: isBlue ? 50 : 20, position: 'relative' }}
            >
              {financeInfo}
            </motion.div>
          </Html>
        )}
      </a.mesh>

      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([...position, 0, 0, 0]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#FAFAFA" linewidth={1} />
      </line>
    </>
  );
}

function NodeGroup({ size = 0.14 }: { size?: number }) {
  const nodes = useMemo(() => getHardcodedNodes(size), [size]);
  return <>{nodes.map((node, i) => <Node key={i} {...node} />)}</>;
}

function AutoRotate({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  const isDragging = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  // Drag handlers
  const onPointerDown = useCallback((e: any) => {
    isDragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
    // Prevent canvas drag select
    e.target.setPointerCapture?.(e.pointerId);
  }, []);
  const onPointerUp = useCallback((e: any) => {
    isDragging.current = false;
    last.current = null;
    e.target.releasePointerCapture?.(e.pointerId);
  }, []);
  const onPointerMove = useCallback((e: any) => {
    if (!isDragging.current || !last.current || !ref.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    ref.current.rotation.y += dx * 0.0025;
    ref.current.rotation.x += dy * 0.0025;
    last.current = { x: e.clientX, y: e.clientY };
  }, []);

  useFrame((_, delta) => {
    if (!isDragging.current && ref.current) {
      ref.current.rotation.y += delta * 0.01;
    }
  });

  return (
    <DragContext.Provider value={{ isDragging: isDragging.current }}>
      <group
        ref={ref}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerMove={onPointerMove}
      >
        {children}
      </group>
    </DragContext.Provider>
  );
}

const DragContext = createContext<{ isDragging: boolean }>({ isDragging: false });

export default function GrokGalaxy() {
  return (
    <div className="relative w-full h-[500px] md:h-screen">
      {/* Particles background */}
      <Particles
        className="absolute inset-0 w-full h-full z-0 hidden xl:block"
        color="#38bdf8"
        quantity={90}
        size={0.7}
        staticity={60}
        ease={60}
      />
      <div className="w-full h-full relative z-10 rounded-xl overflow-visible">
        <Canvas camera={{ position: [0, 0, 20], fov: 60 }} className="w-full h-full">
          <ambientLight intensity={1} />
          <pointLight position={[10, 60, 10]} intensity={0.2} />
          <AutoRotate>
            <NodeGroup size={0.1} />
          </AutoRotate>
        </Canvas>
      </div>
    </div>
  );
}