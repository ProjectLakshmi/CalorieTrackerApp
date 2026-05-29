
using MailKit.Net.Smtp;
using MimeKit;

namespace CalorieTrackerWebApi.Services
{
    public class EmailService :IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }
     public async Task SendOtpAsync(string toEmail, string otp)
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(_config["Email:Username"]));
            email.To.Add(MailboxAddress.Parse(toEmail));
            email.Subject = "CalorieTracker - Password Reset OTP";
            email.Body = new TextPart("html")
            {
                Text = $@"
<h2>Password Reset</h2>
<p>Your Otp is: <strong>{otp}</strong></p>
<p>Expires in <strong>10 minutes</strong>.</p>"
            };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(_config["Email:Host"],
                int.Parse(_config["Email:Port"]),false);
            await smtp.AuthenticateAsync(
               _config["Email:Username"],
               _config["Email:Password"]
                );
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(false);
        }
    }
}
