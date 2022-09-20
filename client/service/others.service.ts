import type { Manager } from '../../server/types/dependency.types';
import { fetchJSON } from './utils';

export const getAvailableManagers = async (): Promise<
  Record<Manager, boolean>
> => {
  return fetchJSON(`/api/available-managers`);
};
