using CalorieTrackerWebApi.Data;
using CalorieTrackerWebApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CalorieTrackerWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MealsController : ControllerBase
    {
        private readonly AppDBContext _dbContext;
        public MealsController(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        // GET: api/Meals
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
                        calories = meal.QuantityType == "Grams"
                            ? (int)Math.Round((meal.Quantity / 100.0) * food.Calories)
                            : meal.QuantityType == "Cups"
                                ? (int)Math.Round((double)(meal.Quantity * 240.0 / 100.0) * food.Calories)
                                : (int)Math.Round((double)meal.Quantity * food.Calories) // Pieces
                    })
                .ToListAsync();

            return Ok(meals);
        }

        // POST api/Meals
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] MealEntry mealentry)
        {
            if (mealentry == null)
                return BadRequest(new { message = "Invalid meal data" });

            _dbContext.MealEntries.Add(mealentry);
            await _dbContext.SaveChangesAsync();

            // ✅ Return joined data so Meal.jsx gets name + calories immediately after POST
            var food = await _dbContext.Foods.FindAsync(mealentry.FoodId);
            double calories = mealentry.QuantityType == "Grams"
                ? (mealentry.Quantity / 100.0) * food.Calories
                : mealentry.QuantityType == "Cups"
                    ? (mealentry.Quantity * 240.0 / 100.0) * food.Calories
                    : mealentry.Quantity * food.Calories;

            return Ok(new
            {
                id = mealentry.Id,
                userId = mealentry.UserId,
                foodId = mealentry.FoodId,
                quantity = mealentry.Quantity,
                quantityType = mealentry.QuantityType,
                mealType = mealentry.MealType,
                date = mealentry.Date.ToString("yyyy-MM-dd"),
                name = food.Name,
                calories = (int)Math.Round(calories)
            });
        }

        // PUT api/Meals/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] MealEntry mealEntry)
        {
            var res = await _dbContext.MealEntries.FindAsync(id);
            if (res == null)
                return NotFound(new { message = "Meal not found" });

            res.FoodId = mealEntry.FoodId;
            res.Quantity = mealEntry.Quantity;
            res.QuantityType = mealEntry.QuantityType;  
            res.MealType = mealEntry.MealType;          
            res.Date = mealEntry.Date;
            await _dbContext.SaveChangesAsync();
            return Ok(res);
        }

        // DELETE api/Meals/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var meal = await _dbContext.MealEntries.FindAsync(id);
            if (meal == null)
                return NotFound(new { message = "Meal not found" });

            _dbContext.MealEntries.Remove(meal);
            await _dbContext.SaveChangesAsync();
            return Ok(new { message = "Deleted Successfully" });
        }
    }
}