import { DailyEntry } from "@/types";

/**
 * Converts DailyEntry array to CSV string and triggers browser download.
 */
export const exportEntriesToCSV = (entries: DailyEntry[]): void => {
  if (entries.length === 0) return;

  const headers = [
    "Date",
    "Vocab Words",
    "Listening (min)",
    "Grammar Points",
    "Notes",
  ];

  const rows = entries.map((e) => [
    e.date,
    e.vocabCount,
    e.listeningMinutes,
    e.grammarCount,
    // Wrap notes in quotes and escape any internal quotes
    `"${e.notes.replace(/"/g, '""')}"`,
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `nihongo-entries-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();

  URL.revokeObjectURL(url);
};