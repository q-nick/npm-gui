/* eslint-disable max-statements */
import type { FC } from 'react';
import { useContext } from 'react';

import { useInterval } from '../../hooks/use-interval';
import { TaskQueueContext } from '../TaskQueue/TaskQueueContext';
import { useDependenciesMutations } from './use-dependencies-mutations';

interface Props {
  projectPath: string;
}

const FIVE_SEC = 5000;
export const ProjectTaskQueueWorker: FC<Props> = ({
  children,
  projectPath,
}) => {
  const { mutationActions } = useDependenciesMutations(projectPath);

  const {
    state: { queue },
    dispatch: taskQueueDispatch,
  } = useContext(TaskQueueContext);

  const checkTaskQueue = async (queueId: string): Promise<void> => {
    const activeTask = queue[queueId]?.find(
      (task) => task.status === 'RUNNING',
    );

    if (!activeTask) {
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

          // TODO
          const mutation = mutationActions[currentTask.action.name];
          await mutation.mutateAsync(currentTask.action as never);
          const executionTime = Date.now() - startTime.getTime();

          taskQueueDispatch({
            type: 'updateTask',
            queueId,
            task: {
              ...currentTask,
              description: `${currentTask.description} (took: ${
                executionTime / 1000
              } s)`,
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
