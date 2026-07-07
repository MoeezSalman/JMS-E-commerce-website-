"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import type { Group } from "three";

function ShoppingBag() {
  const group = useRef<Group>(null);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.4;
  });

  return (
    <group ref={group}>
      {/* Bag body */}
      <RoundedBox args={[2.2, 2.4, 1.15]} radius={0.14} smoothness={5}>
        <meshStandardMaterial color="#7c3aed" roughness={0.3} metalness={0.15} />
      </RoundedBox>

      {/* Front accent panel */}
      <RoundedBox
        args={[1.5, 1.5, 0.06]}
        radius={0.1}
        smoothness={4}
        position={[0, -0.05, 0.61]}
      >
        <meshStandardMaterial
          color="#8b5cf6"
          roughness={0.22}
          metalness={0.25}
          emissive="#6d28d9"
          emissiveIntensity={0.18}
        />
      </RoundedBox>

      {/* "J" monogram bar on the bag */}
      <RoundedBox args={[0.16, 0.9, 0.05]} radius={0.05} smoothness={3} position={[0.18, 0.05, 0.66]}>
        <meshStandardMaterial color="#ecfeff" roughness={0.3} metalness={0.1} />
      </RoundedBox>
      <RoundedBox args={[0.5, 0.16, 0.05]} radius={0.05} smoothness={3} position={[-0.05, -0.35, 0.66]}>
        <meshStandardMaterial color="#ecfeff" roughness={0.3} metalness={0.1} />
      </RoundedBox>

      {/* Handles (front + back arches) */}
      {[0.4, -0.4].map((z) => (
        <mesh key={z} position={[0, 1.2, z]}>
          <torusGeometry args={[0.52, 0.078, 16, 64, Math.PI]} />
          <meshStandardMaterial
            color="#22d3ee"
            roughness={0.2}
            metalness={0.45}
            emissive="#0891b2"
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

function Parcel({
  position,
  color,
  ribbon,
  size = 0.5,
}: {
  position: [number, number, number];
  color: string;
  ribbon: string;
  size?: number;
}) {
  return (
    <Float speed={2.2} rotationIntensity={1.6} floatIntensity={2.2}>
      <group position={position}>
        <RoundedBox args={[size, size, size]} radius={0.06} smoothness={4}>
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.35} />
        </RoundedBox>
        <mesh>
          <boxGeometry args={[size * 1.03, size * 0.16, size * 1.03]} />
          <meshStandardMaterial color={ribbon} roughness={0.2} metalness={0.4} />
        </mesh>
        <mesh>
          <boxGeometry args={[size * 0.16, size * 1.03, size * 1.03]} />
          <meshStandardMaterial color={ribbon} roughness={0.2} metalness={0.4} />
        </mesh>
      </group>
    </Float>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 6.4], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 5, 4]} intensity={1.4} color="#e0e7ff" />
      <pointLight position={[-4, -2, -2]} intensity={3} color="#8b5cf6" />
      <pointLight position={[4, 2, 3]} intensity={1.6} color="#22d3ee" />

      <Float speed={1.4} rotationIntensity={0.4} floatIntensity={1.1}>
        <ShoppingBag />
      </Float>

      <Parcel position={[2.6, 1.4, -0.5]} color="#22d3ee" ribbon="#a78bfa" size={0.55} />
      <Parcel position={[-2.7, -1.1, -0.3]} color="#f472b6" ribbon="#fde68a" size={0.46} />
      <Parcel position={[2.3, -1.5, 0.4]} color="#a78bfa" ribbon="#22d3ee" size={0.4} />
      <Parcel position={[-2.4, 1.5, 0.2]} color="#34d399" ribbon="#ffffff" size={0.34} />
    </Canvas>
  );
}
