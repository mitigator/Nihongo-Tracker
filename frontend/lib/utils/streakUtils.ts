/**
 * Streak Utilities — pure functions, no DB calls.
 */

export interface StreakResult {
  currentStreak: number;
  longestStreak: number;
}

/**
 * Given a sorted (desc) array of YYYY-MM-DD date strings,
 * calculate current streak and longest streak.
 */
export function calculateStreaks(sortedDatesDesc: string[]): StreakResult {
  if (!sortedDatesDesc || sortedDatesDesc.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const todayStr = getTodayStr();
  const yesterdayStr = getOffsetDateStr(-1);

  let currentStreak = 0;
  const mostRecent = sortedDatesDesc[0];

  if (mostRecent === todayStr || mostRecent === yesterdayStr) {
    let expected = mostRecent;
    for (const date of sortedDatesDesc) {
      if (date === expected) {
        currentStreak++;
        expected = getPreviousDateStr(expected);
      } else {
        break;
      }
    }
  }

  let longestStreak = 0;
  let runLength = 1;

  for (let i = 0; i < sortedDatesDesc.length; i++) {
    if (i === 0) {
      runLength = 1;
    } else {
      const prev = sortedDatesDesc[i - 1];
      const curr = sortedDatesDesc[i];
      if (getPreviousDateStr(prev) === curr) {
        runLength++;
      } else {
        runLength = 1;
      }
    }
    if (runLength > longestStreak) longestStreak = runLength;
  }

  return { currentStreak, longestStreak };
}

export function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getOffsetDateStr(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function getPreviousDateStr(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}