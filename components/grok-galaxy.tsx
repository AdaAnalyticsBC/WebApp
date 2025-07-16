'use client';

import React, { useRef, useMemo, useState, useEffect, createContext, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
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

// Define a Node type for all nodes
interface Node {
  position: [number, number, number];
  size: number;
  isBlue: boolean;
}

// Optimized node distribution - half blue, half static
function getOptimizedNodes(size = 0.14): Node[] {
  const nodes: Node[] = [];
  const radius = 7;
  const total = 90; // More nodes for a denser, more circular look
  const spreadFactor = 0.3; // Tighter cluster
  const blueCount = Math.floor(total / 2); // Half blue nodes

  // Use a fixed seed for deterministic layout
  const rand = mulberry32(42);

  // Create all nodes (half blue, half static)
  for (let i = 0; i < total; i++) {
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    const r = radius * (1 + rand() * spreadFactor);

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    nodes.push({
      position: [x, y, z] as [number, number, number],
      size,
      isBlue: i < blueCount
    });
  }

  return nodes;
}

// Connection lines component for all nodes
function ConnectionLines({ nodes }: { nodes: Node[] }) {
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

// Static (grey) nodes using InstancedMesh
function StaticNodes({ nodes }: { nodes: Node[] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const staticNodes = useMemo(() => nodes.filter(node => !node.isBlue), [nodes]);

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
      castShadow
      receiveShadow
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

// Blue nodes using InstancedMesh
function BlueNodes({ nodes }: { nodes: Node[] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const blueNodes = useMemo(() => nodes.filter(node => node.isBlue), [nodes]);

  useEffect(() => {
    if (!meshRef.current) return;

    const mesh = meshRef.current;
    const tempObject = new THREE.Object3D();
    
    blueNodes.forEach((node, i) => {
      tempObject.position.set(node.position[0], node.position[1], node.position[2]);
      tempObject.rotation.set(0.2, 0, 0.5);
      tempObject.updateMatrix();
      mesh.setMatrixAt(i, tempObject.matrix);
    });
    
    mesh.instanceMatrix.needsUpdate = true;
  }, [blueNodes]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, blueNodes.length]}
      position={[0, 0, 0]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[0.14, 0.14, 0.05]} />
      <meshStandardMaterial
        color="#38bdf8"
        emissive="#38bdf8"
        emissiveIntensity={0.4}
      />
    </instancedMesh>
  );
}

// Simple floating question tooltips (1-3 at a time)
function FloatingQuestions() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [positions, setPositions] = useState<Array<[number, number, number]>>([]);

  useEffect(() => {
    // Pick 1-3 random questions
    const questionCount = Math.floor(Math.random() * 3) + 1; // 1-3 questions
    const selectedQuestions = [];
    const selectedPositions = [];
    
    for (let i = 0; i < questionCount; i++) {
      const randomIndex = Math.floor(Math.random() * questionPool.length);
      selectedQuestions.push(questionPool[randomIndex]);
      
      // Random positions around the sphere
      const radius = 8 + Math.random() * 2; // Slightly outside the node sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      selectedPositions.push([x, y, z] as [number, number, number]);
    }
    
    setQuestions(selectedQuestions);
    setPositions(selectedPositions);

    // Update questions every 8 seconds
    const interval = setInterval(() => {
      const newQuestionCount = Math.floor(Math.random() * 3) + 1;
      const newQuestions = [];
      const newPositions = [];
      
      for (let i = 0; i < newQuestionCount; i++) {
        const randomIndex = Math.floor(Math.random() * questionPool.length);
        newQuestions.push(questionPool[randomIndex]);
        
        const radius = 8 + Math.random() * 2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        newPositions.push([x, y, z] as [number, number, number]);
      }
      
      setQuestions(newQuestions);
      setPositions(newPositions);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {questions.map((question, i) => (
        <Html 
          key={`${question}-${i}`}
          position={positions[i] || [0, 0, 0]}
          center 
          distanceFactor={10} 
          zIndexRange={[50, 0]}
          pointerEvents="none"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="z-50 text-[13px] w-fit max-w-[200px] font-bold text-foreground bg-neutral-100 px-3 py-2 rounded-md backdrop-blur-lg shadow-lg text-center select-none pointer-events-none whitespace-nowrap"
            style={{ pointerEvents: 'none' }}
          >
            {question}
          </motion.div>
        </Html>
      ))}
    </>
  );
}

function NodeGroup({ size = 0.14 }: { size?: number }) {
  const [nodes, setNodes] = useState<Node[] | null>(null);
  useEffect(() => {
    setNodes(getOptimizedNodes(size));
  }, [size]);
  
  if (!nodes) return null;

  return (
    <>
      <ConnectionLines nodes={nodes} />
      <StaticNodes nodes={nodes} />
      <BlueNodes nodes={nodes} />
      <FloatingQuestions />
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
          shadows
        >
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[0, 10, 0]} 
            intensity={0.8} 
            castShadow 
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <AutoRotate>
            <NodeGroup size={0.1} />
          </AutoRotate>
        </Canvas>
      </div>
    </div>
  );
}