/* eslint-disable unicorn/no-array-callback-reference */
/* eslint-disable no-await-in-loop */
import type { BundleScore } from '../../../types/dependency.types';
import type { ResponserFunction } from '../../../types/new-server.types';
import { requestGET } from '../../../utils/request-with-promise';
import { notEmpty } from '../../../utils/utils';
import { getChunks } from './utils';

const cache: Record<string, BundleScore> = {};

interface Parameters {
  dependenciesName: string;
}

const getDependenciesScoreValue = async (
  dependencyName: string,
): Promise<BundleScore | undefined> => {
  console.log('starts', dependencyName);
  const bundleInfoCached = cache[dependencyName];

  if (bundleInfoCached) {
    console.log('is cache', dependencyName);
    return bundleInfoCached;
  }

  try {
    const response = await requestGET(
      'snyk.io',
      `/advisor/npm-package/${dependencyName}/badge.svg`,
    );
    const score = response.match(/>(?<score>\d+)\//)?.groups?.['score'];

    console.log('response', dependencyName, score);
    if (score) {
      // eslint-disable-next-line require-atomic-updates
      cache[dependencyName] = { name: dependencyName, score: +score };
      return { name: dependencyName, score: +score };
    }
    return undefined;
  } catch {
    return undefined;
  }
};

export const getDependenciesScore: ResponserFunction<
  unknown,
  Parameters,
  BundleScore[]
> = async ({ params: { dependenciesName } }) => {
  const chunks = getChunks(dependenciesName.split(','), 5);

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
};
