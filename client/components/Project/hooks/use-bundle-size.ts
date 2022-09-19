import { useQueries } from '@tanstack/react-query';

import type { DependencyInstalledExtras } from '../../../../server/types/dependency.types';
import { getDependencySize } from '../../../service';

export const useBundleSize = (
  dependencies?: DependencyInstalledExtras[],
): DependencyInstalledExtras[] | undefined => {
  const sizeQueries = useQueries({
    queries:
      dependencies
        ?.filter((dependency) => dependency.installed)
        .map((dependency) => {
          return {
            queryKey: [
              'get-dependency-size',
              dependency.name,
              dependency.installed,
            ],
            queryFn: (): ReturnType<typeof getDependencySize> =>
              getDependencySize(dependency.name, dependency.installed),
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            retry: false,
          };
        }) || [],
  });

  return dependencies?.map((dependency) => ({
    ...dependency,
    size: sizeQueries.find((x) => x.data?.name === dependency.name)?.data?.size,
    gzip: sizeQueries.find((x) => x.data?.name === dependency.name)?.data?.gzip,
  }));
};
