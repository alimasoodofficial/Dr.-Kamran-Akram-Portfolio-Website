/**
 * Australian Eastern Time formatting utilities
 * All times in this app are in Australia/Sydney timezone
 */

const TIMEZONE = 'Australia/Sydney';

/**
 * Format a UTC date string as time in Australian Eastern Time
 * e.g. "6:00 PM"
 */
export function formatTimeAEST(dateString: string): string {
  return new Date(dateString).toLocaleString('en-AU', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: TIMEZONE,
  });
}

/**
 * Format a UTC date string as a full date in Australian Eastern Time
 * e.g. "February 15, 2026"
 */
export function formatDateAEST(dateString: string): string {
  return new Date(dateString).toLocaleString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: TIMEZONE,
  });
}

/**
 * Format a UTC date string as short date in Australian Eastern Time
 * e.g. "Feb 15, 2026"
 */
export function formatShortDateAEST(dateString: string): string {
  return new Date(dateString).toLocaleString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: TIMEZONE,
  });
}

/**
 * Format a UTC date string as day name in Australian Eastern Time
 * e.g. "Saturday"
 */
export function formatDayAEST(dateString: string): string {
  return new Date(dateString).toLocaleString('en-AU', {
    weekday: 'long',
    timeZone: TIMEZONE,
  });
}

/**
 * Format a UTC date string as full date + time in Australian Eastern Time
 * e.g. "Saturday, February 15, 2026 at 6:00 PM"
 */
export function formatFullDateTimeAEST(dateString: string): string {
  return new Date(dateString).toLocaleString('en-AU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: TIMEZONE,
  });
}

/**
 * Get the start and end of a given date in Australian Eastern Time (as UTC ISO strings).
 * Used for querying slots by Australian date.
 */
export function getAESTDayRange(dateStr: string): { start: string; end: string } {
  // Create the start of day in AEST: dateStr + "T00:00:00" in Australia/Sydney
  // We need to figure out the UTC equivalent of midnight AEST on that date
  
  // Parse the date parts
  const [year, month, day] = dateStr.split('-').map(Number);
  
  // Create a date formatter that can tell us the UTC offset for AEST on that date
  const formatter = new Intl.DateTimeFormat('en-AU', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  // Approximate: AEST is UTC+10 or UTC+11 (AEDT)
  // Create midnight AEST by trying UTC-11 (worst case) and checking
  // A simpler approach: construct the timestamp as if it's in AEST
  const startAEST = new Date(`${dateStr}T00:00:00+11:00`); // AEDT (summer)
  const endAEST = new Date(`${dateStr}T23:59:59+11:00`);
  
  // Check if we're in AEDT or AEST by looking at the formatted date
  // For robustness, we'll use a wider range (UTC+10 to UTC+11)
  const startConservative = new Date(`${dateStr}T00:00:00+11:00`); // Earlier in UTC
  const endConservative = new Date(`${dateStr}T23:59:59+10:00`); // Later in UTC
  
  return {
    start: startConservative.toISOString(),
    end: endConservative.toISOString(),
  };
}
