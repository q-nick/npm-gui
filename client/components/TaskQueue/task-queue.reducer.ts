/* eslint-disable @typescript-eslint/no-type-alias */
import type { Reducer } from 'react';

export interface Task {
  id: number;
  projectPath: string;
  description: string;
  executeMe: () => Promise<unknown>;
  status: 'ERROR' | 'RUNNING' | 'SUCCESS' | 'WAITING';
  stdout?: string;
  instantTaskQueue?: boolean;
  dependencies?: string[];
  skipFinalDependencies?: true;
}

export type Action =
  | {
      type: 'addTask';
      task: Omit<Task, 'id' | 'status'>;
    }
  | {
      type: 'removeTask';
      task: Task;
    }
  | {
      type: 'updateTask';
      task: Task;
    };

export interface State {
  queue: Task[];
}

export const initialState: State = {
  queue: [],
};

export const taskQueueReducer: Reducer<State, Action> = (
  state,
  action,
): State => {
  switch (action.type) {
    case 'removeTask': {
      return {
        ...state,
        queue: state.queue.filter((task) => task.id !== action.task.id),
      };
    }

    case 'addTask': {
      return {
        ...state,
        queue: [
          ...state.queue,
          { id: Date.now(), status: 'WAITING', ...action.task },
        ],
      };
    }

    case 'updateTask': {
      return {
        ...state,
        queue: state.queue.map((task) => {
          if (task.id !== action.task.id) {
            return task;
          }

          return action.task;
        }),
      };
    }

    default:
      return state;
  }
};
