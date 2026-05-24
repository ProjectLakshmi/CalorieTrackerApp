import React, { useState, useContext, useEffect } from 'react'
import { FoodContext } from '../context/FoodContext';
import BarcodeScanner from '../components/BarcodeScanner';
import AxiosInstance from '../api/AxiosInstance';        // ← REPLACED axios import

function Food() {

  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [goal, setGoal] = useState(2000);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [showScanner, setShowScanner] = useState(false);

  const { foods, setFoods } = useContext(FoodContext);

  useEffect(() => {
    const fetchedFood = async () => {
      try {
        const res = await AxiosInstance.get("/food");    // ← AxiosInstance, short URL
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
      alert("Enter all fields");
      return;
    }
    try {
      if (editId) {
        const res = await AxiosInstance.put(`/food/${editId}`, {   // ← AxiosInstance
          name,
          calories: Number(calories)
        });
        setFoods(foods.map(f => f.id === editId ? res.data : f))
        setEditId(null);
      } else {
        const res = await AxiosInstance.post(`/food`, {             // ← AxiosInstance
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
      await AxiosInstance.delete(`/food/${id}`)          // ← AxiosInstance
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

      const res = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );
      const data = await res.json();
      const product = data.product;
      const newFood = {
        id: Date.now(),
        name: product.product_name || "Unknown Food",
        calories: product.nutriments["energy-kcal_100g"] || 0,
      };
      setFoods((prev) => [...prev, newFood]);
      setShowScanner(false);
    } catch (error) {
      alert("Failed to fetch food data");
    }
  };



  // const editFood = (food) => {
  //   setName(food.name);
  //   setCalories(food.calories);
  //   setEditId(food.id);
  // };

  // const totalCalories = foods.reduce((sum, food) =>
  //   sum + Number(food.calories), 0
  // )

  // const filteredFoods = foods.filter((food) => food.name?.toLowerCase().includes(search.toLowerCase()));

  // const handleScan = async (barcode) => {
  //   try {
  //     const res = await axios.get(
  //       `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
  //     );
  //     const product = res.data.product;
  //     const newFood = {
  //       id: Date.now(),
  //       name: product.product_name || "Unknown Food",
  //       calories: product.nutriments["energy-kcal_100g"] || 0,
  //     };
  //     setFoods((prev) => [...prev, newFood]);
  //     setShowScanner(false);
  //   } catch (error) {
  //     alert("Failed to fetch food data");
  //   }
  // };

  const inputCls =
    "w-full bg-white/[0.05] border border-white/[0.08] rounded-xl text-white text-sm font-medium px-3.5 py-3 outline-none placeholder:text-white/20 focus:border-[rgba(99,255,180,0.4)] focus:bg-[rgba(99,255,180,0.04)] focus:ring-2 focus:ring-[rgba(99,255,180,0.08)] transition-all";

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-start justify-center p-6 relative overflow-hidden">

      {/* Background orbs */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(99,255,180,0.10)_0%,transparent_70%)] -top-24 -left-24 pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(99,160,255,0.09)_0%,transparent_70%)] -bottom-20 -right-20 pointer-events-none" />

      <div className="relative w-full max-w-[900px] mt-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#63ffb4] to-[#63a0ff] flex items-center justify-center text-xl shadow-[0_4px_16px_rgba(99,255,180,0.3)]">
              🍎
            </div>
            <div>
              <h1 className="text-white text-xl font-bold leading-none">
                Nutri<span className="bg-gradient-to-r from-[#63ffb4] to-[#63a0ff] bg-clip-text text-transparent">Track</span>
              </h1>
              <p className="text-[10px] text-white/30 tracking-widest uppercase mt-0.5">Daily Food Journal</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-[rgba(99,255,180,0.08)] border border-[rgba(99,255,180,0.18)] text-[#63ffb4] text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#63ffb4] animate-pulse" />
            Calorie Tracker
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-5">

          {/* LEFT — Add / Edit */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-[24px] px-8 py-8 backdrop-blur-xl shadow-[0_40px_80px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)]">

            <div className="inline-flex items-center gap-1.5 bg-[rgba(99,255,180,0.08)] border border-[rgba(99,255,180,0.18)] text-[#63ffb4] text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#63ffb4]" />
              {editId ? "Editing" : "Log Food"}
            </div>

            <h2 className="text-white text-2xl font-bold leading-tight mb-1">
              {editId ? "Edit" : "Add"}{" "}
              <span className="bg-gradient-to-r from-[#63ffb4] to-[#63a0ff] bg-clip-text text-transparent">
                Food
              </span>
            </h2>
            <p className="text-white/40 text-sm mb-6">Every bite counts toward your goal.</p>

            {/* Scan */}
            <button
              onClick={() => setShowScanner(!showScanner)}
              className="w-full mb-4 py-3 rounded-[14px] bg-white/[0.05] border border-white/[0.08] text-white/60 text-sm font-medium hover:border-[rgba(99,160,255,0.4)] hover:text-[#63a0ff] transition-all flex items-center justify-center gap-2"
            >
              📷 {showScanner ? "Close Scanner" : "Scan Food"}
            </button>

            {showScanner && (
              <div className="mb-4 rounded-xl overflow-hidden border border-white/[0.08]">
                <BarcodeScanner onScan={handleScan} />
              </div>
            )}

            {/* Food Name */}
            <div className="flex flex-col gap-1.5 mb-3">
              <label className="text-[11px] font-semibold tracking-widest uppercase text-white/35">Food Name</label>
              <input
                className={inputCls}
                placeholder="Food Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Calories */}
            <div className="flex flex-col gap-1.5 mb-6">
              <label className="text-[11px] font-semibold tracking-widest uppercase text-white/35">Calories</label>
              <input
                type="number"
                className={inputCls}
                placeholder="Calories"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
            </div>

            {/* Submit */}
            <button
              onClick={addFood}
              className="w-full py-3.5 rounded-[14px] bg-gradient-to-r from-[#63ffb4] to-[#63d4ff] text-[#0a0a0f] text-[15px] font-bold tracking-wide shadow-[0_8px_24px_rgba(99,255,180,0.25)] hover:shadow-[0_12px_32px_rgba(99,255,180,0.35)] hover:-translate-y-px active:translate-y-0 transition-all duration-150"
            >
              {editId ? "Update Food" : "Add Food"}
            </button>

            {editId && (
              <button
                onClick={() => { setEditId(null); setName(""); setCalories(""); }}
                className="w-full mt-3 py-3 rounded-[14px] bg-white/[0.04] border border-white/[0.08] text-white/40 text-sm hover:text-white/70 hover:border-white/20 transition-all"
              >
                ✕ Cancel
              </button>
            )}
          </div>

          {/* RIGHT — Food List */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-[24px] px-8 py-8 backdrop-blur-xl shadow-[0_40px_80px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)]">

            <div className="inline-flex items-center gap-1.5 bg-[rgba(99,160,255,0.08)] border border-[rgba(99,160,255,0.18)] text-[#63a0ff] text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#63a0ff]" />
              Food List
            </div>

            <h2 className="text-white text-2xl font-bold leading-tight mb-1">
              Your{" "}
              <span className="bg-gradient-to-r from-[#63a0ff] to-[#63ffb4] bg-clip-text text-transparent">
                Entries
              </span>
            </h2>
            <p className="text-white/40 text-sm mb-6">Everything you've logged today.</p>

            {/* Search */}
            <div className="relative mb-5">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 text-sm">🔍</span>
              <input
                className={inputCls + " pl-9"}
                placeholder="Search food..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* List */}
            {filteredFoods.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-3 opacity-40">🥗</p>
                <p className="text-white/25 text-sm">No food found</p>
              </div>
            ) : (
              <ul className="flex flex-col gap-3 max-h-[360px] overflow-y-auto pr-1">
                {filteredFoods.map((food) => (
                  <li
                    key={food.id}
                    className="flex items-center gap-3 px-4 py-3 bg-white/[0.05] border border-white/[0.07] rounded-[14px] hover:border-[rgba(99,255,180,0.2)] hover:bg-[rgba(99,255,180,0.03)] transition-all group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{food.name}</p>
                      <p className="text-white/30 text-xs mt-0.5">
                        <span className="text-[#63ffb4] font-semibold">{food.calories}</span> cal
                      </p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => editFood(food)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-[8px] bg-[rgba(245,200,66,0.12)] text-[#f5c842] hover:bg-[rgba(245,200,66,0.22)] transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteFood(food.id)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-[8px] bg-[rgba(255,99,99,0.12)] text-[#ff6363] hover:bg-[rgba(255,99,99,0.22)] transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Total */}
            {foods.length > 0 && (
              <div className="mt-5 pt-4 border-t border-white/[0.07] flex justify-between items-center">
                <span className="text-[11px] text-white/30 uppercase tracking-widest">Total Calories</span>
                <span className="text-[#63ffb4] font-bold text-lg">{totalCalories} cal</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Food;
