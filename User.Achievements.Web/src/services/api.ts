import axios from 'axios'
import { UserAchievementLevelDto } from '../types'

// Use import.meta.env in development/production, fallback to process.env in tests
// jest tests do not recognise Vite specific "import.meta.env"
const API_URL = import.meta.env.VITE_API_URL || process.env.VITE_API_URL

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

export const userService = {
    getAllUsersAsync: async (): Promise<UserAchievementLevelDto[]> => {
        const response =
            await apiClient.get<UserAchievementLevelDto[]>('/users')
        return response.data
    },

    getUserByIdAsync: async (id: number): Promise<UserAchievementLevelDto> => {
        const response = await apiClient.get<UserAchievementLevelDto>(
            `/users/${id}`
        )
        return response.data
    },

    searchUsersByUsernameAsync: async (
        username: string
    ): Promise<UserAchievementLevelDto[]> => {
        // TODO: this is a client-side implementation until the API endpoint is available
        // const response = await apiClient.get<UserAchievementLevelDto[]>(`/users/search?username=${encodeURIComponent(username)}`)

        // For now, we'll fetch all users and filter client-side
        const response =
            await apiClient.get<UserAchievementLevelDto[]>('/users')
        if (!username.trim()) return response.data

        return response.data.filter((user) =>
            user.name.toLowerCase().includes(username.toLowerCase())
        )
    },
}
