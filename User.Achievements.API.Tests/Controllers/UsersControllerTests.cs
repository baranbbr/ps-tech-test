namespace User.Achievements.API.Tests.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using User.Achievements.API.Controllers;
using User.Achievements.API.Models.DTOs;
using User.Achievements.API.Services;

public class ControllerTests
{
    private readonly Mock<ILogger<UsersController>> _loggerMock;
    private readonly Mock<IUsersService> _usersServiceMock;
    private readonly UsersController _controller;

    public ControllerTests()
    {
        _loggerMock = new Mock<ILogger<UsersController>>();
        _usersServiceMock = new Mock<IUsersService>();

        _usersServiceMock.Setup(x => x.GetAllUsers())
            .ReturnsAsync(new List<UserAchievementLevelDto>() {
                new(1, "John", "Bronze"),
                new(2, "Sarah", "Gold")
            });

        _controller = new UsersController(_loggerMock.Object, _usersServiceMock.Object);
    }

    [Fact]
    public async Task GetAllUsers_Returns_NoContent_When_No_Users_Exist()
    {
        // Arrange
        _usersServiceMock.Setup(x => x.GetAllUsers()).ReturnsAsync(new List<UserAchievementLevelDto>());

        // Act
        var result = await _controller.GetAllUsers();

        // Assert
        Assert.NotNull(result);
        Assert.IsType<NoContentResult>(result);
        _loggerMock.Verify(
            x => x.Log(
                LogLevel.Information,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Request received to get all users.")),
                null,
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()
            ),
            Times.Once
        );
    }

    [Fact]
    public async Task GetAllUsers_Returns_OkResult_When_Users_Exist()
    {
        // Arrange
        var expectedUsers = new List<UserAchievementLevelDto>
        {
            new UserAchievementLevelDto(1, "Luca", "Bronze"),
            new UserAchievementLevelDto(2, "Tom", "Gold")
        };
        _usersServiceMock.Setup(x => x.GetAllUsers()).ReturnsAsync(expectedUsers);

        // Act
        var result = await _controller.GetAllUsers();

        // Assert
        Assert.NotNull(result);
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(expectedUsers, okResult.Value);
    }

    [Fact]
    public async Task GetByUserId_Returns_User_When_Exists()
    {
        // Arrange
        var userId = 1;
        var expectedUser = new UserAchievementLevelDto(userId, "Tom", "Bronze");
        _usersServiceMock.Setup(x => x.GetByUserId(userId)).ReturnsAsync(expectedUser);

        // Act
        var result = await _controller.GetByUserId(userId);

        // Assert
        Assert.NotNull(result);
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(expectedUser, okResult.Value);
        _loggerMock.Verify(
            x => x.Log(
                LogLevel.Information,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains($"Request received to get user by ID: {userId}")),
                null,
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()
            ),
            Times.Once
        );
    }

    [Fact]
    public async Task GetByUserId_Returns_NotFound_When_User_Does_Not_Exist()
    {
        // Arrange
        var userId = 999; // Assuming this user does not exist
        _usersServiceMock.Setup(x => x.GetByUserId(userId)).ReturnsAsync(new UserAchievementLevelDto(0, string.Empty, string.Empty));

        // Act
        var result = await _controller.GetByUserId(userId);

        // Assert
        Assert.NotNull(result);
        Assert.IsType<NotFoundResult>(result);
        _loggerMock.Verify(
            x => x.Log(
                LogLevel.Information,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains($"Request received to get user by ID: {userId}")),
                null,
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()
            ),
            Times.Once
        );
    }
}