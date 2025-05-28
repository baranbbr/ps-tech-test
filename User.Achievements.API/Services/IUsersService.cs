using User.Achievements.API.Models;

namespace User.Achievements.API.Services;

public interface IUsersService
{
    /// <summary>
    /// Gets all users.
    /// </summary>
    /// <returns>A list of User objects representing all users.</returns>
    Task<List<Models.User>> GetAllUsers();

    /// <summary>
    /// Gets a user by their ID.
    /// </summary>
    /// <param name="id">The ID of the user to retrieve.</param>
    /// <returns>A User object representing the user with the specified ID.</returns>
    Task<Models.User> GetUserById(int id);

    /// <summary>
    /// Gets the user library containing user details and owned games.
    /// </summary>
    /// <returns>A UsersLibrary object containing user and game information.</returns>
    Task<UsersLibrary> GetUsersLibrary(int Id);
}
