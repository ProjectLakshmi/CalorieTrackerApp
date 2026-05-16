using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CalorieTrackerWebApi.Migrations
{
    /// <inheritdoc />
    public partial class AddMealTypeAndQuantityType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MealType",
                table: "MealEntries",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "QuantityType",
                table: "MealEntries",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MealType",
                table: "MealEntries");

            migrationBuilder.DropColumn(
                name: "QuantityType",
                table: "MealEntries");
        }
    }
}
