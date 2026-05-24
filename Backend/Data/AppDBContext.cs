using CalorieTrackerWebApi.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace CalorieTrackerWebApi.Data
{
    public class AppDBContext : DbContext 
    {
        public AppDBContext(DbContextOptions<AppDBContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Food> Foods { get; set; }
        public DbSet<MealEntry> MealEntries { get; set; }
    }
}
