import type { FC } from 'react';
import { createContext, useMemo, useReducer } from 'react';

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
