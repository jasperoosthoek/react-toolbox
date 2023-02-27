import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';

export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
  
// https://stackoverflow.com/questions/54666401/how-to-use-throttle-or-debounce-with-react-hook
export const useDebouncedEffect = (effect, deps, delay) => {
    useEffect(() => {
      const handler = setTimeout(() => effect(), delay);
  
      return () => clearTimeout(handler);
    }, [...(deps || []), delay, effect]);
  };
  
  // https://stackoverflow.com/questions/30626030/can-you-force-a-react-component-to-rerender-without-calling-setstate
  export const useForceUpdate = () => {
    const [, updateState] = useState();
    return useCallback(() => updateState({}), []);
  }
  
export const useSetState = initialState => {
  const [state, setState] = useState(initialState);
  const [callback, setCallback] = useState();
  useEffect(() => {
    if (typeof callback === 'function') callback();
  }, [callback]);
  
  const setSubState = (obj, callback) => {
    setState({ ...state, ...obj });
    if (callback) setCallback(callback);
  }
  return [state, setSubState];
}

export const useWithDispatch = (obj) => {
  const dispatch = useDispatch();

  if (typeof obj === 'function') {
    const hook = (...args) => dispatch(obj(...args))
    return hook;
  }
  
  return Object.entries(obj).reduce((o, [name, func]) => {
    const hook = (...args) => dispatch(func(...args))
    return (
      {
        ...o,
        [name]: hook,
      }
    );
  }, {});
};

// https://devtrium.com/posts/set-interval-react
export const useInterval = (func, value) => useEffect(() => {
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