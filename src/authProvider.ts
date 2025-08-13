import axios from "axios";
import type { AuthProvider } from "@refinedev/core";
import { IUser } from "./interfaces";

export const TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";
export const USER_KEY = "user";

const API_URL = "https://bluewater-portal.fly.dev";
const axiosInstance = axios.create({ baseURL: API_URL });

// --- Caching Strategy ---
// In-memory cache for the user's identity, populated from localStorage.
let userCache: IUser | null = null;

// Axios interceptor to add the token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token && !config.headers["Authorization"]) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

/**
 * Helper function to get user identity from cache or localStorage.
 * This avoids self-referencing within the authProvider object.
 */
const getIdentityHelper = async (): Promise<IUser | null> => {
  // 1. Check if the in-memory cache exists.
  if (userCache) {
    return userCache;
  }

  // 2. If not, check localStorage.
  const storedUser = localStorage.getItem(USER_KEY);
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      // 3. Populate cache and return user.
      userCache = user;
      return userCache;
    } catch (e) {
      // If parsing fails, clear broken data.
      localStorage.removeItem(USER_KEY);
      return null;
    }
  }

  // 4. If no user data is found anywhere, return null.
  return null;
};


export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      const { access_token, refresh_token } = response.data;

      // Clear any old cache on new login
      userCache = null;

      localStorage.setItem(TOKEN_KEY, access_token);
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);

      // After login, fetch user profile and store it
      const { data: profile } = await axiosInstance.get("/profiles/me", {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      const user: IUser = {
        id: profile.id,
        name: `${profile.first_name} ${profile.last_name}`,
        email: profile.email,
        is_adult: profile.is_adult,
        is_admin: profile.is_admin,
        avatar: `https://i.pravatar.cc/300?u=${profile.id}`,
      };

      // Store user data in localStorage and in-memory cache
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      userCache = user;

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
    const refresh_token = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (!token && refresh_token) {
      try {
        const { data } = await axios.post(`${API_URL}/auth/refresh`, { refresh_token });
        localStorage.setItem(TOKEN_KEY, data.access_token);
      } catch {
        return { authenticated: false, redirectTo: "/login" };
      }
    }

    const identity = await getIdentityHelper();
    return identity
      ? { authenticated: true }
      : { authenticated: false, redirectTo: "/login" };
  },

  logout: async () => {
    // Clear the cache and all user-related data from localStorage
    userCache = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return {
      success: true,
      redirectTo: "/login",
    };
  },

  getPermissions: async () => {
    // Call the helper function directly
    const identity = await getIdentityHelper();
    if (identity) {
      const permissions = [];
      if (identity.is_admin) {
        permissions.push("admin");
      }
      return permissions;
    }
    return null;
  },

  getIdentity: async (): Promise<IUser | null> => {
    // The public getIdentity method now just calls the helper
    return getIdentityHelper();
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

  onError: async (error: any) => {
    if (error?.response?.status === 401) {
      const refresh_token = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (refresh_token) {
        try {
          const response = await axiosInstance.post("/auth/refresh", {
            refresh_token,
          });

          const { access_token } = response.data;
          localStorage.setItem(TOKEN_KEY, access_token);

          return {}; // Retry the original request
        } catch (refreshError) {
          // If refresh fails, logout the user completely
          userCache = null;
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(REFRESH_TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          return {
            logout: true,
            redirectTo: "/login",
            error,
          };
        }
      }
    }

    return { error };
  },
};
