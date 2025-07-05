import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const checkUser = () => {
    const storedUser = localStorage.getItem("mockmate-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser(); // Initial run
    window.addEventListener("storage", checkUser);

    return () => {
      window.removeEventListener("storage", checkUser);
    };
  }, []);
  

  const handleLogout = () => {
    localStorage.removeItem("mockmate-user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-[1px] bg-white/1 border-b border-white/1 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center text-white">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-500">
          MockMate AI
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 font-medium text-sm items-center">
          <Link to="/dashboard" className="hover:text-blue-400 transition">
            Dashboard
          </Link>
          <Link to="/new" className="hover:text-blue-400 transition">
            Start Interview
          </Link>
          <Link to="/about" className="hover:text-blue-400 transition">
            About
          </Link>

          {user ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg shadow font-semibold text-sm transition"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg shadow font-semibold text-sm transition"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white text-xl">
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {menuOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-xl border-t border-white/10 p-4 space-y-4 text-sm text-white">
          <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block hover:text-blue-400">
            Dashboard
          </Link>
          <Link to="/new" onClick={() => setMenuOpen(false)} className="block hover:text-blue-400">
            Start Interview
          </Link>
          <Link to="/about" onClick={() => setMenuOpen(false)} className="block hover:text-blue-400">
            About
          </Link>
          {user ? (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="w-full text-left px-2 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block px-2 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-center"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
