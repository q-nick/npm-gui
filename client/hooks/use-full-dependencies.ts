import { useIsMutating, useQuery } from '@tanstack/react-query';

import { useProjectsJobs } from '../app/ContextStore';
import { getProjectDependenciesFull } from '../service/dependencies.service';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const useFullDependencies = (projectPath: string) => {
  const { startJob, successJob } = useProjectsJobs(projectPath);

  const isProjectMutating = useIsMutating([projectPath]) > 0;

  const query = useQuery(
    [projectPath, 'get-project-dependencies', 'full'],
    async () => {
      const id = startJob('Get project dependencies full');

      const dependencies = await getProjectDependenciesFull(projectPath);

      successJob(id);

      return dependencies;
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: !isProjectMutating,
      retry: false,
    },
  );

  return { dependencies: query.data, ...query };
};
