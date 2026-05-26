import { Link, useNavigate, useLocation } from "react-router-dom";
import {UseTheme} from '../context/ThemeContext'

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dark, toggle } = UseTheme();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-slate-900/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-6 py-3 flex justify-between items-center sticky top-0 z-50">

      
      <h1 className="text-lg font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
        CalorieTracker
      </h1>

     
      <div className="flex items-center gap-1">

        {["/dashboard", "/food", "/meal"].map((path) => (
          <Link
            key={path}
            to={path}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all capitalize ${
              isActive(path)
                ? "bg-white/10 text-white"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            {path.replace("/", "")}
          </Link>
        ))}

    
        <button
          onClick={toggle}
          className="ml-2 w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-base"
          title="Toggle theme"
        >
          {dark ? "☀️" : "🌙"}
        </button>

   
        <button
          onClick={handleLogout}
          className="ml-2 px-4 py-1.5 rounded-xl text-sm font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:text-red-300 transition-all"
        >
          Logout
        </button>

      </div>
    </nav>
  );
}

export default Navbar;