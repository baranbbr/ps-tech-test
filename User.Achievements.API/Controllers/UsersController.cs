using System.Threading.Tasks;
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

    [HttpGet]
    [Route("GetById/{Id}")]
    public async Task<IActionResult> GetByUserId(int Id)
    {
        return Ok();
    }

    [HttpGet]
    [Route("GetAllUsers")]
    public async Task<IActionResult> GetAllUsers()
    {
        return Ok(await _usersService.GetAllUsers());
    }
}
