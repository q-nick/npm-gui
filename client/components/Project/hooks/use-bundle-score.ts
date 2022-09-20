import { useQueries } from '@tanstack/react-query';

import type { DependencyInstalledExtras } from '../../../../server/types/dependency.types';
import { getDependencyScore } from '../../../service/dependencies.service';

export const useBundleScore = (
  dependencies?: DependencyInstalledExtras[],
): DependencyInstalledExtras[] | undefined => {
  const scoreQueries = useQueries({
    queries:
      dependencies?.map((dependency) => {
        return {
          queryKey: ['get-dependency-score', dependency.name],
          queryFn: (): ReturnType<typeof getDependencyScore> =>
            getDependencyScore(dependency.name),
          refetchOnWindowFocus: false,
          refetchOnMount: false,
          retry: false,
        };
      }) || [],
  });

  return dependencies?.map((dependency) => ({
    ...dependency,
    score: scoreQueries.find((x) => x.data?.name === dependency.name)?.data
      ?.score,
  }));
};
