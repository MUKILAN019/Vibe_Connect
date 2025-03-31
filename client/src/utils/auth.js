import axios from "axios";
import Cookies from "js-cookie";

let refreshInterval = null;

const isAuthenticated = () => {
  return !!Cookies.get("access_token");
};

export const startRefresh = () => {
  if (!refreshInterval && isAuthenticated()) {
    refreshInterval = setInterval(() => {
      console.log("Session active...");
    }, 15000);
  }
};

export const stopRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
};

export const login = async (email, password, navigate) => {
  try {
    const response = await axios.post("https://vibe-connect-15wk.onrender.com/api/login/", { email, password }, { withCredentials: true });
    Cookies.set("access_token", response.data.tokens.access, { expires: 1, sameSite: "Strict" });
    Cookies.set("refresh_token", response.data.tokens.refresh, { expires: 1, sameSite: "Strict" });
    startRefresh();
    navigate("/home");  
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      if (status === 400) throw new Error("Email and password are required.");
      if (status === 401) throw new Error("Invalid email or password. Please try again.");
      if (status === 403) throw new Error("Your account is not active. Please contact support.");
      if (status === 500) throw new Error("Server error! Please try again later.");
    } else {
      throw new Error("Network error! Check your connection.");
    }
  }
};

export const logout = (navigate) => {
  stopRefresh();
  Cookies.remove("access_token");
  navigate("/");
};

export const checkAuthStatus = (navigate) => {
  if (!isAuthenticated()) {
    stopRefresh();
    navigate("/");
  } else {
    startRefresh();
  }
};
