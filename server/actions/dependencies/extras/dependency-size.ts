import type { BundleSize } from '../../../types/dependency.types';
import type { ResponserFunction } from '../../../types/new-server.types';
import { parseJSON } from '../../../utils/parse-json';
import { requestGET } from '../../../utils/request-with-promise';

const cache: Record<string, BundleSize> = {};

interface Parameters {
  dependencyNameVersion: string;
}

export const getDependencySize: ResponserFunction<
  unknown,
  Parameters,
  BundleSize | undefined
> = async ({ params: { dependencyNameVersion } }) => {
  const bundleInfoCached = cache[`${dependencyNameVersion}`];

  if (bundleInfoCached) {
    return bundleInfoCached;
  }

  try {
    const response = await requestGET(
      'bundlephobia.com',
      `/api/size?package=${dependencyNameVersion}`,
    );
    const json = parseJSON<BundleSize>(response);
    if (json) {
      // eslint-disable-next-line require-atomic-updates
      cache[`${dependencyNameVersion}`] = json;
      const [version] = dependencyNameVersion.match(/[\d+.]+$/) || [];
      const name = dependencyNameVersion.replace(`@${version}`, '');

      return version
        ? {
            size: json.size,
            gzip: json.gzip,
            name,
            version,
          }
        : undefined;
    }
    return undefined;
  } catch {
    return undefined;
  }
};
