import { createContext, useState } from "react";

export const FoodContext = createContext();

export const FoodProvider = ({ children }) => {
  const [foods, setFoods] = useState([]);
  const [meals, setMeals] = useState([]);
  const [goal,setGoal] =useState(2000)

  return (
    <FoodContext.Provider value={{ foods, setFoods, meals, setMeals, goal, setGoal }}>
      {children}
    </FoodContext.Provider>
  );
};