import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom'
import UserList from '../../components/UserList'
import { userService } from '../../services/api'

// Mock the user service
jest.mock('../../services/api', () => ({
    userService: {
        getAllUsersAsync: jest.fn(),
        searchUsersByUsernameAsync: jest.fn(),
    },
}))

const mockUsers = [
    {
        id: 7,
        name: 'James Bond',
        level: 'Silver',
    },
    {
        id: 5,
        name: 'Jane Smith',
        level: 'Platinum',
    },
]

const renderUserList = async () => {
    let result
    await act(async () => {
        result = render(
            <BrowserRouter>
                <UserList />
            </BrowserRouter>
        )
    })
    return result!
}

describe('UserList Component', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        ;(userService.getAllUsersAsync as jest.Mock).mockResolvedValue(
            mockUsers
        )
        ;(
            userService.searchUsersByUsernameAsync as jest.Mock
        ).mockResolvedValue(mockUsers)
    })

    it('renders user list with data', async () => {
        await renderUserList()

        // Wait for the user data to be displayed
        await waitFor(() => {
            expect(screen.getByText('James Bond')).toBeInTheDocument()
            expect(screen.getByText('Jane Smith')).toBeInTheDocument()
        })
    })

    it('allows searching for users', async () => {
        await renderUserList()

        // Wait for initial data load
        await waitFor(() => {
            expect(screen.getByText('James Bond')).toBeInTheDocument()
        })

        // Find and use the search input
        const searchInput = screen.getByPlaceholderText(/enter username/i)
        await act(async () => {
            fireEvent.change(searchInput, { target: { value: 'Bond' } })
        })

        // Mock the search results
        ;(
            userService.searchUsersByUsernameAsync as jest.Mock
        ).mockResolvedValue([mockUsers[0]])

        // Wait for debounce and verify search was called
        await waitFor(() => {
            expect(userService.searchUsersByUsernameAsync).toHaveBeenCalledWith(
                'Bond'
            )
        })
    })

    it('handles error state', async () => {
        ;(userService.getAllUsersAsync as jest.Mock).mockRejectedValue(
            new Error('Failed to fetch')
        )

        await renderUserList()

        await waitFor(() => {
            expect(
                screen.getByText('Failed to load users.')
            ).toBeInTheDocument()
        })
    })
})
