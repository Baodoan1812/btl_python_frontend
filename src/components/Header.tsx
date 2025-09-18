import { Link } from "react-router-dom";

export default function Header({ user }) {
  const handleLogOut=()=>{
    localStorage.removeItem("token");
    window.location.href="/";
  }
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
        <span>Welcome, {user.username}</span>
        
      )}
       {!user && (
        <Link to="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      )}
       {user && (
        <Link to="/chat" className="text-blue-600 hover:underline">
          Chat
        </Link>
      )}
       {user && (
        <button onClick={handleLogOut}>Log out</button>
      )}
    </nav>
  );
}
