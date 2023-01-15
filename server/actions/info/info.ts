import type { ResponserFunction } from '../../types/new-server.types';
import { requestGET } from '../../utils/request-with-promise';

export const info: ResponserFunction<unknown, { id: string }> = async ({
  params: { id },
}) => {
  return requestGET('v4.npm-gui.nullapps.dev', `/info.html?${id}`);
};
