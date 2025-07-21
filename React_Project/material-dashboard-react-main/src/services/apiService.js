import axios from "axios";

// Read environment variables from Vite (must be prefixed with VITE_)
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://localhost:7245/";
const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000;

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
      window.location.href = "/authentication/sign-in"; // Fixed redirect path
    }
    return Promise.reject(error);
  }
);

const apiService = {
  login: async (credentials) => {
    try {
      console.log("Sending login request with:", credentials);
      const response = await apiClient.post("/Auth/login", credentials); //error
      console.log("Login response:", response.data);

      // Fix: Handle different response structures
      const data = response.data.data || response.data;

      if (data?.token) {
        localStorage.setItem("authToken", data.token);
      }

      const user = {
        id: data?.user?.id || data?.id,
        name: data?.user?.name || data?.name,
        email: data?.user?.email || data?.email,
        role: data?.user?.role || data?.role,
        username: data?.user?.username || data?.username,
        token: data?.token,
        expiration: data?.expiration,
      };

      localStorage.setItem("user", JSON.stringify(user));

      return { success: true, user, data };
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response:", error.response?.data);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
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
      console.log("Creating user with data:", userData);
      const response = await apiClient.post("/Users", userData);
      console.log("Create user response:", response.data);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      console.error("Create user error:", error);
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
      return { success: true, data: response.data.data || response.data };
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
      return { success: true, data: response.data.data || response.data };
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
      return { success: true, data: response.data.data || response.data };
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
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch user",
        details: error.response?.data,
      };
    }
  },
  apiCall: async (id) => {
    try {
      const response = await apiClient.delete(`/Users/delete/${id}`);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete user",
        details: error.response?.data,
      };
    }
  },

  updateUser: async (id, userData) => {
    try {
      console.log("Updating user with ID:", id, "and data:", userData);
      const response = await apiClient.put(`/Users/update/${id}`, userData);
      return { success: true, data: response.data.data || response.data };
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

  getCards: async (userId) => {
    try {
      const cards = await apiClient.get(`/Cards/GetAllCards/${userId}`);
      return { success: true, data: cards.data.data }; //card object retrived from API
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch cards", //error message from API
      };
    }
  },

  addCard: async (cardInfo) => {
    try {
      const response = await apiClient.post(`/Cards/add`, cardInfo);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to add card",
      };
    }
  },

  setDefaultCard: async (cardInfo) => {
    try {
      const response = await apiClient.put(`/Cards/setDefault`, cardInfo);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to set default card",
      };
    }
  },

  getDefaultCard: async (userId) => {
    try {
      const response = await apiClient.get(`/Cards/getDefault/${userId}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch default card",
      };
    }
  },
};

export default apiService;
