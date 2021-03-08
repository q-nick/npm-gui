import type * as CommandsYarn from '../CommandsYarn';

export interface YarnDependenciesVersions {
  wanted?: string;
  current?: string;
  latest?: string;
}

export function extractVersionFromYarnOutdated(
  outdatedInfo?: CommandsYarn.Outdated,
): Record<string, YarnDependenciesVersions> {
  if (!outdatedInfo || !outdatedInfo.data) {
    return {};
  }
  const nameIndex = outdatedInfo.data.head.findIndex((x) => x === 'Package');
  const wantedIndex = outdatedInfo.data.head.findIndex((x) => x === 'Wanted');
  const latestIndex = outdatedInfo.data.head.findIndex((x) => x === 'Latest');
  const currentIndex = outdatedInfo.data.head.findIndex((x) => x === 'Current');

  const dependencies: Record<string, YarnDependenciesVersions> = {};

  outdatedInfo.data.body.forEach((packageArr) => {
    const name = packageArr[nameIndex]!; // eslint-disable-line
    dependencies[name] = {
      wanted: packageArr[wantedIndex],
      latest: packageArr[latestIndex],
      current: packageArr[currentIndex],
    };
  });

  return dependencies;
}
