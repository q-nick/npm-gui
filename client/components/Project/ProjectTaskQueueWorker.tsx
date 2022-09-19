/* eslint-disable max-statements */
import {
  useIsFetching,
  useIsMutating,
  useMutation,
} from '@tanstack/react-query';
import type { FC } from 'react';
import { useContext } from 'react';

import { useInterval } from '../../hooks/use-interval';
import { getBasePathFor } from '../../service';
import { xCacheId } from '../../xcache';
import type {
  DeleteDependencyTask,
  InstallAllDependenciesTask,
  InstallDependenciesTask,
  UpdateDependenciesTask,
} from '../TaskQueue/task-queue.reducer';
import { TaskQueueContext } from '../TaskQueue/TaskQueueContext';

interface Props {
  projectPath: string;
}

const FIVE_SEC = 5000;
export const ProjectTaskQueueWorker: FC<Props> = ({
  children,
  projectPath,
}) => {
  const isProjectMutating = useIsMutating([projectPath]) > 0;
  const isProjectFetching = useIsFetching([projectPath]) > 0;
  const isProjectBusy = isProjectMutating || isProjectFetching;

  const installAllDependencies = useMutation(
    [projectPath, 'install-all-dependencies'],
    async (task: InstallAllDependenciesTask) => {
      const response = await fetch(
        `${getBasePathFor(projectPath)}/install${
          task.manager ? `/${task.manager}` : ''
        }`,
        { method: 'POST', headers: { 'x-cache-id': xCacheId } },
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    },
  );

  const instalDependencies = useMutation(
    [projectPath, 'install-dependencies'],
    async (task: InstallDependenciesTask) => {
      const response = await fetch(
        `${getBasePathFor(projectPath)}/${task.type}`,
        {
          method: 'POST',
          body: JSON.stringify(task.dependencies),
          headers: { 'x-cache-id': xCacheId },
        },
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    },
  );

  const deleteDependency = useMutation(
    [projectPath, 'delete-dependencies'],
    async (task: DeleteDependencyTask) => {
      const response = await fetch(
        `${getBasePathFor(projectPath)}/${task.dependency.type}/${
          task.dependency.name
        }`,
        { method: 'DELETE', headers: { 'x-cache-id': xCacheId } },
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    },
  );

  const updateDependencies = useMutation(
    [projectPath, 'update-dependenceis'],
    async (task: UpdateDependenciesTask) => {
      const responseDevelopment = await fetch(
        `${getBasePathFor(projectPath)}/dev`,
        {
          method: 'POST',
          body: JSON.stringify(task.dependenciesToUpdateDevelopment),
          headers: { 'x-cache-id': xCacheId },
        },
      );

      if (!responseDevelopment.ok) {
        throw new Error('Network response was not ok');
      }

      const responseProduction = await fetch(
        `${getBasePathFor(projectPath)}/prod`,
        {
          method: 'POST',
          body: JSON.stringify(task.dependenciesToUpdateProduction),
          headers: { 'x-cache-id': xCacheId },
        },
      );

      if (!responseProduction.ok) {
        throw new Error('Network response was not ok');
      }
    },
  );

  const {
    state: { queue },
    dispatch: taskQueueDispatch,
  } = useContext(TaskQueueContext);

  const checkTaskQueue = async (queueId: string): Promise<void> => {
    if (!isProjectBusy) {
      const currentTask = queue[queueId]?.find(
        (task) => task.status === 'WAITING',
      );

      if (currentTask) {
        taskQueueDispatch({
          type: 'updateTask',
          queueId,
          task: {
            ...currentTask,
            status: 'RUNNING',
          },
        });

        try {
          const startTime = new Date();
          if (currentTask.action.name === 'INSTALL_ALL_DEPENDENCIES') {
            await installAllDependencies.mutateAsync(currentTask.action);
          }
          if (currentTask.action.name === 'INSTALL_DEPENDENCIES') {
            await instalDependencies.mutateAsync(currentTask.action);
          }
          if (currentTask.action.name === 'UPDATE_DEPENDENCIES') {
            await updateDependencies.mutateAsync(currentTask.action);
          }
          if (currentTask.action.name === 'DELETE_DEPENDENCY') {
            await deleteDependency.mutateAsync(currentTask.action);
          }
          const executionTime = Date.now() - startTime.getTime();

          taskQueueDispatch({
            type: 'updateTask',
            queueId,
            task: {
              ...currentTask,
              description: `${currentTask.description} (took: ${executionTime} s)`,
              status: 'SUCCESS',
            },
          });

          setTimeout(() => {
            taskQueueDispatch({
              queueId,
              type: 'removeTask',
              task: currentTask,
            });
          }, FIVE_SEC);
        } catch (error: unknown) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const errorToDisplay = (error as any).response?.data as string;
          // TODO errors?
          // eslint-disable-next-line no-console
          console.error(errorToDisplay);

          taskQueueDispatch({
            type: 'updateTask',
            queueId,
            task: {
              ...currentTask,
              status: 'ERROR',
              stdout: errorToDisplay,
            },
          });
        }
      }
    }
  };

  useInterval((): void => {
    checkTaskQueue(projectPath);
  }, 300);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};
