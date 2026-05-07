namespace CalorieTrackerWebApi.DTO
{
    public class RegisterDTO
    {
      
           public string Email { get; set; }
           public string Password { get; set; }
           public double Height { get; set; }   // in cm
           public double Weight { get; set; }   // in kg
           public int Age { get; set; }



    }
}
