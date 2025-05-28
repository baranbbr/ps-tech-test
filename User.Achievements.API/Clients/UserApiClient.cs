namespace User.Achievements.API.Clients;

using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using User.Achievements.API.Models;

public class UserApiClient
{
    private readonly HttpClient _httpClient;
    private readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
    };

    public UserApiClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
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
            // TODO: log the exception or handle it as needed
            throw new Exception("Error fetching users from API", ex);
        }
    }

    public async Task<User> GetUserById(int Id)
    {
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

            return new User();
        }
        catch (HttpRequestException ex)
        {
            // TODO: log the exception or handle it as needed
            throw new Exception("Error fetching user from API", ex);
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
            // TODO: log the exception or handle it as needed
            throw new Exception("Error fetching user library from API", ex);
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
            // TODO: log the exception or handle it as needed
            throw new Exception("Error fetching user game achievements from API", ex);
        }
    }
}
