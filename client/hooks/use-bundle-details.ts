import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import type { DependencyInstalledExtras } from '../../server/types/dependency.types';
import { getDependenciesDetails } from '../service/dependencies.service';
import { useProjectPath } from './use-project-path';

export const useBundleDetails = (
  dependencies?: DependencyInstalledExtras[],
): DependencyInstalledExtras[] | undefined => {
  const projectPath = useProjectPath();
  const dependenciesToQuery = useMemo(() => {
    return dependencies
      ?.filter((dep) => dep.installed)
      .map((dep) => `${dep.name}@${dep.installed}`);
  }, [dependencies]);

  const manager = dependencies?.[0]?.manager;

  const query = useQuery(
    ['get-dependencies-details', manager, dependenciesToQuery],
    async () => getDependenciesDetails(manager, dependenciesToQuery),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
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

      const latestVersion =
        projectPath === 'global'
          ? [...depDetails.versions]
              .reverse()
              .find((version) => /^\d+\.\d+\.\d+$/.test(version))
          : dep.latest;

      return {
        ...dep,
        size: depDetails.size,
        homepage: depDetails.homepage,
        repository: depDetails.repository,
        updated: depDetails.updated,
        created: depDetails.created,
        versions: depDetails.versions,
        time: depDetails.time,
        latest: latestVersion !== dep.installed ? latestVersion : dep.latest,
      };
    });
  }, [dependencies, projectPath, query?.data]);

  return dependenciesWithDetails;
};
