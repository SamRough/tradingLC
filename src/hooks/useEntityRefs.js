import { useRef, useCallback, useEffect } from 'react';

export function useEntityRefs() {
  const refs = useRef({});

  const register = useCallback((key) => (el) => {
    if (el) {
      refs.current[key] = el;
    }
  }, []);

  useEffect(() => {
    return () => {
      refs.current = {};
    };
  }, []);

  return { entityRefs: refs, register };
}
