// import { useIsMutating, useQuery } from '@tanstack/react-query';

// import { useProjectsJobs } from '../app/ContextStore';
// import { getProjectDependenciesFast } from '../service/dependencies.service';
import { trpc } from '../trpc';
import { xCacheId } from '../xcache';

export const useFastDependencies = (
  projectPath: string,
  onSuccess?: () => void,
) => {
  // const { startJob, successJob } = useProjectsJobs(projectPath);

  // const isProjectMutating = useIsMutating([projectPath]) > 0;
  const query = trpc.getAllDependenciesSimple.useQuery(
    { projectPath: atob(projectPath), xCacheId },
    { onSuccess },
  );

  // const query = useQuery(
  //   [projectPath, 'get-project-dependencies', 'fast'],
  //   async () => {
  //     // const id = startJob('Get project dependencies fast');

  //     const dependencies = await getProjectDependenciesFast(projectPath);

  //     // successJob(id);

  //     return dependencies;
  //   },
  //   {
  //     refetchOnWindowFocus: false,
  //     refetchOnMount: false,
  //     enabled: !isProjectMutating,
  //     retry: false,
  //     onSuccess,
  //   },
  // );

  return { dependencies: query.data, ...query };
};
