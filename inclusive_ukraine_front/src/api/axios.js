import axios from "axios";

const BASE_URL = "http://127.0.0.1:8148/api/";

const apiClient = axios.create({
  baseURL: BASE_URL,
});

export default apiClient;


// used for authorized requests
let axiosData = {
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
};
if (localStorage.getItem("access_token")) {
  axiosData.headers["Authorization"] = `Bearer ${localStorage.getItem("access_token")}`;
}
export const authApiClient = axios.create(axiosData);

// Function to set the token dynamically
export const setAuthToken = (token) => {
  if (token) {
    // Apply token to every request if logged in
    authApiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    // Remove token from header
    delete authApiClient.defaults.headers.common["Authorization"];
  }
};

// Intercept requests to refresh the token if expired
authApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      try {
        const refreshResponse = await apiClient.post("users/token/refresh/", {
          refresh: localStorage.getItem("refresh_token"),
        });
        localStorage.setItem("access_token", refreshResponse.data.access);
        setAuthToken(refreshResponse.data.access);
        authApiClient.defaults.headers.common["Authorization"] = `Bearer ${refreshResponse.data.access}`;
        error.config.headers.common["Authorization"] = `Bearer ${refreshResponse.data.access}`;
        return authApiClient.request(error.config);
      } catch (e) {
        console.error("Failed to refresh token:", e);
        // Handle logout if refresh fails
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

