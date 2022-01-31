import type { Outdated } from '../CommandsYarn';

export interface YarnDependenciesVersions {
  wanted?: string;
  current?: string;
  latest?: string;
}

export const extractVersionFromYarnOutdated = (
  outdatedInfo?: Outdated,
): Record<string, YarnDependenciesVersions> => {
  if (!outdatedInfo || !outdatedInfo.data) {
    return {};
  }
  const nameIndex = outdatedInfo.data.head.indexOf('Package');
  const wantedIndex = outdatedInfo.data.head.indexOf('Wanted');
  const latestIndex = outdatedInfo.data.head.indexOf('Latest');
  const currentIndex = outdatedInfo.data.head.indexOf('Current');

  const dependencies: Record<string, YarnDependenciesVersions> = {};

  for (const packageArray of outdatedInfo.data.body) {
    const name = packageArray[nameIndex]!;
    dependencies[name] = {
      wanted: packageArray[wantedIndex],
      latest: packageArray[latestIndex],
      current: packageArray[currentIndex],
    };
  }

  return dependencies;
};
