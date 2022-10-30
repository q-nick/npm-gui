import { useEffect, useRef } from 'react';

export const useInterval = (callback: () => void, delay: number): void => {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = (): void => {
      savedCallback.current?.();
    };
    const id = setInterval(tick, delay);
    return (): void => clearInterval(id);
  }, [delay]);
};
