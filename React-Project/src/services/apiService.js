import axios from "axios";

// Read environment variables from Vite (must be prefixed with VITE_)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://localhost:7245/";
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000;

// Log values for debugging (optional - remove in production)
console.log("API Base URL:", API_BASE_URL);
console.log("API Timeout:", API_TIMEOUT);

// Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to each request if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error) //error is predeifned error-handling function in interceptor
);

// Handle 401 globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login"; // Redirect to login on 401
    }
    return Promise.reject(error);
  }
);

const apiService = {
  login: async (credentials) => {
    try {
      const response = await apiClient.post("/Auth/login", credentials);
      const data = response.data.data; //response.data = actual body

      if (data?.token) {
        localStorage.setItem("authToken", data.token); //browser storage
      }

      const user = {
        username: data?.username,
        token: data?.token,
        expiration: data?.expiration,
      };

      localStorage.setItem("user", JSON.stringify(user));

      return { success: true, user, data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Login failed.";
      return {
        success: false,
        error: errorMessage,
        details: error.response?.data,
      };
    }
  },

  createUser: async (userData) => {
    try {
      const response = await apiClient.post("/Users", userData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to create user",
        details: error.response?.data,
      };
    }
  },

  getUsers: async () => {
    try {
      const response = await apiClient.get("/Users");
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch users",
        details: error.response?.data,
      };
    }
  },

  getAdminData: async () => {
    try {
      const response = await apiClient.get("/Users/admin");
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch admin data",
        details: error.response?.data,
      };
    }
  },

  getUserData: async () => {
    try {
      const response = await apiClient.get("/Users/user");
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch user data",
        details: error.response?.data,
      };
    }
  },

  getUserById: async (id) => {
    try {
      const response = await apiClient.get(`/Users/${id}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch user",
        details: error.response?.data,
      };
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await apiClient.put(`/Users/update/${id}`, userData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update user",
        details: error.response?.data,
      };
    }
  },

  logout: async () => {
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      return { success: true };
    }
  },

  isAuthenticated: () => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");

    if (!token || !user) return false;

    try {
      const userData = JSON.parse(user);
      if (userData.expiration) {
        const expires = new Date(userData.expiration);
        if (new Date() >= expires) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          return false;
        }
      }
      return true;
    } catch {
      return false;
    }
  },

  getStoredUser: () => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  apiCall: async (method, endpoint, data = null) => {
    try {
      const response = await apiClient({ method, url: endpoint, data });
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "API call failed",
        details: error.response?.data,
      };
    }
  },
};

export default apiService;
