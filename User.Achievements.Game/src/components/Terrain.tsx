import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'
import grassTextureImg from '../assets/grass-texture.png' // adjust path as needed
import React from 'react'

const Terrain: React.FC = () => {
	const grassTexture = useLoader(TextureLoader, grassTextureImg)

	return (
		<mesh
			rotation={[-Math.PI / 2, 0, 0]}
			position={[0, 0, 0]}
			receiveShadow>
			<planeGeometry args={[250, 250, 1, 1]} />
			<meshStandardMaterial map={grassTexture} />
		</mesh>
	)
}

export default Terrain
