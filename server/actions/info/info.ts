import { z } from 'zod';

import { publicProcedure } from '../../trpc/trpc-router';
import type { ResponserFunction } from '../../types/new-server.types';
import { requestGET } from '../../utils/request-with-promise';

export const info: ResponserFunction<unknown, { id: string }> = async ({
  params: { id },
}) => {
  return requestGET('v4.npm-gui.nullapps.dev', `/info.html?${id}`);
};

export const infoProcedure = publicProcedure
  .input(z.string())
  .query(async ({ input: id }) => {
    return requestGET('v4.npm-gui.nullapps.dev', `/info.html?${id}`);
  });
