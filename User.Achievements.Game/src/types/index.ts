export interface UserAchievementLevelDto {
	userId: string
	name: string
	level: string
}

export interface Player extends UserAchievementLevelDto {
	position: [number, number, number]
	snakeSegments: SnakeSegmentType[]
	rotation: number
}

export interface SnakeSegmentType {
	position: [number, number, number]
	index: number
}

export interface CoinType {
	id: string
	position: [number, number, number]
	collected: boolean
}

export interface GameState {
	currentPlayer: {
		position: [number, number, number]
		rotation: number
	}
	snakeSegments: Array<{
		position: [number, number, number]
	}>
	coins: Array<{
		id: number
		position: [number, number, number]
		collected: boolean
	}>
	score: number
}
