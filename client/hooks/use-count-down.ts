import { useCallback, useEffect, useState } from 'react';

interface Hook {
  countLeft?: number;
  onStopCountdown: () => void;
  onStartCountdown: () => void;
}

const COUNT_SEC = 5;
const SECOND = 1000;
const ZERO = 0;

export const useCountdown = (count = COUNT_SEC): Hook => {
  const [countLeft, setCount] = useState<number | undefined>();

  useEffect(() => {
    if (countLeft !== ZERO) {
      setTimeout(() => {
        setCount((c) => c! - 1);
      }, SECOND);
    }
  }, [countLeft]);

  const onStartCountdown = useCallback(() => {
    setCount(count);
  }, [count]);

  const onStopCountdown = useCallback(() => {
    setCount(ZERO);
  }, []);

  return { countLeft, onStartCountdown, onStopCountdown };
};
