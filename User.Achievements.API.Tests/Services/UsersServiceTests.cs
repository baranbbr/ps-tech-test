namespace User.Achievements.API.Tests.Services;

using Microsoft.Extensions.Logging;
using Moq;
using User.Achievements.API.Clients;
using User.Achievements.API.Services;
using User.Achievements.API.Models;
using User.Achievements.API.Models.DTOs;
using Microsoft.Extensions.Caching.Memory;

public class UsersServiceTests
{
    private readonly Mock<IUserApiClient> _userApiClientMock;
    private readonly Mock<ILogger<UsersService>> _loggerMock;
    private readonly UsersService _usersService;
    private readonly IMemoryCache _memoryCache = new MemoryCache(new MemoryCacheOptions());

    private readonly User _user;
    private readonly Game _game;
    private readonly UserAchievements _userAchievements;
    private readonly UsersLibrary _usersLibrary;
    private int TOTAL_COMPLETED_ACHIEVEMENTS = 25;
    private int TOTAL_AVAILABLE_ACHIEVEMENTS = 50;

    public UsersServiceTests()
    {
        // Initialise mocks and service
        _userApiClientMock = new Mock<IUserApiClient>();
        _loggerMock = new Mock<ILogger<UsersService>>();

        _usersService = new UsersService(_userApiClientMock.Object, _loggerMock.Object, _memoryCache);

        // Setup mock data for the tests
        _user = new User
        {
            Id = 23,
            Name = "John",
            Email = "john@test.com"
        };

        _game = new Game
        {
            Id = 5,
            Title = "Spiderman: Miles Morales",
            TotalAvailableAchievements = TOTAL_AVAILABLE_ACHIEVEMENTS
        };

        _userAchievements = new UserAchievements
        {
            TotalCompletedAchievements = TOTAL_COMPLETED_ACHIEVEMENTS,
            Game = _game
        };

        _usersLibrary = new UsersLibrary
        {
            User = _user,
            OwnedGames = new List<Game> { _game }
        };

        // Setup mock responses for the IUserApiClient methods
        _userApiClientMock.Setup(x => x.GetAllUsersAsync())
            .ReturnsAsync(() => new List<User>() { _user });

        _userApiClientMock.Setup(x => x.GetUserByIdAsync(It.IsAny<int>()))
            .ReturnsAsync(() => _user);

        _userApiClientMock.Setup(x => x.GetUsersLibraryAsync(It.IsAny<int>()))
            .ReturnsAsync(() => _usersLibrary);

        _userApiClientMock.Setup(x => x.GetUserGameAchievementsAsync(It.IsAny<int>(), It.IsAny<int>()))
            .ReturnsAsync(() => _userAchievements);
    }

    [Fact]
    public async Task GetAllUsers_Returns_EmptyList_When_ApiReturnsEmptyList()
    {
        // Arrange
        _userApiClientMock.Setup(x => x.GetAllUsersAsync()).ReturnsAsync(new List<User>());

        // Act
        var result = await _usersService.GetAllUsersAsync();

        // Assert
        Assert.Empty(result);
        _userApiClientMock.Verify(x => x.GetAllUsersAsync(), Times.Once);
    }

    [Fact]
    public async Task GetAllUsers_Returns_Users_WhenApiReturnsUsers()
    {
        // Arrange
        var expectedDtos = new List<UserAchievementLevelDto>
        {
            new UserAchievementLevelDto(_user.Id, _user.Name, "None")
        };

        // Act
        var result = await _usersService.GetAllUsersAsync();

        // Assert
        Assert.Single(result);
        Assert.Equal(expectedDtos.First(), result.First());
        _userApiClientMock.Verify(x => x.GetAllUsersAsync(), Times.Once);
    }

    [Fact]
    public async Task GetByUserId_Returns_Bronze_When_AverageMeetsSilverCriteriaButNotEachGame()
    {
        // Arrange
        string expectedLevel = "Bronze";
        // Setup user library with 11 games
        for (int i = 0; i < 11; i++)
        {
            _usersLibrary.OwnedGames.Add(new Game { Id = i + 1, Title = $"Game {i + 1}", TotalAvailableAchievements = 100 });
        }

        // Scenario for Silver: Owns >= 10 games and has 75%+ achievements in each
        // We want the average to be >= 75%, but not for each game.

        // 10 games at 100%
        _userApiClientMock.Setup(x => x.GetUserGameAchievementsAsync(_user.Id, It.IsInRange(1, 10, Range.Inclusive)))
            .ReturnsAsync((int uId, int gId) => new UserAchievements { User = _user, Game = new Game { Id = gId, TotalAvailableAchievements = 100 }, TotalCompletedAchievements = 100 });

        // 1 game at 0%
        _userApiClientMock.Setup(x => x.GetUserGameAchievementsAsync(_user.Id, 11))
            .ReturnsAsync(new UserAchievements { User = _user, Game = new Game { Id = 11, TotalAvailableAchievements = 100 }, TotalCompletedAchievements = 0 });


        // Act
        var result = await _usersService.GetByUserIdAsync(_user.Id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(_user.Id, result.UserId);
        Assert.Equal(expectedLevel, result.Level);
    }
}