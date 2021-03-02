import { useEffect, useRef } from 'react';

export function useInterval(callback: (...args: unknown[]) => void, delay: number): void {
  const savedCallback = useRef<(...args: unknown[]) => void>();

  useEffect(
    () => {
      savedCallback.current = callback;
    },
    [callback],
  );

  useEffect((): void => {
    const currentCallback = savedCallback.current;

    const handler = (...args: unknown[]): void => {
      currentCallback(...args);
    };

    if (delay !== null) {
      const id = setInterval(handler, delay);
      return (): void => {
        clearInterval(id);
      };
    }
  },
  [delay]);
}
