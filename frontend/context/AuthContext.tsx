"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import {
  User,
  LoginCredentials,
  RegisterCredentials,
  ApiError,
} from "@/types";
import { AxiosError } from "axios";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Rehydrate user from cookie on page refresh
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axiosInstance.get<User>("/api/auth/me");
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const register = async (credentials: RegisterCredentials) => {
    try {
      const { data } = await axiosInstance.post<User>(
        "/api/auth/register",
        credentials
      );
      setUser(data);
      toast.success("Account created successfully");
      router.push("/dashboard");
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      const message =
        err.response?.data?.message || "Registration failed. Try again.";
      toast.error(message);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const { data } = await axiosInstance.post<User>(
        "/api/auth/login",
        credentials
      );
      setUser(data);
      toast.success("Logged in successfully");
      router.push("/dashboard");
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      const message =
        err.response?.data?.message || "Login failed. Try again.";
      toast.error(message);
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
      setUser(null);
      toast.success("Logged out successfully");
      router.push("/login");
    } catch {
      toast.error("Logout failed. Try again.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };