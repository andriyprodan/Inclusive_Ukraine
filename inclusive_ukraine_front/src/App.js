import { useEffect, useState } from "react";

import './App.css';
import UkraineMap from "./components/UkraineMap";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import apiClient from "./api/axios";

function App() {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const response = await apiClient.get("users/user/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Не вдалося отримати дані користувача.");
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
      <Router>
        <Navbar user={user} />
        <Routes>
          <Route path="/" element={<UkraineMap user={user} />} />
          <Route path="/login" element={<LoginForm onLogin={setUser} />} />
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </Router>
  );
}

export default App;
