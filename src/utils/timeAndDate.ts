import { startOfDay, format, parseISO, isValid } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

export const getTimestamp = () => Math.round(new Date().getTime() / 1000);

/**
 * Today's date in UTC, as a Date at local midnight of that day: `format(getToday(), 'yyyy-MM-dd')` gives the UTC date
 * in every time zone. It is not UTC midnight (00:00:00.000Z) unless the host runs in UTC.
 */
export const getToday = () => {
  return startOfDay(
    toZonedTime(
      new Date(),
      'UTC'
    )
  );
};

// Common date formatting utilities
export const formatDate = (date: Date | string, pattern: string = 'yyyy-MM-dd') => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isValid(dateObj) ? format(dateObj, pattern) : '';
};

export const formatDateTime = (date: Date | string, pattern: string = 'yyyy-MM-dd HH:mm') => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isValid(dateObj) ? format(dateObj, pattern) : '';
};

// Convert local date to UTC
export const toUtc = (date: Date | string, timezone?: string) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return timezone ? fromZonedTime(dateObj, timezone) : dateObj;
};

// Convert UTC date to local timezone
export const fromUtc = (date: Date | string, timezone: string) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return toZonedTime(dateObj, timezone);
};
