/**
 * Format a UTC Date as Pacific Time for display.
 * Ranchita is in the America/Los_Angeles timezone.
 */

export function formatPacific(date: Date, options?: Intl.DateTimeFormatOptions): string {
  return date.toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    ...options,
  });
}

/** e.g. "12:30 PM" */
export function formatPacificTime(date: Date): string {
  return formatPacific(date, { hour: 'numeric', minute: '2-digit', hour12: true });
}

/** e.g. "Tuesday, April 14, 2026 · 12:30 PM" */
export function formatPacificFull(date: Date): string {
  return formatPacific(date, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/** e.g. "Tuesday, 12:30 PM" */
export function formatPacificShort(date: Date): string {
  return formatPacific(date, {
    weekday: 'long',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/** e.g. "Apr 14" */
export function formatPacificMonthDay(date: Date): { month: string; day: string } {
  const month = formatPacific(date, { month: 'short' });
  const day = formatPacific(date, { day: 'numeric' });
  return { month, day };
}
