import type { FC } from 'react';
import { createContext, useMemo, useReducer } from 'react';

import type { Action, State } from './task-queue.reducer';
import { initialState, taskQueueReducer } from './task-queue.reducer';

interface Context {
  state: State;
  dispatch: (action: Action) => void;
}

export const TaskQueueContext = createContext<Context>({
  state: initialState,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispatch() {},
});

export const TaskQueueContextProvider: FC = ({ children }) => {
  const [state, taskQueueDispatch] = useReducer(taskQueueReducer, {
    ...initialState,
  });

  const contextValue = useMemo(() => {
    return { state, dispatch: taskQueueDispatch };
  }, [state, taskQueueDispatch]);

  return (
    <TaskQueueContext.Provider value={contextValue}>
      {children}
    </TaskQueueContext.Provider>
  );
};
