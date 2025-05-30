using User.Achievements.API.Models;
using User.Achievements.API.Models.DTOs;

namespace User.Achievements.API.Services;

public interface IUsersService
{
    /// <summary>
    /// Gets all users and calculates their account achievement level.
    /// </summary>
    /// <returns>A list of UserAchievementLevelDto containing user IDs and their account achievement level.</returns>
    Task<List<UserAchievementLevelDto>> GetAllUsers();

    /// <summary>
    /// Gets a user by their ID and calculates their account achievement level.
    /// </summary>
    /// <param name="id">The ID of the user to retrieve.</param>
    /// <returns>A UserAchievementLevelDto containing a user ID and their account achievement level.</returns>
    Task<UserAchievementLevelDto> GetByUserId(int id);
}
