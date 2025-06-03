import React, { useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface FollowCameraProps {
	target: [number, number, number]
	rotation: number
	distance?: number
	height?: number
	lerp?: number
}

const FollowCamera: React.FC<FollowCameraProps> = ({
	target,
	rotation,
	distance = 15,
	height = 5,
	lerp = 0.1,
}) => {
	const { camera } = useThree()
	const cameraPosition = useRef(
		new THREE.Vector3(target[0], target[1] + height, target[2] - distance)
	)

	useFrame(() => {
		// Calculate camera offset based on rotation
		// We want the camera to follow behind the player based on their rotation
		const angle = rotation
		const offsetX = Math.sin(angle) * distance
		const offsetZ = Math.cos(angle) * distance

		// Calculate ideal camera position - position camera behind the player
		// based on the player's current rotation
		const idealPosition = new THREE.Vector3(
			target[0] + offsetX, // Changed from - to + to position behind
			target[1] + height,
			target[2] + offsetZ // Changed from - to + to position behind
		)

		// Smoothly interpolate current camera position to the ideal position
		cameraPosition.current.lerp(idealPosition, lerp)

		// Update camera position
		camera.position.copy(cameraPosition.current)

		// Make camera look at player
		camera.lookAt(new THREE.Vector3(target[0], target[1], target[2]))
	})

	return null
}

export default FollowCamera
