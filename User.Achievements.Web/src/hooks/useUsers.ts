import { useState, useRef } from 'react'
import { userService } from '../services/api'
import { UserAchievementLevelDto } from '../types'

export function useUsers() {
    const [users, setUsers] = useState<UserAchievementLevelDto[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const fetchedRef = useRef(false)

    async function fetchUsers() {
        if (fetchedRef.current) return
        setLoading(true)
        try {
            const data = await userService.getAllUsersAsync()
            setUsers(data)
            setError('')
        } catch (err) {
            setError('Failed to load users.')
        } finally {
            setLoading(false)
            fetchedRef.current = true
        }
    }

    return { users, loading, error, fetchUsers }
}
