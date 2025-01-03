import React, { useState, useEffect } from "react";
import apiClient from "../api/axios";

const SettlementSearch = ({settlementChosenCallback}) => {
  const [query, setQuery] = useState("");
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(false);

  // Функція для запиту до API
  const fetchSettlements = async (searchText) => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/settlements/?full_name=${searchText}`);
      setSettlements(response.data); // Очікується, що відповідь - масив об'єктів { id, name }
    } catch (error) {
      console.error("Error fetching settlements:", error);
      setSettlements([]);
    } finally {
      setLoading(false);
    }
  };

  // Виклик fetchSettlements при зміні введеного тексту
  useEffect(() => {
    if (query.length > 3) {
      fetchSettlements(query);
    } else {
      setSettlements([]); // Очищуємо результати, якщо довжина менше ніж 4 символи
    }
  }, [query]);

  return (
    <div
      style={{
        position: "fixed",
        top: "60px",
        left: "20px",
        zIndex: 1000,
        backgroundColor: "#fff",
        padding: "20px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        width: "300px",
      }}
    >
      <input
        type="text"
        placeholder="Введіть назву населеного пункту..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          marginBottom: "10px",
        }}
      />
      {loading && <p>Завантаження...</p>}
      {!loading && settlements.length > 0 && (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            maxHeight: "200px",
            overflowY: "auto",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          {settlements.map((settlement) => (
            <li
              key={settlement.id}
              style={{
                padding: "10px",
                borderBottom: "1px solid #f0f0f0",
                cursor: "pointer",
              }}
              onClick={() => settlementChosenCallback(settlement)}
            >
              {settlement.name}, {settlement.district.name}, {settlement.district.region.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SettlementSearch;
