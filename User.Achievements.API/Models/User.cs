namespace User.Achievements.API.Models;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    public override bool Equals(object? obj)
    {
        if (obj is not User other)
        {
            return false;
        }

        return Id == other.Id && Name == other.Name && Email == other.Email;
    }

    public override int GetHashCode()
    {
        return HashCode.Combine(Id, Name, Email);
    }
}
