namespace User.Achievements.API.Tests.Services;

using Microsoft.Extensions.Logging;
using Moq;
using User.Achievements.API.Clients;
using User.Achievements.API.Services;
using User.Achievements.API.Models;
using User.Achievements.API.Models.DTOs;

public class UsersServiceTests
{
    private readonly Mock<IUserApiClient> _userApiClientMock;
    private readonly Mock<ILogger<UsersService>> _loggerMock;
    private readonly UsersService _usersService;

    private readonly User _user;
    private readonly Game _game;
    private readonly UserAchievements _userAchievements;
    private readonly UsersLibrary _usersLibrary;
    private int TOTAL_COMPLETED_ACHIEVEMENTS = 25;
    private int TOTAL_AVAILABLE_ACHIEVEMENTS = 50;

    public UsersServiceTests()
    {
        // Initialize mocks and service
        _userApiClientMock = new Mock<IUserApiClient>();
        _loggerMock = new Mock<ILogger<UsersService>>();
        _usersService = new UsersService(_userApiClientMock.Object, _loggerMock.Object);

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

    [Theory]
    [InlineData(11, 1, 10, "Bronze")]
    [InlineData(11, 75, 100, "Silver")]
    [InlineData(26, 8, 10, "Gold")]
    [InlineData(50, 10, 10, "Platinum")]
    public async Task GetByUserId_Returns_Correct_Level_When_OwnsGames_And_Has_Achievements(int numOwnedGames, int completedAchievements, int availableAchievements, string expectedLevel)
    {
        // Arrange
        TOTAL_COMPLETED_ACHIEVEMENTS = completedAchievements;
        TOTAL_AVAILABLE_ACHIEVEMENTS = availableAchievements;

        for (int i = 0; i < numOwnedGames; i++)
        {
            _usersLibrary.OwnedGames.Add(new Game
            {
                Id = i + 1,
                Title = $"Game {i + 1}",
                TotalAvailableAchievements = TOTAL_AVAILABLE_ACHIEVEMENTS
            });
            _userAchievements.Game = _usersLibrary.OwnedGames[i];
            _userAchievements.TotalCompletedAchievements = TOTAL_COMPLETED_ACHIEVEMENTS;
        }


        // Act
        var result = await _usersService.GetByUserIdAsync(_user.Id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(_user.Id, result.UserId);
        Assert.Equal(expectedLevel, result.Level);
    }
}