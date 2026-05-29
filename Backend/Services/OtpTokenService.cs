using Org.BouncyCastle.Pqc.Crypto.Crystals.Dilithium;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace CalorieTrackerWebApi.Services
{
    public class OtpTokenService
    {
        private readonly IConfiguration _config;

        public OtpTokenService(IConfiguration config)
        {
            _config = config;
        }public string generateOtpToken(string email, string otp)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtSettings:Secret"]));

            var claims = new[]
            {
                new Claim(ClaimTypes.Email, email),
                new Claim("otp",otp),
                new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString())
            };
            var token = new JwtSecurityToken(
                expires: DateTime.UtcNow.AddMinutes(10),
                claims: claims,
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
                );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public (bool isValid, string? email, string? otp) VerifyotpToken(string token)
        {
            try
            {
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtSettings:Secret"]));
                var handler = new JwtSecurityTokenHandler();
                var principal = handler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true
                },out _);
                var email = principal.FindFirstValue(ClaimTypes.Email);
                var otp = principal.FindFirstValue("otp");

                return (true, email, otp);
            }
            catch
            {
                return (false, null, null);
            }
        }
    }
}
