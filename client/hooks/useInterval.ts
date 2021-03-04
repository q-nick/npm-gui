import { useEffect, useRef } from 'react';

export function useInterval(callback: (...args: unknown[]) => void, delay: number | null): void {
  const savedCallback = useRef<(...args: unknown[]) => void>();

  useEffect(
    () => {
      savedCallback.current = callback;
    },
    [callback],
  );

  useEffect((): (() => void) | undefined => { // eslint-disable-line
    const currentCallback = savedCallback.current;

    const handler = (...args: unknown[]): void => {
      currentCallback && currentCallback(...args); // eslint-disable-line
    };

    if (delay !== null) {
      const id = setInterval(handler, delay);
      return (): void => {
        clearInterval(id);
      };
    }

    return; // eslint-disable-line
  },
  [delay]);
}
