import type { CoinType, SnakeSegmentType } from '../types'

// Game constants
export const GRID_SIZE = 60
export const MOVEMENT_SPEED = 3
export const COIN_COUNT = 10
export const TICK_RATE = 16 // ms between game ticks (60 fps)
export const SEGMENTS_PER_COIN = 10 // Number of segments to add to snake per coin

/**
 * Generates a new coin at a random position not too close to a given position
 */
export function generateCoinNotNear(pos: [number, number, number]): CoinType {
	let x, z
	do {
		x = Math.floor(Math.random() * GRID_SIZE) - GRID_SIZE / 2
		z = Math.floor(Math.random() * GRID_SIZE) - GRID_SIZE / 2
	} while (Math.abs(x - pos[0]) < 5 && Math.abs(z - pos[2]) < 5)
	return {
		id: `coin-${Math.random().toString(36).substr(2, 9)}`,
		position: [x, 0.5, z],
		collected: false,
	}
}

/**
 * Check for coin collisions for a given player
 */
export function collectCoinsForPlayer(
	playerPos: [number, number, number],
	coinsArr: CoinType[]
): [CoinType[], boolean] {
	let coinCollected = false
	const updatedCoins = coinsArr.map((coin) => {
		if (!coin.collected) {
			const dx = playerPos[0] - coin.position[0]
			const dy = playerPos[1] - coin.position[1]
			const dz = playerPos[2] - coin.position[2]
			const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
			// Use a larger collection radius (2.5 instead of 1.5) to make it easier for AI players to collect coins
			if (distance < 2.5) {
				coinCollected = true
				return { ...coin, collected: true }
			}
		}
		return coin
	})
	return [updatedCoins, coinCollected]
}

/**
 * Add segments to a snake
 */
export function addSnakeSegments(
	prevSegments: SnakeSegmentType[] | undefined,
	count: number = SEGMENTS_PER_COIN
): SnakeSegmentType[] {
	// Handle undefined case
	if (!prevSegments || prevSegments.length === 0) {
		return []
	}

	const newSegments = [...prevSegments]

	const lastSegment = newSegments[newSegments.length - 1]
	for (let i = 0; i < count; i++) {
		const newSegment: SnakeSegmentType = {
			position: [...lastSegment.position] as [number, number, number],
			index: newSegments.length,
		}
		newSegments.push(newSegment)
	}
	return newSegments
}

/**
 * Update snake segments to follow the head
 */
export function updateSnakeSegments(
	prevSegments: SnakeSegmentType[] | undefined,
	headPosition: [number, number, number],
	movementSpeed: number
): SnakeSegmentType[] {
	// Handle undefined or empty segments
	if (!prevSegments || prevSegments.length === 0) {
		// Return an empty array or initialize with head position
		return [
			{
				position: [...headPosition] as [number, number, number],
				index: 0,
			},
		]
	}

	const newSegments = [...prevSegments]
	// Store the current position of each segment before updating
	const prevPositions = prevSegments.map((seg) => [...seg.position])

	// Update the head position first
	newSegments[0] = {
		...newSegments[0],
		position: [...headPosition] as [number, number, number],
	}

	// Update each segment to follow the one in front of it
	for (let i = 1; i < newSegments.length; i++) {
		// Each segment moves to where the segment in front of it was
		const targetPosition = prevPositions[i - 1]
		const currentPosition = prevSegments[i].position

		// Calculate direction vector to the target position
		const dirX = targetPosition[0] - currentPosition[0]
		const dirZ = targetPosition[2] - currentPosition[2]

		// Calculate distance to the target position
		const distance = Math.sqrt(dirX * dirX + dirZ * dirZ)

		// Move segment towards the target position
		if (distance > 0.1) {
			// Normalize direction vector
			const normalizedDirX = dirX / distance
			const normalizedDirZ = dirZ / distance

			// Calculate new position with smoother following
			const moveSpeed = Math.min(distance, movementSpeed * 1.5)

			newSegments[i] = {
				...newSegments[i],
				position: [
					currentPosition[0] + normalizedDirX * moveSpeed,
					currentPosition[1],
					currentPosition[2] + normalizedDirZ * moveSpeed,
				] as [number, number, number],
			}
		}
	}

	return newSegments
}

/**
 * Check if the player has collided with their own snake
 */
export function checkSelfCollision(
	headPosition: [number, number, number],
	snakeSegments: SnakeSegmentType[]
): boolean {
	// Start from index 3 to avoid immediate collision with neck
	for (let i = 3; i < snakeSegments.length; i++) {
		const seg = snakeSegments[i]
		const dx = headPosition[0] - seg.position[0]
		const dy = headPosition[1] - seg.position[1]
		const dz = headPosition[2] - seg.position[2]
		const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
		if (distance < 1.0) {
			return true
		}
	}
	return false
}
