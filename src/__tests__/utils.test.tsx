import {
  isEmpty,
  snakeToCamelCase,
  camelToSnakeCase,
  pluralToSingle,
  arrayToObject,
  roundFixed,
  round,
  downloadFile,
} from '../utils/utils';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock DOM APIs
Object.defineProperty(window, 'URL', {
  value: {
    createObjectURL: jest.fn(() => 'mock-blob-url'),
    revokeObjectURL: jest.fn(),
  },
});

describe('Utils - General Utilities Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isEmpty', () => {
    it('should return true for undefined', () => {
      expect(isEmpty(undefined)).toBe(true);
    });

    it('should return true for null', () => {
      expect(isEmpty(null)).toBe(true);
    });

    it('should return true for false', () => {
      expect(isEmpty(false)).toBe(true);
    });

    it('should return true for empty object', () => {
      expect(isEmpty({})).toBe(true);
    });

    it('should return true for empty string', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true); // whitespace only
    });

    it('should return false for non-empty values', () => {
      expect(isEmpty(0)).toBe(false);
      expect(isEmpty(true)).toBe(false);
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty('0')).toBe(false);
      expect(isEmpty({ key: 'value' })).toBe(false);
      expect(isEmpty([1, 2, 3])).toBe(false);
      expect(isEmpty([])).toBe(true); // empty array should be considered empty
    });

    it('should handle edge cases', () => {
      expect(isEmpty(0)).toBe(false);
      expect(isEmpty(-1)).toBe(false);
      expect(isEmpty(NaN)).toBe(false);
      expect(isEmpty(Infinity)).toBe(false);
    });
  });

  describe('snakeToCamelCase', () => {
    it('should convert snake_case to camelCase', () => {
      expect(snakeToCamelCase('snake_case')).toBe('snakeCase');
      expect(snakeToCamelCase('multiple_word_example')).toBe('multipleWordExample');
    });

    it('should convert kebab-case to camelCase', () => {
      expect(snakeToCamelCase('kebab-case')).toBe('kebabCase');
      expect(snakeToCamelCase('multiple-word-example')).toBe('multipleWordExample');
    });

    it('should handle mixed cases', () => {
      expect(snakeToCamelCase('mixed_case-example')).toBe('mixedCaseExample');
    });

    it('should handle single words', () => {
      expect(snakeToCamelCase('word')).toBe('word');
    });

    it('should handle empty string', () => {
      expect(snakeToCamelCase('')).toBe('');
    });

    it('should preserve already camelCase strings', () => {
      expect(snakeToCamelCase('alreadyCamelCase')).toBe('alreadyCamelCase');
    });
  });

  describe('camelToSnakeCase', () => {
    it('should convert camelCase to SNAKE_CASE', () => {
      expect(camelToSnakeCase('camelCase')).toBe('CAMEL_CASE');
      expect(camelToSnakeCase('multipleWordExample')).toBe('MULTIPLE_WORD_EXAMPLE');
    });

    it('should handle single words', () => {
      expect(camelToSnakeCase('word')).toBe('WORD');
    });

    it('should handle empty string', () => {
      expect(camelToSnakeCase('')).toBe('');
    });

    it('should handle already uppercase strings', () => {
      expect(camelToSnakeCase('ALREADY_UPPER')).toBe('ALREADY_UPPER');
    });

    it('should handle strings with numbers', () => {
      expect(camelToSnakeCase('test123')).toBe('TEST_123');
      expect(camelToSnakeCase('test123Word')).toBe('TEST_123_WORD');
    });
  });

  describe('pluralToSingle', () => {
    it('should convert standard plurals to singular', () => {
      expect(pluralToSingle('cats')).toBe('cat');
      expect(pluralToSingle('dogs')).toBe('dog');
      expect(pluralToSingle('items')).toBe('item');
    });

    it('should handle words ending in "ies"', () => {
      expect(pluralToSingle('categories')).toBe('category');
      expect(pluralToSingle('stories')).toBe('story');
      expect(pluralToSingle('companies')).toBe('company');
    });

    it('should handle uppercase "IES"', () => {
      expect(pluralToSingle('CATEGORIES')).toBe('CATEGORY');
      expect(pluralToSingle('STORIES')).toBe('STORY');
    });

    it('should leave non-plural words unchanged', () => {
      expect(pluralToSingle('cat')).toBe('cat');
      expect(pluralToSingle('item')).toBe('item');
      expect(pluralToSingle('mouse')).toBe('mouse');
    });

    it('should handle edge cases', () => {
      expect(pluralToSingle('')).toBe('');
      expect(pluralToSingle('s')).toBe('');
      expect(pluralToSingle('ies')).toBe('y');
      expect(pluralToSingle('IES')).toBe('Y'); // now works correctly
    });
  });

  describe('arrayToObject', () => {
    it('should convert array to object using specified key', () => {
      const array = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ];

      const result = arrayToObject(array, 'id');

      expect(result).toEqual({
        1: { id: 1, name: 'Alice' },
        2: { id: 2, name: 'Bob' },
        3: { id: 3, name: 'Charlie' },
      });
    });

    it('should work with string keys', () => {
      const array = [
        { code: 'US', name: 'United States' },
        { code: 'CA', name: 'Canada' },
        { code: 'MX', name: 'Mexico' },
      ];

      const result = arrayToObject(array, 'code');

      expect(result).toEqual({
        US: { code: 'US', name: 'United States' },
        CA: { code: 'CA', name: 'Canada' },
        MX: { code: 'MX', name: 'Mexico' },
      });
    });

    it('should handle empty array', () => {
      const result = arrayToObject([], 'id');
      expect(result).toEqual({});
    });

    it('should handle duplicate keys (last one wins)', () => {
      const array = [
        { id: 1, name: 'First' },
        { id: 1, name: 'Second' },
      ];

      const result = arrayToObject(array, 'id');

      expect(result).toEqual({
        1: { id: 1, name: 'Second' },
      });
    });
  });

  describe('roundFixed', () => {
    it('should round numbers to specified decimal places as string', () => {
      expect(roundFixed(3.14159, 2)).toBe('3.14');
      expect(roundFixed(3.14159, 0)).toBe('3');
      expect(roundFixed(3.14159, 4)).toBe('3.1416');
    });

    it('should handle string input', () => {
      expect(roundFixed('3.14159', 2)).toBe('3.14');
      expect(roundFixed('10', 2)).toBe('10.00');
    });

    it('should use 0 decimals as default', () => {
      expect(roundFixed(3.14159)).toBe('3');
      expect(roundFixed(3.9)).toBe('4');
    });

    it('should handle negative numbers', () => {
      expect(roundFixed(-3.14159, 2)).toBe('-3.14');
      expect(roundFixed(-3.9)).toBe('-4');
    });

    it('should handle zero', () => {
      expect(roundFixed(0, 2)).toBe('0.00');
      expect(roundFixed('0', 3)).toBe('0.000');
    });
  });

  describe('round', () => {
    it('should round numbers to specified decimal places as number', () => {
      expect(round(3.14159, 2)).toBe(3.14);
      expect(round(3.14159, 0)).toBe(3);
      expect(round(3.14159, 4)).toBe(3.1416);
    });

    it('should handle string input', () => {
      expect(round('3.14159', 2)).toBe(3.14);
      expect(round('10', 2)).toBe(10);
    });

    it('should use 0 decimals as default', () => {
      expect(round(3.14159)).toBe(3);
      expect(round(3.9)).toBe(4);
    });

    it('should handle negative numbers', () => {
      expect(round(-3.14159, 2)).toBe(-3.14);
      expect(round(-3.9)).toBe(-4);
    });

    it('should handle zero', () => {
      expect(round(0, 2)).toBe(0);
      expect(round('0', 3)).toBe(0);
    });

    it('should return number type not string', () => {
      const result = round(3.14159, 2);
      expect(typeof result).toBe('number');
      expect(result).toBe(3.14);
    });
  });

  describe('downloadFile', () => {
    let mockLink: any;
    let createElementSpy: jest.SpyInstance;
    let appendChildSpy: jest.SpyInstance;
    let removeChildSpy: jest.SpyInstance;

    beforeEach(() => {
      mockLink = {
        href: '',
        setAttribute: jest.fn(),
        click: jest.fn(),
      };

      createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(mockLink);
      appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementation();
      removeChildSpy = jest.spyOn(document.body, 'removeChild').mockImplementation();
      
      // Mock successful fetch response
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        blob: () => Promise.resolve(new Blob(['test content'], { type: 'text/plain' })),
      });
    });

    afterEach(() => {
      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
      mockFetch.mockClear();
    });

    it('should download file using default fetch', async () => {
      await downloadFile('http://example.com/file.txt', 'download.txt');

      expect(mockFetch).toHaveBeenCalledWith('http://example.com/file.txt', {
        method: 'GET',
        headers: {},
      });

      expect(window.URL.createObjectURL).toHaveBeenCalled();
      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(mockLink.setAttribute).toHaveBeenCalledWith('download', 'download.txt');
      expect(appendChildSpy).toHaveBeenCalledWith(mockLink);
      expect(mockLink.click).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalledWith(mockLink);
      expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('mock-blob-url');
    });

    it('should download file using custom fetch function', async () => {
      const customFetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        blob: () => Promise.resolve(new Blob(['custom content'], { type: 'text/plain' })),
      });

      await downloadFile('http://example.com/file.txt', 'download.txt', {
        fetchFn: customFetch
      });

      expect(customFetch).toHaveBeenCalledWith('http://example.com/file.txt', {
        method: 'GET',
        headers: {},
      });
    });

    it('should set correct href and download attributes', async () => {
      await downloadFile('http://example.com/test.pdf', 'my-file.pdf');

      expect(mockLink.href).toBe('mock-blob-url');
      expect(mockLink.setAttribute).toHaveBeenCalledWith('download', 'my-file.pdf');
    });

    it('should handle fetch errors', async () => {
      const error = new Error('Network error');
      mockFetch.mockRejectedValue(error);

      await expect(
        downloadFile('http://example.com/file.txt', 'download.txt')
      ).rejects.toThrow('Network error');
    });

    it('should create blob URL and trigger download', async () => {
      const mockBlob = new Blob(['test content'], { type: 'application/pdf' });
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        blob: () => Promise.resolve(mockBlob),
      });

      await downloadFile('http://example.com/document.pdf', 'document.pdf');

      expect(window.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
      expect(mockLink.href).toBe('mock-blob-url');
      expect(mockLink.click).toHaveBeenCalled();
    });

    it('should handle HTTP errors', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        blob: () => Promise.resolve(new Blob()),
      });

      await expect(
        downloadFile('http://example.com/file.txt', 'download.txt')
      ).rejects.toThrow('HTTP error! status: 404');
    });

    it('should use custom headers when provided', async () => {
      await downloadFile('http://example.com/file.txt', 'download.txt', {
        headers: { 'Authorization': 'Bearer token123' }
      });

      expect(mockFetch).toHaveBeenCalledWith('http://example.com/file.txt', {
        method: 'GET',
        headers: { 'Authorization': 'Bearer token123' },
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle null and undefined inputs gracefully', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      
      expect(snakeToCamelCase('')).toBe('');
      expect(camelToSnakeCase('')).toBe('');
      expect(pluralToSingle('')).toBe('');
    });

    it('should handle special characters in string conversions', () => {
      expect(snakeToCamelCase('test_with_123')).toBe('testWith123');
      expect(snakeToCamelCase('test-with-special')).toBe('testWithSpecial');
      expect(camelToSnakeCase('testWith123')).toBe('TEST_WITH_123');
    });

    it('should handle floating point precision', () => {
      expect(round(0.1 + 0.2, 1)).toBe(0.3);
      expect(roundFixed(0.1 + 0.2, 1)).toBe('0.3');
    });
  });

  describe('Function Export Verification', () => {
    it('should export all utility functions', () => {
      expect(typeof isEmpty).toBe('function');
      expect(typeof snakeToCamelCase).toBe('function');
      expect(typeof camelToSnakeCase).toBe('function');
      expect(typeof pluralToSingle).toBe('function');
      expect(typeof arrayToObject).toBe('function');
      expect(typeof roundFixed).toBe('function');
      expect(typeof round).toBe('function');
      expect(typeof downloadFile).toBe('function');
    });
  });
});
