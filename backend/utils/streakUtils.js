/**
 * Streak Utilities
 *
 * Works on arrays of YYYY-MM-DD date strings.
 * All functions are pure — no DB calls, easy to unit test.
 */

/**
 * Given a sorted (desc) array of date strings the user has entries for,
 * calculate current streak and longest streak.
 *
 * Rules:
 *  - A streak is a consecutive sequence of calendar days with an entry.
 *  - Today counts toward the streak even if the entry was just created.
 *  - If the most recent entry is yesterday, the streak is still alive.
 *  - A gap of 2+ days breaks the streak.
 *
 * @param {string[]} sortedDatesDesc - e.g. ["2024-06-10","2024-06-09","2024-06-07"]
 * @returns {{ currentStreak: number, longestStreak: number }}
 */
const calculateStreaks = (sortedDatesDesc) => {
  if (!sortedDatesDesc || sortedDatesDesc.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const todayStr = getTodayStr();
  const yesterdayStr = getOffsetDateStr(-1);

  // Current streak — walk backwards from today/yesterday
  let currentStreak = 0;
  const mostRecent = sortedDatesDesc[0];

  if (mostRecent === todayStr || mostRecent === yesterdayStr) {
    // Start counting from the most recent entry
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

  // Longest streak — full pass over all dates
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
};

/**
 * Returns today's date as YYYY-MM-DD in local server time.
 */
const getTodayStr = () => {
  return new Date().toISOString().slice(0, 10);
};

/**
 * Returns a date string offset by `days` from today.
 * @param {number} days - negative for past, positive for future
 */
const getOffsetDateStr = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

/**
 * Given a YYYY-MM-DD string, returns the previous day as YYYY-MM-DD.
 * @param {string} dateStr
 */
const getPreviousDateStr = (dateStr) => {
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
};

module.exports = { calculateStreaks, getTodayStr, getOffsetDateStr };