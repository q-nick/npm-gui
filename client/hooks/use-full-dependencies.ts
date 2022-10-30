import { useIsMutating, useQuery } from '@tanstack/react-query';

import type { DependencyInstalled } from '../../server/types/dependency.types';
import { getProjectDependenciesFull } from '../service/dependencies.service';

export const useFullDependencies = (
  projectPath: string,
): [DependencyInstalled[] | undefined, ReturnType<typeof useQuery>] => {
  const isProjectMutating = useIsMutating([projectPath]) > 0;

  const query = useQuery(
    [projectPath, 'get-project-dependencies', 'full'],
    () => getProjectDependenciesFull(projectPath),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: !isProjectMutating,
      retry: false,
    },
  );

  return [query.data, query];
};
