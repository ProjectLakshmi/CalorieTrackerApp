import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoading(true);
        try {
            const res = await axios.post('https://localhost:7213/api/login', { email, password });
            localStorage.setItem("token", res.data.token);
            navigate("/dashboard");
        } catch (err) {
            alert("Login Failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex">

            {/* LEFT PANEL */}
            <div className="hidden lg:flex flex-col w-[52%] bg-[#0f1117] px-16 py-14 relative overflow-hidden">

                {/* Grid texture */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                                          linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                        backgroundSize: "40px 40px",
                    }}
                />

                {/* Glow blobs */}
                <div className="absolute top-[-80px] left-[-80px] w-[380px] h-[380px] rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.18)_0%,transparent_70%)] pointer-events-none" />
                <div className="absolute bottom-[-60px] right-[-60px] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.15)_0%,transparent_70%)] pointer-events-none" />

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-2.5 mb-16">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-black text-sm shadow-lg">
                        C
                    </div>
                    <span className="text-white font-bold text-lg tracking-tight">CalorieTracker</span>
                </div>

                {/* Main content — vertically centered */}
                <div className="relative z-10 flex flex-col justify-center flex-1">

                    {/* Heading */}
                    <h2 className="text-white text-4xl font-bold leading-snug mb-3">
                        Your health,<br />
                        <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                            your data.
                        </span>
                    </h2>
                    <p className="text-white/40 text-sm mb-10 max-w-xs leading-relaxed">
                        Track every meal, hit every goal, and stay consistent — all in one place.
                    </p>

                    {/* Stat Cards — stacked neatly */}
                    <div className="flex flex-col gap-3 max-w-xs">

                        {/* Today's Calories */}
                        <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl px-5 py-4 backdrop-blur-sm">
                            <p className="text-white/40 text-[10px] font-semibold mb-2 uppercase tracking-widest">Today's Calories</p>
                            <p className="text-white text-2xl font-bold mb-2.5">
                                1,840 <span className="text-sm font-normal text-white/40">/ 2,200</span>
                            </p>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-orange-400 to-pink-500" />
                            </div>
                        </div>

                        {/* Bottom two cards side by side */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl px-4 py-4 backdrop-blur-sm">
                                <p className="text-white/40 text-[10px] font-semibold mb-2 uppercase tracking-widest">Streak</p>
                                <p className="text-white text-xl font-bold">🔥 14 days</p>
                            </div>
                            <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl px-4 py-4 backdrop-blur-sm">
                                <p className="text-white/40 text-[10px] font-semibold mb-2 uppercase tracking-widest">This Week</p>
                                <div className="flex items-end gap-0.5 h-8">
                                    {[40, 65, 50, 80, 70, 90, 84].map((h, i) => (
                                        <div
                                            key={i}
                                            className="flex-1 rounded-sm"
                                            style={{
                                                height: `${h}%`,
                                                background: i === 6
                                                    ? "linear-gradient(to top, #fb923c, #ec4899)"
                                                    : "rgba(255,255,255,0.12)"
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Bottom quote */}
                <div className="relative z-10 mt-10">
                    <p className="text-white/20 text-xs italic">"Small daily improvements lead to stunning results."</p>
                </div>
            </div>

            {/* RIGHT PANEL — form */}
            <div className="flex-1 bg-[#080b10] flex items-center justify-center px-8 py-14 relative overflow-hidden">

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.06)_0%,transparent_70%)] pointer-events-none" />

                <div className="relative z-10 w-full max-w-sm">

                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-2 mb-10">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-black text-xs">
                            C
                        </div>
                        <span className="text-white font-bold tracking-tight">CalorieTracker</span>
                    </div>

                    <h1 className="text-white text-3xl font-bold mb-1">Welcome back</h1>
                    <p className="text-white/40 text-sm mb-9">Sign in to continue your journey</p>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5 mb-4">
                        <label className="text-[11px] font-semibold tracking-widest uppercase text-white/35">
                            Email
                        </label>
                        <input
                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm font-medium px-4 py-3 outline-none placeholder:text-white/20 focus:border-orange-400/50 focus:bg-orange-400/[0.04] focus:ring-2 focus:ring-orange-400/10 transition-all"
                            type="email"
                            placeholder="you@example.com"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-1.5 mb-2">
                        <label className="text-[11px] font-semibold tracking-widest uppercase text-white/35">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm font-medium px-4 py-3 pr-11 outline-none placeholder:text-white/20 focus:border-orange-400/50 focus:bg-orange-400/[0.04] focus:ring-2 focus:ring-orange-400/10 transition-all"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Your password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                            </button>
                        </div>
                    </div>

                    {/* Forgot password */}
                    <div className="flex justify-end mb-7">
                        <span className="text-xs text-orange-400/80 hover:text-orange-400 cursor-pointer transition-colors">
                            Forgot password?
                        </span>
                    </div>

                    {/* Login button */}
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 text-white text-[15px] font-bold tracking-wide shadow-[0_8px_24px_rgba(251,146,60,0.3)] hover:shadow-[0_12px_32px_rgba(251,146,60,0.45)] hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 flex items-center justify-center gap-2 mb-5"
                    >
                        {loading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Signing in…
                            </>
                        ) : "Sign In"}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex-1 h-px bg-white/[0.06]" />
                        <span className="text-[11px] text-white/20 tracking-widest uppercase">or</span>
                        <div className="flex-1 h-px bg-white/[0.06]" />
                    </div>

                    {/* Sign up */}
                    <p className="text-center text-[13px] text-white/30">
                        Don't have an account?{" "}
                        <span
                            onClick={() => navigate("/register")}
                            className="text-orange-400 font-semibold cursor-pointer hover:underline"
                        >
                            Create one
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
