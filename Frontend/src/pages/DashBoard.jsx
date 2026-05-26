import { useContext, useMemo, useState } from "react";
import { FoodContext } from "../context/FoodContext";

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];
const TYPE_EMOJI = { Breakfast: "🌅", Lunch: "☀️", Dinner: "🌙", Snack: "🍿" };

function Dashboard() {
  const { meals = [], goal, setGoal } = useContext(FoodContext);
  const [inputGoal, setInputGoal] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const todayMeals = useMemo(
    () => meals.filter((m) => m.date === today),
    [meals, today]
  );

  const totalCalories = todayMeals.reduce((sum, m) => sum + m.calories, 0);
  const remaining = goal - totalCalories;
  const progress = Math.min((totalCalories / goal) * 100, 100);
  const overGoal = totalCalories > goal;

  const caloriesByType = (type) =>
    todayMeals
      .filter((m) => m.mealType === type)
      .reduce((sum, m) => sum + m.calories, 0);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6">
      <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent tracking-tight">
        Dashboard 📊
      </h2>

      {/* Daily Summary Card */}
      <div className="max-w-md mx-auto bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl p-6 mb-5 shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-white/40 mb-5">
          Daily Summary
        </p>

        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500 dark:text-white/50">Consumed</span>
          <span className="text-sm font-semibold text-gray-800 dark:text-white/90">{totalCalories} cal</span>
        </div>

        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500 dark:text-white/50">Goal</span>
          <span className="text-sm font-semibold text-gray-800 dark:text-white/90">{goal} cal</span>
        </div>

        <div className="flex gap-2 mb-2">
          <input
            type="number"
            placeholder="Set new goal..."
            value={inputGoal}
            onChange={(e) => setInputGoal(e.target.value)}
            className="flex-1 bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/15 rounded-xl px-3 py-2 text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 outline-none focus:border-violet-400 transition-colors"
          />
          <button
            onClick={() => { if (inputGoal) { setGoal(Number(inputGoal)); setInputGoal(""); } }}
            className="bg-violet-500 hover:bg-violet-400 active:scale-95 text-white text-sm font-semibold px-4 rounded-xl transition-all"
          >
            Set
          </button>
        </div>

        <div className="h-px bg-gray-200 dark:bg-white/[0.06] my-4" />

        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500 dark:text-white/50">Remaining</span>
          <span className={`text-sm font-semibold ${overGoal ? "text-red-400" : "text-emerald-500"}`}>
            {overGoal ? `+${Math.abs(remaining)} over` : `${remaining} cal`}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${overGoal ? "bg-gradient-to-r from-red-500 to-red-400" : "bg-gradient-to-r from-emerald-500 to-teal-400"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 dark:text-white/25 text-right mt-1.5">
          {Math.round(progress)}% of daily goal
        </p>
      </div>

      {/* Calories by Meal Type */}
      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mb-5">
        {MEAL_TYPES.map((type) => (
          <div
            key={type}
            className="bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl p-4 text-center shadow-lg"
          >
            <span className="text-2xl block mb-1">{TYPE_EMOJI[type]}</span>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-white/35 mb-1">
              {type}
            </p>
            <p className="text-lg font-bold bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">
              {caloriesByType(type)} cal
            </p>
          </div>
        ))}
      </div>

      {/* Total + Remaining */}
      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
        <div className="bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl p-5 text-center shadow-lg">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-white/35 mb-2">
            Total today
          </p>
          <p className="text-3xl font-bold bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent leading-none">
            {totalCalories}
          </p>
          <p className="text-xs text-gray-400 dark:text-white/25 mt-1">kcal</p>
        </div>
        <div className="bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl p-5 text-center shadow-lg">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-white/35 mb-2">
            Remaining
          </p>
          <p className={`text-3xl font-bold leading-none ${overGoal ? "text-red-400" : "text-emerald-500"}`}>
            {overGoal ? `-${Math.abs(remaining)}` : remaining}
          </p>
          <p className="text-xs text-gray-400 dark:text-white/25 mt-1">kcal</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;