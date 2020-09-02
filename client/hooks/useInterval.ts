import { useEffect, useRef } from 'react';

export function useInterval(callback: (...args: any) => void, delay:number):void {
  const savedCallback = useRef<(...args: any) => void>();

  useEffect(
    () => {
      savedCallback.current = callback;
    },
    [callback],
  );

  useEffect(() => { // eslint-disable-line
    const currentCallback = savedCallback.current;

    const handler = (...args: any) => currentCallback && currentCallback(...args);

    if (delay !== null) {
      const id = setInterval(handler, delay);
      return () => clearInterval(id);
    }
  },
  [delay]);
}
