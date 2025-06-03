import axios from 'axios';
import { userService } from '../../services/api';
import { UserAchievementLevelDto } from '../../types';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
  })),
}));

describe('userService', () => {
  const mockAxiosGet = axios.create().get as jest.Mock;
  const mockUsers: UserAchievementLevelDto[] = [
    { id: 1, name: 'John Doe', points: 100, level: 'Beginner', nextLevelPoints: 200 },
    { id: 2, name: 'Jane Smith', points: 250, level: 'Intermediate', nextLevelPoints: 500 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsersAsync', () => {
    it('should fetch all users successfully', async () => {
      // Arrange
      mockAxiosGet.mockResolvedValueOnce({ data: mockUsers });

      // Act
      const result = await userService.getAllUsersAsync();

      // Assert
      expect(mockAxiosGet).toHaveBeenCalledWith('/users');
      expect(result).toEqual(mockUsers);
      expect(result.length).toBe(2);
    });

    it('should handle errors when fetching users fails', async () => {
      // Arrange
      const errorMessage = 'Network Error';
      mockAxiosGet.mockRejectedValueOnce(new Error(errorMessage));

      // Act & Assert
      await expect(userService.getAllUsersAsync()).rejects.toThrow(errorMessage);
      expect(mockAxiosGet).toHaveBeenCalledWith('/users');
    });
  });

  describe('getUserByIdAsync', () => {
    it('should fetch a user by id successfully', async () => {
      // Arrange
      const userId = 1;
      const mockUser = mockUsers[0];
      mockAxiosGet.mockResolvedValueOnce({ data: mockUser });

      // Act
      const result = await userService.getUserByIdAsync(userId);

      // Assert
      expect(mockAxiosGet).toHaveBeenCalledWith(`/users/${userId}`);
      expect(result).toEqual(mockUser);
    });
  });

  describe('searchUsersByUsernameAsync', () => {
    it('should search users by username successfully', async () => {
      // Arrange
      const searchTerm = 'john';
      mockAxiosGet.mockResolvedValueOnce({ data: mockUsers });

      // Act
      const result = await userService.searchUsersByUsernameAsync(searchTerm);

      // Assert
      expect(mockAxiosGet).toHaveBeenCalledWith('/users');
      expect(result).toEqual([mockUsers[0]]);
      expect(result.length).toBe(1);
    });

    it('should return all users when search term is empty', async () => {
      // Arrange
      const searchTerm = '';
      mockAxiosGet.mockResolvedValueOnce({ data: mockUsers });

      // Act
      const result = await userService.searchUsersByUsernameAsync(searchTerm);

      // Assert
      expect(mockAxiosGet).toHaveBeenCalledWith('/users');
      expect(result).toEqual(mockUsers);
      expect(result.length).toBe(2);
    });
  });
});
