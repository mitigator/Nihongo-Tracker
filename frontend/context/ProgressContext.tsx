"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
} from "react";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import { ProgressSummary } from "@/types";

interface ProgressContextType {
    summary: ProgressSummary | null;
    loading: boolean;
    fetchSummary: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
    const [summary, setSummary] = useState<ProgressSummary | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchSummary = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.get<ProgressSummary>(
                "/api/progress/summary"
            );
            setSummary(data);
        } catch {
            toast.error("Failed to fetch progress summary");
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <ProgressContext.Provider value={{ summary, loading, fetchSummary }}>
            {children}
        </ProgressContext.Provider>
    );
};

export const useProgressContext = () => {
    const ctx = useContext(ProgressContext);
    if (!ctx)
        throw new Error("useProgressContext must be used inside ProgressProvider");
    return ctx;
};