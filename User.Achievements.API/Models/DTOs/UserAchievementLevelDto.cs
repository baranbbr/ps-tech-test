namespace User.Achievements.API.Models.DTOs;

public class UserAchievementLevelDto
{
    public int UserId { get; set; }
    public string Name { get; set; }
    public string Level { get; set; }

    public UserAchievementLevelDto(int userId, string name, string level)
    {
        UserId = userId;
        Name = name;
        Level = level;
    }

    public override bool Equals(object? obj)
    {
        if (obj is UserAchievementLevelDto other)
        {
            return UserId == other.UserId && Name == other.Name && Level == other.Level;
        }
        return false;
    }

    public override int GetHashCode()
    {
        return HashCode.Combine(UserId, Level);
    }
}
