import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        //dummy data//
        // if(email && password){
        //     localStorage.setItem("user" ,email);
        //     navigate("/dashboard")
        // }else{
        //     alert("Enter Details")
        // }

        // Api logic//
        try {
            const res = await axios.post('https://localhost:7213/api/login', { email, password });
            // localStorage.setItem("token",res.data.token);
            navigate("/dashboard");
        } catch (err) {
            alert("login Failed");
        }
    }

    const handleRegister = () => {
        navigate("/register")
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-xl shadow-md w-80">
                <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
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
                <button className="w-full bg-blue-500 text-white p-2 rounded" onClick={handleLogin}>Login</button>
                <label
                    onClick={handleRegister}
                    className="cursor-pointer block text-center text-black-500 hover:text-blue-700 hover:underline transition-colors duration-200"
                >
                    Sign Up
                </label>
            </div>
        </div>
    )
}

export default Login