import axios from "axios";
import type { AuthProvider } from "@refinedev/core";

export const TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";

const API_URL = "https://bluewater-portal.fly.dev";
const axiosInstance = axios.create({ baseURL: API_URL });

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      const { access_token, refresh_token } = response.data;

      localStorage.setItem(TOKEN_KEY, access_token);
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: "LoginError",
          message: error?.response?.data?.detail || "Login failed",
        },
      };
    }
  },

  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return { authenticated: false, redirectTo: "/login" };
    }

    try {
      await axiosInstance.get("/profiles/me");
      return { authenticated: true };
    } catch (error: any) {
      if (error.response?.status === 401) {
        const refresh_token = localStorage.getItem(REFRESH_TOKEN_KEY);
        if (!refresh_token) {
          return { authenticated: false, redirectTo: "/login", logout: true };
        }

        try {
          const res = await axiosInstance.post("/auth/refresh", {
            refresh_token,
          });

          const { access_token } = res.data;
          localStorage.setItem(TOKEN_KEY, access_token);
          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
          return { authenticated: true };
        } catch {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(REFRESH_TOKEN_KEY);
          return { authenticated: false, redirectTo: "/login", logout: true };
        }
      }

      return { authenticated: false, redirectTo: "/login", logout: true };
    }
  },

  register: async (params) => {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        isAdult = true,
        isAdmin = false,
      } = params;

      await axiosInstance.post("/auth/register", {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        is_adult: isAdult,
        is_admin: isAdmin,
      });

      return {
        success: true,
        redirectTo: "/login",
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: "RegisterError",
          message: error?.response?.data?.detail || "Registration failed",
        },
      };
    }
  },

  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    delete axiosInstance.defaults.headers.common["Authorization"];
    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return { authenticated: true };
    }
    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },

  getPermissions: async () => null,

  getIdentity: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {
      const response = await axios.get(`${API_URL}/profiles/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const profile = response.data;
      return {
        id: profile.id,
        name: `${profile.first_name} ${profile.last_name}`,
        email: profile.email,
        avatar: "https://i.pravatar.cc/300",
      };
    } catch {
      return null;
    }
  },

  onError: async (error) => {
    if (error?.response?.status === 401) {
      const refresh_token = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (refresh_token) {
        try {
          const response = await axiosInstance.post("/auth/refresh", {
            refresh_token,
          });

          const { access_token } = response.data;
          localStorage.setItem(TOKEN_KEY, access_token);
          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
          return { error: null };
        } catch {
          return { error };
        }
      }
    }

    return { error };
  },
};
