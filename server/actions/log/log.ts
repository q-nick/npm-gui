import type { ResponserFunction } from '../../types/new-server.types';
import { requestGET } from '../../utils/request-with-promise';

export const log: ResponserFunction<{ id: string }> = async ({
  body: { id },
}) => {
  const result = await requestGET('npm-gui-stats.herokuapp.com', `log/${id}`);
  return result;
};
