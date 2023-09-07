import { useQuery } from '@tanstack/react-query';

import type { AvailableManagerResponse } from '../../server/types/global.types';
import { fetchJSON } from '../service/utils';

export const useAvailableManagers = () => {
  const { data } = useQuery(
    ['available-managers'],
    () => fetchJSON<AvailableManagerResponse>(`/api/available-managers`),
    { refetchOnMount: false, refetchOnWindowFocus: false },
  );

  return data;
};
