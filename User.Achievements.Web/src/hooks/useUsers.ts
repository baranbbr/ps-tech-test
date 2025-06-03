import { useState, useRef, useCallback } from 'react'
import { userService } from '../services/api'
import { UserAchievementLevelDto } from '../types'

export function useUsers() {
    const [users, setUsers] = useState<UserAchievementLevelDto[]>([])
    const [filteredUsers, setFilteredUsers] = useState<UserAchievementLevelDto[]>([])
    const [loading, setLoading] = useState(true)
    const [searching, setSearching] = useState(false)
    const [error, setError] = useState('')
    const fetchedRef = useRef(false)
    const [searchTerm, setSearchTerm] = useState('')

    async function fetchUsers() {
        if (fetchedRef.current) return
        setLoading(true)
        try {
            const data = await userService.getAllUsersAsync()
            setUsers(data)
            setFilteredUsers(data)
            setError('')
        } catch (err) {
            setError('Failed to load users.')
        } finally {
            setLoading(false)
            fetchedRef.current = true
        }
    }

    const searchUsers = useCallback(async (username: string) => {
        setSearchTerm(username)
        if (!username.trim()) {
            setFilteredUsers(users)
            return
        }
        
        setSearching(true)
        try {
            const results = await userService.searchUsersByUsernameAsync(username)
            setFilteredUsers(results)
            setError('')
        } catch (err) {
            setError('Search failed. Please try again.')
        } finally {
            setSearching(false)
        }
    }, [users])

    return { 
        users, 
        filteredUsers, 
        loading, 
        searching, 
        error, 
        fetchUsers, 
        searchUsers, 
        searchTerm, 
        setSearchTerm 
    }
}
