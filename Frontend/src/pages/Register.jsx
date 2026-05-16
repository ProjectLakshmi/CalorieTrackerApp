import { useState } from "react"
import React from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from 'react-icons/fa'

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {

    //Dummy Data//
    // alert("User Registeres");
    // navigate("/")

    //Api Logic//
    try {
      await axios.post("https://localhost:7213/api/register", {
        email,
        password,
        weight,
        height,
        age
      });

      alert("Registered Successfully");
      navigate("/");
    } catch (err) {
      alert("Registration failed");
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>
        <input className='w-full p-2 border mb-3 rounded' type='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
        <div className="relative mb-3">
          <input className='w-full p-2 border  rounded pr-10' type={showPassword ? 'text' : 'password'} placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <input className='w-full p-2 border mb-3 rounded' type='number' placeholder='Height (cm)' onChange={(e) => setHeight(e.target.value)} />
        <input className='w-full p-2 border mb-3 rounded' type='number' placeholder='Weight (kg)' onChange={(e) => setWeight(e.target.value)} />
        <input className='w-full p-2 border mb-3 rounded' type='number' placeholder='Age' onChange={(e) => setAge(e.target.value)} />
        <button className="w-full bg-blue-500 text-white p-2 rounded" onClick={handleRegister}>Register</button>

      </div>
    </div>
  )
}

export default Register