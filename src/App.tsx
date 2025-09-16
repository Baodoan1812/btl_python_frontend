import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import Header from "./components/Header";
import useGetDataUser from "./hooks/useGetDataUser";

function App() {
  const { user } = useGetDataUser();
  console.log("App user:", user);
  return (
    <BrowserRouter>
      {/* Header */}
      <Header user={user} />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
