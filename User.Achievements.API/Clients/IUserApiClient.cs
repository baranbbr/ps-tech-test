namespace User.Achievements.API.Clients;

using User.Achievements.API.Models;

public interface IUserApiClient
{
    Task<List<User>> GetAllUsersAsync();
    Task<User> GetUserByIdAsync(int Id);
    Task<UsersLibrary> GetUsersLibraryAsync(int userId);
    Task<UserAchievements> GetUserGameAchievementsAsync(int userId, int gameId);
}
