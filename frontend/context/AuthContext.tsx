"use client";

import {
  createContext,
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
  // Step 1: send OTP — returns true on success so the form can advance to OTP screen
  requestOtp: (credentials: RegisterCredentials) => Promise<boolean>;
  // Step 2: verify OTP and create account
  verifyOtpAndRegister: (email: string, otp: string) => Promise<void>;
  // Resend OTP (calls same endpoint as requestOtp but with stored credentials)
  resendOtp: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

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

  // ── Step 1: Request OTP ───────────────────────────────────
  const requestOtp = async (credentials: RegisterCredentials): Promise<boolean> => {
    try {
      await axiosInstance.post("/api/auth/send-otp", credentials);
      toast.success("Verification code sent to your email!");
      return true;
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      const message = err.response?.data?.message || "Failed to send OTP. Try again.";
      toast.error(message);
      return false;
    }
  };

  // ── Step 2: Verify OTP and create account ────────────────
  const verifyOtpAndRegister = async (email: string, otp: string): Promise<void> => {
    try {
      const { data } = await axiosInstance.post<User>("/api/auth/verify-otp", {
        email,
        otp,
      });
      setUser(data);
      toast.success("Account created! Welcome to Nihongo Tracker 🎉");
      router.replace("/dashboard");
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      const message = err.response?.data?.message || "Verification failed. Try again.";
      toast.error(message);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────
  const resendOtp = async (credentials: RegisterCredentials): Promise<void> => {
    try {
      await axiosInstance.post("/api/auth/send-otp", credentials);
      toast.success("New code sent!");
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      const message = err.response?.data?.message || "Failed to resend OTP.";
      toast.error(message);
    }
  };

  // ── Login ─────────────────────────────────────────────────
  const login = async (credentials: LoginCredentials) => {
    try {
      const { data } = await axiosInstance.post<User>("/api/auth/login", credentials);
      setUser(data);
      router.replace("/dashboard");
      toast.success("Logged in successfully");
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      const message = err.response?.data?.message || "Login failed. Try again.";
      toast.error(message);
    }
  };

  // ── Logout ────────────────────────────────────────────────
  const logout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
      setUser(null);
      toast.success("Logged out successfully");
      router.replace("/login");
    } catch {
      toast.error("Logout failed. Try again.");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, requestOtp, verifyOtpAndRegister, resendOtp, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };