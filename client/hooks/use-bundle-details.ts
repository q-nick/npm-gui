import { useQueries } from '@tanstack/react-query';

import type { DependencyInstalledExtras } from '../../server/types/dependency.types';
import { getDependencyDetails } from '../service/dependencies.service';

export const useBundleDetails = (
  dependencies?: DependencyInstalledExtras[],
): DependencyInstalledExtras[] | undefined => {
  const sizeQueries = useQueries({
    queries:
      dependencies
        ?.filter((dependency) => dependency.installed)
        .map((dependency) => {
          return {
            queryKey: [
              'get-dependency-details',
              dependency.name,
              dependency.installed,
            ],
            queryFn: (): ReturnType<typeof getDependencyDetails> =>
              getDependencyDetails(
                dependency.manager,
                dependency.name,
                dependency.installed,
              ),
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            cacheTime: Number.POSITIVE_INFINITY,
            retry: 3,
          };
        }) || [],
  });

  return dependencies?.map((dependency) => ({
    ...dependency,
    ...sizeQueries.find((x) => x.data?.name === dependency.name)?.data,
  }));
};
