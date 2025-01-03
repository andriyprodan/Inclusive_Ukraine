import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import apiClient from "../../api/axios";

export default function RegisterForm() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post("users/register/", formData);
      setMessage(response.data.message);
      // redirect to login page
      navigate("/login");
    } catch (error) {
      setMessage(error.response.data.error || "Щось пішло не так.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
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
      <button type="submit">Зареєструватися</button>
      {message && <p>{message}</p>}
    </form>
  );
}
