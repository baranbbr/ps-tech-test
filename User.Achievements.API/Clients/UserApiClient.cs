namespace User.Achievements.API.Clients;

using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using User.Achievements.API.Models;

public class UserApiClient
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<UserApiClient> _logger;

    private readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
    };

    public UserApiClient(HttpClient httpClient, ILogger<UserApiClient> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<List<User>> GetAllUsers()
    {
        try
        {
            string requestUri = "/users";
            var response = await _httpClient.GetAsync(requestUri);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            if (!string.IsNullOrEmpty(content))
            {
                return JsonSerializer.Deserialize<List<User>>(content, _jsonOptions)
                    ?? new List<User>();
            }

            return new List<User>();
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Error fetching users from API.");
            return new List<User>();
        }
    }

    public async Task<User> GetUserById(int Id)
    {
        User user = new();
        try
        {
            string requestUri = $"/users/{Id}";
            var response = await _httpClient.GetAsync(requestUri);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            if (!string.IsNullOrEmpty(content))
            {
                return JsonSerializer.Deserialize<User>(content, _jsonOptions) ?? new User();
            }

            return user;
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Error fetching user by ID: {UserId} from API.", Id);
            return user;
        }
    }

    public async Task<UsersLibrary> GetUsersLibrary(int userId)
    {
        try
        {
            string requestUri = $"/users/{userId}/library";
            var response = await _httpClient.GetAsync(requestUri);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            if (!string.IsNullOrEmpty(content))
            {
                return JsonSerializer.Deserialize<UsersLibrary>(content, _jsonOptions)
                    ?? new UsersLibrary();
            }

            return new UsersLibrary();
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(
                ex,
                "Error fetching user library from API for user ID: {UserId}",
                userId
            );
            return new UsersLibrary();
        }
    }

    public async Task<UserAchievements> GetUserGameAchievements(int userId, int gameId)
    {
        try
        {
            string requestUri = $"/users/{userId}/achievements/{gameId}";
            var response = await _httpClient.GetAsync(requestUri);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            if (!string.IsNullOrEmpty(content))
            {
                return JsonSerializer.Deserialize<UserAchievements>(content, _jsonOptions)
                    ?? new UserAchievements();
            }

            return new UserAchievements();
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(
                ex,
                "Error fetching user game achievements from API for user ID: {UserId}, game ID: {GameId}",
                userId,
                gameId
            );
            return new UserAchievements();
        }
    }
}
