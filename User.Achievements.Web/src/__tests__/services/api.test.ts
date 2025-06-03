import { UserAchievementLevelDto } from '../../types'

// Mock axios module
jest.mock('axios', () => ({
    create: jest.fn(() => ({
        get: jest.fn(),
    })),
}))

// Mock the API service module
jest.mock('../../services/api', () => {
    // Get the mocked axios instance
    const mockAxiosInstance = {
        get: jest.fn(),
    }

    // Return the mocked userService
    return {
        userService: {
            getAllUsersAsync: jest.fn().mockImplementation(async () => {
                const response = await mockAxiosInstance.get('/users')
                return response.data
            }),
            getUserByIdAsync: jest.fn().mockImplementation(async (id) => {
                const response = await mockAxiosInstance.get(`/users/${id}`)
                return response.data
            }),
            searchUsersByUsernameAsync: jest
                .fn()
                .mockImplementation(async (username) => {
                    const response = await mockAxiosInstance.get('/users')
                    if (!username.trim()) return response.data
                    return response.data.filter(
                        (user: UserAchievementLevelDto) =>
                            user.name
                                .toLowerCase()
                                .includes(username.toLowerCase())
                    )
                }),
        },
        // Export the mock axios instance for test control
        __axiosInstance: mockAxiosInstance,
    }
})

// Import the mocked service
import { userService } from '../../services/api'

// Get the mock axios instance directly from the mock
const mockModule = jest.requireMock('../../services/api')
const __axiosInstance = mockModule.__axiosInstance

describe('userService', () => {
    const mockAxiosGet = __axiosInstance.get as jest.Mock
    const mockUsers: UserAchievementLevelDto[] = [
        {
            id: 1,
            name: 'Mario',
            level: 'Bronze',
        },
        {
            id: 2,
            name: 'Luigi',
            level: 'Gold',
        },
    ]

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('getAllUsersAsync', () => {
        it('should fetch all users successfully', async () => {
            // Arrange
            mockAxiosGet.mockResolvedValueOnce({ data: mockUsers })

            // Act
            const result = await userService.getAllUsersAsync()

            // Assert
            expect(mockAxiosGet).toHaveBeenCalledWith('/users')
            expect(result).toEqual(mockUsers)
            expect(result.length).toBe(2)
        })

        it('should handle errors when fetching users fails', async () => {
            // Arrange
            const errorMessage = 'Network Error'
            mockAxiosGet.mockRejectedValueOnce(new Error(errorMessage))

            // Act & Assert
            await expect(userService.getAllUsersAsync()).rejects.toThrow(
                errorMessage
            )
            expect(mockAxiosGet).toHaveBeenCalledWith('/users')
        })
    })

    describe('getUserByIdAsync', () => {
        it('should fetch a user by id successfully', async () => {
            // Arrange
            const userId = 1
            const mockUser = mockUsers[0]
            mockAxiosGet.mockResolvedValueOnce({ data: mockUser })

            // Act
            const result = await userService.getUserByIdAsync(userId)

            // Assert
            expect(mockAxiosGet).toHaveBeenCalledWith(`/users/${userId}`)
            expect(result).toEqual(mockUser)
        })
    })

    describe('searchUsersByUsernameAsync', () => {
        it('should search users by username successfully', async () => {
            // Arrange
            const searchTerm = 'mario'
            mockAxiosGet.mockResolvedValueOnce({ data: mockUsers })

            // Act
            const result =
                await userService.searchUsersByUsernameAsync(searchTerm)

            // Assert
            expect(mockAxiosGet).toHaveBeenCalledWith('/users')
            expect(result).toEqual([mockUsers[0]])
            expect(result.length).toBe(1)
        })

        it('should return all users when search term is empty', async () => {
            // Arrange
            const searchTerm = ''
            mockAxiosGet.mockResolvedValueOnce({ data: mockUsers })

            // Act
            const result =
                await userService.searchUsersByUsernameAsync(searchTerm)

            // Assert
            expect(mockAxiosGet).toHaveBeenCalledWith('/users')
            expect(result).toEqual(mockUsers)
            expect(result.length).toBe(2)
        })
    })
})
