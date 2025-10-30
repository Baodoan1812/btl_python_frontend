import { Link } from "react-router-dom";

export default function Header({ user }) {
  const handleLogOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <nav className="flex items-center justify-between bg-gradient-to-r from-blue-400 to-indigo-500 text-white p-4 shadow-md">
      {/* Logo / Brand */}
      <Link to="/" className="text-2xl font-bold hover:text-gray-200 transition">
        MyApp
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-6">
        <Link to="/" className="hover:text-gray-200 transition">
          Home
        </Link>

        {!user && (
          <>
            <Link
              to="/login"
              className="bg-white text-blue-500 px-3 py-1 rounded-lg hover:bg-gray-100 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white text-blue-500 px-3 py-1 rounded-lg hover:bg-gray-100 transition"
            >
              Register
            </Link>
          </>
        )}

        {user && (
          <>
            <span className="mr-4">Welcome, <b>{user.username}</b></span>
            <Link
              to="/chat"
              className="bg-white text-blue-500 px-3 py-1 rounded-lg hover:bg-gray-100 transition"
            >
              Chat
            </Link>
            <button
              onClick={handleLogOut}
              className="bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600 transition"
            >
              Log out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
