using User.Achievements.API.Enums;

namespace User.Achievements.API.Models;

public class CalculatedUserAchievement
{
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public AchievementLevel Level { get; set; }
}
