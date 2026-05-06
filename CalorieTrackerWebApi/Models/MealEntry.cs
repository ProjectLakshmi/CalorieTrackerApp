namespace CalorieTrackerWebApi.Models
{
    public class MealEntry
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int FoodId { get; set; }
        public int Quantity { get; set; }
        public DateTime Date { get; set; }
    }
}
