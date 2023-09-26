import { useMemo } from 'react';

import type { DependencyInstalledExtras } from '../../server/types/dependency.types';
import { trpc } from '../trpc';

export const useBundleDetails = (
  dependencies?: DependencyInstalledExtras[],
): DependencyInstalledExtras[] | undefined => {
  const dependenciesNameVersion = useMemo(() => {
    return (
      dependencies
        ?.filter((dep) => dep.installed)
        .map((dep) => `${dep.name}@${dep.installed}`) || []
    );
  }, [dependencies]);

  const manager = dependencies?.[0]?.manager;

  const query = trpc.getDependenciesDetails.useQuery(
    {
      dependenciesNameVersion,
      manager: manager || 'unknown',
    },
    { enabled: !!manager },
  );

  const dependenciesWithDetails = useMemo(() => {
    return dependencies?.map((dep) => {
      const depDetails = query?.data?.find(
        (details) =>
          details.name === dep.name && details.version === dep.installed,
      );

      if (!depDetails) {
        return dep;
      }

      return {
        ...dep,
        size: depDetails.size,
        homepage: depDetails.homepage,
        repository: depDetails.repository,
        updated: depDetails.updated,
        created: depDetails.created,
        versions: depDetails.versions,
        time: depDetails.time,
      };
    });
  }, [dependencies, query?.data]);

  return dependenciesWithDetails;
};
