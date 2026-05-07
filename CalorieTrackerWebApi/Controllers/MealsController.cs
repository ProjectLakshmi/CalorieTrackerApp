using CalorieTrackerWebApi.Data;
using CalorieTrackerWebApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

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
        // GET: api/<MealsController>
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
                name = food.Name,        // ✅ from Food table
                baseCalories = food.Calories  // ✅ from Food table
            })
        .ToListAsync();

            return Ok(meals);
        }
    

        // POST api/<MealsController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] MealEntry mealentry)
        {
            if (mealentry == null)
            {
                return BadRequest(new { message = "Invalid food data" });
            }
            _dbContext.MealEntries.Add(mealentry);
            await _dbContext.SaveChangesAsync();
            return Ok(mealentry);
        }

        // PUT api/<MealsController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] MealEntry mealEntry)
        {
            var res = await _dbContext.MealEntries.FindAsync(id);
            if(res == null)
            {
                return NotFound(new { message = "Meal not found" });
                }
            res.FoodId = mealEntry.FoodId;
            res.Quantity = mealEntry.Quantity;
            res.Date = mealEntry.Date;

            await _dbContext.SaveChangesAsync();
            return Ok(res);
            
        }

        // DELETE api/<MealsController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var meal = await _dbContext.MealEntries.FindAsync(id);
            if (meal == null)
            {
                return NotFound(new { message = "Meal not found" });
            }
            _dbContext.MealEntries.Remove(meal);
            await _dbContext.SaveChangesAsync();
            return Ok(new { message = "Deleted Successfully" });
        }
    }
}
