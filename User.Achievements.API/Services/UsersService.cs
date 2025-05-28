namespace User.Achievements.API.Services;

using System.Threading.Tasks;
using User.Achievements.API.Clients;
using User.Achievements.API.Models;
using User.Achievements.API.Models.DTOs;

public class UsersService : IUsersService
{
    private readonly UserApiClient _apiClient;

    public UsersService(UserApiClient apiClient)
    {
        _apiClient = apiClient;
    }

    /// <summary>
    /// Gets all users and calculates their average achievement level.
    /// </summary>
    /// <returns>A list of UserAchievementLevelDto containing user IDs and their achievement levels.</returns>
    public async Task<List<UserAchievementLevelDto>> GetAllUsers()
    {
        // get all users
        // for each user, get library
        // for each user library, calculate achievement percentage
        var users = await _apiClient.GetAllUsers();
        var userGameAchievements = new List<CalculatedUserAchievementForGame>();
        var userAverageAchievements = new List<UserAverageAchievement>();
        foreach (var user in users)
        {
            var userAchievements = await GetAchievementsForUser(user.Id);
            userGameAchievements.AddRange(userAchievements);

            if (userAchievements.Count > 0)
            {
                userAverageAchievements.Add(CalculateUserAverageAchievement(userAchievements));
            }
        }

        return userAverageAchievements
            .Select(x => new UserAchievementLevelDto(x.UserId, x.Level.ToString()))
            .ToList();
    }

    public async Task<UserAverageAchievement> GetByUserId(int Id)
    {
        throw new NotImplementedException("This method is not implemented yet.");
    }

    private async Task<List<CalculatedUserAchievementForGame>> GetAchievementsForUser(int userId)
    {
        var userLibrary = await _apiClient.GetUsersLibrary(userId);
        var achievements = new List<CalculatedUserAchievementForGame>();

        foreach (var game in userLibrary.OwnedGames)
        {
            var userGameAchivs = await _apiClient.GetUserGameAchievements(userId, game.Id);
            int achievementPercentage = CalculateAchievementPercentage(
                userGameAchivs.TotalCompletedAchievements,
                userGameAchivs.Game.TotalAvailableAchievements
            );
            achievements.Add(
                new CalculatedUserAchievementForGame
                {
                    UserId = userId,
                    GameId = game.Id,
                    AchievementPercentage = achievementPercentage,
                }
            );
        }

        return achievements;
    }

    private static int CalculateAchievementPercentage(int completed, int total)
    {
        if (total == 0)
            return 0;
        return (int)((float)completed / total * 100);
    }

    private static UserAverageAchievement CalculateUserAverageAchievement(
        List<CalculatedUserAchievementForGame> userGameAchievements
    )
    {
        var averageAchievementPercentage = (int)
            userGameAchievements.Average(x => x.AchievementPercentage);

        return new UserAverageAchievement
        {
            UserId = userGameAchievements.First().UserId,
            AverageAchievementPercentage = averageAchievementPercentage,
            UserGameAchievements = userGameAchievements,
        };
    }
}
