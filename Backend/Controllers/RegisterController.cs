using CalorieTrackerWebApi.Data;
using CalorieTrackerWebApi.DTO;
using CalorieTrackerWebApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CalorieTrackerWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        private readonly AppDBContext _dbContext;

        public RegisterController(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        // POST api/<RegisterController>
        [HttpPost]
        public IActionResult Post([FromBody] RegisterDTO registerDTO)
        {
            var existingUser = _dbContext.Users
               .FirstOrDefault(u => u.Email == registerDTO.Email);

            if (existingUser != null)
            {
                return BadRequest(new
                {
                    message = "Username already exists"
                });
            }
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(registerDTO.Password);

            // Create user
            var user = new User
            {
                Email = registerDTO.Email,
                PasswordHash = hashedPassword,
                Weight=registerDTO.Weight,
                Height=registerDTO.Height,
                Age=registerDTO.Age
            };

            //  Save to DB
            _dbContext.Users.Add(user);
            _dbContext.SaveChanges();

            return Ok(new
            {
                message = "User registered successfully"
            });

        }
  
    }
}
