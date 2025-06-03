import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import UserList from '../../components/UserList';
import { userService } from '../../services/api';

// Mock the user service
jest.mock('../../services/api', () => ({
  userService: {
    getAllUsersAsync: jest.fn(),
    searchUsersByUsernameAsync: jest.fn(),
  },
}));

const mockUsers = [
  { id: 1, name: 'John Doe', points: 100, level: 'Beginner', nextLevelPoints: 200 },
  { id: 2, name: 'Jane Smith', points: 250, level: 'Intermediate', nextLevelPoints: 500 },
];

const renderUserList = () => {
  return render(
    <BrowserRouter>
      <UserList />
    </BrowserRouter>
  );
};

describe('UserList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (userService.getAllUsersAsync as jest.Mock).mockResolvedValue(mockUsers);
    (userService.searchUsersByUsernameAsync as jest.Mock).mockResolvedValue(mockUsers);
  });

  it('renders loading state initially', () => {
    renderUserList();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders user list after loading', async () => {
    renderUserList();
    
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('allows searching for users', async () => {
    renderUserList();
    
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'John' } });
    
    // Mock the search results
    (userService.searchUsersByUsernameAsync as jest.Mock).mockResolvedValue([mockUsers[0]]);
    
    // Trigger search (this might be a button or just the input change event)
    fireEvent.keyDown(searchInput, { key: 'Enter' });
    
    await waitFor(() => {
      expect(userService.searchUsersByUsernameAsync).toHaveBeenCalledWith('John');
    });
  });

  it('handles error state', async () => {
    (userService.getAllUsersAsync as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));
    
    renderUserList();
    
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
