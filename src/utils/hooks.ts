import React, { useRef, useEffect, useState, useCallback } from 'react';

// https://stackoverflow.com/questions/53446020/how-to-compare-oldvalues-and-newvalues-on-react-hooks-useeffect
export const usePrevious = <T>(value: T): T | undefined => {
  // Explicitly set initial value to `undefined`
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

// https://stackoverflow.com/questions/54666401/how-to-use-throttle-or-debounce-with-react-hook
export const useDebouncedEffect = (effect: () => void, deps: any[], delay: number) => {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);

    return () => clearTimeout(handler);
  }, [...(deps || []), delay]);
};

// https://stackoverflow.com/questions/30626030/can-you-force-a-react-component-to-rerender-without-calling-setstate
export const useForceUpdate = () => {
  const [, updateState] = useState<any>(null);
  return useCallback(() => updateState({}), []);
}

export const useSetState = <T>(initialState: T): [T, (subState: Partial<T>, callback?: () => void) => void] => {
  const [state, setState] = useState(initialState);
  
  const setSubState = useCallback((obj: Partial<T>, callback?: () => void) => {
    setState(prevState => {
      const newState = { ...prevState, ...obj };
      return newState;
    });
    if (callback) {
      // Execute callback in next tick to ensure state is updated
      Promise.resolve().then(callback);
    }
  }, []);
  
  return [state, setSubState];
}

// https://devtrium.com/posts/set-interval-react
// Calls the latest func on every tick; a changed interval restarts the timer
export const useInterval = (func: () => void, value: number) => {
  const funcRef = useRef(func);
  funcRef.current = func;

  useEffect(() => {
    if (typeof funcRef.current !== 'function') {
      throw('First argument of useInterval should be a function');
    } else if(
      typeof value !== 'number'
      || !isFinite(value)
      || value <= 0
    ) {
      throw('Second argument of useInterval should be a positive number');
    }
    const interval = setInterval(() => funcRef.current(), value);

    return () => clearInterval(interval);
  }, [value]);
};

export const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T) => void] => {
  // Get initial value from localStorage or use provided initial value
  const [state, setState] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        localStorage.setItem(key, JSON.stringify(initialValue));
        return initialValue;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
          setState(JSON.parse(event.newValue) as T);
        } catch (error) {
          console.error('Error parsing localStorage value:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  const setLocalStorage = useCallback((value: T) => {
    try {
      setState(value);
      const oldValue = localStorage.getItem(key);
      localStorage.setItem(key, JSON.stringify(value));
      // Dispatch storage event for components in the same window
      window.dispatchEvent(new StorageEvent('storage', {
        key,
        newValue: JSON.stringify(value),
        oldValue,
      }));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key]);

  return [state, setLocalStorage];
};