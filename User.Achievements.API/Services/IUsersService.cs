using User.Achievements.API.Models;
using User.Achievements.API.Models.DTOs;

namespace User.Achievements.API.Services;

public interface IUsersService
{
    /// <summary>
    /// Gets all users.
    /// </summary>
    /// <returns>A list of User objects representing all users.</returns>
    Task<List<UserAchievementLevelDto>> GetAllUsers();

    /// <summary>
    /// Gets a user by their ID.
    /// </summary>
    /// <param name="id">The ID of the user to retrieve.</param>
    /// <returns>A User object representing the user with the specified ID.</returns>
    Task<UserAverageAchievement> GetByUserId(int id);
}
