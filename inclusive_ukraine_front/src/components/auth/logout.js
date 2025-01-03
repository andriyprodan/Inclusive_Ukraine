import { setAuthToken } from "../../api/axios";


export const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setAuthToken(null);
    window.location.href = "/login"; // Перенаправлення на сторінку входу
  };
  