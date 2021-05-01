import { useCallback, useEffect, useState } from 'react';

interface Hook {
  availableManagers?: {
    npm: boolean;
    yarn: boolean;
    pnpm: boolean;
  };
}

export function useAvailableManagers(): Hook {
  const [availableManagers, setAvailableManagers] = useState<Hook['availableManagers']>();

  const fetchAvailableManagers = useCallback(async () => {
    const responseFull = await fetch('/api/available-managers');
    const fullData = await responseFull.json() as Hook['availableManagers'];
    setAvailableManagers(fullData);
  }, []);

  useEffect(() => {
    void fetchAvailableManagers();
  }, [fetchAvailableManagers]);

  return { availableManagers };
}
