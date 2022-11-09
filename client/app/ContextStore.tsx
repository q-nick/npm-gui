import type { FC } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';

import type { Action, State } from './store.reducer';
import { initialState, storeReducer } from './store.reducer';

interface Context {
  state: State;
  dispatch: (action: Action) => void;
}

export const ContextStore = createContext<Context>({
  state: initialState,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispatch() {},
});

export const ContextStoreProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(storeReducer, {
    ...initialState,
  });

  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  return (
    <ContextStore.Provider value={contextValue}>
      {children}
    </ContextStore.Provider>
  );
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const useProjectsStore = () => {
  const {
    state: { projects },
    dispatch,
  } = useContext(ContextStore);

  return {
    projects,
    dispatch,
  };
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const useProjectStore = (projectPath: string) => {
  const { projects, dispatch } = useProjectsStore();

  return {
    project: projects.find((project) => project.path === projectPath),
    dispatch,
  };
};

let id = 0;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const useProjectsJobs = (projectPath: string) => {
  const { dispatch } = useProjectStore(projectPath);

  const startJob = useCallback(
    (description) => {
      id += 1;

      dispatch({
        action: 'jobStarted',
        projectPath,
        description,
        jobId: id,
      });

      return id;
    },
    [dispatch, projectPath],
  );

  const successJob = useCallback(
    (jobId: number) => {
      dispatch({
        action: 'jobSuccess',
        projectPath,
        jobId,
      });
    },
    [dispatch, projectPath],
  );

  const failedJob = useCallback(
    (jobId: number) => {
      dispatch({
        action: 'jobSuccess',
        projectPath,
        jobId,
      });
    },
    [dispatch, projectPath],
  );

  const removeJob = useCallback(
    (jobId: number) => {
      dispatch({
        action: 'jobRemove',
        jobId,
        projectPath,
      });
    },
    [dispatch, projectPath],
  );

  return {
    startJob,
    successJob,
    failedJob,
    removeJob,
  };
};
