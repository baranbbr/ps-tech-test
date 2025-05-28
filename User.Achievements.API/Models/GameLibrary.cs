namespace User.Achievements.API.Models.Responses;

public class GameLibrary
{
    public User User { get; set; } = new User();
    public List<Game> OwnedGames { get; set; } = new List<Game>();
}
