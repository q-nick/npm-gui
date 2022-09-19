import type { BundleScore } from '../../../types/dependency.types';
import type { ResponserFunction } from '../../../types/new-server.types';
import { requestGET } from '../../../utils/request-with-promise';

const cache: Record<string, BundleScore> = {};

interface Parameters {
  dependencyName: string;
}

export const getDependencyScore: ResponserFunction<
  unknown,
  Parameters,
  BundleScore | undefined
> = async ({ params: { dependencyName } }) => {
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
      return { name: dependencyName, score: +score };
    }
    return undefined;
  } catch {
    return undefined;
  }
};
