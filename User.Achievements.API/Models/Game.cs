namespace User.Achievements.API.Models;

public class Game
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public int TotalAvailableAchievements { get; set; }
}
