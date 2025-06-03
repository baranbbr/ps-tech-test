import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stats, OrbitControls } from '@react-three/drei'

// Import components
import Player from './Player'
import SnakeSegment from './SnakeSegment'
import Coin from './Coin'
import Terrain from './Terrain'
import FollowCamera from './FollowCamera'
import OtherPlayer from './OtherPlayer'
import { Leaderboard } from './Leaderboard'

// Import types and API services
import { getAllUsersAsync } from '../services/api'
import type { Player as PlayerType, CoinType, SnakeSegmentType } from '../types'

// Import game utilities
import { updateAIPlayerMovement } from '../utils/gameAI'
import {
	GRID_SIZE,
	MOVEMENT_SPEED,
	COIN_COUNT,
	TICK_RATE,
	SEGMENTS_PER_COIN,
	generateCoinNotNear,
	collectCoinsForPlayer,
	addSnakeSegments,
	updateSnakeSegments,
	checkSelfCollision,
} from '../utils/gameLogic'

const Game: React.FC = () => {
	const [playerPosition, setPlayerPosition] = useState<
		[number, number, number]
	>([0, 0.5, 0])
	const [playerRotation, setPlayerRotation] = useState<number>(0)
	const [snakeSegments, setSnakeSegments] = useState<SnakeSegmentType[]>([])
	const [score, setScore] = useState<number>(0)

	// Other players state
	const [otherPlayers, setOtherPlayers] = useState<PlayerType[]>([])
	const otherPlayersRef = useRef<PlayerType[]>([])

	// Coins state
	const [coins, setCoins] = useState<CoinType[]>([])
	const coinsRef = useRef<CoinType[]>([])

	// Game state
	const keysPressed = useRef<{ [key: string]: boolean }>({})
	const lastUpdateTime = useRef<number>(Date.now())

	// --- New: Refs for latest state ---
	const playerPositionRef = useRef<[number, number, number]>(playerPosition)
	const playerRotationRef = useRef<number>(playerRotation)

	useEffect(() => {
		playerPositionRef.current = playerPosition
	}, [playerPosition])

	useEffect(() => {
		playerRotationRef.current = playerRotation
	}, [playerRotation])

	useEffect(() => {
		otherPlayersRef.current = otherPlayers
	}, [otherPlayers])

	useEffect(() => {
		coinsRef.current = coins
	}, [coins])

	// --- Initialisation Functions ---
	const initialiseGame = useCallback(() => {
		console.log('Initializing game')
		generateCoins()
		fetchOtherPlayers()
	}, [])

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown)
		window.addEventListener('keyup', handleKeyUp)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
			window.removeEventListener('keyup', handleKeyUp)
		}
	}, [])

	// Fetch other players from the API
	const fetchOtherPlayers = async () => {
		try {
			console.log('Fetching users from API...')
			const users = await getAllUsersAsync()
			console.log('Users fetched successfully:', users)
			// Transform users into players with random positions
			const players: PlayerType[] = users.map((user) => ({
				...user,
				position: [
					Math.floor(Math.random() * GRID_SIZE) - GRID_SIZE / 2,
					0.5,
					Math.floor(Math.random() * GRID_SIZE) - GRID_SIZE / 2,
				],
				rotation: Math.floor(Math.random() * 4) + 1,
				snakeSegments: [{ position: [0, 0.5, 0], index: 0 }],
			}))
			setOtherPlayers(players)
		} catch (error) {
			console.error('Failed to fetch other players:', error)
			// Generate some mock players if API fails
			const mockPlayers: PlayerType[] = Array(5)
				.fill(0)
				.map((_, i) => ({
					userId: `mock-${i}`,
					username: `Player ${i + 1}`,
					name: `Player ${i + 1}`,
					level: 'Bronze',
					position: [
						Math.floor(Math.random() * GRID_SIZE) - GRID_SIZE / 2,
						0.5,
						Math.floor(Math.random() * GRID_SIZE) - GRID_SIZE / 2,
					],
					rotation: Math.floor(Math.random() * 4) + 1,
					snakeSegments: [{ position: [0, 0.5, 0], index: 0 }],
				}))
			setOtherPlayers(mockPlayers)
		}
	}

	// Generate coins at random positions
	const generateCoins = () => {
		const newCoins: CoinType[] = []
		for (let i = 0; i < COIN_COUNT; i++) {
			let x, z
			do {
				x = Math.floor(Math.random() * GRID_SIZE) - GRID_SIZE / 2
				z = Math.floor(Math.random() * GRID_SIZE) - GRID_SIZE / 2
			} while (
				Math.abs(x - playerPositionRef.current[0]) < 5 &&
				Math.abs(z - playerPositionRef.current[2]) < 5
			)

			newCoins.push({
				id: `coin-${i}`,
				position: [x, 0.5, z] as [number, number, number],
				collected: false,
			})
		}
		console.log('generateCoins called, newCoins:', newCoins)
		setCoins(newCoins)
	}

	const handleKeyDown = (event: KeyboardEvent) => {
		const key = event.key.toLowerCase()
		if (!keysPressed.current[key]) {
			if (key === 'arrowleft' || key === 'a') {
				setPlayerRotation((prev) => prev - Math.PI / 2)
			}
			if (key === 'arrowright' || key === 'd') {
				setPlayerRotation((prev) => prev + Math.PI / 2)
			}
		}
		keysPressed.current[key] = true
		if (
			[
				'arrowup',
				'arrowdown',
				'arrowleft',
				'arrowright',
				'w',
				'a',
				'd',
			].includes(key)
		) {
			event.preventDefault()
		}
	}

	const handleKeyUp = (event: KeyboardEvent) => {
		const key = event.key.toLowerCase()
		keysPressed.current[key] = false
	}

	// These functions have been moved to gameLogic.ts

	// Check for coin collisions
	const checkCoinCollisions = () => {
		let updatedCoins = [...coinsRef.current]
		let mainPlayerCollected = false
		;[updatedCoins, mainPlayerCollected] = collectCoinsForPlayer(
			playerPositionRef.current,
			updatedCoins
		)
		if (mainPlayerCollected) {
			setScore((prevScore) => prevScore + 1) // Keep score increment at 1 per coin
			addSnakeSegment() // This will add segments based on SEGMENTS_PER_COIN
		}

		// Other players collect coins - using a temporary array to track changes
		let otherPlayersCollected = false
		let updatedPlayers = [...otherPlayersRef.current] // Use ref for latest data

		// Check each player for coin collisions
		updatedPlayers = updatedPlayers.map((other) => {
			let collected = false
			;[updatedCoins, collected] = collectCoinsForPlayer(
				other.position,
				updatedCoins
			)
			if (collected) {
				console.log('Other player collected coin:', other.name)
				otherPlayersCollected = true
				// Add snake segments to other players when they collect coins
				const snakeSegments = other.snakeSegments || []
				const newSegments = addSnakeSegments(
					snakeSegments,
					SEGMENTS_PER_COIN
				)

				// Calculate new score based on snake length
				const newScore = Math.floor(
					newSegments.length / SEGMENTS_PER_COIN
				)

				return {
					...other,
					snakeSegments: newSegments,
					score: newScore,
				}
			}
			return other
		})

		// Update both state and ref with the new data
		if (otherPlayersCollected) {
			setOtherPlayers(updatedPlayers)
			otherPlayersRef.current = updatedPlayers
		}

		// Regenerate collected coins after a short delay
		if (mainPlayerCollected || otherPlayersCollected) {
			// First update the coins state with the current updatedCoins
			setCoins(updatedCoins)
			coinsRef.current = updatedCoins

			setTimeout(() => {
				// Get the latest coins from the ref
				const currentCoins = [...coinsRef.current]
				const collectedCount = currentCoins.filter(
					(c) => c.collected
				).length
				const remainingCoins = currentCoins.filter((c) => !c.collected)

				// Generate new coins to replace collected ones
				const newCoins = []
				for (let i = 0; i < collectedCount; i++) {
					// Generate coins away from both player and other players
					const newCoin = generateCoinNotNear(
						playerPositionRef.current
					)
					newCoins.push(newCoin)
				}

				// Combine remaining and new coins
				const updatedCoinArray = [...remainingCoins, ...newCoins]

				// Update both state and ref
				setCoins(updatedCoinArray)
				coinsRef.current = updatedCoinArray
				console.log(
					'Regenerated coins, total:',
					updatedCoinArray.length
				)
			}, 500) // Half-second delay before regenerating coins
		}
	}

	// Add a new segment to the snake
	const addSnakeSegment = (count = SEGMENTS_PER_COIN) => {
		setSnakeSegments((prevSegments) => {
			return addSnakeSegments(prevSegments, count)
		})
	}

	// Update snake segments to follow the head
	const updatePlayerSnakeSegments = () => {
		setSnakeSegments((prevSegments) => {
			return updateSnakeSegments(
				prevSegments,
				playerPositionRef.current,
				MOVEMENT_SPEED
			)
		})
	}

	// Main game loop
	useEffect(() => {
		let animationFrameId: number
		const gameLoop = () => {
			const now = Date.now()
			const deltaTime = (now - lastUpdateTime.current) / 1000 // in seconds

			if (deltaTime >= TICK_RATE / 1000) {
				let newX = playerPositionRef.current[0]
				let newZ = playerPositionRef.current[2]

				// Always move forward in the current direction
				newX +=
					Math.sin(playerRotationRef.current) *
					MOVEMENT_SPEED *
					deltaTime
				newZ -=
					Math.cos(playerRotationRef.current) *
					MOVEMENT_SPEED *
					deltaTime

				newX = Math.max(Math.min(newX, GRID_SIZE / 2), -GRID_SIZE / 2)
				newZ = Math.max(Math.min(newZ, GRID_SIZE / 2), -GRID_SIZE / 2)

				// Update both the state and the ref
				const newPosition: [number, number, number] = [newX, 0.5, newZ]
				setPlayerPosition(newPosition)
				playerPositionRef.current = newPosition

				// Check coin collisions for main player and other players
				checkCoinCollisions()
				updatePlayerSnakeSegments()

				// We'll skip updating other players' snake segments here
				// as we'll do it in the AI movement section below

				if (
					checkSelfCollision(playerPositionRef.current, snakeSegments)
				) {
					alert('Game Over! You ran into your tail.')
					setScore(0)
					// Reset player position to center
					const newPosition: [number, number, number] = [0, 0.5, 0]
					setPlayerPosition(newPosition)
					playerPositionRef.current = newPosition
					// Reset snake
					setSnakeSegments([{ position: newPosition, index: 0 }])
					// Reset other players' scores
					setOtherPlayers((prevPlayers) =>
						prevPlayers.map((player) => ({
							...player,
							snakeSegments: [],
						}))
					)
					// Generate new coins
					generateCoins()
				}
				lastUpdateTime.current = now
			}

			// Only move other players with AI behavior if enough time has passed
			// This prevents the snake from moving too fast and creating duplicate heads
			if (deltaTime > 0) {
				const updatedAIPlayers = otherPlayersRef.current.map(
					(player) => {
						// First update AI movement based on nearby coins
						const playerWithUpdatedPosition =
							updateAIPlayerMovement(
								player,
								coinsRef.current,
								deltaTime,
								MOVEMENT_SPEED
							)

						// Then update snake segments to follow the head
						const newSegments = updateSnakeSegments(
							playerWithUpdatedPosition.snakeSegments,
							playerWithUpdatedPosition.position,
							MOVEMENT_SPEED
						)

						// Return player with updated position and segments
						return {
							...playerWithUpdatedPosition,
							snakeSegments: newSegments,
							// Update the score based on snake length
							score: Math.floor(
								(newSegments?.length || 0) / SEGMENTS_PER_COIN
							),
						}
					}
				)
				// Update both state and ref
				setOtherPlayers(updatedAIPlayers)
				otherPlayersRef.current = updatedAIPlayers
			}

			animationFrameId = requestAnimationFrame(gameLoop)
		}
		console.log('Game loop started')
		gameLoop()
		return () => {
			console.log('Game loop stopped')
			cancelAnimationFrame(animationFrameId)
		}
	}, [])

	// --- Initialization ---
	useEffect(() => {
		console.log('Running initialization effect')
		initialiseGame()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div
			className='app-container'
			style={{ position: 'relative', width: '100%', height: '100%' }}>
			{/* Leaderboard in top right */}
			<Leaderboard
				users={[
					{
						userId: 'current-player',
						name: 'You',
						level:
							otherPlayers.length > 0
								? otherPlayers[0].level
								: 'Bronze',
						position: playerPosition,
						rotation: playerRotation,
						snakeSegments: snakeSegments,
					},
					...otherPlayers.map((player) => ({
						...player,
						snakeSegments: [], // Other players don't have snake segments yet
					})),
				]}
			/>

			<div className='game-ui'>
				<h2>Score: {score}</h2>
				<p>Snake Length: {snakeSegments.length}</p>
				<p>Use arrow keys or WASD to move</p>
				<p>
					Achievement Level:{' '}
					{otherPlayers.length > 0 ? otherPlayers[0].level : 'Bronze'}
				</p>
			</div>

			<Canvas shadows camera={{ position: [0, 10, 10], fov: 60 }}>
				{/* Lighting */}
				<ambientLight intensity={0.5} />
				<directionalLight
					position={[10, 10, 5]}
					intensity={1}
					castShadow
					shadow-mapSize-width={2048}
					shadow-mapSize-height={2048}
				/>

				{/* Game elements */}
				<Terrain />

				{/* Player and snake segments */}
				<Player position={playerPosition} rotation={playerRotation} />
				{snakeSegments.map((segment, index) => (
					<SnakeSegment
						key={`segment-${index}`}
						position={segment.position}
						index={segment.index}
					/>
				))}

				{/* Coins */}
				{coins
					.filter((coin) => !coin.collected)
					.map((coin) => (
						<Coin key={coin.id} position={coin.position} />
					))}

				{/* Other players */}
				{otherPlayers.map((player) => (
					<React.Fragment key={player.userId}>
						<OtherPlayer userData={player} />
						{/* Render snake segments for other players */}
						{player.snakeSegments?.map((segment, index) => (
							<SnakeSegment
								key={`${player.userId}-segment-${index}`}
								position={segment.position}
								index={segment.index}
							/>
						))}
					</React.Fragment>
				))}

				{/* Camera */}
				<FollowCamera
					target={playerPosition}
					rotation={-playerRotation}
					distance={15}
					height={8}
					lerp={0.05}
				/>

				{/* Debug */}
				<Stats />
				<OrbitControls enabled={false} />
			</Canvas>
		</div>
	)
}

export default Game
