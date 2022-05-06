import React, { useRef, useEffect, useState, useCallback } from 'react';

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
  