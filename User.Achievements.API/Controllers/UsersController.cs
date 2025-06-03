using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using User.Achievements.API.Services;

namespace User.Achievements.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly ILogger<UsersController> _logger;
    private readonly IUsersService _usersService;

    public UsersController(ILogger<UsersController> logger, IUsersService usersService)
    {
        _logger = logger;
        _usersService = usersService;
    }

    [HttpGet("{id}")]
    [ResponseCache(
        Duration = 30,
        Location = ResponseCacheLocation.Any,
        VaryByQueryKeys = new[] { "id" }
    )]
    public async Task<IActionResult> GetByUserId(int id)
    {
        _logger.LogInformation("Request received to get user by ID: {id}", id);
        var user = await _usersService.GetByUserIdAsync(id);
        if (user.UserId <= 0)
        {
            return NotFound();
        }

        return Ok(user);
    }

    [HttpGet]
    [ResponseCache(
        Duration = 60,
        Location = ResponseCacheLocation.Any,
        VaryByHeader = "Accept-Encoding"
    )]
    public async Task<IActionResult> GetAllUsers()
    {
        _logger.LogInformation("Request received to get all users.");
        var users = await _usersService.GetAllUsersAsync();
        if (users == null || users.Count == 0)
            return NoContent();
        return Ok(users);
    }
}
