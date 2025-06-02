import axios from 'axios'
import { UserAchievementLevelDto } from '../types'

// TODO: move to config
const API_URL = 'http://localhost:5041/api'

const apiClient = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
})

export const userService = {
	getAllUsersAsync: async (): Promise<UserAchievementLevelDto[]> => {
		const response = await apiClient.get<UserAchievementLevelDto[]>(
			'/users'
		)
		return response.data
	},

	getUserByIdAsync: async (id: number): Promise<UserAchievementLevelDto> => {
		const response = await apiClient.get<UserAchievementLevelDto>(
			`/users/${id}`
		)
		return response.data
	},
}
