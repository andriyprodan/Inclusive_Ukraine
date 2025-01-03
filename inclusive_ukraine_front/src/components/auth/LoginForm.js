import React, { useState } from "react";
import apiClient, { setAuthToken } from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ onLogin }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post("users/token/", formData);
      const { access, refresh } = response.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      setAuthToken(access);

      // Отримуємо дані користувача
      const userResponse = await apiClient.get("users/user/", {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      onLogin(userResponse.data);
      navigate("/");
    } catch (error) {
      setError("Неправильне ім'я користувача або пароль.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Вхід</h2>
      <div>
        <label>Ім'я користувача:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Пароль:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Увійти</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
