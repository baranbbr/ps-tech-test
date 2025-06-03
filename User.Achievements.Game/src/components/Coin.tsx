import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface CoinProps {
  position: [number, number, number];
}

const Coin: React.FC<CoinProps> = ({ position }) => {
  const meshRef = useRef<Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Rotate the coin
      meshRef.current.rotation.y = clock.getElapsedTime() * 2;
      // Make the coin bob up and down
      meshRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 2) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
      <meshStandardMaterial color="gold" metalness={0.8} roughness={0.2} />
    </mesh>
  );
};

export default Coin;
