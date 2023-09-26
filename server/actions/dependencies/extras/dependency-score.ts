/* eslint-disable unicorn/no-array-callback-reference */
/* eslint-disable no-await-in-loop */
import { z } from 'zod';

import { publicProcedure } from '../../../trpc/trpc-router';
import type { BundleScore } from '../../../types/dependency.types';
import { requestGET } from '../../../utils/request-with-promise';
import { notEmpty } from '../../../utils/utils';
import { getChunks } from './utils';

const cache: Record<string, BundleScore> = {};

const getDependenciesScoreValue = async (
  dependencyName: string,
): Promise<BundleScore | undefined> => {
  const bundleInfoCached = cache[dependencyName];

  if (bundleInfoCached) {
    return bundleInfoCached;
  }

  try {
    const response = await requestGET(
      'snyk.io',
      `/advisor/npm-package/${dependencyName}/badge.svg`,
    );
    const score = response.match(/>(?<score>\d+)\//)?.groups?.['score'];

    if (score) {
      // eslint-disable-next-line require-atomic-updates
      cache[dependencyName] = { name: dependencyName, score: +score };
      return cache[dependencyName];
    }
    return undefined;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return undefined;
  }
};

export const getDependenciesScoreProcedure = publicProcedure
  .input(z.array(z.string()))
  .query(async ({ input: dependenciesName }) => {
    const chunks = getChunks(dependenciesName, 5);

    try {
      const allScore: BundleScore[] = [];

      for (const chunk of chunks) {
        const chunkScore = await Promise.all(
          chunk.map((dependencyName) =>
            getDependenciesScoreValue(dependencyName),
          ),
        );

        allScore.push(...chunkScore.filter(notEmpty));
      }

      return allScore;
    } catch {
      return [];
    }
  });
