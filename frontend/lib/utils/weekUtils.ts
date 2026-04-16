/**
 * Week Utilities — ISO week, always starts Monday.
 */

export function getWeekStart(date?: Date | string): string {
  const d = date ? new Date(date) : new Date();
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diff);
  return d.toISOString().slice(0, 10);
}

export function getCurrentWeekStart(): string {
  return getWeekStart(new Date());
}

export function getWeekEnd(weekStartDate: string): string {
  const d = new Date(weekStartDate + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + 6);
  return d.toISOString().slice(0, 10);
}