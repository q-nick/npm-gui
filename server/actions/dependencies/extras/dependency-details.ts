/* eslint-disable no-await-in-loop */
import type { Details } from '../../../types/commands.types';
import type { BundleDetails, Manager } from '../../../types/dependency.types';
import type { ResponserFunction } from '../../../types/new-server.types';
import { executeCommandJSONWithFallback } from '../../execute-command';
import { getChunks } from './utils';

interface Parameters {
  dependenciesNameVersion: string;
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

const extractVersionFromDependencyString = (
  dependencyNameVersion: string,
): string => {
  return dependencyNameVersion.slice(
    Math.max(0, dependencyNameVersion.lastIndexOf('@') + 1),
  );
};

const getDependencyDetailsCross = async (
  dependencyNameVersion: string,
  manager: Manager,
): Promise<BundleDetails> => {
  const details = await executeCommandJSONWithFallback<
    Details | { data: Details }
  >(undefined, `${manager} info ${dependencyNameVersion} --json`);

  // yarn has different structure
  const detailsData: Details =
    manager === 'yarn' ? (details as any).data : details;
  const name = extractNameFromDependencyString(dependencyNameVersion);
  const version = extractVersionFromDependencyString(dependencyNameVersion);

  return {
    name,
    version,
    versions: detailsData.versions,
    homepage: detailsData.homepage,
    repository: detailsData.repository.url,
    size: +detailsData.dist.unpackedSize,
    time: detailsData.time,
    updated: detailsData.time.modified,
    created: detailsData.time.created,
  };
};

export const getDependenciesDetails: ResponserFunction<
  unknown,
  Parameters,
  BundleDetails[]
> = async ({ params: { dependenciesNameVersion, manager } }) => {
  const chunks = getChunks(dependenciesNameVersion.split(','));
  try {
    const allDetails: BundleDetails[] = [];

    for (const chunk of chunks) {
      const chunkDetails = await Promise.all(
        chunk.map((item) =>
          getDependencyDetailsCross(item, manager as Manager),
        ),
      );

      allDetails.push(...chunkDetails);
    }

    return allDetails;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return [];
  }
};
