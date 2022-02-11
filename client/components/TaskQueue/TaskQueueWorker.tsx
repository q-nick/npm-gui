/* eslint-disable max-statements */
import type { FC } from 'react';
import { useContext, useEffect } from 'react';

import { ContextStore } from '../../app/ContextStore';
import { TaskQueueContext } from './TaskQueueContext';

// const THOUSAND = 1000;
const FIVE_SEC = 5000;
export const TaskQueueWorker: FC = ({ children }) => {
  const { dispatch: storeDispatch } = useContext(ContextStore);
  const {
    state: { queue },
    dispatch: taskQueueDispatch,
  } = useContext(TaskQueueContext);

  const checkTaskQueue = async (): Promise<void> => {
    const working = queue.find((task) => task.status === 'RUNNING');

    if (!working) {
      const currentTask = queue.find((task) => task.status === 'WAITING');

      if (currentTask) {
        taskQueueDispatch({
          type: 'updateTask',
          task: {
            ...currentTask,
            status: 'RUNNING',
          },
        });

        if (currentTask.dependencies) {
          storeDispatch({
            type: 'setProjectDependenciesProcessing',
            projectPath: currentTask.projectPath,
            dependenciesToUpdate: currentTask.dependencies,
            value: true,
          });
        }

        try {
          const startTime = new Date();
          await currentTask.executeMe();
          const executionTime = Date.now() - startTime.getTime();

          taskQueueDispatch({
            type: 'updateTask',
            task: {
              ...currentTask,
              description: `${currentTask.description} (took: ${executionTime} s)`,
              status: 'SUCCESS',
            },
          });

          setTimeout(() => {
            taskQueueDispatch({
              type: 'removeTask',
              task: currentTask,
            });
          }, FIVE_SEC);
        } catch (error: unknown) {
          const errorToDisplay = (error as any).response?.data as string;
          // TODO errors?
          // eslint-disable-next-line no-console
          console.error(errorToDisplay);

          taskQueueDispatch({
            type: 'updateTask',
            task: {
              ...currentTask,
              status: 'ERROR',
              stdout: errorToDisplay,
            },
          });
        } finally {
          if (
            currentTask.skipFinalDependencies !== true &&
            currentTask.dependencies
          ) {
            storeDispatch({
              type: 'setProjectDependenciesProcessing',
              projectPath: currentTask.projectPath,
              dependenciesToUpdate: currentTask.dependencies,
              value: false,
            });
          }
        }
      }
    }
  };

  useEffect(() => {
    void checkTaskQueue();
    console.log(queue);
  });

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};
