import { useCallback, useEffect, useState } from 'react';

interface Hook {
  countLeft?: number;
  onStopCountdown: () => void;
  onStartCountdown: () => void;
}

export function useCountdown(count = 5): Hook {
  const [countLeft, setCount] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (countLeft !== 0) {
      setTimeout(() => { setCount((c) => c! - 1); }, 1000);
    }
  }, [countLeft]);

  const onStartCountdown = useCallback(() => {
    setCount(count);
  }, [count]);

  const onStopCountdown = useCallback(() => {
    setCount(0);
  }, []);

  return { countLeft, onStartCountdown, onStopCountdown };
}
