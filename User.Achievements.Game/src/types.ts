// Game types

export interface SnakeSegmentType {
	position: [number, number, number]
	index: number
}

export interface Player {
	id: string
	name: string
	position: [number, number, number]
	rotation?: number
	level?: string
	snakeSegments?: SnakeSegmentType[]
	color?: string
}

export interface CoinType {
	id: string
	position: [number, number, number]
	collected: boolean
}

export interface UserAchievementLevelDto {
	id: string
	name: string
	level: number
}
