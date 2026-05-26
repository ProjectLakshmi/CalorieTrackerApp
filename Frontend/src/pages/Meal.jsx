import { useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import AxiosInstance from "../api/AxiosInstance";
import { FoodContext } from "../context/FoodContext";

const BASE_URL = "/Meals";

function Meal() {
  const { foods, meals = [], setMeals } = useContext(FoodContext);
  const [selectedFood, setSelectedFood] = useState("");
  const [quantity, setQuantity] = useState("");
  const [mealType, setMealType] = useState("Breakfast");
  const [quantityType, setQuantityType] = useState("Grams");
  const [openDay, setOpenDay] = useState(null);
  const [aiRecommendation, setAiRecommendation] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const token = localStorage.getItem("token");
  const userId = token ? Number(jwtDecode(token).sub) : null;
  const calorieGoal = Number(localStorage.getItem("calorieGoal")) || 2000;

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await AxiosInstance.get(BASE_URL);
        setMeals(res.data);
      } catch (err) {
        console.log("Error:", err.response?.data);
        alert("Failed to load meals");
      }
    };
    fetchMeals();
  }, []);

  const addMeal = async () => {
    if (!selectedFood || !quantity) { alert("Select food and quantity"); return; }
    const food = foods.find(f => f.id == selectedFood);
    try {
      const res = await AxiosInstance.post(BASE_URL, {
        foodId: food.id, userId, quantity: Number(quantity),
        quantityType, mealType, date: new Date().toISOString()
      });
      setMeals([...meals, res.data]);
      setSelectedFood(""); setQuantity("");
    } catch (err) { alert("Failed to add meal"); }
  };

  const deleteMeal = async (id) => {
    try {
      await AxiosInstance.delete(`${BASE_URL}/${id}`);
      setMeals(meals.filter(meal => meal.id !== id));
    } catch (err) { alert("Failed to delete meal"); }
  };

  const getAiRecommendation = async () => {
    setAiLoading(true); setAiRecommendation("");
    const consumed = meals.reduce((sum, meal) => sum + meal.calories, 0);
    const remaining = calorieGoal - consumed;
    const todayStr = new Date().toISOString().split("T")[0];
    const todayMeals = meals.filter(m => m.date === todayStr);
    const mealSummary = todayMeals.length > 0
      ? todayMeals.map(m => `${m.name} (${m.calories} cal, ${m.mealType})`).join(", ")
      : "Nothing yet";
    const prompt = `You are a nutrition assistant. Here is the user's current status:
- Calorie goal: ${calorieGoal} kcal
- Calories consumed today: ${consumed} kcal
- Calories remaining: ${remaining} kcal
- Meals eaten today: ${mealSummary}
Recommend 3 specific foods the user should eat next to stay on track. For each include food name, portion size, approximate calories, and why it fits their remaining budget. Keep it concise.`;
    try {
      const res = await AxiosInstance.post("/AI/recommend", { prompt });
      setAiRecommendation(res.data.text || "No recommendation received.");
    } catch (err) {
      setAiRecommendation("Failed to get recommendation. Please try again.");
    } finally { setAiLoading(false); }
  };

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const remaining = calorieGoal - totalCalories;
  const progressPct = Math.min((totalCalories / calorieGoal) * 100, 100);

  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];
  const typeEmoji = { Breakfast: "🌅", Lunch: "☀️", Dinner: "🌙", Snack: "🍿" };

  const exportCSV = () => {
    const header = ["Date", "Meal Type", "Food", "Quantity", "Unit", "Calories"];
    const rows = meals.map(meal => [meal.date, meal.mealType, meal.name, meal.quantity, meal.quantityType, meal.calories]);
    const csvContent = [header, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "meal_log.csv"; a.click();
  };

  const selectCls = "w-full bg-white/[0.05] border border-white/[0.08] rounded-xl text-white text-sm font-medium px-3.5 py-3 outline-none focus:border-[rgba(99,255,180,0.4)] focus:ring-2 focus:ring-[rgba(99,255,180,0.08)] transition-all appearance-none";
  const inputCls = "w-full bg-white/[0.05] border border-white/[0.08] rounded-xl text-white text-sm font-medium px-3.5 py-3 outline-none placeholder:text-white/20 focus:border-[rgba(99,255,180,0.4)] focus:ring-2 focus:ring-[rgba(99,255,180,0.08)] transition-all";

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-6 relative overflow-hidden">

      {/* Background orbs */}
      <div className="fixed w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(99,255,180,0.07)_0%,transparent_70%)] -top-32 -left-32 pointer-events-none" />
      <div className="fixed w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(99,160,255,0.06)_0%,transparent_70%)] -bottom-24 -right-24 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#63ffb4] to-[#63a0ff] flex items-center justify-center text-xl shadow-[0_4px_16px_rgba(99,255,180,0.3)]">
              🍽️
            </div>
            <div>
              <h1 className="text-white text-xl font-bold leading-none">
                Meal<span className="bg-gradient-to-r from-[#63ffb4] to-[#63a0ff] bg-clip-text text-transparent">Tracker</span>
              </h1>
              <p className="text-[10px] text-white/30 tracking-widest uppercase mt-0.5">Daily Food Journal</p>
            </div>
          </div>
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/50 text-sm hover:text-[#63ffb4] hover:border-[rgba(99,255,180,0.3)] transition-all">
            📥 Export CSV
          </button>
        </div>

        {/* Calorie Summary Cards */}
        {/* <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Goal", value: calorieGoal, color: "text-white", glow: "" },
            { label: "Consumed", value: totalCalories, color: "text-[#63ffb4]", glow: "shadow-[0_0_20px_rgba(99,255,180,0.15)]" },
            { label: "Remaining", value: remaining, color: remaining < 0 ? "text-red-400" : "text-[#63a0ff]", glow: "" },
          ].map(({ label, value, color, glow }) => (
            <div key={label} className={`bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 text-center backdrop-blur-xl ${glow}`}>
              <p className="text-[10px] text-white/30 tracking-widest uppercase mb-2">{label}</p>
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
              <p className="text-[11px] text-white/20 mt-1">kcal</p>
            </div>
          ))}
        </div> */}

        {/* Progress Bar */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 mb-6 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[11px] text-white/30 uppercase tracking-widest">Daily Progress</span>
            <span className="text-[11px] text-white/40">{Math.round(progressPct)}%</span>
          </div>
          <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progressPct}%`,
                background: progressPct >= 100
                  ? "linear-gradient(to right, #ff6363, #ff9f63)"
                  : "linear-gradient(to right, #63ffb4, #63a0ff)"
              }}
            />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">

          {/* Add Meal */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-[24px] p-8 backdrop-blur-xl shadow-[0_40px_80px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="inline-flex items-center gap-1.5 bg-[rgba(99,255,180,0.08)] border border-[rgba(99,255,180,0.18)] text-[#63ffb4] text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#63ffb4]" /> Add Meal
            </div>
            <h2 className="text-white text-2xl font-bold mb-1">
              Log a <span className="bg-gradient-to-r from-[#63ffb4] to-[#63a0ff] bg-clip-text text-transparent">Meal</span>
            </h2>
            <p className="text-white/30 text-sm mb-6">Track every bite toward your goal.</p>

            <div className="flex flex-col gap-3">
              <select className={selectCls} value={selectedFood} onChange={e => setSelectedFood(e.target.value)}>
                <option value="" className="bg-[#0a0a0f]">Select Food</option>
                {foods.map(food => (
                  <option key={food.id} value={food.id} className="bg-[#0a0a0f]">{food.name} ({food.calories} cal)</option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-3">
                <select className={selectCls} value={mealType} onChange={e => setMealType(e.target.value)}>
                  {["Breakfast", "Lunch", "Dinner", "Snack"].map(t => <option key={t} className="bg-[#0a0a0f]">{t}</option>)}
                </select>
                <select className={selectCls} value={quantityType} onChange={e => setQuantityType(e.target.value)}>
                  {["Grams", "Cups", "Peices"].map(t => <option key={t} className="bg-[#0a0a0f]">{t}</option>)}
                </select>
              </div>

              <input type="number" className={inputCls} placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} />

              <button onClick={addMeal} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#63ffb4] to-[#63d4ff] text-[#0a0a0f] font-bold text-[15px] shadow-[0_8px_24px_rgba(99,255,180,0.25)] hover:shadow-[0_12px_32px_rgba(99,255,180,0.4)] hover:-translate-y-px active:translate-y-0 transition-all duration-150">
                + Add Meal
              </button>
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-[24px] p-8 backdrop-blur-xl shadow-[0_40px_80px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="inline-flex items-center gap-1.5 bg-[rgba(168,99,255,0.08)] border border-[rgba(168,99,255,0.18)] text-[#a863ff] text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a863ff] animate-pulse" /> AI Powered
            </div>
            <div className="flex items-start justify-between mb-1">
              <h2 className="text-white text-2xl font-bold">
                Food <span className="bg-gradient-to-r from-[#a863ff] to-[#63a0ff] bg-clip-text text-transparent">Suggestions</span>
              </h2>
              <button
                onClick={getAiRecommendation}
                disabled={aiLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#a863ff] to-[#6363ff] text-white text-sm font-semibold shadow-[0_4px_16px_rgba(168,99,255,0.3)] hover:shadow-[0_8px_24px_rgba(168,99,255,0.45)] hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
              >
                {aiLoading ? (
                  <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Thinking</>
                ) : "✨ Suggest"}
              </button>
            </div>
            <p className="text-white/30 text-sm mb-5">
              {totalCalories} consumed · {remaining} remaining of {calorieGoal} kcal
            </p>

            {aiLoading && (
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-white/[0.04] rounded-xl animate-pulse" />
                ))}
              </div>
            )}

            {aiRecommendation && !aiLoading && (
              <div className="bg-[rgba(168,99,255,0.06)] border border-[rgba(168,99,255,0.15)] rounded-xl p-4 text-sm text-white/70 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                {aiRecommendation}
              </div>
            )}

            {!aiRecommendation && !aiLoading && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <p className="text-4xl mb-3 opacity-30">🤖</p>
                <p className="text-white/25 text-sm">Click "Suggest" for AI-powered<br />food recommendations</p>
              </div>
            )}
          </div>
        </div>

        {/* Meal List */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-[24px] p-8 backdrop-blur-xl mb-6">
          <div className="inline-flex items-center gap-1.5 bg-[rgba(99,160,255,0.08)] border border-[rgba(99,160,255,0.18)] text-[#63a0ff] text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#63a0ff]" /> Today's Meals
          </div>
          <h2 className="text-white text-2xl font-bold mb-6">
            What You've <span className="bg-gradient-to-r from-[#63a0ff] to-[#63ffb4] bg-clip-text text-transparent">Eaten</span>
          </h2>

          {meals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3 opacity-30">🥗</p>
              <p className="text-white/25 text-sm">No meals logged yet today</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {mealTypes.map(type => {
                const typeMeals = meals.filter(m => m.mealType === type);
                if (typeMeals.length === 0) return null;
                const typeCalories = typeMeals.reduce((sum, m) => sum + m.calories, 0);
                return (
                  <div key={type} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{typeEmoji[type]}</span>
                        <span className="text-white font-semibold">{type}</span>
                      </div>
                      <span className="text-[#63ffb4] text-sm font-semibold">{typeCalories} cal</span>
                    </div>
                    <ul className="flex flex-col gap-2">
                      {typeMeals.map(meal => (
                        <li key={meal.id} className="flex items-center justify-between gap-3 px-3 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl group hover:border-[rgba(255,99,99,0.2)] transition-all">
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">{meal.name}</p>
                            <p className="text-white/30 text-xs">{meal.quantity} {meal.quantityType} · <span className="text-[#63ffb4]">{meal.calories}</span> cal</p>
                          </div>
                          <button onClick={() => deleteMeal(meal.id)} className="opacity-0 group-hover:opacity-100 px-2.5 py-1 text-xs font-semibold rounded-lg bg-[rgba(255,99,99,0.12)] text-[#ff6363] hover:bg-[rgba(255,99,99,0.22)] transition-all">
                            Delete
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Meal History */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-[24px] p-8 backdrop-blur-xl">
          <div className="inline-flex items-center gap-1.5 bg-[rgba(99,255,180,0.08)] border border-[rgba(99,255,180,0.18)] text-[#63ffb4] text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#63ffb4]" /> History
          </div>
          <h2 className="text-white text-2xl font-bold mb-6">
            Meal <span className="bg-gradient-to-r from-[#63ffb4] to-[#63a0ff] bg-clip-text text-transparent">History</span>
          </h2>

          {meals.length === 0 ? (
            <p className="text-white/25 text-sm text-center py-8">No history yet</p>
          ) : (
            <div className="flex flex-col gap-3">
              {[...new Set(meals.map(m => m.date))].map(date => {
                const dayMeals = meals.filter(m => m.date === date);
                const dayCalories = dayMeals.reduce((sum, m) => sum + m.calories, 0);
                const isOpen = openDay === date;
                return (
                  <div key={date} className="border border-white/[0.07] rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setOpenDay(isOpen ? null : date)}
                      className="w-full flex justify-between items-center px-5 py-4 text-left hover:bg-white/[0.02] transition-all"
                    >
                      <span className="text-white font-medium">{date}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[#63ffb4] text-sm font-semibold">{dayCalories} kcal</span>
                        <span className="text-white/30 text-xs">{isOpen ? "▲" : "▼"}</span>
                      </div>
                    </button>
                    {isOpen && (
                      <ul className="px-5 pb-4 flex flex-col gap-2 border-t border-white/[0.06]">
                        {dayMeals.map(meal => (
                          <li key={meal.id} className="flex justify-between py-2 text-sm">
                            <span className="text-white/50">{meal.mealType} — {meal.name} · {meal.quantity} {meal.quantityType}</span>
                            <span className="text-[#63ffb4] font-medium">{meal.calories} cal</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Meal;