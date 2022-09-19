/* eslint-disable @typescript-eslint/no-type-alias */
import type { Reducer } from 'react';

import type {
  Basic,
  Manager,
  Type,
} from '../../../server/types/dependency.types';

export interface InstallAllDependenciesTask {
  name: 'INSTALL_ALL_DEPENDENCIES';
  manager?: Manager;
}

export interface InstallDependenciesTask {
  name: 'INSTALL_DEPENDENCIES';
  dependencies: Basic[];
  type: Type;
}

export interface DeleteDependencyTask {
  name: 'DELETE_DEPENDENCY';
  dependency: Basic;
}

export interface UpdateDependenciesTask {
  name: 'UPDATE_DEPENDENCIES';
  dependenciesToUpdateProduction: Basic[];
  dependenciesToUpdateDevelopment: Basic[];
}

export type AnyTask =
  | DeleteDependencyTask
  | InstallAllDependenciesTask
  | InstallDependenciesTask
  | UpdateDependenciesTask;

export interface Task {
  id: number;
  action: AnyTask;
  status: 'ERROR' | 'RUNNING' | 'SUCCESS' | 'WAITING';
  stdout?: string;
  description: string;
}

export type Action =
  | {
      type: 'addTask';
      queueId: string;
      task: Omit<Task, 'id' | 'status'>;
    }
  | {
      type: 'removeTask';
      queueId: string;
      task: Task;
    }
  | {
      type: 'updateTask';
      queueId: string;
      task: Task;
    };

export interface State {
  queue: Record<string, Task[]>;
}

export const initialState: State = {
  queue: {},
};

export const taskQueueReducer: Reducer<State, Action> = (
  state,
  action,
): State => {
  switch (action.type) {
    case 'removeTask': {
      return {
        ...state,
        queue: {
          ...state.queue,
          [action.queueId]:
            state.queue[action.queueId]?.filter(
              (task) => task.id !== action.task.id,
            ) || [],
        },
      };
    }

    case 'addTask': {
      return {
        ...state,
        queue: {
          ...state.queue,
          [action.queueId]: [
            ...(state.queue[action.queueId] || []),
            { id: Date.now(), status: 'WAITING', ...action.task },
          ],
        },
      };
    }

    case 'updateTask': {
      return {
        ...state,
        queue: {
          ...state.queue,
          [action.queueId]:
            state.queue[action.queueId]?.map((task) => {
              if (task.id !== action.task.id) {
                return task;
              }

              return action.task;
            }) || [],
        },
      };
    }

    default:
      return state;
  }
};
