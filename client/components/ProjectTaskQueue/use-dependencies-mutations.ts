/* eslint-disable @typescript-eslint/naming-convention */
import {
  useIsFetching,
  useIsMutating,
  useMutation,
} from '@tanstack/react-query';

import {
  deleteDependency,
  installAllDependencies,
  installDependencies,
  updateDependencies,
} from '../../service/dependencies.service';
import type {
  DeleteDependencyTask,
  InstallAllDependenciesTask,
  InstallDependenciesTask,
  UpdateDependenciesTask,
} from '../TaskQueue/task-queue.reducer';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const useDependenciesMutations = (projectPath: string) => {
  const isProjectMutating = useIsMutating([projectPath]) > 0;
  const isProjectFetching = useIsFetching([projectPath]) > 0;
  const isProjectBusy = isProjectMutating || isProjectFetching;

  const installAllDependenciesMutation = useMutation(
    [projectPath, 'install-all-dependencies'],
    async (task: InstallAllDependenciesTask) => {
      await installAllDependencies(projectPath, task.manager);
    },
  );

  const instalDependenciesMutation = useMutation(
    [projectPath, 'install-dependencies'],
    async (task: InstallDependenciesTask) => {
      await installDependencies(projectPath, task.type, task.dependencies);
    },
  );

  const deleteDependencyMutation = useMutation(
    [projectPath, 'delete-dependencies'],
    async (task: DeleteDependencyTask) => {
      await deleteDependency(projectPath, task.dependency);
    },
  );

  const updateDependenciesMutation = useMutation(
    [projectPath, 'update-dependenceis'],
    async (task: UpdateDependenciesTask) => {
      updateDependencies(
        projectPath,
        task.dependenciesToUpdateDevelopment,
        task.dependenciesToUpdateProduction,
      );
    },
  );

  const mutationActions = {
    INSTALL_ALL_DEPENDENCIES: installAllDependenciesMutation,
    UPDATE_DEPENDENCIES: updateDependenciesMutation,
    DELETE_DEPENDENCY: deleteDependencyMutation,
    INSTALL_DEPENDENCIES: instalDependenciesMutation,
  } as const;

  return {
    isProjectBusy,
    mutationActions,
  };
};
