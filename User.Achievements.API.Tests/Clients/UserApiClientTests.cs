namespace User.Achievements.API.Tests.Clients;

using System.Net;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Moq;
using Moq.Protected;
using User.Achievements.API.Clients;
using User.Achievements.API.Models;

public class UserApiClientTests
{
    private readonly Mock<ILogger<UserApiClient>> _loggerMock;
    private readonly IUserApiClient _userApiClient;
    private readonly HttpClient _httpClient;
    private HttpStatusCode _httpStatusCodeResponse;
    private string _stringJsonResponse;


    public UserApiClientTests()
    {
        _loggerMock = new Mock<ILogger<UserApiClient>>();

        _httpStatusCodeResponse = HttpStatusCode.OK;
        _stringJsonResponse = string.Empty;

        var handlerMock = new Mock<HttpMessageHandler>();
        handlerMock.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>()
            )
            .ReturnsAsync(() => new HttpResponseMessage
            {
                StatusCode = _httpStatusCodeResponse,
                Content = new StringContent(_stringJsonResponse)
            });

        _httpClient = new HttpClient(handlerMock.Object)
        {
            BaseAddress = new Uri("http://test")
        };

        _userApiClient = new UserApiClient(
            _httpClient,
            _loggerMock.Object
        );
    }

    [Fact]
    public async Task GetAllUsers_Returns_ListOfUsers_When_ResponseIsSuccessful()
    {
        // Arrange
        var expectedListOfUsers = new List<User>
        {
            new User { Id = 1, Name = "Test User", Email = "testuser@example.com" },
            new User { Id = 2, Name = "Another User", Email = "beepboop@example.com" }
        };

        _stringJsonResponse = JsonSerializer.Serialize(expectedListOfUsers);
        _httpStatusCodeResponse = HttpStatusCode.OK;

        // Act
        var result = await _userApiClient.GetAllUsersAsync();

        // Assert
        Assert.Equal(expectedListOfUsers.Count, result.Count);
        Assert.Equal(expectedListOfUsers.First(), result.First());
        Assert.Equal(expectedListOfUsers.Last(), result.Last());
    }

    [Fact]
    public async Task GetUserById_Returns_User_When_ResponseIsSuccessful()
    {
        // Arrange
        var expectedUser = new User { Id = 1, Name = "Bob ", Email = "testuser@example.com" };
        _stringJsonResponse = JsonSerializer.Serialize(expectedUser);
        _httpStatusCodeResponse = HttpStatusCode.OK;

        // Act
        var result = await _userApiClient.GetUserByIdAsync(1);

        // Assert
        Assert.Equal(expectedUser, result);
    }
}