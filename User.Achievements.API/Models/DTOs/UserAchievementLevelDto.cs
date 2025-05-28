namespace User.Achievements.API.Models.DTOs;

public class UserAchievementLevelDto
{
    public int UserId { get; set; }
    public string Level { get; set; }

    public UserAchievementLevelDto(int userId, string level)
    {
        UserId = userId;
        Level = level;
    }
}
