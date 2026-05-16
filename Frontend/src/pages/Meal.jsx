import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { FoodContext } from "../context/FoodContext";

const BASE_URL = "https://localhost:7213/api/Meals";

function Meal() {
  const { foods, meals = [], setMeals } = useContext(FoodContext);
  const [selectedFood, setSelectedFood] = useState("");
  const [quantity, setQuantity] = useState("");
  const [mealType, setMealType] = useState("Breakfast");
  const [quantityType, setQuantityType] = useState("Grams");
  const [openDay, setOpenDay] = useState(null);


  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await axios.get(BASE_URL);
        console.log("API Response:", res.data);
        setMeals(res.data);
      } catch (err) {
        console.log("Error:", err.response?.data);
        alert("Failed to load meals");
      }
    };
    fetchMeals();
  }, []);


  const addMeal = async () => {
    if (!selectedFood || !quantity) {
      alert("Select food and quantity");
      return;
    }

    const food = foods.find(f => f.id == selectedFood);

    // let calculatedCalories = 0;
    // if (quantityType === "Grams") {
    //   calculatedCalories = (quantity / 100) * food.calories;
    // } else if (quantityType === "Cups") {
    //   calculatedCalories = (quantity * 240 / 100) * food.calories;
    // } else if (quantityType === "Peices") {
    //   calculatedCalories = quantity * food.calories;
    // }

    try {
      const res = await axios.post(BASE_URL, {
        foodId: food.id,
        userId: 1,
        quantity: Number(quantity),
        quantityType,
        mealType,
        date: new Date().toISOString()
      });
      setMeals([...meals, res.data]);

      setSelectedFood("");
      setQuantity("");
    } catch (err) {
      console.log("Status:", err.response?.status);
      console.log("Data:", err.response?.data);
      console.log("Message:", err.message);
      alert("Failed to add meal");
    }
  };


  const deleteMeal = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      setMeals(meals.filter(meal => meal.id !== id));
    } catch (err) {
      alert("Failed to delete meal");
    }
  };

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);

  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];
  const typeEmoji = {
    Breakfast: "🌅",
    Lunch: "☀️",
    Dinner: "🌙",
    Snack: "🍿"
  };

  const exportCSV = () => {
    const header = ["Date", "Meal Type", "Food", "Quantity", "Unit", "Calories"];
    const rows = meals.map(meal => [
      meal.date, meal.mealType, meal.name, meal.quantity, meal.quantityType, meal.calories
    ]);
    const csvContent = [header, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "meal_log.csv";
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h2 className="text-3xl font-bold text-center mb-6">Meal Tracker 🍽️</h2>

      {/* Add Meal Card */}
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Add Meal</h3>

        <select className="w-full p-2 border rounded mb-3" value={selectedFood} onChange={(e) => setSelectedFood(e.target.value)}>
          <option value="">Select Food</option>
          {foods.map(food => (
            <option key={food.id} value={food.id}>{food.name} ({food.calories} cal)</option>
          ))}
        </select>

        <select className="w-full p-2 border rounded mb-3" value={mealType} onChange={(e) => setMealType(e.target.value)}>
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
          <option>Snack</option>
        </select>

        <select className="w-full p-2 border rounded mb-3" value={quantityType} onChange={(e) => setQuantityType(e.target.value)}>
          <option>Grams</option>
          <option>Cups</option>
          <option>Peices</option>
        </select>

        <input
          type="number"
          className="w-full p-2 border rounded mb-3"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <button onClick={addMeal} className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
          Add Meal
        </button>
      </div>

      {/* Meal List */}
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">Meals</h3>

        {meals.length === 0 ? (
          <p className="text-gray-500 text-center">No meals added</p>
        ) : (
          <div>
            {mealTypes.map(type => {
              const typeMeals = meals.filter(m => m.mealType === type);
              if (typeMeals.length === 0) return null;
              const typeCalories = typeMeals.reduce((sum, m) => sum + m.calories, 0);

              return (
                <div key={type} className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-700">{typeEmoji[type]} {type}</h4>
                    <span className="text-sm text-gray-500">{typeCalories} cal</span>
                  </div>
                  <ul>
                    {typeMeals.map(meal => (
                      <li key={meal.id} className="flex justify-between items-center border-b py-2">
                        <span>{meal.name} x {meal.quantity} {meal.quantityType} = {meal.calories} cal</span>
                        <button onClick={() => deleteMeal(meal.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
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

      {/* Total Calories */}
      <div className="max-w-md mx-auto mt-6 bg-white p-6 rounded-xl shadow-md text-center">
        <h3 className="text-lg text-gray-500">Total Calories</h3>
        <p className="text-3xl font-bold text-blue-500">{totalCalories} kcal</p>
      </div>

      {/* Meal History Accordion */}
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Meal History 📅</h3>
          <button onClick={exportCSV} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
            Export CSV 📥
          </button>
        </div>

        {meals.length === 0 ? (
          <p className="text-gray-500 text-center">No history yet</p>
        ) : (
          [...new Set(meals.map(m => m.date))].map(date => {
            const dayMeals = meals.filter(m => m.date === date);
            const dayCalories = dayMeals.reduce((sum, m) => sum + m.calories, 0);
            const isOpen = openDay === date;

            return (
              <div key={date} className="border rounded-lg mb-2">
                <button
                  onClick={() => setOpenDay(isOpen ? null : date)}
                  className="w-full flex justify-between items-center p-3 text-left"
                >
                  <span className="font-medium text-gray-700">{date}</span>
                  <span className="text-sm text-gray-500">
                    {dayCalories} kcal {isOpen ? "▲" : "▼"}
                  </span>
                </button>

                {isOpen && (
                  <ul className="px-3 pb-3">
                    {dayMeals.map(meal => (
                      <li key={meal.id} className="flex justify-between border-b py-1 text-sm text-gray-600">
                        <span>{meal.mealType} — {meal.name} x {meal.quantity} {meal.quantityType}</span>
                        <span>{meal.calories} cal</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

export default Meal;