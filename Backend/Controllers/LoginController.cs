using CalorieTrackerWebApi.Data;
using CalorieTrackerWebApi.DTO;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;

namespace CalorieTrackerWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly AppDBContext _context;

        public LoginController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult Login([FromBody] LoginDTO dto)
        {
            //  Fetch user from DB
            var user = _context.Users
                .FirstOrDefault(u => u.Email == dto.Email);

            if (user == null)
            {
                return Unauthorized(new { message = "User not found" });
            }

            //  Check password
            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Invalid password" });
            }

            return Ok(new
            {
                message = "Login successful",
                token = "dummy-jwt-token"
            });
        }
    }
}