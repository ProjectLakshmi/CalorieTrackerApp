using CalorieTrackerWebApi.Data;
using CalorieTrackerWebApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CalorieTrackerWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodController : ControllerBase
    {
        private readonly AppDBContext _dbContext;

        public FoodController(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        // GET: api/food
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var meals = await _dbContext.MealEntries
         .Join(_dbContext.Foods,
             meal => meal.FoodId,
             food => food.Id,
             (meal, food) => new
             {
                 id = meal.Id,
                 userId = meal.UserId,
                 foodId = meal.FoodId,
                 quantity = meal.Quantity,
                 quantityType = meal.QuantityType,
                 mealType = meal.MealType,
                 date = meal.Date.ToString("yyyy-MM-dd"),
                 name = food.Name,      
                 baseCalories = food.Calories 
             })
         .ToListAsync();

            return Ok(meals);
        }

        // POST: api/food
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] Food food)
        {
            if (food == null || string.IsNullOrEmpty(food.Name))
                return BadRequest(new { message = "Invalid food data" });

            _dbContext.Foods.Add(food);
            await _dbContext.SaveChangesAsync();
            return Ok(food);
        }

        // PUT: api/food/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Food food)
        {
            var existing = await _dbContext.Foods.FindAsync(id);
            if (existing == null)
                return NotFound(new { message = "Food not found" });

            existing.Name = food.Name;
            existing.Calories = food.Calories;

            await _dbContext.SaveChangesAsync();
            return Ok(existing);
        }

        // DELETE: api/food/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var food = await _dbContext.Foods.FindAsync(id);
            if (food == null)
                return NotFound(new { message = "Food not found" });

            _dbContext.Foods.Remove(food);
            await _dbContext.SaveChangesAsync();
            return Ok(new { message = "Deleted successfully" });
        }
    }
}