namespace CalorieTrackerWebApi.DTO
{
    public class VerifyOtpDTO
    {
        public string Email { get; set; } = string.Empty;
        public string OtpToken { get; set; } = string.Empty;
        public string Otp { get; set; } = string.Empty;
    }
}
