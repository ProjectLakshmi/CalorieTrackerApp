namespace CalorieTrackerWebApi.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public double Weight { get; set; }
        public double Height { get; set; }
        public int Age { get; set; }
    }
}
