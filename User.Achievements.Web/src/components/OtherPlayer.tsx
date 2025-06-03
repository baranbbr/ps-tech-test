import React from 'react'
import { Text } from '@react-three/drei'
import type { Player } from '../types'

interface OtherPlayerProps {
	userData: Player
}

export const OtherPlayer: React.FC<OtherPlayerProps> = ({ userData }) => {
	// Color based on achievement level
	const getColorByLevel = (level: string) => {
		if (level === 'Platinum') return '#E5E4E2' // Platinum
		if (level === 'Gold') return '#FFD700' // Gold
		if (level === 'Silver') return '#C0C0C0' // Silver
		if (level === 'Bronze') return '#CD7F32' // Bronze
		return '#808080' // Default
	}

	return (
		<group position={userData.position}>
			<mesh>
				<boxGeometry args={[1, 1, 1]} />
				<meshStandardMaterial
					color={getColorByLevel(userData.level)}
					metalness={0.6}
					roughness={0.2}
				/>
			</mesh>
			<Text
				position={[0, 1.5, 0]}
				fontSize={0.5}
				color='white'
				anchorX='center'
				anchorY='middle'
				rotateY={Math.PI} // Rotate text to face camera
			>
				{userData.name}
			</Text>
			<Text
				position={[0, 2, 0]}
				fontSize={0.3}
				color={getColorByLevel(userData.level)}
				anchorX='center'
				anchorY='middle'
				rotateY={Math.PI} // Rotate text to face camera
			>
				Level: {userData.level}
			</Text>
		</group>
	)
}

export default OtherPlayer
