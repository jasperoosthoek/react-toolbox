import { startOfDay, format, parseISO, isValid } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

export const getTimestamp = () => Math.round(new Date().getTime() / 1000);

export const getToday = () => {
  const now = new Date();
  const utcDate = toZonedTime(now, 'UTC');
  return startOfDay(utcDate);
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
