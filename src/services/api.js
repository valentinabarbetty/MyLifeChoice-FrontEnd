export const API_URL = "https://mylifechoice-backend.onrender.com/api";

export const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
