import type { CoinType, Player as PlayerType } from '../types'

// Constants
const GRID_SIZE = 60
const COIN_DETECTION_RADIUS = 15 // How far away AI can detect coins

/**
 * Calculates the distance between two 3D points
 */
export const calculateDistance = (
	point1: [number, number, number],
	point2: [number, number, number]
): number => {
	const dx = point1[0] - point2[0]
	const dy = point1[1] - point2[1]
	const dz = point1[2] - point2[2]
	return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

/**
 * Finds the nearest coin to a player
 */
export const findNearestCoin = (
	player: PlayerType,
	coins: CoinType[]
): CoinType | null => {
	const availableCoins = coins.filter((coin) => !coin.collected)
	if (availableCoins.length === 0) return null

	let nearestCoin = availableCoins[0]
	let minDistance = calculateDistance(player.position, nearestCoin.position)

	for (let i = 1; i < availableCoins.length; i++) {
		const coin = availableCoins[i]
		const distance = calculateDistance(player.position, coin.position)
		if (distance < minDistance) {
			minDistance = distance
			nearestCoin = coin
		}
	}

	// Only return the coin if it's within detection radius
	if (minDistance <= COIN_DETECTION_RADIUS) {
		return nearestCoin
	}
	return null
}

/**
 * Calculates the angle to a target position
 */
export const calculateAngleToTarget = (
	currentPosition: [number, number, number],
	targetPosition: [number, number, number]
): number => {
	const dx = targetPosition[0] - currentPosition[0]
	const dz = targetPosition[2] - currentPosition[2]
	return Math.atan2(dx, -dz) // Negative z because forward is negative z in our coordinate system
}

/**
 * Updates AI player movement based on nearby coins
 */
export const updateAIPlayerMovement = (
	player: PlayerType,
	coins: CoinType[],
	deltaTime: number,
	movementSpeed: number
): PlayerType => {
	const nearestCoin = findNearestCoin(player, coins)
	let [x, y, z] = player.position
	let rotation = player.rotation ?? 0

	if (nearestCoin) {
		// Calculate the angle to the coin
		const targetAngle = calculateAngleToTarget(
			player.position,
			nearestCoin.position
		)

		// Gradually rotate towards the coin
		const angleDiff = targetAngle - rotation

		// Normalize the angle difference to be between -π and π
		let normalizedAngleDiff = angleDiff
		while (normalizedAngleDiff > Math.PI) normalizedAngleDiff -= 2 * Math.PI
		while (normalizedAngleDiff < -Math.PI)
			normalizedAngleDiff += 2 * Math.PI

		// Rotate towards the coin with some randomness
		const rotationSpeed = 2.0 * deltaTime // Adjust rotation speed as needed
		if (Math.abs(normalizedAngleDiff) > 0.1) {
			rotation += Math.sign(normalizedAngleDiff) * rotationSpeed
		}

		// Keep rotation between 0 and 2π
		rotation = ((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
	} else {
		// Random movement when no coins are nearby
		if (Math.random() < 0.02) {
			const turn = (Math.random() < 0.5 ? -1 : 1) * (Math.PI / 2)
			rotation += turn
			// Keep rotation between 0 and 2π
			rotation =
				((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
		}
	}

	// Move forward in the current direction
	x += Math.sin(rotation) * movementSpeed * deltaTime
	z -= Math.cos(rotation) * movementSpeed * deltaTime

	// Clamp to grid
	x = Math.max(Math.min(x, GRID_SIZE / 2), -GRID_SIZE / 2)
	z = Math.max(Math.min(z, GRID_SIZE / 2), -GRID_SIZE / 2)

	return {
		...player,
		position: [x, y, z],
		rotation,
	}
}
