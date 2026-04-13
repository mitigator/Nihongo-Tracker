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
import { MockTest, MockTestFormData, MockTestsResponse, ApiError } from "@/types";

interface MockTestContextType {
    tests: MockTest[];
    stats: {
        count: number;
        passed: number;
        failed: number;
        avgScore: number;
        bestScore: number;
    };
    loading: boolean;
    fetchTests: () => Promise<void>;
    createTest: (data: MockTestFormData) => Promise<boolean>;
    deleteTest: (id: string) => Promise<void>;
}

const MockTestContext = createContext<MockTestContextType | undefined>(undefined);

const defaultStats = {
    count: 0,
    passed: 0,
    failed: 0,
    avgScore: 0,
    bestScore: 0,
};

export const MockTestProvider = ({ children }: { children: ReactNode }) => {
    const [tests, setTests] = useState<MockTest[]>([]);
    const [stats, setStats] = useState(defaultStats);
    const [loading, setLoading] = useState(false);

    const fetchTests = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.get<MockTestsResponse>("/api/tests");
            setTests(data.tests);
            setStats({
                count: data.count,
                passed: data.passed,
                failed: data.failed,
                avgScore: data.avgScore,
                bestScore: data.bestScore,
            });
        } catch {
            toast.error("Failed to fetch tests");
        } finally {
            setLoading(false);
        }
    }, []);

    const createTest = async (formData: MockTestFormData): Promise<boolean> => {
        try {
            const { data } = await axiosInstance.post<MockTest>("/api/tests", formData);
            setTests((prev) => [data, ...prev]);
            // Refetch to get updated stats
            await fetchTests();
            toast.success("Test logged!");
            return true;
        } catch (error) {
            const err = error as AxiosError<ApiError>;
            const message = err.response?.data?.message || "Failed to log test";
            toast.error(message);
            return false;
        }
    };

    const deleteTest = async (id: string): Promise<void> => {
        try {
            await axiosInstance.delete(`/api/tests/${id}`);
            setTests((prev) => prev.filter((t) => t._id !== id));
            await fetchTests(); // refetch to recalculate stats
            toast.success("Test deleted");
        } catch {
            toast.error("Failed to delete test");
        }
    };

    return (
        <MockTestContext.Provider
            value={{ tests, stats, loading, fetchTests, createTest, deleteTest }}
        >
            {children}
        </MockTestContext.Provider>
    );
};

export const useMockTestContext = () => {
    const ctx = useContext(MockTestContext);
    if (!ctx)
        throw new Error("useMockTestContext must be used inside MockTestProvider");
    return ctx;
};