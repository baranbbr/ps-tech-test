namespace User.Achievements.API.Models;

public class UserAchievements
{
    public User User { get; set; } = new User();
    public Game Game { get; set; } = new Game();
    public int TotalCompletedAchievements { get; set; }
}
