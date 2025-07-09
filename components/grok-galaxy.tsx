'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useRef, useMemo, useState, useContext, createContext } from 'react';
import * as THREE from 'three';
import { useSpring, a } from '@react-spring/three';


const questionPool = [
  'Will crypto replace fiat currencies?',
  'Can AI beat the market long-term?',
  'What triggers SEC investigations?',
  'How is insider trading detected?',
  'What drives whale movements in crypto?',
  'Are stablecoins truly stable?',
  'How transparent are hedge funds?',
  'Do social signals move markets?',
  'How risky is DeFi yield farming?',
  'Can sentiment predict crashes?',
  'Should trading bots be regulated?',
  'What’s the future of CBDCs?',
  'Can governance tokens impact law?',
  'Will ETFs disrupt crypto markets?',
  'Do tokenomics affect investor trust?'
];

// Organic "galaxy" style node distribution
function getHardcodedNodes() {
  const nodes = [];
  const radius = 7;
  const total = 160;
  let spreadFactor = 0.15;
  if (typeof window !== 'undefined') {
    const width = window.innerWidth;
    if (width >= 1200) {
      spreadFactor = 0.6;
    } else if (width >= 800) {
      spreadFactor = 0.3;
    } else {
      spreadFactor = 0.15;
    }
  }

  for (let i = 0; i < total; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = radius * (1 + Math.random() * spreadFactor);

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    nodes.push({
      position: [x, y, z] as [number, number, number],
      label: questionPool[i % questionPool.length],
      size: 0.14,
      hoverable: i % 2 === 0,
      visibleDistance: r,
      isBlue: i % 2 === 0
    });
  }

  return nodes;
}

const DragContext = createContext<{ isDragging: boolean }>({ isDragging: false });

import { useEffect } from 'react';

let lastTooltipTime = 0;

function Node({
  position,
  label,
  size,
  hoverable,
  visibleDistance,
  isBlue
}: {
  position: [number, number, number];
  label: string;
  size: number;
  hoverable: boolean;
  visibleDistance: number;
  isBlue: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { isDragging } = useContext(DragContext);
  const lastShownRef = useRef<number>(0);
  const [showTooltip, setShowTooltip] = useState(false);

  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const check = () => setIsMobileOrTablet(window.innerWidth < 800);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useFrame(() => {
    if (ref.current) ref.current.lookAt(0, 0, 0);
  });

  // Force all visibleDistance < 7 nodes to always be bright sky blue
  const color = isBlue ? '#0ea5e9' : '#e5e5e5';

  const handlePointerOver = () => {
    if (!hoverable || isMobileOrTablet) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHovered(true);
  };

  const handlePointerOut = () => {
    if (!hoverable || isMobileOrTablet) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setHovered(false), 600);
  };

  useEffect(() => {
    const now = Date.now();

    if (hovered && isBlue && now - lastTooltipTime > 800) {
      lastTooltipTime = now;
      setShowTooltip(true);
    } else if (!hovered) {
      setTimeout(() => setShowTooltip(false), 100); // only hide with slight delay
    }
  }, [hovered, isBlue]);

  useEffect(() => {
    if (isMobileOrTablet && isBlue) {
      const interval = setInterval(() => {
        if (Date.now() - lastTooltipTime > 800) {
          setHovered(Math.random() < 0.03);
        } else {
          setHovered(false);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isMobileOrTablet, isBlue]);

  useEffect(() => {
    return () => {
      lastTooltipTime = Date.now(); // track when tooltip ends
    };
  }, [showTooltip]);

  const { scale } = useSpring({
    scale: hovered ? 1.5 : 1,
    config: { tension: 170, friction: 18 }
  });

  return (
    <>
      <mesh
        position={position}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[size * 10, size * 10, 0.1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <a.mesh
        ref={ref}
        position={position}
        scale={scale}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[size, size, 0.05]} />
        <meshStandardMaterial
          color={color}
          emissive={isBlue ? '#0ea5e9' : '#000000'}
          emissiveIntensity={isBlue ? 0.4 : 0}
        />
        {showTooltip && (
          <Html position={[0, size * 1.5, 0]} center distanceFactor={10}>
            <div
              className={`text-[0.875rem] font-bold text-foreground bg-neutral-100 px-3 py-2 rounded-md backdrop-blur-lg shadow-lg text-center whitespace-nowrap`}
            >
              {label.toUpperCase()}
            </div>
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
        <lineBasicMaterial color="#f5f5f5" linewidth={1} />
      </line>
    </>
  );
}

function NodeGroup() {
  const nodes = useMemo(() => getHardcodedNodes(), []);
  return <>{nodes.map((node, i) => <Node key={i} {...node} />)}</>;
}

import { useCallback } from 'react';
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

export default function GrokGalaxy() {
  return (
    <div className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px]">
      <div className="absolute top-1/2 left-1/8 right-1/8 bottom-1/2 flex flex-col items-center justify-center gap-2 z-10 bg-[radial-gradient(circle,_rgba(0,0,0,0.12)_0%,_transparent_100%)]"></div>
      <div className="w-full h-full relative z-10 rounded-xl overflow-visible">
        <Canvas camera={{ position: [0, 0, 20], fov: 60 }} className="w-full h-full">
          <ambientLight intensity={0.7} />
          <pointLight position={[10, 10, 10]} />
          <AutoRotate>
            <NodeGroup />
          </AutoRotate>
        </Canvas>
      </div>
    </div>
  );
}