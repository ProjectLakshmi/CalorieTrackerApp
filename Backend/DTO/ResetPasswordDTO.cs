namespace CalorieTrackerWebApi.DTO
{
    public class ResetPasswordDTO
    {
        public string Email { get; set; } = string.Empty;
        public string OtpToken { get; set; } = string.Empty;
        public string Otp { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
