/**
 * Week Utilities
 *
 * All functions return YYYY-MM-DD strings.
 * Week always starts on Monday (ISO standard).
 */

/**
 * Given any date string or Date object, return the Monday of that week.
 * @param {Date|string} date
 * @returns {string} YYYY-MM-DD of the Monday of that week
 */
const getWeekStart = (date) => {
  const d = date ? new Date(date) : new Date();
  // getUTCDay(): 0=Sun,1=Mon,...,6=Sat
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day; // shift to Monday
  d.setUTCDate(d.getUTCDate() + diff);
  return d.toISOString().slice(0, 10);
};

/**
 * Returns the Monday of the current week.
 * @returns {string} YYYY-MM-DD
 */
const getCurrentWeekStart = () => getWeekStart(new Date());

/**
 * Returns the Sunday (end) of a week given its Monday start.
 * @param {string} weekStartDate YYYY-MM-DD
 * @returns {string} YYYY-MM-DD
 */
const getWeekEnd = (weekStartDate) => {
  const d = new Date(weekStartDate + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + 6);
  return d.toISOString().slice(0, 10);
};

module.exports = { getWeekStart, getCurrentWeekStart, getWeekEnd };