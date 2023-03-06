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
  
// export const useSetState = <T>(initialState: T): [T, (subState: Partial<T>) => void]) => {
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

export const useWithDispatch = <T>(obj: T) => {
  const dispatch = useDispatch();

  if (typeof obj === 'function') {
    const hook = <G extends any[]>(...args: G) => dispatch(obj(...args));
    return hook;
  }
  
  return Object.fromEntries(
    Object.entries(obj).map(([name, func]) =>
      [
        name,
        <G extends any[]>(...args: G) => dispatch(func(...args)),
      ]
    )
  );
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