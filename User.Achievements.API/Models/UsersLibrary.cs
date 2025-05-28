namespace User.Achievements.API.Models;

public class UsersLibrary
{
    public User User { get; set; } = new User();
    public List<Game> OwnedGames { get; set; } = new List<Game>();
}
