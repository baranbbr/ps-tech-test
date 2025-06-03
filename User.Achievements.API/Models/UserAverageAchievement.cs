using User.Achievements.API.Models.Enums;

namespace User.Achievements.API.Models;

public class UserAverageAchievement
{
    public int UserId { get; set; }
    public List<CalculatedUserAchievementForGame> UserGameAchievements { get; set; } = new();

    public AchievementLevel Level
    {
        get
        {
            if (
                UserGameAchievements.Count >= 50
                && UserGameAchievements.All(x => x.AchievementPercentage == 100)
            )
            {
                return AchievementLevel.Platinum;
            }
            else if (
                UserGameAchievements.Count >= 25
                && UserGameAchievements.All(x => x.AchievementPercentage >= 80)
            )
            {
                return AchievementLevel.Gold;
            }
            else if (
                UserGameAchievements.Count >= 10
                && UserGameAchievements.All(x => x.AchievementPercentage >= 75)
            )
            {
                return AchievementLevel.Silver;
            }
            else if (UserGameAchievements.Count > 10)
            {
                return AchievementLevel.Bronze;
            }
            else
            {
                return AchievementLevel.None;
            }
        }
    }
}
