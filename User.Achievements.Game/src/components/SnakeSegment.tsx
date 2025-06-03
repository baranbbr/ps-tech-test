import React from 'react'

interface SnakeSegmentProps {
	position: [number, number, number]
	index: number
}

const SnakeSegment: React.FC<SnakeSegmentProps> = ({ position, index }) => {
	// Use different colors for head and body segments
	const color = index === 0 ? '#4444ff' : '#2222dd'

	return (
		<mesh position={position} castShadow>
			<boxGeometry args={[1, 1, 1]} />
			<meshStandardMaterial color={color} />
		</mesh>
	)
}

export default SnakeSegment
