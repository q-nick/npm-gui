import type { BundleSize } from '../../../types/dependency.types';
import type { ResponserFunction } from '../../../types/new-server.types';
import { parseJSON } from '../../../utils/parse-json';
import { requestGET } from '../../../utils/request-with-promise';

const cache: Record<string, BundleSize> = {};

interface Parameters {
  dependencyName: string;
  version: string;
}

export const getDependencySize: ResponserFunction<
  unknown,
  Parameters,
  BundleSize | undefined
> = async ({ params: { dependencyName, version } }) => {
  const bundleInfoCached = cache[`${dependencyName}@${version}`];

  if (bundleInfoCached) {
    return bundleInfoCached;
  }

  try {
    const response = await requestGET(
      'bundlephobia.com',
      `/api/size?package=${dependencyName}@${version}`,
    );
    const json = parseJSON<BundleSize>(response);
    if (json) {
      // eslint-disable-next-line require-atomic-updates
      cache[`${dependencyName}@${version}`] = json;
      return {
        size: json.size,
        gzip: json.gzip,
        name: dependencyName,
        version,
      };
    }
    return undefined;
  } catch {
    return undefined;
  }
};
