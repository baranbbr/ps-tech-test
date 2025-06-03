import axios from 'axios'
import type { UserAchievementLevelDto } from '../types'

// Configure API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL

const apiClient = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
})

export const getAllUsersAsync = async (): Promise<
	UserAchievementLevelDto[]
> => {
	try {
		const response = await apiClient.get<UserAchievementLevelDto[]>(
			'/api/Users'
		)
		return response.data
	} catch (error) {
		console.error('Error fetching all users:', error)
		return []
	}
}

export const getUserByIdAsync = async (
	id: number
): Promise<UserAchievementLevelDto | null> => {
	try {
		const response = await apiClient.get<UserAchievementLevelDto>(
			`/api/Users/${id}`
		)
		return response.data
	} catch (error) {
		console.error(`Error fetching user ${id}:`, error)
		return null
	}
}
