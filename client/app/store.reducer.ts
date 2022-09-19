/* eslint-disable max-statements */
/* eslint-disable @typescript-eslint/no-type-alias */
import type { Reducer } from 'react';

import { initialProjects, syncProjectsStorage } from './projects.storage';

export type Action =
  | { type: 'addProject'; projectPath: string }
  | { type: 'removeProject'; projectPath: string };

export interface State {
  projects: string[];
}

export const initialState: State = {
  projects: initialProjects,
};

export const storeReducer: Reducer<State, Action> = (state, action): State => {
  switch (action.type) {
    case 'addProject': {
      const newState = {
        ...state,
        projects: [...state.projects, action.projectPath],
      };

      syncProjectsStorage(newState.projects);

      return newState;
    }

    case 'removeProject': {
      const newState = {
        ...state,
        projects: state.projects.filter((p) => p === action.projectPath),
      };

      syncProjectsStorage(newState.projects);

      return newState;
    }

    default:
      return state;
  }
};
