import { Link } from "react-router-dom";

export default function Header({ user }) {
  return (
    <nav className="flex gap-4 p-4 bg-gray-200">
      <Link to="/" className="text-blue-600 hover:underline">
        Home
      </Link>

      {!user && (
        <Link to="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      )}

      {user && (
        <span className="text-gray-700">Hello, {user.username}</span>
      )}
       {!user && (
        <Link to="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      )}

    </nav>
  );
}
