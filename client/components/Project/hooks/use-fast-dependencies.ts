import { useIsMutating, useQuery } from '@tanstack/react-query';

import type { DependencyInstalled } from '../../../../server/types/dependency.types';
import { getProjectDependenciesFast } from '../../../service/dependencies.service';

export const useFastDependencies = (
  projectPath: string,
): [DependencyInstalled[] | undefined, ReturnType<typeof useQuery>] => {
  const isProjectMutating = useIsMutating([projectPath]) > 0;

  const query = useQuery(
    [projectPath, 'get-project-dependencies-fast'],
    () => getProjectDependenciesFast(projectPath),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: !isProjectMutating,
      retry: false,
    },
  );

  return [query.data, query];
};
