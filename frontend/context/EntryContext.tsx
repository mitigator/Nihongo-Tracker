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
import { DailyEntry, EntryFormData, EntriesResponse, ApiError } from "@/types";

interface EntryContextType {
    entries: DailyEntry[];
    currentStreak: number;
    longestStreak: number;
    loading: boolean;
    fetchEntries: (startDate?: string, endDate?: string) => Promise<void>;
    createEntry: (data: EntryFormData) => Promise<boolean>;
    updateEntry: (id: string, data: Partial<EntryFormData>) => Promise<boolean>;
    deleteEntry: (id: string) => Promise<void>;
}

const EntryContext = createContext<EntryContextType | undefined>(undefined);

export const EntryProvider = ({ children }: { children: ReactNode }) => {
    const [entries, setEntries] = useState<DailyEntry[]>([]);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchEntries = useCallback(
        async (startDate?: string, endDate?: string) => {
            setLoading(true);
            try {
                const params: Record<string, string> = {};
                if (startDate) params.startDate = startDate;
                if (endDate) params.endDate = endDate;

                const { data } = await axiosInstance.get<EntriesResponse>(
                    "/api/entries",
                    { params }
                );
                setEntries(data.entries);
                setCurrentStreak(data.currentStreak);
                setLongestStreak(data.longestStreak);
            } catch {
                toast.error("Failed to fetch entries");
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const createEntry = async (formData: EntryFormData): Promise<boolean> => {
        try {
            const { data } = await axiosInstance.post<DailyEntry>(
                "/api/entries",
                formData
            );
            // Prepend and re-sort desc by date
            setEntries((prev) =>
                [data, ...prev].sort((a, b) => (a.date < b.date ? 1 : -1))
            );
            toast.success("Entry saved!");
            return true;
        } catch (error) {
            const err = error as AxiosError<ApiError>;
            const message = err.response?.data?.message || "Failed to create entry";
            toast.error(message);
            return false;
        }
    };

    const updateEntry = async (
        id: string,
        formData: Partial<EntryFormData>
    ): Promise<boolean> => {
        try {
            const { data } = await axiosInstance.put<DailyEntry>(
                `/api/entries/${id}`,
                formData
            );
            setEntries((prev) => prev.map((e) => (e._id === id ? data : e)));
            toast.success("Entry updated!");
            return true;
        } catch (error) {
            const err = error as AxiosError<ApiError>;
            const message = err.response?.data?.message || "Failed to update entry";
            toast.error(message);
            return false;
        }
    };

    const deleteEntry = async (id: string): Promise<void> => {
        try {
            await axiosInstance.delete(`/api/entries/${id}`);
            setEntries((prev) => prev.filter((e) => e._id !== id));
            toast.success("Entry deleted");
        } catch {
            toast.error("Failed to delete entry");
        }
    };

    return (
        <EntryContext.Provider
            value={{
                entries,
                currentStreak,
                longestStreak,
                loading,
                fetchEntries,
                createEntry,
                updateEntry,
                deleteEntry,
            }}
        >
            {children}
        </EntryContext.Provider>
    );
};

export const useEntryContext = () => {
    const ctx = useContext(EntryContext);
    if (!ctx) throw new Error("useEntryContext must be used inside EntryProvider");
    return ctx;
};