import { useCallback, useContext } from 'react';

import type {
  Basic,
  Manager,
  Type,
} from '../../../../server/types/dependency.types';
import { ZERO } from '../../../utils';
import type { Task } from '../../TaskQueue/task-queue.reducer';
import { TaskQueueContext } from '../../TaskQueue/TaskQueueContext';
import { useProjectPath } from '../../use-project-path';

interface Hook {
  onInstallAllDependencies: (manager?: Manager) => void;
  onUpdateDependencies: (dependencies: Basic[]) => void;
  onInstallNewDependency: (dependency: Basic, type: Type) => void;
  onDeleteDependency: (dependency: Basic) => void;
}

export const useProjectActions = (): Hook => {
  const projectPath = useProjectPath();
  const { dispatch: taskQueueDispatch } = useContext(TaskQueueContext);

  const addTask = useCallback(
    (task: Omit<Task, 'id' | 'status'>) => {
      taskQueueDispatch({
        type: 'addTask',
        queueId: projectPath,
        task,
      });
    },
    [projectPath, taskQueueDispatch],
  );

  const onInstallAllDependencies = useCallback(
    (manager?: Manager) => {
      addTask({
        description: `${manager} installing all`,
        action: {
          name: 'INSTALL_ALL_DEPENDENCIES',
          manager,
        },
      });
    },
    [addTask],
  );

  const onUpdateDependencies = useCallback(
    (dependenciesToUpdate: Basic[]) => {
      if (dependenciesToUpdate.length === ZERO) {
        return;
      }

      const dependenciesToUpdateDevelopment = dependenciesToUpdate.filter(
        (d) => d.type === 'dev',
      );
      const dependenciesToUpdateProduction = dependenciesToUpdate.filter(
        (d) => d.type === 'prod',
      );

      addTask({
        description: 'updating dependencies',
        action: {
          name: 'UPDATE_DEPENDENCIES',
          dependenciesToUpdateDevelopment,
          dependenciesToUpdateProduction,
        },
      });
    },
    [addTask],
  );

  const onInstallNewDependency = useCallback(
    (dependency: Basic, type: Type) => {
      taskQueueDispatch({
        type: 'addTask',
        queueId: projectPath,
        task: {
          description: `installing ${dependency.name} as ${type}`,
          action: {
            name: 'INSTALL_DEPENDENCIES',
            dependencies: [dependency],
            type,
          },
        },
      });
    },
    [projectPath, taskQueueDispatch],
  );

  const onDeleteDependency = useCallback(
    (dependency: Basic) => {
      taskQueueDispatch({
        type: 'addTask',
        queueId: projectPath,
        task: {
          description: `deleting ${dependency.name} as ${dependency.type}`,
          action: {
            name: 'DELETE_DEPENDENCY',
            dependency,
          },
        },
      });
    },
    [projectPath, taskQueueDispatch],
  );

  return {
    onInstallAllDependencies,
    onUpdateDependencies,
    onInstallNewDependency,
    onDeleteDependency,
  };
};
