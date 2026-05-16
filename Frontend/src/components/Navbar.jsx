import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // mock logout
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">

      {/* Logo */}
      <h1 className="text-xl font-bold text-blue-500">
        CalorieTracker
      </h1>

      {/* Links */}
      <div className="flex gap-4">

        <Link to="/dashboard" className="hover:text-blue-500">
          Dashboard
        </Link>

        <Link to="/food" className="hover:text-blue-500">
          Food
        </Link>

        <Link to="/meal" className="hover:text-blue-500">
          Meal
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>

      </div>
    </nav>
  );
}

export default Navbar;