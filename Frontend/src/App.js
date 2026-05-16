import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import DashBoard from './pages/DashBoard';
import Food from './pages/Food';
import Meal from './pages/Meal';
import { useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import { FoodProvider } from './context/FoodContext';

function App() {
  const location = useLocation();
  const navBarHide = location.pathname == '/' || location.pathname == '/register'
  return (
    <>
      {!navBarHide && <Navbar />}

      <FoodProvider>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path='/dashboard' element={<DashBoard />}></Route>
          <Route path='/food' element={<Food />}></Route>
          <Route path='/meal' element={<Meal />}></Route>
        </Routes>
      </FoodProvider>

    </>
  );
}

export default App;
