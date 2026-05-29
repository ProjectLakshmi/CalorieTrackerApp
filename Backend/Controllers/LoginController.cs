using CalorieTrackerWebApi.Data;
using CalorieTrackerWebApi.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;

namespace CalorieTrackerWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly IConfiguration _config;

        public LoginController(AppDBContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost]
        public IActionResult Login([FromBody] LoginDTO dto)
        {
          
            var user = _context.Users
                .FirstOrDefault(u => u.Email == dto.Email);

            if (user == null)
            {
                return Unauthorized(new { message = "User not found" });
            }

            
            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Invalid password" });
            }
            var token = GenerateJwtToken(user.Id, user.Email);

            return Ok(new
            {
                message = "Login successful",
                token = token
            });
        }

        private string GenerateJwtToken(int userId, string email)
        {
            var jwtSettings = _config.GetSection("JwtSettings");
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings["Secret"]));

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(
                    int.Parse(jwtSettings["ExpiryDays"])),
                signingCredentials: new SigningCredentials(
                    key, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}