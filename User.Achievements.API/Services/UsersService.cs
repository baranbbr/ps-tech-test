namespace User.Achievements.API.Services;

using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using User.Achievements.API.Clients;
using User.Achievements.API.Models;
using User.Achievements.API.Models.DTOs;

public class UsersService : IUsersService
{
    private readonly IUserApiClient _apiClient;
    private readonly ILogger<UsersService> _logger;
    private readonly IMemoryCache _cache;

    // Cache keys
    private const string ALL_USERS_CACHE_KEY = "AllUsers";
    private const string USER_BY_ID_CACHE_KEY = "User_{0}"; // Will be formatted with user ID
    private const string USER_ACHIEVEMENTS_CACHE_KEY = "UserAchievements_{0}"; // Will be formatted with user ID

    // Cache durations
    private static readonly TimeSpan ALL_USERS_CACHE_DURATION = TimeSpan.FromMinutes(5);
    private static readonly TimeSpan USER_CACHE_DURATION = TimeSpan.FromMinutes(2);
    private static readonly TimeSpan ACHIEVEMENTS_CACHE_DURATION = TimeSpan.FromMinutes(3);

    public UsersService(IUserApiClient apiClient, ILogger<UsersService> logger, IMemoryCache cache)
    {
        _apiClient = apiClient;
        _logger = logger;
        _cache = cache;
    }

    public async Task<List<UserAchievementLevelDto>> GetAllUsersAsync()
    {
        if (
            _cache.TryGetValue(ALL_USERS_CACHE_KEY, out List<UserAchievementLevelDto>? cachedResult)
            && cachedResult != null
        )
        {
            _logger.LogInformation("Retrieved all users from cache.");
            return cachedResult;
        }

        _logger.LogInformation("Cache miss for all users, fetching from API.");
        var users = await _apiClient.GetAllUsersAsync();
        var result = new List<UserAchievementLevelDto>();

        foreach (var user in users)
        {
            var dto = await GetUserAchievementLevelDto(user.Id);
            if (dto.UserId > 0)
            {
                result.Add(dto);
            }
        }

        var cacheOptions = new MemoryCacheEntryOptions()
            .SetAbsoluteExpiration(ALL_USERS_CACHE_DURATION)
            .SetPriority(CacheItemPriority.High);

        _cache.Set(ALL_USERS_CACHE_KEY, result, cacheOptions);
        _logger.LogInformation(
            "Cached all users data for {duration} minutes.",
            ALL_USERS_CACHE_DURATION.TotalMinutes
        );

        return result;
    }

    public async Task<UserAchievementLevelDto> GetByUserIdAsync(int Id)
    {
        // Generate cache key for this specific user
        string cacheKey = string.Format(USER_BY_ID_CACHE_KEY, Id);

        if (
            _cache.TryGetValue(cacheKey, out UserAchievementLevelDto? cachedResult)
            && cachedResult != null
        )
        {
            _logger.LogInformation("Retrieved user {userId} from cache.", Id);
            return cachedResult;
        }

        _logger.LogInformation("Cache miss for user {userId}, fetching from API.", Id);
        var result = await GetUserAchievementLevelDto(Id);

        var cacheOptions = new MemoryCacheEntryOptions()
            .SetAbsoluteExpiration(USER_CACHE_DURATION)
            .SetPriority(CacheItemPriority.Normal);

        _cache.Set(cacheKey, result, cacheOptions);

        return result;
    }

    private async Task<List<CalculatedUserAchievementForGame>> GetAchievementsForUser(int userId)
    {
        string cacheKey = string.Format(USER_ACHIEVEMENTS_CACHE_KEY, userId);

        if (
            _cache.TryGetValue(
                cacheKey,
                out List<CalculatedUserAchievementForGame>? cachedAchievements
            )
            && cachedAchievements != null
        )
        {
            _logger.LogInformation("Retrieved achievements for user {userId} from cache.", userId);
            return cachedAchievements;
        }

        _logger.LogInformation(
            "Cache miss for user {userId} achievements, fetching from API.",
            userId
        );
        var userLibrary = await _apiClient.GetUsersLibraryAsync(userId);
        var achievements = new List<CalculatedUserAchievementForGame>();

        foreach (var game in userLibrary.OwnedGames)
        {
            // get user achievements for each game
            var userGameAchivs = await _apiClient.GetUserGameAchievementsAsync(userId, game.Id);
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

        var cacheOptions = new MemoryCacheEntryOptions()
            .SetAbsoluteExpiration(ACHIEVEMENTS_CACHE_DURATION)
            .SetPriority(CacheItemPriority.Normal);

        _cache.Set(cacheKey, achievements, cacheOptions);

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
        var user = await _apiClient.GetUserByIdAsync(userId);
        if (user.Id <= 0)
        {
            return new UserAchievementLevelDto(0, string.Empty, "0");
        }

        var userAchievements = await GetAchievementsForUser(user.Id);
        if (userAchievements.Count == 0)
        {
            return new UserAchievementLevelDto(user.Id, user.Name, "0");
        }

        return new UserAchievementLevelDto(
            user.Id,
            user.Name,
            CalculateUserAverageAchievement(userAchievements).Level.ToString()
        );
    }
}
