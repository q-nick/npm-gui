import { useMemo } from 'react';

import type { DependencyInstalledExtras } from '../../server/types/dependency.types';
import { trpc } from '../trpc';

export const useBundleScore = (
  dependencies?: DependencyInstalledExtras[],
): DependencyInstalledExtras[] | undefined => {
  const dependenciesNameVersion = useMemo(() => {
    return dependencies?.map((dep) => dep.name) || [];
  }, [dependencies]);

  const query = trpc.getDependenciesScore.useQuery(dependenciesNameVersion);

  const dependenciesWithScore = useMemo(() => {
    return dependencies?.map((dep) => {
      const depScore = query?.data?.find((score) => score.name === dep.name);

      if (!depScore) {
        return dep;
      }

      return {
        ...dep,
        score: depScore.score,
      };
    });
  }, [dependencies, query?.data]);

  return dependenciesWithScore;
};
