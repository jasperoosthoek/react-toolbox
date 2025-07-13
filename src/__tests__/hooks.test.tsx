import { renderHook, act } from '@testing-library/react';
import {
  usePrevious,
  useDebouncedEffect,
  useForceUpdate,
  useSetState,
  useInterval,
  useLocalStorage,
} from '../utils/hooks';

// Mock localStorage for testing
const mockStorage = {
  store: {} as Record<string, string>,
  getItem: jest.fn((key: string) => mockStorage.store[key] || null),
  setItem: jest.fn((key: string, value: string) => {
    mockStorage.store[key] = value;
  }),
  removeItem: jest.fn((key: string) => {
    delete mockStorage.store[key];
  }),
  clear: jest.fn(() => {
    mockStorage.store = {};
  }),
};

// Override the global localStorage
Object.defineProperty(window, 'localStorage', {
  value: mockStorage,
  writable: true
});

// Also set global.localStorage for Node environments
global.localStorage = mockStorage as any;

const localStorageMock = mockStorage;

describe('Utils - Hooks Tests', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
    // Reset localStorage mock
    localStorageMock.store = {};
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('usePrevious', () => {
    it('should return undefined on first render', () => {
      const { result } = renderHook(({ value }) => usePrevious(value), {
        initialProps: { value: 'initial' }
      });

      expect(result.current).toBeUndefined();
    });

    it('should return previous value on subsequent renders', () => {
      const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
        initialProps: { value: 'initial' }
      });

      expect(result.current).toBeUndefined();

      rerender({ value: 'updated' });
      expect(result.current).toBe('initial');

      rerender({ value: 'final' });
      expect(result.current).toBe('updated');
    });

    it('should work with different data types', () => {
      const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
        initialProps: { value: 0 }
      });

      rerender({ value: 1 });
      expect(result.current).toBe(0);

      rerender({ value: { key: 'value' } });
      expect(result.current).toBe(1);

      rerender({ value: [1, 2, 3] });
      expect(result.current).toEqual({ key: 'value' });
    });
  });

  describe('useDebouncedEffect', () => {
    it('should execute effect after delay', () => {
      const effect = jest.fn();
      const delay = 500;

      renderHook(() => useDebouncedEffect(effect, [], delay));

      expect(effect).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(delay - 1);
      });
      expect(effect).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(1);
      });
      expect(effect).toHaveBeenCalledTimes(1);
    });

    it('should cancel previous timeout when deps change', () => {
      const effect = jest.fn();
      const delay = 500;

      const { rerender } = renderHook(({ deps }) => useDebouncedEffect(effect, deps, delay), {
        initialProps: { deps: [1] }
      });

      act(() => {
        jest.advanceTimersByTime(250);
      });
      expect(effect).not.toHaveBeenCalled();

      rerender({ deps: [2] });

      act(() => {
        jest.advanceTimersByTime(250);
      });
      expect(effect).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(250);
      });
      expect(effect).toHaveBeenCalledTimes(1);
    });

    it('should handle empty deps array', () => {
      const effect = jest.fn();
      const delay = 100;

      renderHook(() => useDebouncedEffect(effect, [], delay));

      act(() => {
        jest.advanceTimersByTime(delay);
      });
      expect(effect).toHaveBeenCalledTimes(1);
    });
  });

  describe('useForceUpdate', () => {
    it('should force component re-render', () => {
      let renderCount = 0;
      const { result } = renderHook(() => {
        renderCount++;
        return useForceUpdate();
      });

      expect(renderCount).toBe(1);

      act(() => {
        result.current();
      });
      expect(renderCount).toBe(2);

      act(() => {
        result.current();
      });
      expect(renderCount).toBe(3);
    });

    it('should return a stable function reference', () => {
      const { result, rerender } = renderHook(() => useForceUpdate());
      const firstUpdate = result.current;

      rerender();
      const secondUpdate = result.current;

      expect(firstUpdate).toBe(secondUpdate);
    });
  });

  describe('useSetState', () => {
    it('should initialize with initial state', () => {
      const initialState = { count: 0, name: 'test' };
      const { result } = renderHook(() => useSetState(initialState));

      expect(result.current[0]).toEqual(initialState);
      expect(typeof result.current[1]).toBe('function');
    });

    it('should update state partially', () => {
      const initialState = { count: 0, name: 'test' };
      const { result } = renderHook(() => useSetState(initialState));

      act(() => {
        result.current[1]({ count: 5 });
      });

      expect(result.current[0]).toEqual({ count: 5, name: 'test' });
    });

    it('should merge multiple partial updates', () => {
      const initialState = { a: 1, b: 2, c: 3 };
      const { result } = renderHook(() => useSetState(initialState));

      act(() => {
        result.current[1]({ a: 10 });
      });
      expect(result.current[0]).toEqual({ a: 10, b: 2, c: 3 });

      act(() => {
        result.current[1]({ b: 20, c: 30 });
      });
      expect(result.current[0]).toEqual({ a: 10, b: 20, c: 30 });
    });

    it('should handle callback execution', async () => {
      const initialState = { count: 0 };
      const callback = jest.fn();
      const { result } = renderHook(() => useSetState(initialState));

      await act(async () => {
        result.current[1]({ count: 1 }, callback);
        // Wait for the promise to resolve
        await Promise.resolve();
      });

      expect(callback).toHaveBeenCalled();
    });
  });

  describe('useInterval', () => {
    it('should execute function at specified intervals', () => {
      const func = jest.fn();
      const interval = 1000;

      renderHook(() => useInterval(func, interval));

      expect(func).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(interval);
      });
      expect(func).toHaveBeenCalledTimes(1);

      act(() => {
        jest.advanceTimersByTime(interval);
      });
      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should throw error for non-function first argument', () => {
      expect(() => {
        renderHook(() => useInterval('not a function' as any, 1000));
      }).toThrow('First argument of useInterval should be a function');
    });

    it('should throw error for invalid interval values', () => {
      const func = jest.fn();

      expect(() => {
        renderHook(() => useInterval(func, 0));
      }).toThrow('Second argument of useInterval should be a positive number');

      expect(() => {
        renderHook(() => useInterval(func, -1));
      }).toThrow('Second argument of useInterval should be a positive number');

      expect(() => {
        renderHook(() => useInterval(func, Infinity));
      }).toThrow('Second argument of useInterval should be a positive number');

      expect(() => {
        renderHook(() => useInterval(func, 'invalid' as any));
      }).toThrow('Second argument of useInterval should be a positive number');
    });

    it('should clear interval on unmount', () => {
      const func = jest.fn();
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

      const { unmount } = renderHook(() => useInterval(func, 1000));

      unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();
    });
  });

  describe('useLocalStorage', () => {
    it('should initialize with initial value when localStorage is empty', () => {
      const key = 'testKey1';
      const initialValue = 'initial';

      const { result } = renderHook(() => useLocalStorage(key, initialValue));

      expect(result.current[0]).toBe(initialValue);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(key, JSON.stringify(initialValue));
    });

    it('should initialize with localStorage value when available', () => {
      const key = 'testKey2';
      const initialValue = 'initial';
      const storedValue = 'stored';

      // Set up localStorage to return stored value
      localStorageMock.store[key] = JSON.stringify(storedValue);

      const { result } = renderHook(() => useLocalStorage(key, initialValue));

      expect(result.current[0]).toBe(storedValue);
    });

    it('should update localStorage when state changes', () => {
      const key = 'testKey3';
      const initialValue = 'initial';

      const { result } = renderHook(() => useLocalStorage(key, initialValue));

      act(() => {
        result.current[1]('updated');
      });

      expect(result.current[0]).toBe('updated');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(key, JSON.stringify('updated'));
    });

    it('should handle complex objects', () => {
      const key = 'testKey4';
      const initialValue = { count: 0, items: [] };

      const { result } = renderHook(() => useLocalStorage(key, initialValue));

      const newValue = { count: 5, items: ['a', 'b'] };
      act(() => {
        result.current[1](newValue);
      });

      expect(result.current[0]).toEqual(newValue);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(key, JSON.stringify(newValue));
    });

    it('should respond to storage events', () => {
      const key = 'testKey5';
      const initialValue = 'initial';

      const { result } = renderHook(() => useLocalStorage(key, initialValue));

      const newValue = 'fromEvent';
      const storageEvent = new StorageEvent('storage', {
        key,
        newValue: JSON.stringify(newValue),
      });

      act(() => {
        window.dispatchEvent(storageEvent);
      });

      expect(result.current[0]).toBe(newValue);
    });

    it('should ignore storage events for different keys', () => {
      const key = 'testKey6';
      const initialValue = 'initial';

      const { result } = renderHook(() => useLocalStorage(key, initialValue));

      const storageEvent = new StorageEvent('storage', {
        key: 'differentKey',
        newValue: JSON.stringify('different'),
      });

      act(() => {
        window.dispatchEvent(storageEvent);
      });

      expect(result.current[0]).toBe(initialValue);
    });

    it('should dispatch storage events when setting value', () => {
      const key = 'testKey7';
      const initialValue = 'initial';
      const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

      const { result } = renderHook(() => useLocalStorage(key, initialValue));

      act(() => {
        result.current[1]('updated');
      });

      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'storage',
          key,
          newValue: JSON.stringify('updated'),
        })
      );
    });
  });

  describe('Hook Export Verification', () => {
    it('should export all hooks as functions', () => {
      expect(typeof usePrevious).toBe('function');
      expect(typeof useDebouncedEffect).toBe('function');
      expect(typeof useForceUpdate).toBe('function');
      expect(typeof useSetState).toBe('function');
      expect(typeof useInterval).toBe('function');
      expect(typeof useLocalStorage).toBe('function');
    });
  });
});
