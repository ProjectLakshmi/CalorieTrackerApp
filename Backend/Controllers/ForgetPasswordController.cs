using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CalorieTrackerWebApi.Data;
using Microsoft.Identity.Client;
using CalorieTrackerWebApi.Services;
using CalorieTrackerWebApi.DTO;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CalorieTrackerWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ForgetPasswordController : ControllerBase
    {
        private readonly AppDBContext _dbContext;
        private readonly OtpTokenService _otpTokenService;
        private readonly IEmailService _emailService;

        public ForgetPasswordController(AppDBContext dbContext,OtpTokenService otpTokenService,IEmailService emailService)
        {
            _dbContext = dbContext;
            _otpTokenService = otpTokenService; 
            _emailService = emailService;
        }
        [HttpGet("forgetPassword")]
        public async Task<IActionResult> ForgetPassword([FromQuery] ForgetPasswordDTO dto)
        {
          var user =_dbContext.Users.FirstOrDefault(u=>u.Email.ToLower() == dto.Email.ToLower());

            if (user == null)
            {
                return NotFound(new { message = "No account found with this email." });
            }
            var otp = new Random().Next(100000, 999999).ToString();

            var otpToken = _otpTokenService.generateOtpToken(user.Email, otp);

            await _emailService.SendOtpAsync(user.Email, otp);

            return Ok(new
            {
                message = "Otp sent your email.",
                otpToken
            });
        }
        [HttpPost("verify-post")]

        public IActionResult VerifyOtp([FromBody] VerifyOtpDTO dto)
        {
            var (isValid, email, otpInToken) =_otpTokenService.VerifyotpToken(dto.OtpToken);

            if (!isValid)
            {
                return BadRequest(new { message = "OTP expired or invalid.Please try again." });
            }
            if (otpInToken != dto.Otp)
            {
                return BadRequest(new { message = "Incorrect OTP." });
            }
            return Ok(new
            {
                message = "OTP verified. Proceed to reset.",
                otpToken = dto.OtpToken
            });
        }

        [HttpPut("reset")]
        public IActionResult ResetPassword([FromBody] ResetPasswordDTO dto)
        {
            var (isValid, email, otpInToken) = _otpTokenService.VerifyotpToken(dto.OtpToken);
            if (!isValid)
            {
                return BadRequest(new { message = "OTP expired or invalid.Please try again." });
            }
            if (otpInToken != dto.Otp)
            {
                return BadRequest(new { message = "Incorrect OTP." });
            }
            var user = _dbContext.Users.FirstOrDefault(u => u.Email.ToLower() == email.ToLower());
            if (user == null) { 
                    return NotFound(new { message = "User Not Found" });
        }
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            _dbContext.SaveChanges();
            return Ok(new { message = "Password reset successfully" });
        }
    }
}
