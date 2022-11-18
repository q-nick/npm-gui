import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import type {
  BundleScore,
  DependencyInstalledExtras,
} from '../../server/types/dependency.types';
import { fetchJSON } from '../service/utils';

export const useBundleScore = (
  dependencies?: DependencyInstalledExtras[],
): DependencyInstalledExtras[] | undefined => {
  const dependenciesToQuery = useMemo(() => {
    return dependencies?.map((dep) => dep.name);
  }, [dependencies]);

  const query = useQuery(
    ['get-dependencies-score', dependenciesToQuery],
    async () => {
      const detailsLoaded =
        dependenciesToQuery && dependenciesToQuery.length > 0
          ? await fetchJSON<BundleScore[]>(
              `/api/score/${dependenciesToQuery.join(',')}`,
            )
          : [];

      return detailsLoaded;
    },
  );

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
