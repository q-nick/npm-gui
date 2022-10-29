/* eslint-disable max-statements */
/* eslint-disable @typescript-eslint/no-type-alias */
import type { Reducer } from 'react';

import type { Type } from '../../server/types/dependency.types';
import { initialProjects, syncProjectsStorage } from './projects.storage';

export type Action =
  | {
      action: 'mutateProjectDependency';
      projectPath: string;
      name: string;
      required: string | null;
      type: Type;
      delete: true | null;
    }
  | {
      action: 'mutateProjectDependencyCancel';
      projectPath: string;
      name: string;
    }
  | { action: 'addProject'; projectPath: string }
  | { action: 'removeProject'; projectPath: string };

interface DependencyMutation {
  required: string | undefined;
  type: Type;
  delete: true | undefined;
}
interface Project {
  path: string;
  dependenciesMutate: Record<string, DependencyMutation>;
}

export interface State {
  projects: Project[];
}

export const initialState: State = {
  projects: initialProjects.map((path) => ({
    path,
    dependenciesMutate: {},
  })),
};

export const storeReducer: Reducer<State, Action> = (state, action): State => {
  switch (action.action) {
    case 'addProject': {
      const newState = {
        ...state,
        projects: [
          ...state.projects,
          { path: action.projectPath, dependenciesMutate: {} },
        ],
      };

      syncProjectsStorage(newState.projects.map((project) => project.path));

      return newState;
    }

    case 'removeProject': {
      const newState = {
        ...state,
        projects: state.projects.filter(
          (project) => project.path !== action.projectPath,
        ),
      };

      syncProjectsStorage(newState.projects.map((project) => project.path));

      return newState;
    }

    case 'mutateProjectDependency': {
      return {
        ...state,
        projects: state.projects.map((project) => {
          if (project.path === action.projectPath) {
            return {
              ...project,
              dependenciesMutate: {
                ...project.dependenciesMutate,
                [action.name]: {
                  required: action.required,
                  type: action.type,
                  delete: action.delete,
                },
              },
            };
          }

          return project;
        }),
      };
    }

    case 'mutateProjectDependencyCancel': {
      return {
        ...state,
        projects: state.projects.map((project) => {
          if (project.path === action.projectPath) {
            delete project.dependenciesMutate[action.name];
            return {
              ...project,
              dependenciesMutate: {
                ...project.dependenciesMutate,
              },
            };
          }

          return project;
        }),
      };
    }

    default:
      return state;
  }
};
