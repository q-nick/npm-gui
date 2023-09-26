import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { publicProcedure } from '../../trpc/trpc-router';
import { parseJSON } from '../../utils/parse-json';
import { requestGET } from '../../utils/request-with-promise';

interface NPMApiResult {
  results: {
    package: {
      name: string;
      description: string;
      version: string;
      date: string;
      links: {
        npm: string;
        homepage: string;
        repository: string;
        bugs: string;
      };
    };
    score: {
      final: number;
    };
  }[];
}

export const searchProcedure = publicProcedure
  .input(z.string())
  .query(async ({ input: searchString }) => {
    const response = await requestGET(
      'api.npms.io',
      `/v2/search?from=0&size=25&q=${searchString}`,
    );

    const parsed = parseJSON<NPMApiResult>(response);
    if (!parsed) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Unable to get package info',
      });
    }

    return parsed.results.map((result) => ({
      name: result.package.name,
      version: result.package.version,
      score: result.score.final,
      updated: result.package.date,
      npm: result.package.links.npm,
      repository: result.package.links.repository,
      homepage: result.package.links.homepage,
      description: result.package.description,
    }));
  });
