import { createContext, useState } from "react";

export const FoodContext = createContext();

export const FoodProvider = ({ children }) => {
  const [foods, setFoods] = useState([]);
  const [meals, setMeals] = useState([]);

  return (
    <FoodContext.Provider value={{ foods, setFoods, meals, setMeals }}>
      {children}
    </FoodContext.Provider>
  );
};