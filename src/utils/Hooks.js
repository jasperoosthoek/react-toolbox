import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';

export const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }
  
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
  return [state, obj => setState({ ...state, ...obj })];
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
