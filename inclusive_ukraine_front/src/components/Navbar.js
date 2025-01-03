import React from "react";
import { logout } from "./auth/logout"; // auth.js зберігає функцію logout

export default function Navbar({ user }) {
  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
      <div>
        <a href="/">Головна</a>
      </div>
      <div>
        {user ? (
          <>
            <span>Вітаю, {user.username}!</span>
            <button onClick={logout} style={{ marginLeft: "10px" }}>
              Вийти
            </button>
          </>
        ) : (
          <>
            <a href="/login" style={{ marginRight: "10px" }}>
              Вхід
            </a>
            <a href="/register">Реєстрація</a>
          </>
        )}
      </div>
    </nav>
  );
}
