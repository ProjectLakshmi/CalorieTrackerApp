import React, { useState, useContext, useEffect } from 'react'
import { FoodContext } from '../context/FoodContext';
import BarcodeScanner from '../components/BarcodeScanner';
import axios from 'axios';

function Food() {

  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [goal, setGoal] = useState(2000);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const { foods, setFoods } = useContext(FoodContext);

  useEffect(() => {
    const fetchedFood = async () => {
      try {
        const res = await axios.get("https://localhost:7213/api/food");
        setFoods(res.data);
      }
      catch (err) {
        alert('Failed to load foods')
      }
    }
    fetchedFood();
  }, []);



  const addFood = async () => {
    if (!name || !calories) {
      alert("Enter all feilds");
      return;
    }
    try {
      if (editId) {

        const res = await axios.put(`https://localhost:7213/api/food/${editId}`, {
          name,
          calories: Number(calories)
        });

        setFoods(foods.map(f => f.id === editId ? res.data : f))
        setEditId(null);

      }

      else {
        const res = await axios.post(`https://localhost:7213/api/food`, {
          name,
          calories: Number(calories)
        })
        setFoods([...foods, res.data]);

      }
      setName("");
      setCalories("");
    } catch (err) {
      console.log(err);
      alert("Failed to save food");
    }
  }

  const deleteFood = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      const res = await axios.delete(`https://localhost:7213/api/food/${id}`)
      setFoods(foods.filter((food) => food.id != id))
    } catch (err) {
      alert("Failed to delete food")
    }

  }

  const editFood = (food) => {
    setName(food.name);
    setCalories(food.calories);
    setEditId(food.id);
  };

  const totalCalories = foods.reduce((sum, food) =>
    sum + Number(food.calories), 0
  )

  const filteredFoods = foods.filter((food) => food.name?.toLowerCase().includes(search.toLowerCase()));

  const handleScan = async (barcode) => {
    try {
      const res = await axios.get(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );
      const data = res.data;

      const product = data.product;

      const newFood = {
        id: Date.now(),
        name: product.product_name || "Unknown Food",
        calories: product.nutriments["energy-kcal_100g"] || 0,
      };

      setFoods((prev) => [...prev, newFood]);
      setShowScanner(false); // close scanner after scan
    } catch (error) {
      alert("Failed to fetch food data");
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-6 relative">

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-6 right-6 bg-black text-white px-4 py-2 rounded-lg shadow dark:bg-white dark:text-black transition"
        >
          {darkMode ? "Light" : "Dark"}
        </button>

        {/* Header */}
        <h2 className="heading">
          Food Tracker 🍎
        </h2>

        {/* Layout */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">

          {/* LEFT */}
          <div className="space-y-6">

            {/* Summary */}
            <div className="card">
              <h3 className="subheading">Daily Summary</h3>

              <div className="flex justify-between text-muted mb-2">
                <span>Total</span>
                <span>{totalCalories} cal</span>
              </div>

              <div className="flex justify-between text-muted mb-2">
                <span>Goal</span>
                <span>{goal} cal</span>
              </div>

              <div className="flex justify-between text-muted mb-3">
                <span>Remaining</span>
                <span>{goal - totalCalories} cal</span>
              </div>

              {/* Progress */}
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-3 rounded-full ${totalCalories > goal ? "bg-red-500" : "bg-green-500"
                    }`}
                  style={{
                    width: `${Math.min((totalCalories / goal) * 100, 100)}%`,
                  }}
                ></div>
              </div>

              <input
                type="number"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="input mt-4"
                placeholder="Set goal"
              />
            </div>

            {/* Add/Edit */}
            <div className="card">
              <h3 className="subheading">
                {editId ? "Edit Food" : "Add Food"}
              </h3>

              <button
                onClick={() => setShowScanner(!showScanner)}
                className="w-full mb-3 bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 transition"
              >
                {showScanner ? "Close Scanner" : "Scan Food 📷"}
              </button>

              {showScanner && (
                <div className="mb-4">
                  <BarcodeScanner onScan={handleScan} />
                </div>
              )}

              <input
                className="input mb-3"
                placeholder="Food Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                type="number"
                className="input mb-4"
                placeholder="Calories"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />

              <button onClick={addFood} className="button-primary">
                {editId ? "Update Food" : "Add Food"}
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="card">
            <h3 className="subheading">Food List</h3>

            <input
              className="input mb-4"
              placeholder="Search food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {filteredFoods.length === 0 ? (
              <p className="text-muted text-center">No food found</p>
            ) : (
              <ul className="space-y-3">
                {filteredFoods.map((food) => (
                  <li
                    key={food.id}
                    className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                  >
                    <div>
                      <p className="font-medium text-gray-700 dark:text-white">
                        {food.name}
                      </p>
                      <p className="text-muted">
                        {food.calories} cal
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => editFood(food)}
                        className="px-3 py-1 text-sm bg-yellow-400 text-white rounded-md hover:bg-yellow-500"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteFood(food.id)}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>
    </div >
  );
}

export default Food