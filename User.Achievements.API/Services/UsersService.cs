namespace User.Achievements.API.Services;

using System.Threading.Tasks;
using User.Achievements.API.Clients;
using User.Achievements.API.Models;

public class UsersService : IUsersService
{
    private readonly UserApiClient _apiClient;

    public UsersService(UserApiClient apiClient)
    {
        _apiClient = apiClient;
    }

    public async Task<List<User>> GetAllUsers()
    {
        return await _apiClient.GetAllUsers();
    }

    public async Task<User> GetUserById(int Id)
    {
        return await _apiClient.GetUserById(Id);
    }

    public async Task<UsersLibrary> GetUsersLibrary(int Id)
    {
        return await _apiClient.GetUsersLibrary(Id);
    }
}
