import { useEntryContext } from "@/context/EntryContext";

// Thin re-export — keeps component imports clean
// Usage: const { entries, loading, fetchEntries } = useEntries();
const useEntries = () => useEntryContext();

export default useEntries;