import type { ResponserFunction } from '../../types/new-server.types';
import { requestGET } from '../../utils/request-with-promise';

export const info: ResponserFunction = async () => {
  const result = await requestGET(
    'raw.githubusercontent.com',
    `/q-nick/npm-gui/master/INFO?${Date.now()}`,
  );
  return result;
};
