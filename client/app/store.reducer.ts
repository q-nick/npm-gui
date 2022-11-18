/* eslint-disable max-statements */
/* eslint-disable @typescript-eslint/no-type-alias */
import type { Reducer } from 'react';

import type { Type } from '../../server/types/dependency.types';
import { initialProjects, syncProjectsStorage } from './projects.storage';

export interface Job {
  id: number;
  description: string;
  status: 'FAILURE' | 'SUCCESS' | 'WAITING' | 'WORKING';
  startTime: number;
}

export type Action =
  | {
      action: 'busyProject';
      projectPath: string;
      isBusy: boolean;
    }
  | {
      action: 'jobRemove';
      projectPath: string;
      jobId: number;
    }
  | {
      action: 'jobStarted';
      projectPath: string;
      description: string;
      jobId: number;
    }
  | {
      action: 'jobSuccess';
      projectPath: string;
      jobId: number;
    }
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
  | {
      action: 'mutateProjectDependencyReset';
      projectPath: string;
    }
  | { action: 'addProject'; projectPath: string }
  | { action: 'removeProject'; projectPath: string };

interface DependencyMutation {
  required: string | null;
  type: Type;
  delete: true | null;
}
interface Project {
  path: string;
  dependenciesMutate: Record<string, DependencyMutation>;
  jobs: Job[];
  isBusy: boolean;
}

export interface State {
  projects: Project[];
}

export const initialState: State = {
  projects: initialProjects.map((path) => ({
    path,
    dependenciesMutate: {},
    jobs: [],
    isBusy: false,
  })),
};

export const storeReducer: Reducer<State, Action> = (state, action): State => {
  switch (action.action) {
    case 'addProject': {
      const newState = {
        ...state,
        projects: [
          ...state.projects,
          {
            path: action.projectPath,
            dependenciesMutate: {},
            jobs: [],
            isBusy: false,
          },
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
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
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

    case 'mutateProjectDependencyReset': {
      return {
        ...state,
        projects: state.projects.map((project) => {
          if (project.path === action.projectPath) {
            return {
              ...project,
              dependenciesMutate: {},
            };
          }

          return project;
        }),
      };
    }

    case 'jobStarted': {
      return {
        ...state,
        projects: state.projects.map((project) => {
          if (project.path === action.projectPath) {
            return {
              ...project,
              jobs: [
                {
                  description: action.description,
                  id: action.jobId,
                  status: 'WORKING',
                  startTime: Date.now(),
                },
                ...project.jobs.slice(0, 10),
              ],
            };
          }

          return project;
        }),
      };
    }

    case 'jobSuccess': {
      return {
        ...state,
        projects: state.projects.map((project) => {
          if (project.path === action.projectPath) {
            return {
              ...project,
              jobs: project.jobs.map((job) => {
                if (job.id === action.jobId) {
                  return {
                    ...job,
                    description: `${job.description} (${Math.ceil(
                      (Date.now() - job.startTime) / 1000,
                    )}s)`,
                    status: 'SUCCESS',
                  };
                }

                return job;
              }),
            };
          }

          return project;
        }),
      };
    }

    case 'jobRemove': {
      return {
        ...state,
        projects: state.projects.map((project) => {
          if (project.path === action.projectPath) {
            return {
              ...project,
              jobs: project.jobs.filter((job) => job.id !== action.jobId),
            };
          }

          return project;
        }),
      };
    }

    case 'busyProject': {
      return {
        ...state,
        projects: state.projects.map((project) => {
          if (project.path === action.projectPath) {
            return {
              ...project,
              isBusy: action.isBusy,
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
