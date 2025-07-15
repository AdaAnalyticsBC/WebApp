'use client';

import React, { useRef, useMemo, useState, useEffect, createContext, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, a } from '@react-spring/three';
import { motion } from 'motion/react';
import { Particles } from "./magicui/particles";
import { useCursor } from './cursor-context';

const questionPool = [
  "What's the best way to hedge against inflation in 2024?",
  "How do ETFs compare to mutual funds for long-term growth?",
  "What are the risks of algorithmic trading for retail investors?",
  "How does AI impact modern portfolio management?",
  "180 Redditors want to buy SPY.",
  "Most discussed stock this week: NVDA.",
  "Is now a good time to rebalance a 60/40 portfolio?",
  "Why is TSLA so volatile this month?",
  "What are the best dividend stocks for 2024?",
  "Redditors are bullish on QQQ.",
  "How does sector rotation affect portfolio performance?",
  "What's the impact of Fed policy on small cap stocks?",
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

// Optimized node distribution with connection lines for all nodes
function getOptimizedNodes(size = 0.14) {
  const nodes = [];
  const radius = 7;
  const total = 60; // Reduced further for better performance
  const spreadFactor = 0.5;
  const interactiveCount = 10; // Increased interactive nodes

  // Use a fixed seed for deterministic layout
  const rand = mulberry32(42);

  // First, create interactive blue nodes
  for (let i = 0; i < interactiveCount; i++) {
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    const r = radius * (1 + rand() * spreadFactor);

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    nodes.push({
      position: [x, y, z] as [number, number, number],
      label: questionPool[i % questionPool.length],
      size,
      hoverable: true,
      isBlue: true,
      isInteractive: true
    });
  }

  // Then create static grey nodes
  for (let i = interactiveCount; i < total; i++) {
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    const r = radius * (1 + rand() * spreadFactor);

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    nodes.push({
      position: [x, y, z] as [number, number, number],
      label: "",
      size,
      hoverable: false,
      isBlue: false,
      isInteractive: false
    });
  }

  return nodes;
}

// Connection lines component for all nodes
function ConnectionLines({ nodes }: { nodes: any[] }) {
  const linesRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!linesRef.current) return;

    // Clear existing lines
    while (linesRef.current.children.length > 0) {
      linesRef.current.remove(linesRef.current.children[0]);
    }

    // Create lines for all nodes
    nodes.forEach((node) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array([
        node.position[0], node.position[1], node.position[2], // node position
        0, 0, 0 // center
      ]);
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      const material = new THREE.LineBasicMaterial({ 
        color: '#DDD', 
        transparent: true, 
        opacity: 0.3 
      });
      
      const line = new THREE.Line(geometry, material);
      if (linesRef.current) {
        linesRef.current.add(line);
      }
    });
  }, [nodes]);

  return <group ref={linesRef} />;
}

// Optimized static node rendering using InstancedMesh (without lines since they're separate now)
function StaticNodes({ nodes }: { nodes: any[] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const staticNodes = useMemo(() => nodes.filter(node => !node.isInteractive), [nodes]);

  useEffect(() => {
    if (!meshRef.current) return;

    const mesh = meshRef.current;
    const tempObject = new THREE.Object3D();
    
    staticNodes.forEach((node, i) => {
      tempObject.position.set(node.position[0], node.position[1], node.position[2]);
      tempObject.rotation.set(0.2, 0, 0.5);
      tempObject.updateMatrix();
      mesh.setMatrixAt(i, tempObject.matrix);
    });
    
    mesh.instanceMatrix.needsUpdate = true;
  }, [staticNodes]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, staticNodes.length]}
      position={[0, 0, 0]}
    >
      <boxGeometry args={[0.14, 0.14, 0.05]} />
      <meshStandardMaterial
        color="#FAFAFA"
        emissive="#FAFAFA"
        emissiveIntensity={0}
      />
    </instancedMesh>
  );
}

// Improved interactive node with better hover detection
function InteractiveNode({
  position,
  size,
  label
}: {
  position: [number, number, number];
  size: number;
  label: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize mobile check
  useEffect(() => {
    const check = () => setIsMobileOrTablet(window.innerWidth < 800);
    check();
    const debouncedCheck = debounce(check, 100);
    window.addEventListener('resize', debouncedCheck);
    return () => window.removeEventListener('resize', debouncedCheck);
  }, []);

  // Static rotation instead of useFrame for better performance
  useEffect(() => {
    if (ref.current) {
      ref.current.rotation.set(0.2, 0, 0.5);
    }
  }, []);

  // Improved hover handling with debouncing to prevent flickering
  const handlePointerOver = useCallback(() => {
    if (isMobileOrTablet) return;
    
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    setHovered(true);
    setShowTooltip(true);
  }, [isMobileOrTablet]);

  const handlePointerOut = useCallback(() => {
    if (isMobileOrTablet) return;
    
    // Add small delay before hiding to prevent flickering
    hoverTimeoutRef.current = setTimeout(() => {
      setHovered(false);
      setShowTooltip(false);
    }, 50);
  }, [isMobileOrTablet]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const { scale } = useSpring({
    scale: hovered ? 1.5 : 1,
    config: { tension: 300, friction: 30 }
  });

  return (
    <>
      {/* Larger invisible interaction area to prevent flickering */}
      <mesh
        position={position}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[3, 3, 3]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Visible node */}
      <a.mesh
        ref={ref}
        position={position}
        scale={scale}
      >
        <boxGeometry args={[size * 1.2, size * 1.2, 0.05]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={0.4}
        />
        {showTooltip && (
          <Html 
            position={[0, size * 2, 0]} 
            center 
            distanceFactor={10} 
            zIndexRange={[50, 0]}
            pointerEvents="none"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="z-50 text-[13px] w-fit font-bold text-foreground bg-neutral-100 px-3 py-2 rounded-md backdrop-blur-lg shadow-lg text-center whitespace-nowrap select-none pointer-events-none"
              style={{ pointerEvents: 'none' }}
            >
              {label}
            </motion.div>
          </Html>
        )}
      </a.mesh>
    </>
  );
}

// Debounce utility
function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function NodeGroup({ size = 0.14 }: { size?: number }) {
  const nodes = useMemo(() => getOptimizedNodes(size), [size]);
  const interactiveNodes = useMemo(() => nodes.filter(node => node.isInteractive), [nodes]);

  return (
    <>
      <ConnectionLines nodes={nodes} />
      <StaticNodes nodes={nodes} />
      {interactiveNodes.map((node, i) => (
        <InteractiveNode 
          key={i} 
          position={node.position}
          size={node.size}
          label={node.label}
        />
      ))}
    </>
  );
}

function AutoRotate({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  const isDragging = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const { setCursorState, setCursorText, setIsDragging } = useCursor();

  // Optimized drag handlers with useCallback
  const onPointerDown = useCallback((e: PointerEvent) => {
    isDragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
    setCursorState('move');
    setCursorText('Move');
    setIsDragging(true);
    const target = e.target as Element;
    target.setPointerCapture?.(e.pointerId);
  }, [setCursorState, setCursorText, setIsDragging]);
  
  const onPointerUp = useCallback((e: PointerEvent) => {
    isDragging.current = false;
    last.current = null;
    setCursorState('move');
    setCursorText('Move');
    setIsDragging(false);
    const target = e.target as Element;
    target.releasePointerCapture?.(e.pointerId);
  }, [setCursorState, setCursorText, setIsDragging]);
  
  const onPointerMove = useCallback((e: PointerEvent) => {
    if (!isDragging.current || !last.current || !ref.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    ref.current.rotation.y += dx * 0.0025;
    ref.current.rotation.x += dy * 0.0025;
    last.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onPointerEnter = useCallback(() => {
    if (!isDragging.current) {
      setCursorState('move');
      setCursorText('Move');
    }
  }, [setCursorState, setCursorText]);

  const onPointerLeave = useCallback(() => {
    if (!isDragging.current) {
      setCursorState('default');
      setCursorText('');
    }
  }, [setCursorState, setCursorText]);

  // Optimized auto-rotation
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
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
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
      {/* Optimized particles with reduced quantity */}
      <Particles
        className="absolute inset-0 w-full h-full z-0 hidden xl:block"
        color="#38bdf8"
        quantity={50} // Further reduced for better performance
        size={0.7}
        staticity={60}
        ease={60}
      />
      <div className="w-full h-full relative z-10 rounded-xl overflow-visible">
        <Canvas 
          camera={{ position: [0, 0, 20], fov: 60 }} 
          className="w-full h-full"
          performance={{ min: 0.5 }}
        >
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