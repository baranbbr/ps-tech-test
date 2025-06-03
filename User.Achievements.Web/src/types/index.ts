export interface UserAchievementLevelDto {
    id: number
    userId?: number
    name: string
    level: string
    points: number
    nextLevelPoints: number
}
