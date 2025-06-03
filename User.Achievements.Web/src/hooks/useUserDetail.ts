import { useState, useCallback, useEffect } from 'react'
import { userService } from '../services/api'
import { UserAchievementLevelDto } from '../types'

export function useUserDetail() {
    const [userId, setUserId] = useState<string | undefined>(undefined)
    const [user, setUser] = useState<UserAchievementLevelDto | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const fetchUser = useCallback((id?: string) => {
        if (id) {
            setUserId(id)
        }
    }, [])

    useEffect(() => {
        const loadUser = async () => {
            if (!userId) return
            
            setLoading(true)
            setError('')
            
            try {
                const data = await userService.getUserByIdAsync(parseInt(userId))
                setUser(data)
            } catch (err) {
                setError('Failed to load user details. Please try again later.')
            } finally {
                setLoading(false)
            }
        }
        
        loadUser()
    }, [userId])

    return { user, loading, error, fetchUser }
}
