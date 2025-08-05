import axios from "axios";

// import { useAuth } from "AuthProvider";

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

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      console.log("Using token for request:", token);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      if (localStorage.getItem("user")) {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/authentication/sign-in";
      }
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

      const data = response.data.data;

      if (data?.token) {
        localStorage.setItem("authToken", data.token);
      }

      const user = {
        id: data?.id,
        name: data?.name,
        role: data?.userRole,
        username: data?.username,
        token: data?.token,
        expiration: data?.expiration,
        permissions: data?.permissions,
        balance: data.balance,
      };

      console.log("Parsed user data:", user);
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

  getOutstandingBills: async () => {
    try {
      const response = await apiClient.get(`/Bill/outstanding`);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.data || "Failed to fetch outstanding bills",
      };
    }
  },

  getOutstandingBills: async () => {
    try {
      const response = await apiClient.get(`/Bill/outstanding`);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.data || "Failed to fetch outstanding bills",
      };
    }
  },
  getOutstandingBills: async () => {
    try {
      const response = await apiClient.get(`/Bill/outstanding`);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.data || "Failed to fetch outstanding bills",
      };
    }
  },

  getChallanByNumber: async (challanNumber) => {
    try {
      const response = await apiClient.get(`/Bill/byChallan/${challanNumber}`);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.data || "Failed to fetch challan",
      };
    }
  },

  getClearedBills: async () => {
    try {
      const response = await apiClient.get(`/Bill/cleared`);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.data || "Failed to fetch Cleared bills",
      };
    }
  },

  payBill: async (challanNumber) => {
    try {
      const response = await apiClient.post(`/Bill/pay/${challanNumber}`);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.data || "Failed to pay bill",
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

  getUserDashboardData: async () => {
    try {
      console.log("Fetching user dashboard data");
      const response = await apiClient.get("/Dashboard/get");
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.data || "Failed to fetch dashboard data",
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
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.data || "Failed to update user",
        details: error.response?.data,
      };
    }
  },

  logout: async () => {
    try {
      const response = await apiClient.post("/Auth/logout");

      if (response.status === 200) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        console.log("Logout successful, local storage cleared.");
        return { success: true };
      } else {
        console.error("Logout failed on server.");
        return { success: false };
      }
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      return { success: false };
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
        error: error.response?.data?.data || "Failed to fetch cards", //error message from API
      };
    }
  },

  transferMoney: async (transferData) => {
    //reciever id , amount
    try {
      const response = await apiClient.post(`/Transaction/transfer`, transferData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.data || "Failed to transfer money",
      };
    }
  },

  getNames: async () => {
    try {
      const response = await apiClient.get("/Users/getNames");
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.data || "Failed to fetch names",
      };
    }
  },

  getTransactions: async (userId) => {
    try {
      const response = await apiClient.get(`/Transaction/get/${userId}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.data || "Failed to fetch transactions",
      };
    }
  },

  getBalance: async () => {
    try {
      const response = await apiClient.get(`/Users/getBalance`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.data || "Failed to fetch balance",
      };
    }
  },

  addCard: async (cardInfo) => {
    try {
      const response = await apiClient.post(`/Cards/add`, cardInfo);
      return { success: true, data: "Card Added Successfully" || response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to add card",
      };
    }
  },

  updateCard: async (cardInfo) => {
    try {
      const response = await apiClient.put(`/Cards/update/${cardInfo.id}`, cardInfo);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update card",
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
