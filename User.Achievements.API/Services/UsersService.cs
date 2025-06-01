namespace User.Achievements.API.Services;

using System.Threading.Tasks;
using User.Achievements.API.Clients;
using User.Achievements.API.Models;
using User.Achievements.API.Models.DTOs;

public class UsersService : IUsersService
{
    private readonly IUserApiClient _apiClient;
    private readonly ILogger<UsersService> _logger;

    public UsersService(IUserApiClient apiClient, ILogger<UsersService> logger)
    {
        _apiClient = apiClient;
        _logger = logger;
    }

    public async Task<List<UserAchievementLevelDto>> GetAllUsers()
    {
        var users = await _apiClient.GetAllUsers();
        var result = new List<UserAchievementLevelDto>();

        foreach (var user in users)
        {
            var dto = await GetUserAchievementLevelDto(user.Id);
            if (dto.UserId > 0)
            {
                result.Add(dto);
            }
        }

        return result;
    }

    public async Task<UserAchievementLevelDto> GetByUserId(int Id)
    {
        return await GetUserAchievementLevelDto(Id);
    }

    private async Task<List<CalculatedUserAchievementForGame>> GetAchievementsForUser(int userId)
    {
        var userLibrary = await _apiClient.GetUsersLibrary(userId);
        var achievements = new List<CalculatedUserAchievementForGame>();

        foreach (var game in userLibrary.OwnedGames)
        {
            // get user achievements for each game
            var userGameAchivs = await _apiClient.GetUserGameAchievements(userId, game.Id);
            // calculate compelted achievements percentage for game
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

    private async Task<UserAchievementLevelDto> GetUserAchievementLevelDto(int userId)
    {
        var user = await _apiClient.GetUserById(userId);
        if (user.Id <= 0)
        {
            return new UserAchievementLevelDto(0, "0");
        }

        var userAchievements = await GetAchievementsForUser(user.Id);
        if (userAchievements.Count == 0)
        {
            return new UserAchievementLevelDto(user.Id, "0");
        }

        return new UserAchievementLevelDto(
            user.Id,
            CalculateUserAverageAchievement(userAchievements).Level.ToString()
        );
    }
}
