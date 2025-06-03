import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface PlayerProps {
  position: [number, number, number];
  rotation: number;
}

const Player: React.FC<PlayerProps> = ({ position, rotation }) => {
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.set(position[0], position[1], position[2]);
      meshRef.current.rotation.y = rotation;
    }
  });

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
};

export default Player;
