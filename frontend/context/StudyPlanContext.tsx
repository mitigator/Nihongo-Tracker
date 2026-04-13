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
import { StudyPlan, StudyPlanFormData, PlansResponse, ApiError } from "@/types";

interface StudyPlanContextType {
    plans: StudyPlan[];
    loading: boolean;
    fetchPlans: () => Promise<void>;
    fetchPlanById: (id: string) => Promise<StudyPlan | null>;
    createPlan: (data: StudyPlanFormData) => Promise<boolean>;
    updatePlan: (id: string, data: Partial<StudyPlanFormData>) => Promise<boolean>;
    deletePlan: (id: string) => Promise<void>;
}

const StudyPlanContext = createContext<StudyPlanContextType | undefined>(
    undefined
);

export const StudyPlanProvider = ({ children }: { children: ReactNode }) => {
    const [plans, setPlans] = useState<StudyPlan[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchPlans = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.get<PlansResponse>("/api/plans");
            setPlans(data.plans);
        } catch {
            toast.error("Failed to fetch plans");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPlanById = useCallback(
        async (id: string): Promise<StudyPlan | null> => {
            try {
                const { data } = await axiosInstance.get<StudyPlan>(`/api/plans/${id}`);
                return data;
            } catch {
                toast.error("Failed to fetch plan");
                return null;
            }
        },
        []
    );

    const createPlan = async (formData: StudyPlanFormData): Promise<boolean> => {
        try {
            const { data } = await axiosInstance.post<StudyPlan>(
                "/api/plans",
                formData
            );
            setPlans((prev) => [data, ...prev]);
            toast.success("Plan created!");
            return true;
        } catch (error) {
            const err = error as AxiosError<ApiError>;
            const message = err.response?.data?.message || "Failed to create plan";
            toast.error(message);
            return false;
        }
    };

    const updatePlan = async (
        id: string,
        formData: Partial<StudyPlanFormData>
    ): Promise<boolean> => {
        try {
            const { data } = await axiosInstance.put<StudyPlan>(
                `/api/plans/${id}`,
                formData
            );
            setPlans((prev) => prev.map((p) => (p._id === id ? data : p)));
            toast.success("Plan updated!");
            return true;
        } catch (error) {
            const err = error as AxiosError<ApiError>;
            const message = err.response?.data?.message || "Failed to update plan";
            toast.error(message);
            return false;
        }
    };

    const deletePlan = async (id: string): Promise<void> => {
        try {
            await axiosInstance.delete(`/api/plans/${id}`);
            setPlans((prev) => prev.filter((p) => p._id !== id));
            toast.success("Plan deleted");
        } catch {
            toast.error("Failed to delete plan");
        }
    };

    return (
        <StudyPlanContext.Provider
            value={{
                plans,
                loading,
                fetchPlans,
                fetchPlanById,
                createPlan,
                updatePlan,
                deletePlan,
            }}
        >
            {children}
        </StudyPlanContext.Provider>
    );
};

export const useStudyPlanContext = () => {
    const ctx = useContext(StudyPlanContext);
    if (!ctx)
        throw new Error(
            "useStudyPlanContext must be used inside StudyPlanProvider"
        );
    return ctx;
};