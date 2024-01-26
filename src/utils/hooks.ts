import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';

// https://stackoverflow.com/questions/53446020/how-to-compare-oldvalues-and-newvalues-on-react-hooks-useeffect
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();
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
  }, [...(deps || []), delay, effect]);
};

// https://stackoverflow.com/questions/30626030/can-you-force-a-react-component-to-rerender-without-calling-setstate
export const useForceUpdate = () => {
  const [, updateState] = useState<any>(null);
  return useCallback(() => updateState({}), []);
}

export const useSetState = <T>(initialState: T): [T, (subState: Partial<T>) => void] => {
  const [state, setState] = useState(initialState);
  const [callback, setCallback] = useState<() => void | undefined>();
  useEffect(() => {
    if (typeof callback === 'function') callback();
  }, [callback]);
  
  const setSubState = (obj: Partial<T>, callback?: () => void) => {
    setState({ ...state, ...obj });
    if (callback) setCallback(callback);
  }
  return [state, setSubState];
}

export const useWithDispatch = <G extends any[]>(obj: (...args: G) => any) => {
  const dispatch = useDispatch();
  
  return (...args: G) => dispatch(obj(...args));
};

// https://devtrium.com/posts/set-interval-react
export const useInterval = (func: () => void, value: number) => useEffect(() => {
  if (typeof func !== 'function') {
    throw('First argument of useInterval should be a function');
  } else if(
    typeof value !== 'number'
    || !isFinite(value)
    || value <= 0
  ) {
    throw('Second argument of useInterval should be a positive number');
  }
  const interval = setInterval(func, value);

  return () => clearInterval(interval);
}, []);

export const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T) => void] => {
  const initialLocalStorageValue = localStorage.getItem(key);
  const [state, setState] = useState<T>(
    initialLocalStorageValue
      ? JSON.parse(initialLocalStorageValue) as T
      : initialValue
  );

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        setState(JSON.parse(event.newValue) as T);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  const setLocalStorage = (value: T) => {
    setState(value);
    localStorage.setItem(key, JSON.stringify(value));

    // Manually dispatch an event to update components in the same document
    window.dispatchEvent(new StorageEvent('storage', {
      key,
      newValue: JSON.stringify(value),
      oldValue: localStorage.getItem(key),
    }));
  };

  return [state, setLocalStorage];
};