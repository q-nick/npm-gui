// import { useIsMutating, useQuery } from '@tanstack/react-query';

// import { useProjectsJobs } from '../app/ContextStore';
// import { getProjectDependenciesFull } from '../service/dependencies.service';
import { trpc } from '../trpc';
import { xCacheId } from '../xcache';

export const useFullDependencies = (projectPath: string) => {
  // const { startJob, successJob } = useProjectsJobs(projectPath);

  // const isProjectMutating = useIsMutating([projectPath]) > 0;

  const query = trpc.getAllDependencies.useQuery({
    projectPath: atob(projectPath),
    xCacheId,
  });

  // const query = useQuery(
  //   [projectPath, 'get-project-dependencies', 'full'],
  //   async () => {
  //     const id = startJob('Get project dependencies full');

  //     const dependencies = await getProjectDependenciesFull(projectPath);

  //     successJob(id);

  //     return dependencies;
  //   },
  //   {
  //     refetchOnWindowFocus: false,
  //     refetchOnMount: false,
  //     enabled: !isProjectMutating,
  //     retry: false,
  //   },
  // );

  return { dependencies: query.data, ...query };
};
