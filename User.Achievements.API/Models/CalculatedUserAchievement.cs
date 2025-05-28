using User.Achievements.API.Models.Enums;

namespace User.Achievements.API.Models;

public class CalculatedUserAchievementForGame
{
    public int UserId { get; set; }
    public int GameId { get; set; }
    public int AchievementPercentage { get; set; }
}
