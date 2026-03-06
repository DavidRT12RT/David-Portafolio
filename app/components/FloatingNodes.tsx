"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

function Nodes({ count = 40, color = "#22c55e" }: { count?: number; color?: string }) {
  const groupRef = useRef<THREE.Group>(null);

  const nodes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4
        ),
        speed: 0.2 + Math.random() * 0.3,
        offset: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, [count]);

  const connections = useMemo(() => {
    const conns: [number, number][] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].pos.distanceTo(nodes[j].pos) < 2.5) {
          conns.push([i, j]);
        }
      }
    }
    return conns;
  }, [nodes]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.015;
    }
  });

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <mesh key={i} position={node.pos}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>
      ))}
      {connections.map(([a, b], i) => (
        <Line
          key={i}
          points={[
            [nodes[a].pos.x, nodes[a].pos.y, nodes[a].pos.z],
            [nodes[b].pos.x, nodes[b].pos.y, nodes[b].pos.z],
          ]}
          color={color}
          transparent
          opacity={0.06}
          lineWidth={0.5}
        />
      ))}
    </group>
  );
}

export default function FloatingNodes({
  className = "",
  color = "#22c55e",
  count = 40,
}: {
  className?: string;
  color?: string;
  count?: number;
}) {
  return (
    <div className={`pointer-events-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: false }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <Nodes count={count} color={color} />
      </Canvas>
    </div>
  );
}
