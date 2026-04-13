"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
} from "react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import axiosInstance from "@/lib/axios";
import {
    WeeklyGoal,
    GoalFormData,
    GoalsResponse,
    ApiError,
} from "@/types";

interface GoalContextType {
    goals: WeeklyGoal[];
    currentGoal: WeeklyGoal | null;
    loading: boolean;
    fetchGoals: () => Promise<void>;
    fetchCurrentGoal: () => Promise<void>;
    upsertGoal: (data: GoalFormData) => Promise<boolean>;
    deleteGoal: (id: string) => Promise<void>;
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const GoalProvider = ({ children }: { children: ReactNode }) => {
    const [goals, setGoals] = useState<WeeklyGoal[]>([]);
    const [currentGoal, setCurrentGoal] = useState<WeeklyGoal | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchGoals = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.get<GoalsResponse>("/api/goals");
            setGoals(data.goals);
        } catch {
            toast.error("Failed to fetch goals");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCurrentGoal = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.get<WeeklyGoal>("/api/goals/current");
            setCurrentGoal(data);
        } catch (error) {
            const err = error as AxiosError<ApiError>;
            // 404 just means no goal set yet — not an error worth toasting
            if (err.response?.status !== 404) {
                toast.error("Failed to fetch current goal");
            }
            setCurrentGoal(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const upsertGoal = async (formData: GoalFormData): Promise<boolean> => {
        try {
            const { data } = await axiosInstance.post<WeeklyGoal>(
                "/api/goals",
                formData
            );
            // Update currentGoal if this upsert is for the current week
            setCurrentGoal(data);
            // Also sync into the goals list
            setGoals((prev) => {
                const exists = prev.find((g) => g._id === data._id);
                if (exists) return prev.map((g) => (g._id === data._id ? data : g));
                return [data, ...prev];
            });
            toast.success("Goals saved!");
            return true;
        } catch (error) {
            const err = error as AxiosError<ApiError>;
            const message = err.response?.data?.message || "Failed to save goals";
            toast.error(message);
            return false;
        }
    };

    const deleteGoal = async (id: string): Promise<void> => {
        try {
            await axiosInstance.delete(`/api/goals/${id}`);
            setGoals((prev) => prev.filter((g) => g._id !== id));
            if (currentGoal?._id === id) setCurrentGoal(null);
            toast.success("Goal deleted");
        } catch {
            toast.error("Failed to delete goal");
        }
    };

    return (
        <GoalContext.Provider
            value={{
                goals,
                currentGoal,
                loading,
                fetchGoals,
                fetchCurrentGoal,
                upsertGoal,
                deleteGoal,
            }}
        >
            {children}
        </GoalContext.Provider>
    );
};

export const useGoalContext = () => {
    const ctx = useContext(GoalContext);
    if (!ctx) throw new Error("useGoalContext must be used inside GoalProvider");
    return ctx;
};