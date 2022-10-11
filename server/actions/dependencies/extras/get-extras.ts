import type { Details } from '../../../types/commands.types';
import type { BundleDetails, Manager } from '../../../types/dependency.types';
import type { ResponserFunction } from '../../../types/new-server.types';
import { executeCommandJSONWithFallback } from '../../execute-command';

interface Parameters {
  dependencyNameVersion: string;
  manager: string;
}

const extractNameFromDependencyString = (
  dependencyNameVersion: string,
): string => {
  return dependencyNameVersion.slice(
    0,
    Math.max(0, dependencyNameVersion.lastIndexOf('@')),
  );
};

const getExtrasCross = async (
  dependencyNameVersion: string,
  manager: Manager,
): Promise<BundleDetails> => {
  const details = await executeCommandJSONWithFallback<
    Details | { data: Details; type: 'inspect' }
  >(undefined, `${manager} info ${dependencyNameVersion} --json`);

  // yarn has different structure
  const detailsData = 'type' in details ? details.data : details;
  const name = extractNameFromDependencyString(dependencyNameVersion);

  return {
    name,
    versions: detailsData.versions,
    homepage: detailsData.homepage,
    repository: detailsData.repository.url,
    size: +detailsData.dist.unpackedSize,
    time: detailsData.time,
    updated: detailsData.time.modified,
    created: detailsData.time.created,
  };
};

export const getExtras: ResponserFunction<
  unknown,
  Parameters,
  BundleDetails | []
> = async ({ params: { dependencyNameVersion, manager } }) => {
  try {
    return await getExtrasCross(dependencyNameVersion, manager as Manager);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return [];
  }
};
