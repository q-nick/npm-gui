import type { VFC } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { ContextStoreProvider } from '../app/ContextStore';
import { Header } from './Header/Header';
import { Info } from './Info';
import { Main } from './Main';
import { TaskQueue } from './TaskQueue/TaskQueue';
import { TaskQueueContextProvider } from './TaskQueue/TaskQueueContext';
import { TaskQueueWorker } from './TaskQueue/TaskQueueWorker';

export const App: VFC = () => {
  return (
    <ContextStoreProvider>
      <TaskQueueContextProvider>
        <TaskQueueWorker>
          <Router>
            <Route exact path="/:projectPathEncoded?">
              <Header />

              <Main />

              <TaskQueue />

              <Info />
            </Route>
          </Router>
        </TaskQueueWorker>
      </TaskQueueContextProvider>
    </ContextStoreProvider>
  );
};
