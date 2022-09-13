/* eslint-disable @typescript-eslint/no-type-alias */
import type { Reducer } from 'react';

import type { Entire } from '../../server/types/dependency.types';
import { initialProjects, syncProjectsStorage } from './projects.storage';

export type Action =
  | {
      type: 'setProjectDependencies';
      projectPath: string;
      dependencies: Entire[];
    }
  | {
      type: 'setProjectDependenciesProcessing';
      projectPath: string;
      value: boolean;
      dependenciesToUpdate: string[];
    }
  | { type: 'addProject'; projectPath: string }
  | { type: 'removeProject'; projectPath: string };

export interface ProjectScope {
  dependencies?: Entire[];
  dependenciesProcessing: string[];
}

export interface State {
  projects: Record<string, ProjectScope>;
}

export const initialState: State = {
  projects: initialProjects,
};

export const storeReducer: Reducer<State, Action> = (state, action): State => {
  switch (action.type) {
    case 'addProject': {
      const newState = {
        projects: {
          ...state.projects,
          [action.projectPath]: { dependenciesProcessing: [] },
        },
      };

      syncProjectsStorage(newState.projects);

      return newState;
    }

    case 'setProjectDependencies': {
      return {
        ...state,
        projects: {
          ...state.projects,
          [action.projectPath]: {
            dependenciesProcessing:
              state.projects[action.projectPath]?.dependenciesProcessing ?? [],
            dependencies: action.dependencies,
          },
        },
      };
    }

    case 'setProjectDependenciesProcessing': {
      const project = state.projects[action.projectPath] ?? {
        dependenciesProcessing: [],
      };

      const dependenciesProcessing = action.value
        ? [...project.dependenciesProcessing, ...action.dependenciesToUpdate]
        : project.dependenciesProcessing.filter(
            (d) => !action.dependenciesToUpdate.includes(d),
          );

      return {
        ...state,
        [action.projectPath]: {
          ...state.projects[action.projectPath],
          dependenciesProcessing,
        },
      };
    }
    default:
      return state;
  }
};
