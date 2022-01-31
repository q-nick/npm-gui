import { useEffect, useRef } from 'react';

export const useInterval = (
  callback: (...arguments_: unknown[]) => void,
  delay: number | null,
): void => {
  const savedCallback = useRef<(...arguments_: unknown[]) => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect((): (() => void) | undefined => {
    const currentCallback = savedCallback.current;

    const handler = (...arguments_: unknown[]): void => {
      currentCallback && currentCallback(...arguments_);
    };

    if (delay !== null) {
      const id = setInterval(handler, delay);
      return (): void => {
        clearInterval(id);
      };
    }
  }, [delay]);
};
