import { useContext, useMemo } from "react";
import { FoodContext } from "../context/FoodContext";

const GOAL = 2000;
const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];
const TYPE_EMOJI = { Breakfast: "🌅", Lunch: "☀️", Dinner: "🌙", Snack: "🍿" };

function Dashboard() {
  const { meals = [] } = useContext(FoodContext); // pull meals from context

  const today = new Date().toISOString().split("T")[0];

  const todayMeals = useMemo(
    () => meals.filter((m) => m.date === today),
    [meals, today]
  );

  const totalCalories = todayMeals.reduce((sum, m) => sum + m.calories, 0);
  const remaining = GOAL - totalCalories;
  const progress = Math.min((totalCalories / GOAL) * 100, 100);
  const overGoal = totalCalories > GOAL;

  const caloriesByType = (type) =>
    todayMeals
      .filter((m) => m.mealType === type)
      .reduce((sum, m) => sum + m.calories, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center mb-8">Dashboard 📊</h2>

      {/* Daily Summary Card */}
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Daily Summary</h3>

        <div className="flex justify-between text-gray-500 mb-2">
          <span>Total</span>
          <span className="font-medium text-gray-800">{totalCalories} cal</span>
        </div>
        <div className="flex justify-between text-gray-500 mb-2">
          <span>Goal</span>
          <span className="font-medium text-gray-800">{GOAL} cal</span>
        </div>
        <div className="flex justify-between text-gray-500 mb-4">
          <span>Remaining</span>
          <span className={`font-medium ${overGoal ? "text-red-500" : "text-green-500"}`}>
            {overGoal ? `+${Math.abs(remaining)} over` : `${remaining} cal`}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all ${overGoal ? "bg-red-500" : "bg-green-500"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 text-right mt-1">
          {Math.round(progress)}% of goal
        </p>
      </div>

      {/* Calories by Meal Type */}
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
        {MEAL_TYPES.map((type) => (
          <div key={type} className="bg-white p-4 rounded-xl shadow-md text-center">
            <h4 className="text-gray-500 text-sm mb-1">
              {TYPE_EMOJI[type]} {type}
            </h4>
            <p className="text-xl font-semibold text-blue-500">
              {caloriesByType(type)} cal
            </p>
          </div>
        ))}
      </div>

      {/* Total + Remaining */}
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        <div className="bg-white p-4 rounded-xl shadow-md text-center">
          <h4 className="text-gray-500 text-sm">Total today</h4>
          <p className="text-2xl font-bold text-blue-500">{totalCalories} kcal</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md text-center">
          <h4 className="text-gray-500 text-sm">Remaining</h4>
          <p className={`text-2xl font-bold ${overGoal ? "text-red-500" : "text-green-500"}`}>
            {overGoal ? `-${Math.abs(remaining)}` : remaining} kcal
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;