import { useState } from 'react'
import { userService } from '../services/api'
import { UserAchievementLevelDto } from '../types'

export function useUserDetail() {
	const [user, setUser] = useState<UserAchievementLevelDto | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	async function fetchUser(id?: string) {
		if (!id) return
		setLoading(true)
		setError('')
		try {
			const data = await userService.getUserByIdAsync(parseInt(id))
			setUser(data)
		} catch (err) {
			setError('Failed to load user details. Please try again later.')
		} finally {
			setLoading(false)
		}
	}

	return { user, loading, error, fetchUser }
}
