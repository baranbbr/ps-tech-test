namespace User.Achievements.API.Clients;

using User.Achievements.API.Models;

public interface IUserApiClient
{
    Task<List<User>> GetAllUsers();
    Task<User> GetUserById(int Id);
    Task<UsersLibrary> GetUsersLibrary(int userId);
    Task<UserAchievements> GetUserGameAchievements(int userId, int gameId);
}
