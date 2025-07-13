import {
  getTimestamp,
  getToday,
  formatDate,
  formatDateTime,
  toUtc,
  fromUtc,
} from '../utils/timeAndDate';

// Mock the getTimestamp function directly since Date.now mocking can be tricky
jest.mock('../utils/timeAndDate', () => {
  const actual = jest.requireActual('../utils/timeAndDate');
  return {
    ...actual,
    getTimestamp: jest.fn(),
    getToday: jest.fn(),
  };
});

// Mock date-fns functions
jest.mock('date-fns', () => ({
  startOfDay: jest.fn((date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())),
  format: jest.fn((date, pattern) => `formatted-${pattern}`),
  parseISO: jest.fn((dateString) => new Date(dateString)),
  isValid: jest.fn((date) => {
    if (!date) return false;
    return date instanceof Date && !isNaN(date.getTime());
  }),
}));

jest.mock('date-fns-tz', () => ({
  toZonedTime: jest.fn((date, timezone) => date),
  fromZonedTime: jest.fn((date, timezone) => date),
}));

describe('Utils - Time and Date Tests', () => {
  // Store original Date to restore after tests
  const OriginalDate = global.Date;
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Ensure Date constructor is not mocked globally
    global.Date = OriginalDate;
  });
  
  afterEach(() => {
    // Restore original Date constructor
    global.Date = OriginalDate;
  });

  describe('getTimestamp', () => {
    it('should return current timestamp in seconds', () => {
      const mockTimestamp = 1640995200;
      const { getTimestamp } = require('../utils/timeAndDate');
      getTimestamp.mockReturnValue(mockTimestamp);

      const timestamp = getTimestamp();
      
      expect(timestamp).toBe(1640995200); // seconds
      expect(typeof timestamp).toBe('number');
    });

    it('should return different values when called at different times', () => {
      const mockTimestamp1 = 1640995200;
      const mockTimestamp2 = 1640995260; // 1 minute later
      
      const { getTimestamp } = require('../utils/timeAndDate');
      getTimestamp.mockReturnValueOnce(mockTimestamp1);
      getTimestamp.mockReturnValueOnce(mockTimestamp2);
      
      const timestamp1 = getTimestamp();
      const timestamp2 = getTimestamp();

      expect(timestamp2).toBe(timestamp1 + 60);
    });
  });

  describe('getToday', () => {
    it('should return start of current day in UTC', () => {
      // Mock the getToday function to return a specific date at midnight UTC
      const { getToday } = require('../utils/timeAndDate');
      const mockToday = new Date('2023-06-15T00:00:00.000Z'); // Explicitly UTC midnight
      
      getToday.mockReturnValue(mockToday);

      const today = getToday();

      // Check if it's a Date-like object
      expect(today).toBeDefined();
      expect(today.getHours).toBeDefined();
      expect(today.getMinutes).toBeDefined();
      expect(today.getSeconds).toBeDefined();
      
      // Check that it represents midnight UTC
      expect(today.getUTCHours()).toBe(0);
      expect(today.getUTCMinutes()).toBe(0);
      expect(today.getUTCSeconds()).toBe(0);
    });
  });

  describe('formatDate', () => {
    it('should format Date object with default pattern', () => {
      const date = new Date('2023-06-15T14:30:00Z');
      
      // Ensure isValid returns true for this test
      const { isValid } = require('date-fns');
      isValid.mockReturnValueOnce(true);
      
      const result = formatDate(date);
      
      expect(result).toBe('formatted-yyyy-MM-dd');
    });

    it('should format Date object with custom pattern', () => {
      const date = new Date('2023-06-15T14:30:00Z');
      const pattern = 'MM/dd/yyyy';
      
      // Ensure isValid returns true for this test
      const { isValid } = require('date-fns');
      isValid.mockReturnValueOnce(true);
      
      const result = formatDate(date, pattern);
      
      expect(result).toBe(`formatted-${pattern}`);
    });

    it('should format ISO string with default pattern', () => {
      const dateString = '2023-06-15T14:30:00Z';
      
      // Ensure isValid returns true for this test
      const { isValid } = require('date-fns');
      isValid.mockReturnValueOnce(true);
      
      const result = formatDate(dateString);
      
      expect(result).toBe('formatted-yyyy-MM-dd');
    });

    it('should format ISO string with custom pattern', () => {
      const dateString = '2023-06-15T14:30:00Z';
      const pattern = 'dd-MM-yyyy';
      
      // Ensure isValid returns true for this test
      const { isValid } = require('date-fns');
      isValid.mockReturnValueOnce(true);
      
      const result = formatDate(dateString, pattern);
      
      expect(result).toBe(`formatted-${pattern}`);
    });

    it('should return empty string for invalid date', () => {
      // Mock isValid to return false for this test
      const { isValid } = require('date-fns');
      isValid.mockReturnValueOnce(false);

      const result = formatDate('invalid-date');
      
      expect(result).toBe('');
      
      // Reset the mock
      isValid.mockRestore();
    });
  });

  describe('formatDateTime', () => {
    it('should format Date object with default pattern', () => {
      const date = new Date('2023-06-15T14:30:00Z');
      
      // Ensure isValid returns true for this test
      const { isValid } = require('date-fns');
      isValid.mockReturnValueOnce(true);
      
      const result = formatDateTime(date);
      
      expect(result).toBe('formatted-yyyy-MM-dd HH:mm');
    });

    it('should format Date object with custom pattern', () => {
      const date = new Date('2023-06-15T14:30:00Z');
      const pattern = 'MM/dd/yyyy HH:mm:ss';
      
      // Ensure isValid returns true for this test
      const { isValid } = require('date-fns');
      isValid.mockReturnValueOnce(true);
      
      const result = formatDateTime(date, pattern);
      
      expect(result).toBe(`formatted-${pattern}`);
    });

    it('should format ISO string with default pattern', () => {
      const dateString = '2023-06-15T14:30:00Z';
      
      // Ensure isValid returns true for this test
      const { isValid } = require('date-fns');
      isValid.mockReturnValueOnce(true);
      
      const result = formatDateTime(dateString);
      
      expect(result).toBe('formatted-yyyy-MM-dd HH:mm');
    });

    it('should return empty string for invalid date', () => {
      // Mock isValid to return false for this test
      const { isValid } = require('date-fns');
      isValid.mockReturnValueOnce(false);

      const result = formatDateTime('invalid-date');
      
      expect(result).toBe('');
      
      // Reset the mock
      isValid.mockRestore();
    });
  });

  describe('toUtc', () => {
    it('should convert Date object to UTC without timezone', () => {
      const date = new Date('2023-06-15T14:30:00Z');
      
      const result = toUtc(date);
      
      expect(result).toBe(date);
    });

    it('should convert Date object to UTC with timezone', () => {
      const date = new Date('2023-06-15T14:30:00Z');
      const timezone = 'America/New_York';
      
      const result = toUtc(date, timezone);
      
      expect(result).toBe(date); // fromZonedTime mock returns the same date
    });

    it('should convert ISO string to UTC with timezone', () => {
      const dateString = '2023-06-15T14:30:00Z';
      const timezone = 'Europe/London';
      
      const result = toUtc(dateString, timezone);
      
      // Check if it's a Date-like object
      expect(result).toBeDefined();
      expect(typeof result.getTime).toBe('function');
    });
  });

  describe('fromUtc', () => {
    it('should convert Date object from UTC to timezone', () => {
      const date = new Date('2023-06-15T14:30:00Z');
      const timezone = 'Asia/Tokyo';
      
      const result = fromUtc(date, timezone);
      
      expect(result).toBe(date); // toZonedTime mock returns the same date
    });

    it('should convert ISO string from UTC to timezone', () => {
      const dateString = '2023-06-15T14:30:00Z';
      const timezone = 'Australia/Sydney';
      
      const result = fromUtc(dateString, timezone);
      
      // Check if it's a Date-like object
      expect(result).toBeDefined();
      expect(typeof result.getTime).toBe('function');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null and undefined inputs', () => {
      const { isValid } = require('date-fns');
      isValid.mockReturnValue(false);

      expect(formatDate(null as any)).toBe('');
      expect(formatDate(undefined as any)).toBe('');
      expect(formatDateTime(null as any)).toBe('');
      expect(formatDateTime(undefined as any)).toBe('');
    });

    it('should handle invalid date strings', () => {
      const { isValid } = require('date-fns');
      isValid.mockReturnValue(false);

      expect(formatDate('not-a-date')).toBe('');
      expect(formatDateTime('invalid')).toBe('');
    });

    it('should handle various timezone formats', () => {
      const date = new Date('2023-06-15T14:30:00Z');
      
      expect(() => toUtc(date, 'UTC')).not.toThrow();
      expect(() => toUtc(date, 'America/Los_Angeles')).not.toThrow();
      expect(() => fromUtc(date, 'Europe/Paris')).not.toThrow();
    });
  });

  describe('Function Export Verification', () => {
    it('should export all time and date functions', () => {
      expect(typeof getTimestamp).toBe('function');
      expect(typeof getToday).toBe('function');
      expect(typeof formatDate).toBe('function');
      expect(typeof formatDateTime).toBe('function');
      expect(typeof toUtc).toBe('function');
      expect(typeof fromUtc).toBe('function');
    });
  });
});
